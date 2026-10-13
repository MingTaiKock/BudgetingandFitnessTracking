# Little Wins wellness expansion — proposed design

Date: 11 October 2026. Status: ready for user review; not yet approved or implemented.

## Intent and boundaries

Extend the existing personal companion into a coherent money, movement and optional connection experience inspired by the supplied prototypes. Success means someone can record an action, understand their week, choose a practical next step and return after interruption without losing records or feeling judged.

Working assumption: keep the existing product identity, approved Mochi/Chonk artwork, currencies and manual-entry model. Audience clarification is pending. The Alex persona is design research, not the user's profile.

Initial release: local browser data, no external accounts, background monitoring, messages, bank/wearable imports, predictive model, or automatic partner sharing. Deployment is a separate decision. Existing records and usable budget/workout flows are retained.

## Information architecture and visual contract

- Today: next action, money summary, this week's movement, optional connection summary, quick log and unfinished workout.
- Money: existing transactions, limits and savings; scenario planner becomes a secondary tool.
- Movement: existing routines, schedule, session and exercise progress.
- Journey: weekly review, intentions/consistency and habitat; future scenarios become a secondary tool.
- Settings: domain preferences, motion/sound, backup/restore and deletion controls.

Desktop: persistent navigation and multi-column cards. Phone: compact navigation, stacked cards and accessible bottom sheets. Start verification at 375, 390, 768 and 1440 CSS pixels, plus mobile landscape and 200% zoom. Content determines layout; illustrations must not obscure forms or primary actions. Prototype screenshots guide composition and color, while text and controls remain real HTML.

Use current hamster assets where possible. Full-scene prototype images are references, not usable sprite assets. Asset extraction/generation needs its own review if required. No fabricated partner quotes or sample data in a personal journey.

## State, persistence and calculation contracts

Keep pure domain functions separate from rendering. Proposed modules: `wellness.ts` for summaries, `connection.ts` for manual logs, `intentions.ts` for planned actions and consistency, `scenarios.ts` for arithmetic comparisons, and `interventions.ts` for opt-in reset choices.

Phase 1 establishes an explicit schema-version migration boundary. Existing schema is version 1 and uses `little-wins:journey:v1`. Read and validate the old payload, preserve the original, create a versioned migrated payload, and only activate it after a successful validated write. Never overwrite corrupt or unsupported input. Add new optional domain defaults only at the migration boundary. Export identifies schema version and export date; restore preview reports record counts before replacing data.

If a storage write fails, show that changes are only in memory and offer backup; do not claim durable saving. Detect a changed revision from another tab before overwriting it and offer reload or backup. Do not merge financial records by last write wins without review.

Retain integer cents, existing date validation and reference integrity. Store activity dates as local calendar keys. Use the user's local week beginning Monday. Timers use absolute timestamps; they must not depend on background interval execution. Derived summaries are computed from records and an explicit reference date, not a nightly background task.

### Optional connection records

Proposed record: stable ID, local date, integer minutes (1–1440), activity enum (`conversation`, `shared-meal`, `walk`, `shared-activity`, `other`), optional short note, and `manual` origin. Domain preference defaults off. Enablement explains exactly what is stored; no partner identity or message content is required.

Users can add, edit and delete entries, disable display while retaining records, or explicitly delete all connection data. Same-day entries sum for display; reject a daily sum over 1440 minutes. Accidental repeat submissions reuse the action ID and do not create duplicate logs. Existing mood/rest entries do not imply connection activity.

### Weekly review

Money: logged income, spending by category and recorded savings contributions. Show budget remainder separately from bank balance. Workout: completed sessions and minutes, plus actual exercise data where already available. Rest: explicitly recorded or planned rest shown distinctly. Connection: recorded minutes and days with entries only when enabled.

