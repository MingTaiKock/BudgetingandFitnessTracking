# Little Wins — app experience review

Method: dual-agent (A: /root/ux_review · B: /root/ui_evidence). 9 October 2026.

## Verdict

The approved hamster pair, affectionate voice, spending jars and garden give the app a distinctive identity. The main weakness was the daily workflow: decorative reassurance came before the core tasks, while a refresh could erase a workout. Preserve the identity and make the practical experience trustworthy.

This is a source and saved-screen review, not a completed live usability test. The in-app browser timed out at local ports 5173 and 5174. Older mobile captures contain superseded pixel artwork; only layout observations were drawn from them. Current source and approved-art desktop captures establish character identity. No fresh phone screenshots or measured browser layout are claimed.

## Baseline design health

Provisional heuristic scores, before this increment. 0 = absent/broken, 4 = excellent. These are design judgments, not measured user outcomes.

| Heuristic | Score / 4 | Baseline evidence |
|---|---:|---|
| System status | 3 | Progress/toasts/storage warning exist; unfinished sessions were temporary |
| Real-world match | 3 | Clear SGD, cash flow and rep language; income asked for a spending jar |
| Control and freedom | 2 | Undo set and cancellation exist; no recoverable draft |
| Consistency | 3 | Shared forms/dialogs; mobile exercise hierarchy weakens |
| Error prevention | 3 | Strong schemas and reset/restore confirmation |
| Recognition | 2 | No equipment or previous performance beside the exercise |
| Efficiency | 1 | Monthly re-entry and exercise load reset |
| Aesthetic/minimalism | 2 | Coherent warmth; secondary habits precede money/workout actions |
| Error recovery | 2 | Form values generally survive errors; some errors are too broad |
| Help | 2 | Exercise cues exist; first-use setup is buried in reset settings |
| **Total** | **23/40** | **Usable foundation with meaningful gaps** |

## Priorities and disposition

| Priority | Finding and evidence | Action |
|---|---|---|
| P1 | `Routines.tsx` originally kept all session state only in component memory; duration defaulted to 20 minutes | Implemented a validated persistent draft, snapshot, resume, editable elapsed-based duration and atomic finish |
| P1 | `Today.tsx` placed garden/coach and three habits before core tasks | Implemented early spending and workout actions plus an unfinished-workout summary |
| P1 | `demo.ts` originally assigned S$1,300 of category limits to a fresh personal journey; Settings owns the starting/reset path | Removed unchosen limits for new personal journeys; complete guided onboarding remains planned |
| P1 | Mobile runner retained a 100 px cheer column and 9–10 px copy, squeezing reps/load | Implemented a full-width exercise column, compact approved-art pair and larger task controls; live phone inspection remains open |
| P2 | Six category amounts needed re-entry in every new month | Implemented last-month preview with explicit save/cancel and an unplanned-month state |
| P2 | Routine model has no equipment, schedule or stable exercise ID; history depends on typed names | Planned equipment library, scheduling and comparable exercise history |
| P2 | Several faint secondary labels and routine controls of 24–30 px | Darkened coach/rest/footer text and enlarged routine edit/delete hit areas; full-app accessibility pass remains planned |
| P2 | Progress widgets all shared the name “Progress” | Added contextual-label capability; new workout runner uses it. Remaining callers need semantic money/count labels |
| P2 | Water changes were announced only at the goal | Added spoken count status |
| P3 | Generic destructive copy “Keep my journey” / “Confirm” | Still open: action-specific cancellation and deletion wording |

## Emotional and cognitive experience

Arrival is warm and accepting. Partial workouts, actual reps, rest days and forgiving rewards are strengths. The main emotional valleys were lost effort and confusing personal setup. The new draft addresses the first; onboarding is next. Finish currently returns to the existing screen with a result toast; a later completion recap should show completed work and a useful next step.

The five navigation destinations are reasonable. The problem is equal emphasis within screens: the user should not need to weigh a garden, coach, three habits and two tracking domains to find the next task. The new early action row establishes a practical starting point. Optional care check-ins remain available below it.

Persona risks: a distracted phone user needs interruption recovery and generous controls; a first-time user needs a clear personal setup and honest unplanned state; a keyboard/screen-reader user needs contextual progress names, visible focus and spoken feedback. These are inspection hypotheses until observed with the intended user.

## Technical design scan

Assessment B found 2 warnings and 0 errors across `src`: Arial on the decorative flower glyph (false positive for interface typography), and a width transition on progress fills (low-priority performance concern). Existing reduced-motion rules disable transitions. It calculated low baseline contrast for coach signature (2.81:1), rest text (3.04:1) and footer (2.27:1); those colors were darkened in this increment.

The final scan of changed TSX entry points returned no findings. That narrow result does not supersede the original stylesheet warnings or certify accessibility. Dialogs already implement titles, Escape handling, focus trapping/restoration and body scroll locking. No browser overlay was injected: the available browser evaluation is read-only.

## Review closure

Questions skipped: the user explicitly requested planning followed by implementation; names, currency, platform and character identity were already settled. Future product choices remain labeled in PRODUCT.md and FEATURE_PLAN.md.

Run notes: target `src/App.tsx`; independent assessments; ignore file absent; source scan completed; no overlay/live-overlay server or temporary detector files. Local preview startup and connection failures are recorded in the delivery validation. No user data was changed during the review. A real phone pass and intended-user walkthrough remain outstanding.
