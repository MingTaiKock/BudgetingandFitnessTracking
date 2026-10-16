# Private Cloud Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. Execution begins after user review and execution-method selection.

**Goal:** Google login with private, durable budgeting and fitness records shared across the user's devices, preserving existing local records and workout drafts.

**Architecture:** Supabase Auth establishes identity; Postgres stores one validated journey per user with row-level security and atomic revision checks. A serialized browser sync controller owns loading, recovery, saves, and conflicts. Existing feature components continue editing the current State through App's change callback.

**Tech Stack:** React 19, TypeScript, Vite, Zod, Supabase Auth/Postgres, Node test runner, Cloudflare Workers static assets.

**Spec:** `plan/PRIVATE_CLOUD_PERSISTENCE_DESIGN.md`, approved by user on 15 October 2026.

## Global constraints

- Project: `wedybltcduamanjcifta`; public API URL: `https://wedybltcduamanjcifta.supabase.co`.
- Production application: `https://smallwins.mtkock1994.workers.dev/`.
- Google callback: `https://wedybltcduamanjcifta.supabase.co/auth/v1/callback`.
- Google provider is verified enabled; Site URL and redirect allowlist match production. End-to-end OAuth remains untested.
- Preserve the existing validated version-2 State, legacy migration, export/restore, and active workouts.
- Only public URL and publishable key enter the frontend. Google secret stays in Supabase.
- Each account owns its own records. Partner illustrations do not imply shared access.
- Demo never uploads automatically. Legacy data requires explicit migration.
- Only server acknowledgement permits the label Saved online.
- Preserve pending edits on errors/conflicts; never silently overwrite a newer revision.
- Keep all services on free plans. No paid upgrades.
- Prefix shell commands with `rtk`. Do not include local `secret/` files, credentials, or unrelated changes in commits.
- Existing .gitignore changes belong to the user unless inspection establishes otherwise. Prior default-branch push was rejected; obtain explicit authorization before any push to main.

## File map

| File | Responsibility |
|---|---|
| `src/cloud/contracts.ts` | Shared cloud record/result/status types |
| `src/cloud/client.ts` | Environment validation and single Supabase client |
| `src/cloud/repository.ts` | Authenticated read and atomic save RPC |
| `src/cloud/recovery.ts` | Account-scoped pending snapshots and legacy import decisions |
| `src/cloud/controller.ts` | Serialized saves, revisions, generation guards, retry and refresh |
| `src/cloud/useJourney.ts` | React subscription and auth lifecycle |
| `src/features/AccountGate.tsx` | Login/demo/loading/import/error screens |
| `src/features/AccountPanel.tsx` | Account, sync status, retry, backup and sign-out |
| `src/cloud.css` | Existing-theme styles for new account surfaces |
| `src/App.tsx`, `src/features/Settings.tsx`, `src/main.tsx` | Connect persistence and account UI |
| `src/storage.ts` | Retain isolated demo and legacy reads; no authenticated writes to shared key |
| `src/vite-env.d.ts`, `.env.example`, package manifests | Typed public configuration, exact SDK version and lockfile |
| `supabase/migrations/` | CLI-generated migration for journey table, policies, save function |
| `tests/cloud-*.test.ts` | Controller, repository, import/recovery and account-isolation tests |
| `scripts/verify-cloud-isolation.mjs` | Real authenticated API checks with disposable fixture users |
| `plan/CLOUD_PERSISTENCE_OPERATIONS.md` | Environment, migration, deployment, recovery and verification record |

## Review focus

1. A save commits but its response is lost: retry must not silently duplicate or overwrite subsequent edits (Tasks 1 and 3).
2. A delayed request resolves after switching accounts: old data must never enter the new account's view (Tasks 3 and 4).
3. Browser storage is blocked or full: preserve edits in memory and offer export; never claim a recovery copy exists (Tasks 2 and 4).
4. An older app sees an unsupported remote schema: preserve raw data and block writes (Tasks 1 and 4).
5. Two devices create the first journey simultaneously: only one succeeds; the other receives a recoverable conflict (Tasks 1 and 5).

## Task 1: Private database and typed repository

**Files:** Create contracts, client, repository, `tests/cloud-repository.test.ts`, migration and `.env.example`; update package manifests and vite-env declarations.

**Interfaces:**

