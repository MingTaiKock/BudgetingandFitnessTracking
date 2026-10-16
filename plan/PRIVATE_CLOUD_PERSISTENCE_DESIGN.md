# Private cloud persistence — proposed design

Status: proposal for review. The free backend is created and healthy; the live app still saves locally. Google sign-in was selected by the user on 15 October 2026.

## Intended outcome

The user wants private login, records available on phone and computer, and records that survive clearing browser data. Preserve the existing budgeting, fitness, preferences, workout drafts, and backup workflows. Keep the Cloudflare-hosted frontend and current hamster artwork.

## Approaches

| Approach | Benefit | Tradeoff |
|---|---|---|
| Supabase Auth + Postgres (recommended) | Managed login, ownership rules, database, and mature browser client | Separate backend account; free projects can pause after inactivity; email authentication needs configured delivery |
| Cloudflare D1 + managed identity provider | Database beside existing Worker | More API and identity integration work; introduces a separate identity provider or Access configuration |
| Existing browser storage + exports | Already works without backend | Cannot meet automatic cross-device persistence |

## Recommended architecture

Use the dedicated Supabase project `smallwins`, ID `wedybltcduamanjcifta`, in MTBase, Singapore (`ap-southeast-1`). The dashboard showed Healthy on 15 October 2026. Its public project URL is https://wedybltcduamanjcifta.supabase.co. The user created it on the verified Free organization plan. Automatic row-level security is enabled and automatically exposing new tables is disabled.

Each authenticated user owns one journey record containing the existing validated version-2 state, a monotonically increasing revision, and an updated timestamp. Preserve the current data schema initially rather than splitting all features into separate database tables at once. Database row-level security must enforce that only the record's owner can read or write it. Do not trust client-supplied owner identifiers for authorization.

Use compare-and-swap saves against the expected revision. If another device has changed the journey, stop the stale write, preserve the pending local changes, and offer reload or backup. Never overwrite remote records silently. This first version synchronizes when signing in, reopening/focusing the app, and saving; it does not merge simultaneous conflicting edits automatically.

Store only the public Supabase project URL and publishable key in the browser build. No database password, service-role key, or privileged secret belongs in GitHub or frontend code.

## Login experience

Add a calm login screen matching the existing fluffy hamster artwork and typography. Show the current account and cloud save status in Settings. The user selected Google sign-in. Use Supabase's Google OAuth provider with PKCE, validated redirect URLs, and a Google OAuth web client configured for the Supabase callback. The live application's site URL is https://smallwins.mtkock1994.workers.dev. Configure https://wedybltcduamanjcifta.supabase.co/auth/v1/callback in the Google client, and the app's live URL in Supabase's redirect allowlist. Add development redirects separately, without a wildcard allowing arbitrary domains. Keep the Google client secret only in Supabase provider configuration, never GitHub or the browser bundle. Request only identity scopes needed for login, with no Gmail or Drive access.

Do not make the public demo depend on a login. Demo records must never automatically upload into someone's personal account.

## Existing records and account isolation

After sign-in, load the remote journey before allowing changes. If the account has no cloud records, offer a deliberate choice to import the local personal journey or start fresh. Provide a backup before import. If both local and remote records exist, show a preview and require a deliberate replacement decision; do not automatically upload either over the other.

Local caches and pending saves must be scoped by authenticated user ID. Signing out clears the in-memory personal journey and user cache, and stops any pending cloud operation. A different account must not see or upload the previous account's records. Existing unclaimed local data remains available for explicit migration without automatic attachment to any account.

## Saving and errors

Display Saving, Saved online, Offline/unsynced, and Save failed accurately. Only show Saved online after server acknowledgement. Keep a per-account local recovery copy for unfinished changes. Browser clearing can remove unsynced work, so the interface must distinguish pending work from confirmed online saves.

A login expiry, database pause, network failure, or revision conflict must preserve local work and offer backup. Keep export and restore, with restore treated as a deliberate cloud replacement and subject to the same revision checks.

## Verification before delivery

- Create records, reload, and verify database persistence.
- Sign in on a second independent browser and verify the same journey.
- Clear a test browser's local data, sign in, and recover confirmed cloud records.
- Verify two different accounts cannot read or modify one another's rows through direct API requests.
- Verify simultaneous edits reject stale writes without losing either device's pending data.
- Verify sign-out/account switching never exposes the previous user's records.
- Verify import, restore, offline failure, expired session, and workout draft preservation.
- Run existing domain tests, production build, and mobile/desktop login and save-status checks.

## Free-tier limits

Supabase currently offers a $0 plan with a 500 MB database, 50,000 monthly active users, and 5 GB egress. Free projects may pause after one week of inactivity, and automatic backups are not included. Keep export backups; cloud storage is not a guarantee of permanent availability. Staying free remains subject to provider limits. No paid plan is authorized by this proposal.

## Next stages

Review this architecture, with the selected Google login. Then produce the detailed implementation plan and login mockup prompt before development, following the user's plan-first design preference. Configure the dedicated backend and Google provider, implement and verify private storage, then deploy only after verification.

Official references checked 14 October 2026:

- https://supabase.com/pricing
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/database/postgres/row-level-security
