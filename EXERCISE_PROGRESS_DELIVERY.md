# Exercise progress delivery

Implemented the next approved feature-plan increment in Little Wins.

## Available now

- **During a guided workout:** see the last logged day for the same library exercise and equipment, including actual set groups, reps and kilograms. Several sessions on one date are clearly counted together. Previous entries are reference information; they never change the planned or actual input automatically.
- **My journey → Your strength, over time:** choose an exercise and view 30 days, 90 days, or all recorded history. The latest eight logged days appear first, with an option to expand. This replaces the old name-only highest-weight cards.
- **After finishing a guided workout:** a hamster recap shows saved duration, actual sets, total reps, equipment and weights. It works for partial workouts too. Storage warnings remain visible when a browser save fails.
- **My fitness → movement diary → View workout recap:** reopen a recap from any entry containing strength details. It is derived from the current saved record, so edits and deletion remain authoritative.
- New starter routines now contain explicit catalog exercise IDs and equipment. Existing saved routines are preserved; replace their exercises through the library to start comparable records going forward.

## Comparison rules

Only matching exercise IDs **and** equipment are combined. Names alone are insufficient. Older/custom entries without both remain in the diary, with an explanation in the progress panel. The active workout is excluded from previous-history lookup, as are records dated after the session. Multiple sessions on a date are grouped without inventing a within-day chronology.

Loads are displayed as entered. The interface asks for a consistent setup and weight convention; it does not claim a strength assessment, personal best, or automatic progression. No existing records were relabeled and no storage schema migration was needed.

## Verification

- **31 automated tests passed.** Five new tests cover identity/equipment isolation, same-day grouping without mutation, inclusive date windows/current-record exclusion, grouped set/repetition totals including bodyweight, and new starter-routine identities.
- **TypeScript and production build passed.** The two existing Zod comment-annotation warnings remain non-blocking.
- The Impeccable source detector reported no findings for the changed screens.
- Vite reported ready at `http://127.0.0.1:5173/`, but the in-app browser returned `ERR_CONNECTION_TIMED_OUT`. Interactive flows and phone appearance were not verified. The temporary server was stopped after this attempt.

## Pending walkthrough

On a reachable preview, log the same library exercise twice with different reps/weights. Verify prior entries during the second session, finish partially, reopen the recap from the diary, and review each history date range. Confirm a different machine or custom exercise stays separate. Check narrow screens, long names, keyboard focus, reduced motion, and the storage-warning state.

The next planned development is preparing the approved hamster action artwork for distinct workout states. Real-phone validation remains open alongside development. Timed/cardio routines, setup-specific machine identities, cloud sync and automatic load progression are not included in this increment.

See [EXERCISE_PROGRESS_SPEC.md](EXERCISE_PROGRESS_SPEC.md) for the implementation contract and [FEATURE_PLAN.md](FEATURE_PLAN.md) for remaining priorities.