```ts
import type { State } from '../model.ts';
export type CloudRecord = { state: State; revision: number; updatedAt: string };
export type SaveResult = { kind: 'saved'; record: CloudRecord }
  | { kind: 'conflict' };
export interface JourneyRepository {
  read(): Promise<CloudRecord | null>;
  save(state: State, expectedRevision: number): Promise<SaveResult>;
}
// expectedRevision 0 means create; existing records start at 1.
// Authentication, network and validation failures reject; they are not empty records.
```

- [ ] Inspect current Supabase docs/changelog, discover CLI via `--help`, and pin the selected supported SDK version using `npm install --save-exact`. Create one client with PKCE, persisted session, auto refresh, and callback detection. Missing public configuration produces a useful setup error while demo remains usable.
- [ ] Write repository tests with a fake Supabase transport: unknown schema rejects without mutation; absent row returns null; RPC conflict returns conflict; transport error throws. Example assertion:

```ts
await assert.rejects(repository.read(), /Unsupported|Invalid/);
assert.equal(transport.writeCalls.length, 0);
```

- [ ] Run `rtk node --experimental-strip-types --test tests/cloud-repository.test.ts`; verify the missing implementation causes failure.
- [ ] Generate migration filename using `supabase migration new private_journeys` after discovering installed CLI syntax. Define `public.journeys(user_id uuid primary key references auth.users(id) on delete cascade, state jsonb not null, revision integer not null check(revision > 0), updated_at timestamptz not null default now())`.
- [ ] Enable RLS; grant authenticated SELECT/INSERT/UPDATE only; revoke anonymous table access. SELECT/INSERT/UPDATE policies require `(select auth.uid()) = user_id`; UPDATE includes both USING and WITH CHECK. Do not grant DELETE to browser clients.
- [ ] Add SECURITY INVOKER function `public.save_journey(p_state jsonb, p_expected_revision integer)` returning the saved row or zero rows on conflict. Derive owner from auth.uid(), reject null identity, negative expected revision, non-object state, version other than 2, and demo=true. For revision zero, INSERT ... ON CONFLICT DO NOTHING; otherwise UPDATE WHERE user_id=auth.uid() AND revision=p_expected_revision, SET revision=revision+1. Use fully qualified table references and fixed search_path. Revoke function execution from PUBLIC and anon; grant authenticated execution.

```sql
update public.journeys
set state = p_state, revision = revision + 1, updated_at = now()
where user_id = auth.uid() and revision = p_expected_revision
returning *;
```

- [ ] Validate every payload using stateSchema before save and after read. Verify schema/RLS/grants with advisors and direct queries; iterate before recording the final migration. Apply the reviewed migration to the named project and verify migration history.
- [ ] Run repository tests and `rtk npm run build`. Commit only task files locally when git permissions allow; do not push main.

## Task 2: Recovery and explicit local migration

**Files:** Create recovery module and `tests/cloud-recovery.test.ts`; retain existing storage migration functions.

**Interfaces:** `readRecovery(store,userId): Recovery|null`, `writeRecovery(store,userId,recovery): string|null`, `clearRecovery(store,userId): string|null`; Recovery is `{userId:string, baseRevision:number, state:State}`. Errors reading malformed recovery are surfaced separately from a missing entry; do not delete malformed bytes. Key is `small-wins:pending:v1:<userId>`.

- [ ] Write tests with Map-backed Storage and throwing Storage: account A's recovery never reads under B; invalid JSON is preserved; demo rejects; full storage returns an error. Use assertions such as:

```ts
writeRecovery(store, 'A', {userId:'A', baseRevision:3, state:personal});
assert.equal(readRecovery(store, 'B'), null);
assert.equal(readRecovery(store, 'A')?.baseRevision, 3);
assert.match(writeRecovery(fullStore,'A',pending)!, /backup|storage/i);
```

- [ ] Run new tests to fail, then implement owner and State validation. Keep pending snapshot before initiating remote save, and clear it only when the exact acknowledged local version has no newer edits.
- [ ] Define import selection: remote present => load remote and offer explicit local replacement; remote absent plus legacy personal => Import or Start fresh; legacy demo => fresh setup only. Every replacement shows local/remote profile and entry counts, offers backup, and uses the loaded remote revision.
- [ ] Preserve legacy keys until cloud import succeeds. On successful claimed migration, retire the shared personal legacy copy so it cannot be offered to a different account; retain an owner-scoped recovery copy only as needed. On failure leave original bytes untouched. Migration must never turn a failed cloud read into an empty account.
- [ ] Run new and existing migration/onboarding tests, then commit task files locally.

