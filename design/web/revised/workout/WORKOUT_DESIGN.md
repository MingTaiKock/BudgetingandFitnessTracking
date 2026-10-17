# Workout prototype — Small Wins

## Approved direction
Balanced muscle development; 3–4 visits weekly; over a year of lifting without a fixed routine. Gym first, dumbbells and bench at home. Preserve the approved hamster artwork and design/web/revised components. This is a standalone interactive design prototype, not an application release or a prescribed training plan.

## Design plan
Five views: next workout, workout preview, active logging, completion, exercise progress. Rolling Upper A → Lower A → Upper B → Lower B; no Monday reset. Gym/home selection happens before starting. Freeze the chosen exercise list during a session. Resume a paused session with entered and completed sets intact. Finish early explicitly, preserving partial work; allow repeat or move forward. A skipped day changes neither the sequence nor rewards.

Keep the next action primary. Exercise history appears next to logging controls. Targets and actual sets are distinct; only explicit completion records a set. Nudges are optional, based on comparable history plus effort, suppressed on discomfort. No history means establish a baseline. No body-weight or calorie goals are assumed.

## High-fidelity mockup prompt
Extend the existing Small Wins web application, using the exact visual vocabulary from ../02-movement-desktop.png and ../03-workout-desktop.png: pale #f6faff background, navy #101b46 text, restrained blue actions, sage success accents, lavender coaching surface, 12–16px corner radii, generous 20–24px spacing, familiar sans-serif typography. Reuse the approved dashboard hamster image regions; do not generate or redraw characters. Preserve the desktop sidebar and compact mobile navigation. Create five consistent screens at desktop 1440×1000 and mobile 390×844: (1) Movement home with a prominent Upper A next-session panel, four-step rolling programme, optional missed-day explanation, weekly attendance; (2) preview with Gym/Home segmented control, six exercise rows, previous results, explicit substitution disclosure; (3) active workout with all-six-exercise navigation, previous comparable sets, a single skippable progression nudge, editable actual weight/reps, completion controls, rest timer and effort/discomfort controls, no art overlapping fields; (4) completion with original hamster, actual completed-set count, honest partial/complete state and next-session choice; (5) progress with exercise/equipment filter, dated comparable records, empty home-history state. Use clearly labelled illustrative records. Every prototype control must have a coherent outcome. Keep source code, database and live records untouched.

## Prototype boundaries and assumptions
Session examples and loads are illustrative, not recommendations. Session definitions are a structure demo; health limitations, available dumbbell increments, exercise preferences and initial workloads remain unknown. Home variants are alternatives, not equivalent load comparisons. Production must support calibrated progression, all plan families, editable programmes, account persistence, conflicting device updates and full accessibility testing. The prototype uses browser session storage under its own key only; no Supabase calls. Clearing demo resets only that key.

## Intended review scenarios
1. Gym: preview Upper A, start, enter actual values, record a set, choose effort, navigate to the sixth exercise, pause and resume, finish a partial session.
2. Home: switch before starting; show dumbbell/bench options and no comparable machine-history prompts. Reset location only on a new session.
3. Missed day: leave next session unchanged; explain continuation rather than doubling up.
4. Complete: log every prescribed example set; show actual count and increment sequence once. Reloading completion must not advance again.
5. Comparison: isolate dumbbell vs machine records, show unknown rather than invented history; new completed demo sets appear in matching progress view.
6. Mobile: no horizontal overflow, readable actual inputs, no character obstruction, all exercises reachable.

## Deferred
Meal input → estimated calories → user refinement remains in future scope. Rewards stay supportive; no extra credit for ignoring effort or discomfort.

## Descriptive plan refinement
User requested a more descriptive workout plan after reviewing the prototype. Added an expandable all-session explanation on Movement home, a sets/reps/start-weight/rest/progression guide on preview, a session-specific purpose statement, muscle labels and per-exercise purpose/logging details. Home substitution limitations are explicit. The active logging screen retains its compact layout. These descriptions explain the example programme; they do not turn sample targets into personalised prescriptions. General principles reference ACSM's 2026 update and exercise anatomy uses ACE's exercise library.
