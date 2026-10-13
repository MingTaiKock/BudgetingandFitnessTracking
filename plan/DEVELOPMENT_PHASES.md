# Development and testing phases

Date: 11 October 2026. Updated 12 October 2026: design approved; the persistence foundation and phases 2–5 interface have been implemented and the prototype rebuild verified. This remains the acceptance roadmap; implementation does not imply every detailed gate below has been exercised. See PROTOTYPE_REWORK.md and CONTINUATION_VERIFICATION.md for actual evidence. Offline packaging, physical-device checks and pilot acceptance remain outstanding.

Source of behavior: `WELLNESS_DESIGN_SPEC.md`. Rationale and prototype review: `PLAN_EVALUATION.md`. This document adds gates to the source plan rather than claiming its 16-week estimate is reliable.

## Delivery sequence

| Phase | Deliverable | Main dependency | Release gate |
|---|---|---|---|
| 0 | Critical evaluation, baseline and reviewed design | Supplied plans/prototypes | Design and scope reviewed |
| 1 | Reliable versioned persistence and recovery | 0 | Existing records migrate/restore without loss; write failures remain recoverable |
| 2 | Responsive dashboard and factual weekly review | 1 | Every displayed value is traceable to records; phone and desktop flows pass |
| 3 | Optional connection diary and manual reset chooser | 2 | CRUD, consent, timers, reload and opt-out work |
| 4 | Scenario planner and weekly experiments | 2; 3 for connection experiments | Exact arithmetic, matching periods and explicit plan application pass |
| 5 | Flexible consistency, intentions and habitat | 3–4 | Historical goals, rest, duplicate rewards and earned unlocks behave correctly |
| 6 | Transparent future view, asset/performance work and offline packaging | 4–5 | Assumptions, recovery, update and device checks pass |
| 7 | Pilot, defect fixes and release decision | 1–6 | Intended user completes core tasks; no open record-loss or blocking-flow defects |
| 8 | Optional integrations and evaluated analytics | Demonstrated need after 7 | Separate feasibility/evaluation and consent gates |

Phases 1–7 form the proposed local companion release. Phase 8 is conditional. Re-estimate effort after phase 1 and asset review; do not promise a launch date before browser/device and integration constraints are known.

## Phase 0 — evaluate and align

Completed: read the three supplied planning documents; visually inspect eight desktop screens and four key mobile screens; compare existing foundation; run baseline tests/build; produce written evaluation/spec/phase sequence.

Evidence: 31 tests pass, build succeeds. Nonblocking dependency annotation warnings exist. Current workspace has no Git repository. No new UI, domain features or migrations have been implemented. Browser and real-device baseline validation remains open.

Exit: user reviews the concrete proposed expansion. Resolve the audience question and incorporate corrections. Any required implementation skill workflow begins after this review.

## Phase 1 — data safety and baseline browser verification

Primary files: `src/model.ts`, `src/storage.ts`, `src/download.ts`, `src/App.tsx`, `src/features/Settings.tsx`; proposed `src/migrations.ts` and migration/storage tests.

Development:

1. Capture reproducible v1 fixtures representing empty, personal, demo and active-workout states, including routines, schedule, savings and owned cosmetics.
2. Add explicit version routing and pure migrations. Preserve original payload and handle unsupported versions without overwrite.
3. Add dated export metadata and restore preview without breaking validated legacy backups.
4. Detect another-tab revisions before overwriting. Preserve in-memory state and backup ability on quota/access failure.
5. Verify current onboarding, transaction, workout/resume and backup flows in a browser before redesigning them.

Tests: migrate each fixture; verify exact cents, IDs and references; repeat migration; failed migrated write; corrupt/unknown payload; restore failure leaves previous state intact; concurrent tab change is detected. Run the existing suite and production build. Browser: enter money, start a workout, reload, finish it once, export, restore and simulate storage failure.

Exit: no unexplained record loss or silent overwrite; dated evidence documents browser results. Rollback uses the retained valid prior payload, with no silent destructive migration.

## Phase 2 — dashboard and weekly review

Primary files: `src/features/Today.tsx`, `src/features/Journey.tsx`, `src/App.tsx`, `src/components.tsx`, `src/styles.css`; proposed `src/wellness.ts`, `src/features/WeeklyReview.tsx`, `tests/wellness.test.ts`.

Development:

1. Implement pure weekly summaries from existing transaction, contribution, workout and check-in records.
2. Make Today follow the prototype hierarchy while keeping logging/resume actions easy to reach.
3. Add review window selection, coverage labels and an evidence drawer.
4. Include empty, partial, overspent and storage-warning states; keep currency-aware formatting.
5. Compare desktop/mobile composition against the supplied dashboard and summary references. Only render implemented destinations.

Tests: Monday/Sunday boundaries, month/year transitions, zero history, deleted entries, contribution versus income separation, workout target versus rest, equal-period comparison and zero baseline. Browser: change review window, trace a metric, log/edit/delete a record and observe updated totals, reload, keyboard navigation, 375/390/768/1440 widths and 200% zoom.

Exit: summary values reconcile with records and no placeholder percentages or wellness units appear as real measurements.

## Phase 3 — connection and reset flows

Primary additions: `src/connection.ts`, `src/features/Connection.tsx`, `src/interventions.ts`, `src/features/ResetChooser.tsx`, tests; extend model, migrations, settings and quick-log entry points.