## Task 3: Serialized sync controller

**Files:** Create controller and `tests/cloud-controller.test.ts`.

**Interfaces:** `createJourneyController({repository,store,userId})` returns `{getSnapshot,subscribe,load,edit,retry,refresh,replace,dispose}`. Snapshot includes `state:State|null`, `revision:number`, `status:'loading'|'ready'|'saving'|'saved'|'offline'|'error'|'conflict'`, `error:string|null`, `pending:boolean`. `edit(state):boolean` means valid edit accepted into memory, never server acknowledgement; `replace(state):Promise<SaveResult>` is explicit destructive replacement with revision checks.

- [ ] Write deferred-promise tests for saves A then B, focus refresh during pending edits, account disposal during read/save, ambiguous network response, stale first-create, and offline retry. Assert:

```ts
controller.edit(first); controller.edit(second);
assert.equal(repository.concurrentWrites, 1);
await settleAll();
assert.deepEqual(controller.getSnapshot().state, second);
assert.equal(controller.getSnapshot().status, 'saved');
```

- [ ] Run the controller tests to fail. Implement one in-flight write, a latest pending edit, and incremented local edit counters. Advance acknowledged revision before dispatching the queued state. Acknowledgement of A must not replace B in memory or clear B's recovery.
- [ ] Load remote before enabling edits. On focus/reconnect, refresh only when clean. Pending changes retain their base revision and require conflict handling if remote changed. Do not silently rebase pending data.
- [ ] On lost response, retain recovery and retry the same expected revision. A conflict is safe even if caused by the previous successful commit; offer export/reload rather than resubmitting against a new revision automatically.
- [ ] Invalidate asynchronous completions with a controller generation/disposed flag. Dispose stops subscriptions and queued operations; an already-sent request may complete for its original user but must not affect a new session. Reset the view immediately on account change.
- [ ] Run targeted tests and all existing tests. Commit locally.

## Task 4: Login, import and account UI

**Files:** Create hook, AccountGate, AccountPanel and cloud.css; modify App, Settings and main; create `tests/cloud-account.test.ts` for extracted session transition helpers.

**Interfaces:** `useJourney()` returns controller snapshot, `user`, `signIn():Promise<void>`, `signOut():Promise<void>`, `exploreDemo():void`, edit/replace/retry/refresh, and explicit import choice actions. AccountGate displays account state; AccountPanel consumes these account actions. Existing feature `change(next,replace?)` remains synchronous acceptance for ordinary edits; Settings replacement workflows must await remote confirmation before announcing completion.

- [ ] Before UI coding, use the high-fidelity prompt below to produce a reference mockup and inspect it against existing artwork. Save under `design/branding/` with a versioned filename. Use existing hamster assets in product code; do not embed a screenshot as the interface.
- [ ] Write failing session tests: account changes reset journey immediately; a rejected sign-out retains visible error; failed replace retains current view and pending candidate; demo never invokes cloud repository. Example:

```ts
await account.exploreDemo();
account.edit(demoState());
assert.equal(repository.writeCalls.length, 0);
```

- [ ] Implement Supabase auth subscription plus initial session restore, with one OAuth callback consumer under React StrictMode. Trigger `signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/'}})`. Render callback errors visibly and remove only auth callback parameters after processing; preserve unrelated query parameters.
- [ ] Replace App's direct persistence logic with the hook while keeping domain feature interfaces. Route onboarding, draft changes, import, reset, and restore through the same owner-bound persistence path. Demo uses its own key; never writes the legacy personal key.
- [ ] Render loading before personal data. Login screen offers Continue with Google and Explore demo. Migration UI follows Task 2. Conflict UI offers Download pending backup and Reload online records with explicit discard confirmation; no automatic merge.
- [ ] Settings displays account email, truthful save status and export controls. Replace local-only sidebar/footer labels with live status. Pending sign-out offers backup and explicit discard or cancel before clearing per-user cache/memory; clean sign-out clears immediately. If remote sign-out fails, show failure and do not claim success.
- [ ] Retain invalid raw backup recovery. Storage errors distinguish memory-only edits from locally cached edits. Show Saved online only when controller is saved and no pending edits exist.
- [ ] Verify keyboard focus, dialog return focus, aria-live save status, reduced motion, mobile width 390 and desktop width 1440. Run all tests/build and commit locally.