Every card states its date window, units and source. Missing days show 'no entry'; totals say 'logged' to avoid implying complete real-world coverage. Current-week comparisons use equal elapsed weekday windows, or let the user select two complete weeks. A zero baseline yields an absolute change, not an infinite percentage. Empty histories show a useful logging action rather than fake trends.

No unified scientific wellness score. Existing seeds remain game currency under the current formula until a separately approved reward change. No causal claims in initial weekly review.

### Intentions and consistency

An intention contains an ID, user-chosen label, domain, target cadence, start date and dated target revisions. Completion points to an explicit record or deliberate confirmation. Schedule changes do not rewrite earlier denominators. Missed, unknown, rest and completed days remain distinguishable.

Use counts such as '2 of 3 planned workouts this week' and '3 of 4 chosen actions completed'. Never require spending less than a fixed amount or exercising daily. Optional identity wording describes the user's chosen aspiration; historical records remain accessible when wording changes. Unlocks already earned remain earned.

### Reset chooser

Open from an explicit action. Offer a short pause, an optional connection intention, or returning to the current task. Each option states time required and lets the user dismiss. Starting a timer does not automatically record a completed workout or connection entry. User confirms the actual duration on completion. Navigation/reload preserves an active timer; expiry while hidden is recalculated on return.

Automatic in-app suggestions, if added later, must explain the triggering record, respect dismissal, avoid active workout interruption and use a configurable cooldown. No OS notification promise in the initial version.

### Scenario planner and future view

Compare editable money and time assumptions. A scenario includes label, period, cost per occurrence, occurrences per week, extra preparation cost/time, and optional destination goal. Report gross and net effects separately.

For monthly equivalents, use `weekly × 52 / 12` and round displayed money to cents. Explain the convention. For a fixed horizon, use user-selected integer weeks or months; exclude returns unless an explicit rate model is added in a later reviewed design. Check safe-integer bounds before storing results.

Saving a scenario creates an intention only after an explicit action. Applying a budget adjustment shows before/after values and requires confirmation; it never creates past transactions or savings contributions.

Future view uses `starting amount + monthly contribution × months` for the initial no-interest illustration. Starting amount is explicitly entered or deliberately selected from recorded savings. Do not call it a verified bank balance. Show assumptions and neutral alternatives; avoid predictions about health, relationship quality, attractiveness or future property ownership.

### Habitat

Reuse current seed accounting and ownership. Add readable zone links into each domain and cosmetic milestones backed by actual activity. No deterioration, lost earned items or character distress when activity is absent. Optional sound defaults off; reduced motion substitutes a static celebration. Share/export, if added, previews an image and excludes private values unless explicitly selected.

## Testing contract

Domain tests cover boundaries, missing records, dates, exact cents, edits/deletes, duplicates, historical goal changes and deterministic results. Persistence tests cover legacy imports, successful migration, failed writes, corrupt input, unknown versions and multi-tab conflict. Each UI increment gets a browser walkthrough of saving, reloading, empty/error states, keyboard operation and narrow layout.

Passing unit tests alone does not complete a phase. Record test/build results, browser evidence, unresolved defects and acceptance decisions in a dated phase delivery file. Existing budget, routine, draft workout and backup regressions must remain covered.

## Deferred analytics gate

Only consider descriptive cross-domain patterns after there are deliberately collected compatible observations and a defined question. A later analysis design must specify minimum coverage, sample selection, missingness, multiple comparisons, uncertainty, and a held-out evaluation. Arbitrary minimum days or p-values are not sufficient validation. Show association wording and counts; let the user hide patterns. Native/cloud integration and AI each require separate feasibility, consent, security and testing designs.

## Review decisions

1. Confirm personal companion versus broader product audience.
2. Review the web-first scope, optional connection diary, honest metrics and prototype adaptations above.
3. Review phased development/test gates in `DEVELOPMENT_PHASES.md`.

Default execution proposal: implement sequentially in the current chat and workspace, verifying each phase before moving to the next. No subagents, new repository, external service or deployment is required for the initial increments.
