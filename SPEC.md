# Little Wins — Mochi & Chonk

Status: first-version product specification. 6 October 2026.

## Purpose

A personal, cute, fun app for the girlfriend to track budgeting, fitness, and improvement. Mochi is the small gray hamster representing her. Chonk is the larger brown hamster representing her boyfriend and serving as a supportive discipline coach. Confirmed: mobile-friendly web app, names Mochi/Chonk, SGD. Working product name: Little Wins.

Success means she can log daily activity easily, see accurate progress over time, and enjoy returning. Character appearance is original vector artwork, not a portrait of either person.

## First release

1. **Today**: an illustrated hamster garden, current seed count, three daily habit controls (water, mood, rest), a short context-aware message from Chonk, budget/workout summaries, and quick logging actions.
2. **Budget**: month selector; recorded income, expenses, and net cash flow; six category jars with editable monthly limits; dated income/expense entry; editable/deletable history; savings goals with manually recorded contributions.
3. **Fitness**: weekly workout target; weekly count and minutes; activity history; dated workout entry/edit/delete with activity, duration, notes, and optional exercise/sets/reps/load. A preplanned routine library includes editable exercises, sets, rep ranges, and cue notes. Guided sessions show small versions of Mochi and Chonk from the chosen video beside the active exercise, target range, actual reps, load, and completed sets. Sessions can end early and log only completed sets. Rest check-in is valid care and is never treated as a failed workout.
4. **Journey**: recent 8-week movement chart, monthly spending trend, consistency count, personal strength records when supplied, earned milestone badges, and optional cosmetic purchases with seeds.
5. **Settings**: nickname/currency/weekly workout target/water target; backup download and validated restore; explicit fresh start; demo garden loading only after confirmation when replacing records.

First visit opens a clearly labelled demo garden to show the experience. A prominent “Start my journey” control offers an explicit fresh start. Demo data is never silently presented as her history.

## Calculation contract

- Store amounts as integer cents. A positive amount has a separate income/expense type. Reject zero, negative, non-finite, more than two decimals, or values above 1,000,000 currency units per record.
- Category limits are indexed by calendar month and category. Six categories: Food & drinks, Transport, Shopping, Fun & dates, Health, Other. No automatic rollover.
- Category remaining = limit minus that month's recorded category expenses. Monthly remaining = sum of limits minus total expenses. Negative remaining is shown as over budget; progress visuals clamp to their drawing range without concealing the true number.
- Net cash flow = recorded income minus recorded expenses, not total account balance. “Left in budget” does not account for unrecorded bills or bank funds.
- Savings goals are a separate manual ledger of money set aside. Contributions do not create income/expenses or prove that money moved between bank accounts. Label that distinction in the interface.
- ISO calendar dates are local dates. Weeks start Monday. Store date-only strings without UTC conversion. Disallow future log dates; budget planning can use future months.
- Week comparisons include zero-activity weeks. Show eight weeks of actual movement minutes, and six calendar months of recorded expenses. Fitness improvement uses minutes, completed sessions, and optional best recorded exercise load; no weight-loss or calorie-burn assumptions.

## Rewards and tone

- Seeds: 5 for each day with at least one transaction, 10 for each day with at least one workout, 5 for each daily water target reached, 5 for a mood check-in, 5 for a rest check-in. Maximum 30 per day. Derive earned seeds from underlying records so duplicate logging cannot farm them.
- Cosmetics: a bow (30), a plant (60), a picnic rug (100). Purchase once; seeds cannot go negative at purchase. Deleting historical logs may lower available seeds to zero, but owned items stay owned. Seed count is game currency, separate from actual money.
- Each habit is reversible. Repeating/toggling an action never adds duplicate rewards. Daily water can be increased/decreased by one glass. Water target is a user preference, not a medical prescription.
- Chonk never insults, threatens, moralizes food, or criticizes body shape. Firm encouragement: “One tiny step. Log it, then let's celebrate.” Rest is respected. Messages are deterministic, not a live AI coach or messages written by the boyfriend.
- Badges are derived from current records: first transaction, first workout, five active days, ten workouts, first savings contribution. Editing/deleting data updates earned status.

## Design contract

Lavender notebook meets a playful hamster garden. Palette: ink #343047, lavender #7461ba, lilac #eee8fa, pink #f7d7e2, sunflower #f1ba57, leaf #7aa487, paper #faf9fd. Rounded expressive illustration, quieter controls, readable data, and generous whitespace. Headings use Georgia for a storybook feel; body uses a system sans-serif stack for offline reliability. Desktop uses a left navigation rail and an asymmetric main panel; phones use bottom navigation and single-column forms. Selected navigation, visible keyboard focus, labelled fields, modal focus containment, Escape dismissal, reduced motion, and text labels accompanying status colors are required.

## Architecture and data

React + TypeScript + Vite; lucide-react icons; Zod for validation. No backend, API keys, analytics, or remote fonts. Separate schema, domain calculations, demo data, storage, illustrations, reusable UI, and feature views. Versioned localStorage document contains profile, monthly budgets, transactions, workouts, goals/contributions, daily check-ins, owned cosmetics, and demo flag. All mutation paths validate before saving; failed storage displays a persistent warning and allows memory-only work/export. Corrupt stored content is retained until the user explicitly replaces it; display a recovery notice.

Backups contain a version and the complete validated data. Maximum import size 2 MB. Reject unknown/invalid versions, impossible dates, future log dates, unsafe amounts, duplicate IDs, unknown category/item references, and invalid nested structures. A restore replaces the local journey only after confirmation. Render user text through React, never HTML injection.

Local storage is device/browser/origin-specific and is not encrypted application storage. Clearing browser data loses records without a backup. It is not multi-user access control. The interface and README must state these practical limits.

## Out of scope and next releases

No bank sync, receipt OCR, nutrition database, GPS, HealthKit/Health Connect, AI exercise prescription, cloud sync, notifications, paid subscriptions, or real partner accounts in first release. Follow-on order: validate daily loop; add authentication and opt-in partner sharing; add encrypted server backups and migrations; then evaluate PWA offline support, reminders, and integrations individually. No deployment occurs in this initial local build.

## Acceptance checks

- A fresh journey starts with zero history/rewards and editable default limits.
- Adding/editing/deleting a transaction changes only its relevant month/category and survives reload.
- Savings contributions update goal progress without double-counting income or expenses.
- A workout appears in history, weekly totals, and journey charts; editing/deleting reverses effects.
- A planned routine is editable and has ordered exercises, set counts, minimum/maximum reps, and optional cues. Guided sessions show both pixel companions next to the exercise and log actual completed sets only, including partial sessions.
- Repeated habits and multiple same-day logs obey daily reward caps.
- Buying a cosmetic spends seeds once and changes the garden.
- Backup round-trip preserves records; malformed backup does not replace data.
- Storage failure and corrupt data are visible, with export/recovery available.
- Production build/typecheck and domain tests pass; desktop/phone browser checks cover key flows and keyboard modal behavior.
