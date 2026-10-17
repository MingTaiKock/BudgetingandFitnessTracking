# Workout prototype review

Reviewed 17 October 2026. Prototype only; live application unchanged.

## Result
Five high-fidelity responsive views plus a home-location variant, with twelve full-page PNG captures (desktop 1440px wide, mobile 390px wide). Original dashboard hamster regions reused directly. Initial viewports were 1440×1000 and 390×844; full-page images extend where content scrolls.

25 browser assertions passed on the final run, with zero JavaScript page errors. Checked viewport overflow for all six capture states, sixth-exercise access, explicit logging validation, no automatic target-to-actual conversion, pause/reload preservation, discomfort suppression, matching exercise history, complete and partial session outcomes, single sequence advancement and repeat-session choice. The development server's missing favicon was incidental, not a page-script failure.

## User-centred evaluation
- Next workout is visually primary; programme order remains visible without a calendar prerequisite.
- Mobile logging initially spent too much space on preview navigation. Final version hides the screen gallery, greeting and bottom navigation during an active session; Pause & leave remains available.
- Gym/home changes occur before starting; an active session retains its original exercise list.
- Six exercise selectors are reachable. Actual values start blank, distinct from the coaching target. Finishing early retains completed sets.
- Completion describes actual recorded work, not estimated muscle gain or calories burned. Reopening completion does not advance the programme twice.
- Comparison view separates machine and dumbbell records and displays an empty state for an unfamiliar variation.
- Original characters sit outside input areas. The status message positioning issue discovered in the first screenshot pass was corrected before final captures.

## Limits before product implementation
This demonstrates a selected upper/lower flow. It is not yet the full programme recommender or validated training prescription. Other split families, personalised exercise substitutions, load increments, programme editing, warm-up classification, calibrated progression and long-term account-backed storage remain implementation work. The illustrative coaching nudge is not an adaptive recommendation engine. Attendance is labelled sample data. Prototype state is retained only in this tab's session storage. Manual keyboard/screen-reader coverage and real-device gym usability are not exhaustively tested.

Keep the same design components when implementing. Further user feedback should focus on whether the logging density and nudge wording feel useful during a real session.

## Follow-up: more descriptive plan
Added expandable programme/session explanations and per-exercise muscle, purpose and logging descriptions. Six focused browser checks passed: all-session explanation, sets/reps guide, gym exercise details, home-specific details, desktop/mobile overflow and no guide content leaking into active logging. No page-script errors. Saved 02-descriptive-plan-desktop.png and 02-descriptive-plan-mobile.png. The first test attempt used an already-open page with stale JavaScript; explicitly reloading loaded the revised artifact and the checks passed.