Development: optional domain enablement; connection create/edit/delete; diary and weekly summary; user-initiated reset choices; reload-safe timestamp timer; explicit completion and dismissal. No passive detection or partner messaging.

Tests: disabled defaults, old backups, invalid dates/minutes, daily duration cap, repeated submissions, edits/deletes, opt-out retention, deliberate domain deletion, timer return after hidden/closed page and cancelled timer. Browser: enable, log, edit, reload, delete, disable, start a reset, navigate away and resume, dismiss with Escape and return focus.

Exit: all displayed connection values derive from voluntary entries; no timer completion invents an activity record.

## Phase 4 — scenarios and experiments

Primary additions: `src/scenarios.ts`, `src/features/ScenarioPlanner.tsx`, `src/intentions.ts`, arithmetic and intention tests; connect to Money and Journey.

Development: editable assumptions; compare options A/B/C using actual money/time units; weekly/monthly labels; saved scenarios; one chosen weekly experiment; optional confirmed budget adjustment. Use supplied scenario images as layout references.

Tests: exact cents, negative/zero net effects, input limits, safe-integer bounds, `52/12` month conversion, horizon changes, stale goal references, scenario persistence, plan versus actual separation, repeated application and cancel. Browser: compare, inspect assumptions, save/reload, choose an experiment, preview/cancel/apply an adjustment and verify no transactions were created.

Exit: examples recalculate from inputs; application is explicit and does not rewrite history.

## Phase 5 — consistency, identity and habitat

Primary additions: intention completion/revision logic and consistency calendar; extend `src/features/Journey.tsx`, domain rewards and habitat components.

Development: user-selected labels, counts against dated intentions, planned rest and missing-data states; permanent cosmetic milestones; domain zone links; optional static/motion celebrations. Retain the current seed formula unless a new formula is separately reviewed and tested.

Tests: midweek target revision, backdated correction, missing/rest distinction, repeated completion, deletion, reward cap, purchase duplication, overspend and owned-item retention. Browser: set/change intentions, inspect past weeks, follow habitat links with keyboard, purchase once, turn motion off and reload.

Exit: one definition drives counts everywhere. No unvalidated synergy multiplier, shrinking identity worth, wilt punishment or distress feedback.

## Phase 6 — future view, performance and offline reliability

Primary additions: deterministic projection functions and future view; asset-loading changes; optional manifest/service worker after the update strategy is designed.

Development: no-interest money projection with editable starting amount, contribution and horizon; assumptions drawer; neutral scenario illustrations. Measure image requests and transfer cost; the baseline build emits thirteen hamster PNG sheets of about 1.8–2.4 MB each, so avoid eagerly loading all sheets. Optimize or lazy-load based on measured requests and visual quality.

Offline packaging is separate from browser data persistence: add installable/offline behavior only with a tested shell cache, fallback and update flow. Preserve active workouts and records across app updates; show when an update is ready and avoid changing a live session underneath the user.

Tests: zero horizon/contribution, input limits, rounding, safe bounds, repeat calculation and neutral copy; asset loading/reduced motion. Browser/device: cold/warm loading, landscape, slow network, offline launch after installation, reload offline, update with active draft, backup and rollback/recovery.

Exit: no unsupported future health/relationship predictions, broken offline promises or untested destructive cache update. Record measured performance; do not confuse emitted assets with initial transferred bytes.

## Phase 7 — pilot and release testing

Development: fix issues from an intended-user walkthrough; remove unused navigation and dead ends; finalize help/privacy wording and recovery instructions.

Acceptance script:

1. Start a personal journey; verify the absence of sample history.
2. Set a budget; log/edit money; record savings and distinguish it from transferring funds.
3. Schedule/start a workout; interrupt, reload, resume and finish once.
4. Enable/log optional connection; review the week and inspect sources.
5. Compare a scenario; choose an experiment and revisit it next week.
6. Change an intention without altering past results; unlock a cosmetic.
7. Export and restore; handle storage failure and another-tab conflict.
8. Complete equivalent flows on desktop and the intended phone; verify keyboard, screen-reader labels, zoom and reduced motion.

Exit: no open record-loss defects, broken core flows or fabricated metrics. Record known minor issues. Deployment/account setup remains separately authorized; a local release is not a publicly hosted service.

## Phase 8 — optional research and integrations

Candidates: reviewed recurring-entry proposals; device imports; private sync/sharing; descriptive pattern cards. Prioritize only after pilot evidence identifies a need.

Before each integration: verify current platform/provider support for the target location/device, consent and revocation, duplicate matching, timezone reconciliation, secure credential storage, deletion and recovery. Native usage/health access is its own adapter project, not a web permission switch.

Before a predictive feature: write a question, dataset and labeling contract, baselines, holdout evaluation, calibration, confidence/missingness handling and monitored failure criteria. Do not ship causal strength percentages from fixed coefficients or small observational samples.

## Ongoing feature proposal process

After each phase, record: observed friction, supporting evidence, proposed feature, trade-off, acceptance test and priority. Put ideas into a backlog and select them deliberately; do not let suggestions silently expand the current phase.

Progress is tracked in claude-mem work state when available and in dated delivery files. A phase is marked implemented only after its feature and testing gates pass; unavailable browser/device checks remain explicitly open.
