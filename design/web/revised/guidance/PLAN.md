# Encouragement and practical guidance

19 October 2026. User scope: overall app, specifically rewards feedback, budget settings, lifestyle changes and workout preset plans. Implement using existing components and hamster art. This supersedes the exploratory daily-flow proposal.

## Evidence and design decisions

- [CFPB budgeting guidance](https://www.consumerfinance.gov/archive/blog/budgeting-how-to-create-a-budget-and-stick-with-it/): understand income and categorized spending before creating a realistic budget. Feature: populate an editable category-limit draft from the immediately preceding calendar month's recorded expenses. Show record count and dates; do not imply data completeness or affordability. Missing categories become zero with a clear warning to add bills and irregular costs. No automatic percentage cuts or savings transfers.
- [Self-Determination Theory](https://selfdeterminationtheory.org/topics/application-intrinsic-motivation/): feedback can support or undermine autonomy and competence. Our application: specific, factual encouragement with familiar hamsters, without rewarding larger spending, heavier lifting, or punishing breaks. A weekly summary counts distinct logging days, savings contribution days and completed workouts. Counts are a summary of current records, not permanent earned badges. Existing save-state messages remain explicit.
- [ACSM 2026 guidance](https://acsm.org/effective-resistance-training-program-infographic/): select a sustainable routine matching goals and schedule. Our application for the user's stated 3–4 weekly sessions and muscle-development goal: 3-day full-body or 4-day upper/lower. Offer push/pull/legs, body-part and hybrid alternatives with frequency tradeoffs. Gym or dumbbells/bodyweight at home. Presets are editable starting points, not individualized prescriptions; keep movements stable for comparable logging.
- [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/): detailed choices live within current Money and Movement flows, not new tabs.

## Features and flows

1. Home: compact, collapsible “Your little wins this week” under the Habitat content. Three original hamster illustrations, factual counters, gentle empty copy, save label. Current week uses local Monday and excludes future entries. Edits/deletions recalculate; multiple entries on one day do not farm logging-day counts. No new currency or streak debt.
2. Money → Plan my jars: “Start from recorded spending” presents last month's expense count and total, then explicitly fills the form draft. Review and Save are still required. Existing limits remain until saved. Limits cannot exceed existing schema bounds.
3. A small change: choose an optional lifestyle prompt based on a category with at least two expenses in the last 30 days. Prefill the observed average per entry as a starting estimate, never infer frequency or replacement price. Show evidence count and period. User chooses replacement cost and frequency, then existing scenario calculator/save/experiment flow works unchanged. Do not classify essential spending as waste. Categories: Food & drinks, Transport, Shopping, Fun & dates; all suggestions are optional and category ambiguity is stated.
4. Movement → Browse preset plans: select split and gym/home, see why it fits or its tradeoff, per-session exercises, sets/reps and cues. Explicit Add adds missing preset routines to the library without changing an existing schedule, history, active workout or customized routine. Repeat Add does not duplicate. Existing editor can customize after adding; Weekly plan assigns days. Use stable canonical exercise IDs so comparisons work. Do not auto-rotate randomly or set a heavier load.

## Visual contract

White rounded cards, existing blue actions, sage accents, original soft hamster illustrations from `/companions/` and `/stickers/`. No art regeneration. Keep inline art away from titles. Mobile stack and 44px controls; keyboard-accessible native selects/details/buttons. Detailed presets collapsed per session. Prototype is `index.html`; interactions use sample data only.

## Validation

Pure tests cover date boundaries, incomplete/empty data, income exclusion, distinct-day counts, lifestyle evidence arithmetic, every split/equipment combination, canonical identity, schema bounds, idempotent installation and preservation of existing state. Browser checks cover expanding rewards, empty/recorded states, budget draft/cancel/save, lifestyle prefill/calculation, preset preview/add/repeat, routine start, mobile widths and console errors. Build and full suite must pass. No new database schema or third-party AI API. Recommendations are transparent rules, not claims of AI personalization.

Deferred: automatic plan-period rotation, nutrition estimation, partner rewards, monetary incentives, individualized medical advice. Research informs this design; no real-user study or guaranteed outcome is claimed.
