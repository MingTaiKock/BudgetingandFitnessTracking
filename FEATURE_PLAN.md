# Little Wins — experience improvement plan

9 October 2026. Scope: inspect the existing app, prioritize features, and implement the first useful increment as requested.

## Direction

Preserve the approved Mochi/Chonk identity and current gentle palette. Improve the existing daily flows rather than replace the visual world. The core loop is: see today's next action → record spending or follow a routine → receive useful feedback → return with progress intact.

## First increment — implemented, live phone verification pending

### Recoverable guided workouts

Store one active workout with a snapshot of its routine, completed sets, current exercise, input values, session start and rest deadline. Save it through the same validated storage path as the journey. Closing preserves it; discarding is explicit. Resume from Today or Fitness. Finishing atomically adds one diary record and clears the draft, using the session ID to prevent duplicate completion. Old backups load with no active draft. Show storage failures inside the runner. Elapsed time includes breaks and time away; duration remains editable.

Acceptance: a refresh/restore retains actual reps and fractional weights; editing/deleting a template cannot alter an ongoing workout; invalid/extra sets are rejected; a partial session saves only completed sets; finish cannot duplicate a session. Rest countdown uses a deadline, remains optional, and never prevents logging a set.

### Daily actions and mobile exercise layout

Put Log spending and Start/Resume workout above the garden and optional check-ins. Surface an unfinished workout immediately. On small screens the exercise fields get the full width; the hamster pair sits in a compact encouragement strip. Use comfortable touch areas and readable action text. Keep reduced-motion behavior.

Acceptance: primary actions precede optional check-ins in DOM/reading order; no 100 px side column squeezes reps/load at phone widths; controls are at least 44 px high in the changed flows. The approved character images remain intact.

### Monthly planning clarity

Treat an unplanned month as unplanned, not as zero money available. Offer a preview of last month's category limits inside the planner, then save deliberately. Never copy transactions or overwrite the current month merely by opening the planner. Fresh personal journeys start with no assumed spending limits; demo budgets remain illustrative.

Acceptance: canceling a copied preview makes no changes; zero-valued planned categories are distinguishable from no plan; switching months does not reuse another month's form values.

## Next increments and status

| Order | Feature | User outcome | Completion evidence |
|---|---|---|---|
| 2 | Guided personal setup — implemented 10 October | Confirm names/SGD, select own budget and routine without visiting reset controls | 19 tests and production build pass; clean personal records and replacement guards tested. Live phone/intended-user walkthrough still pending. See DELIVERY_2026-10-10.md |
| 3 | Exercise library and routine scheduling — implemented 10 October | Filter 24 exercises by 10 equipment types, reorder/replace movements, set planned loads, and plan weekdays | 26 tests and production build pass; old backups, active snapshots and history preserved. Live phone verification pending. See GYM_PLANNING_DELIVERY.md |
| 4 | Useful improvement feedback — implemented | Previous matching sets during a workout, exercise history with date windows, and a saved-session recap | 31 tests and production build pass; exact exercise/equipment matching, same-day grouping, partial-session totals. Live phone verification pending. See EXERCISE_PROGRESS_DELIVERY.md |
| 5 | Character states in the workout | Chonk explains the current cue; Mochi celebrates a completed set and rests with her | Registered/cropped approved assets, short state-driven motion, reduced-motion fallback; no equipment illustration presented as form instruction |
| 6 | Faster budgeting | Repeat common entries, category search, recurring-entry proposals and editable savings targets | No automatic duplicates; review before adding recurring entries; exact cents and undo/recovery tests |
| 7 | Installable offline app and backup confidence | Reliable phone launch, offline use, dated backups and restore preview | Offline/reload/update tests on a real phone; migration tests before schema changes |
| 8 | Optional private partner access | Share only chosen progress with Chonk | Explicit visibility, revocation, deletion and cross-device conflict tests before release |

## Deferred

Bank integrations, wearable imports, AI coaching and expanded reward shops follow demonstrated use. They do not solve the current interruption and daily-action gaps. New gym artwork remains an animation resource until it is cut, registered, optimized and reviewed in context.

## Validation and limits

Use unit tests for persistence, legacy backups, duplicate completion and budget preview semantics; compile the complete app. Inspect desktop and phone layouts in one bounded browser pass and correct material issues together. Current browser connection failures must be disclosed; saved mobile captures contain older art and are layout evidence only. A real-user usability session and real-phone testing remain necessary before calling the experience validated.
