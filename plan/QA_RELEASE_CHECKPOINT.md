# Small Wins release QA — 16 October 2026

Publication is authorized only after QA passes. No application release has been pushed yet.

## Verified

- 67 automated tests pass, including account ownership, save revisions, competing tabs, pending edits, refresh retry, corrupt recovery, and planner preview regression.
- Production build passes. It reports a non-blocking large JavaScript chunk warning.
- Database transactional checks pass: create/update, stale revision rejection, account isolation and owner mismatch. Synthetic fixtures rolled back.
- Supabase security advisor reports no findings after internal event-trigger execution grants were restricted.
- Browser: Habitat navigation; six-exercise routine creation; direct sixth-exercise selection; recording 20 kg; partial completion; next-session history showing the previous 20 kg.
- Browser: expense creation, goal contribution, category budget editing, new goal, deletion cancellation, manual workout creation and history.
- Browser: planner estimates $21/week and $91/month from $12 versus $5 three times weekly; save idea; start weekly experiment; find intention; complete/undo/finish intention.
- Browser: Insights separates money and movement with newest dates first; savings filter works.
- Browser: preferences, connection opt-in/navigation, water/mood/rest controls, quick-entry menu, backup download and validated restore.
- Phone and desktop Habitat inspected using original artwork; hint below image. Impeccable detector returned no output/findings on revised core surfaces.

## Fixed during QA

- Planner crashed when preview/saved idea IDs reached strict comparison schema.
- Manual workout rename cleared stable exercise identity and equipment.
- Retry did nothing after a failed clean cloud refresh.
- Corrupt recovery blocked account recovery; explicit reload now archives raw recovery before replacing it.
- Remote reload could overwrite edits made during its request; serial check preserves them.
- Competing tab recovery writes/removals now check ownership of the existing snapshot.
- Online Settings offered an unusable demo replacement; hidden for cloud accounts.
- Cloud recap warning and local sign-in errors are now shown; demo privacy wording is explicit.

## Final account verification

- User approved Google identity consent. Fresh OAuth request returned to the local preview successfully (the older pending request had expired).
- Created an empty personal journey; server status reached Saved online.
- Changed nickname to Mochi QA, waited for Saved online, reloaded, and observed the saved nickname.
- A second client tab loaded Mochi QA from the server; restored Mochi and waited for acknowledgment.
- Sign-out returned to the account gate. No synthetic transactions/workouts were uploaded to the personal account.
- Signed-in browser console showed no errors. A physical second-device test was not performed; independent client-tab reload and real server reads were verified.

## Publication

- Legacy history linking now verified in browser: 3 × 10 at 14 kg preserved and shown in comparable history. Movement, Money and Settings fit the 390px phone viewport without horizontal overflow.
- Public Supabase configuration is now committed-ready in src/cloud/publicConfig.ts with optional environment overrides; local credentials remain ignored.
- Review/stage only intended source, tests, migration and required assets; commit; non-forced GitHub push; verify Cloudflare build and live smoke test.

## Environment

- Preview: http://127.0.0.1:5191/
- Branch: codex/focused-redesign
- Production: https://smallwins.mtkock1994.workers.dev/
- Do not replace existing personal records with test fixtures. UI QA uses the isolated in-memory demo.
