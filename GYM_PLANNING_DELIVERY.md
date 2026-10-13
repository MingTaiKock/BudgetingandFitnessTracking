# Gym planning delivery — 10 October 2026

Implemented locally in the existing mobile-friendly Little Wins app. Mochi remains the small gray hamster and Chonk the larger brown hamster; their approved artwork and current animation are preserved.

## What you can use

- **My fitness → New routine / Edit routine:** browse 24 strength exercises across 10 equipment types. Search by movement or filter available equipment. Add, replace, remove, or reorder exercises using labelled up/down buttons. Custom exercises remain available.
- Set exercise targets, optional planned kilograms, and Chonk's cue. Library defaults are editable starting values. Maximums remain 10 exercises and 30 total sets per routine.
- **My fitness → Edit weekly plan:** assign a routine, rest day, or open day to each weekday. Review the repeating week, then save or cancel.
- **Today:** resume an unfinished workout first; otherwise start today's scheduled routine. A saved partial session is described as logged, without claiming every set was completed. Rest plans encourage recovery without automatically creating rest logs.
- **Guided workout:** see equipment and planned load, with the planned load prefilled. Record actual reps and weight independently. Each exercise retains its unfinished inputs when navigating away and back.

## Data behavior

Plans do not create diary entries or earn seeds. Exercise identity and equipment are saved with logged strength sets, and a routine-origin ID links guided sessions to the schedule. Changing an exercise name or equipment in the editor clears its library identity to avoid false comparisons later.

Deleting a routine also removes its weekly assignments. The confirmation explains this. Historical workouts and an active workout snapshot are preserved, and that snapshot can still be finished after deleting the template. Old backups remain readable: missing schedules default to empty and exercise metadata stays optional.

Everything continues to use this browser's local storage and backup flow. No accounts, sharing, deployment, or new cloud service were introduced.

## Verification

- All **26 automated tests pass**, including seven gym-planning checks covering library filtering, planned/actual loads, backup compatibility, schedule validation, weekday mapping, reordering, and deletion during a workout.
- The TypeScript check and production build pass. Existing Zod comment-annotation warnings are non-blocking.
- The Impeccable source detector returned no findings in the initial changed-screen batch. A final source pass added focus transfer after exercise selection and clearer routine-deletion copy.
- Live preview at `http://127.0.0.1:5173/` returned `ERR_CONNECTION_TIMED_OUT`. No fresh screenshot, interactive browser walkthrough, or real-phone validation is claimed. The test server was stopped after the attempt.

## Next verification and development

On a working phone preview, create a two-exercise routine, filter by equipment, replace and reorder movements, enter fractional loads, and save. Plan it for today, start it, log one set, close and resume, and finish partially. Confirm the diary and Today agree; reload and restore a backup. Check keyboard focus, long exercise names, and narrow layouts.

The next feature increment is comparable exercise history: previous actual reps/load and a session recap using the stable identity and equipment now available. Timed/cardio routines, automatic progression, per-date schedule exceptions, reminders/notifications, and registered equipment-animation assets remain future work. Cardio can still be recorded in the existing movement diary.

Implementation spec: [GYM_PLANNING_SPEC.md](GYM_PLANNING_SPEC.md). Current priorities: [FEATURE_PLAN.md](FEATURE_PLAN.md).