### High-fidelity mockup prompt

Create a polished Small Wins web-app account-flow design board with four clearly separated screens: desktop Google login at 1440x900, mobile login at 390x844, desktop Settings account card with saved/pending/error states, and an import-existing-journey dialog. Match the existing calm wellness application: warm ivory background, sage greens, soft blue and lavender accents, generous whitespace, rounded cards, dark readable text, Inter typography, and fluffy softly shaded hamster companions. Use the approved cream hamster holding a sage sprout as a modest logo. Login headline: “Your little wins, wherever you are.” Supporting text: “Keep your budget, movement and daily progress together.” Primary button: “Continue with Google”, with the authentic Google mark and neutral button treatment. Secondary link: “Explore demo”. Account card shows a sample identity and “Saved online”, with sign-out and backup controls. Import dialog says “Bring your journey with you” and offers “Import this device’s records”, “Start fresh”, and “Download a backup”. A conflict example says “Another device saved newer changes” and offers backup and reload. Avoid implying shared partner records. Preserve consistent hamster proportions, accessible contrast and clear touch targets. No marketing claims about perfect security or guaranteed permanent availability.

## Task 5: Real isolation and recovery verification

**Files:** Create verification script, update operations guide and tests for issues found.

- [ ] Build fixture-only authenticated checks that read access tokens from process environment, never print or persist them, and refuse to modify any pre-existing fixture journey. Use dedicated test identities, not personal budget records. Provision test identities only through an approved provider/admin mechanism; no disabling email verification or weakening production auth.
- [ ] Assert unauthenticated requests cannot read/write; account B reads zero rows for A and cannot insert/update A; authenticated direct ownership reassignment fails; two parallel revision-zero saves yield exactly one success; two same-revision updates yield exactly one success.
- [ ] With user completing Google consent, create a distinctive test record in a dedicated test journey. Verify database row, reload, sign into a second independent browser, and recover the record. Clear only that disposable test browser's app storage and sign in again; verify recovery. Do not clear the user's existing personal browser data.
- [ ] Test active workout draft continuity, offline edits/reconnect, pending sign-out cancellation, profile switching, restore preview, and read failure. Download test backups and validate via existing parseBackup. Never silently delete fixture data; retain it or request narrowly scoped cleanup approval.
- [ ] Run `rtk npm test` and `rtk npm run build`. Record actual results, identities represented as fixture labels, and any untested cases. No production-complete claim if cross-device or cross-account checks remain blocked.

## Task 6: Release and user handoff

**Files:** Operations guide and `plan/CLOUDFLARE_GITHUB_SETUP.md`; public environment values in Cloudflare build settings.

- [ ] Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for the Small Wins build; inspect bundle for accidental secret inclusion without displaying secret contents. Public key must be publishable, never service-role/secret.
- [ ] Review the final diff and include only implementation files. Review changes before remote publication. Obtain explicit authorization for committing/pushing this implementation to GitHub main because the earlier main push was rejected; don't bypass via another tool.
- [ ] After authorized publication, verify Cloudflare build/deploy success and production Google callback. Repeat production save/reload with fixture records and confirm Saved online corresponds to the database row.
- [ ] Explain importing existing data once, signing in with the same Google account on both devices, and the difference between Saved online and pending/offline. Document free-plan inactivity pauses and manual export backups. Mark work complete only after verified deployment and persistence.

## Self-review

Spec coverage: owner privacy and atomic writes (1,5); legacy migration and backups (2,4,5); save serialization and offline/conflict recovery (3,5); Google login/demo/account switch (4,5); artwork and prompt-before-code (4); free deployment and honest completion (6). All five Review Focus conditions have explicit task checks. No product code or deployment is authorized by this plan-review stage alone.

## Execution choice

Recommended: native execution in this session, followed by an independent final review. The tasks share a single persistence interface and benefit from one implementation context. Alternative: subagent-driven execution with a fresh implementer and reviewer per task. Await the user's plan review and selected method before implementation.
