# Evaluation of the supplied wellness plan

Reviewed: 11 October 2026. Status: evaluation complete; proposed expansion awaits design review.

## Material reviewed

- Source: `C:/Users/KOCK MING TAI/project/Claude_Code/budgeting-and-fitness-tracking/plan/implementation_plan.md`, `persona_and_journey.md`, and `research_results.md`.
- Visual review: all eight desktop prototypes, plus the mobile dashboard, scenario planner, weekly summary, and future-self portrait. Other mobile variants were inventoried but not individually inspected.
- Existing implementation: state schemas, persistence, domain calculations, app shell, Today and Journey, source/test inventory, product and roadmap documents.
- Baseline verification: 31/31 automated tests pass; TypeScript and Vite production build pass. Rollup reports removable annotation warnings in Zod. Browser flows and real-phone behavior were not verified in this review.
- Working directory: `C:/Users/KOCK MING TAI/project/budgeting-and-fitness-tracking`. It has no Git repository. The source plan/design directory is a reference location; proposed work goes in the current workspace.

## Overall judgment

The strongest product idea is a calm companion that helps someone plan money, movement, and time for connection together. Manual tracking, transparent weekly reviews, concrete choices, and a rewarding hamster habitat can deliver that value without predictive modeling.

The supplied document is an ideation roadmap, not an executable implementation specification. It mixes native and web technologies, introduces unsupported quantitative claims, and has no feature-level test gates. Its 16-week schedule is an estimate without capacity, integration feasibility, or asset-production assumptions. Replace that schedule with dependency-ordered increments and acceptance gates.

## Decisions and changes recommended

| Area | Assessment | Proposed treatment |
|---|---|---|
| Existing foundation | Money entries, budgets, savings, routines, schedule, resumable workouts, exercise progress, check-ins, rewards and backups already exist | Reuse these flows and preserve stored records |
| Audience | Current PRODUCT.md describes a personal gift; the new persona describes Alex, a distracted professional | Use the personal companion as the working assumption; ask whether the product audience should change. Never prefill Alex's income, age or relationship details |
| Platform | React Native/Flutter, browser React/Vue, SQLCipher and OS key stores are mixed together | Continue React/TypeScript/Vite web development; evaluate a native adapter only when a validated integration requires one |
| WWUs | The plan does not establish a validated common unit for money, exercise and relationships | Prefer separate domain progress. If points are added, describe them as game points with a documented formula |
| Formula conflict | Plan section 12.7 gives 15/41/68 points over five days; the desktop streak screen gives 20/90 | Neither is authoritative. Define one tested reward rule before implementing this screen |
| Cross-domain coefficients | Fixed multipliers such as emergency-fund months × 0.15 lack supporting calibration | Do not turn these constants into claims about a user's behavior |
| Causal analytics | Lag tests and p-values are proposed as evidence that one behavior causes another | Defer causal claims. Start with descriptive totals; later patterns must show source counts, observation window and missing-data limits |
| Distraction detection | Other-app switching and partner-message detection are assumed | Use user-initiated focus and connection logs. Page visibility describes this page; it does not establish what the user did elsewhere |
| Predictive AI | No reference dataset, ground truth, calibration or held-out evaluation is specified | Defer until a specific prediction has demonstrated value and an evaluation contract |
| Fitness consistency | Daily exercise thresholds can conflict with a three-workout weekly goal and recovery | Measure chosen weekly plans; show planned rest distinctly |
| Financial consistency | Daily saving thresholds disadvantage irregular income and confuse no entry with failure | Use chosen weekly/monthly intentions. Missing records remain unknown |
| Relationship quality | Minutes and message frequency are treated as satisfaction proxies | Track voluntarily recorded connection time; never score the partner or infer relationship health |
| Future self | Prototype links compliance to a house, fitness, savings and relationship success | Keep editable arithmetic scenarios and neutral illustrations. Do not predict appearance, VO2 max, relationship satisfaction, or home ownership |
| Privacy | Encryption, end-to-end sync and legal readiness are asserted without implementation evidence | State actual local-storage behavior. Specify consent, export and deletion for each added domain; make no blanket compliance claim |
| Retention | Seven-day raw-data deletion conflicts with longitudinal insights and existing workout/transaction history | Preserve user records unless explicitly deleted. Keep derived summaries recomputable |
| Gamification | Wilting habitat and unhappy characters could punish missed days | Permanent earned unlocks, optional celebrations, and supportive restart copy |
| Accessibility | Accessibility appears late in the source schedule | Include keyboard, reduced motion, readable metrics and mobile layout tests in each UI phase |

## Prototype design evaluation

Retain the light surfaces, navy typography, pastel domain colors, generous cards, rounded controls and hamster habitat. Keep the current approved Mochi/Chonk identity as the default; prototype hamster colors are a visual-direction discrepancy, not an instruction to replace character assets.

The desktop sidebar offers too many destinations for the first increment. Preserve direct access to Today, Money, Movement, Journey and Settings; group weekly review, habitat and future scenarios under useful parent flows. Community, partner messaging and notification controls should appear only when their behavior exists.

The mobile dashboard compresses three text-heavy cards into one row. Stack detailed cards at narrow widths and use compact summaries only where they fit. Place the next useful action before a large illustration. Preserve the desktop cards at wider widths without scaling the whole screenshot down.

The intervention drawer is a useful choice pattern, but its message detection and automatic follow-up promise are unimplemented. Initially open it from an explicit 'I need a reset' action, make dismissal equivalent to other choices, and avoid recommendations with invented outcome probabilities.

The identity prototype shows 65% and 68/100 simultaneously. Use one denominator and show the actual completed intentions. Identity language should be user-selected and editable, not a psychological diagnosis.

The habitat is a strong optional reward view. Add keyboard-accessible zone links and visible zoom/reset buttons; drag and pinch cannot be the sole interaction paths. Sound defaults off; honor reduced motion.

Weekly review is the best first new screen. Its production metrics should be records such as logged spending, savings contributions, completed workouts and optional connection minutes. Claims such as 'stress cycles interrupted' need explicit event/outcome logs before being counted. Percentage arrows need comparable periods and a nonzero baseline.

The scenario planner mixes weekly savings and monthly fund needs. Display matching periods and editable assumptions. A saved scenario is a plan, not a transaction or a completed activity. Never fabricate a quote from a partner.

## Feature proposals, ordered by usefulness

| Feature | Why add it | Earliest phase |
|---|---|---|
| Weekly review with coverage labels | Gives immediate value from existing records and distinguishes no record from zero | 2 |
| Optional connection diary | Provides a trustworthy third domain without passive surveillance | 3 |
| 'Smallest next step' chooser | Helps a user resume an intention after interruption | 3 |
| One weekly experiment | Turns a scenario into a chosen, reviewable intention | 4 |
| Money/time scenario comparison | Makes trade-offs concrete using user-entered assumptions | 4 |
| Flexible consistency calendar | Recognizes planned rest and allows irregular schedules | 5 |
| Evidence drawer | Explains every derived metric and later pattern | 2 onward |
| Repeat-entry templates and reviewed recurring proposals | Reduces logging effort without silently inventing transactions | After phase 4, if walkthroughs show need |
| Backup reminders and conflict detection | Protects records as the app becomes a daily tool | 1 and 6 |

## Architecture options

1. **Extend the current web app — recommended.** Reuses tested domain logic and assets; quickest route to phone and desktop evaluation. External device data remains a future adapter concern.
2. **Rebuild as a native app.** Appropriate if native health/usage integrations become essential; adds packaging, permissions, platform testing and migration work before delivering new user value.
3. **Build cloud analytics and sync first.** Enables multiple devices but requires identity, access control, conflict handling and operational support. There is no demonstrated need yet.

## Verified technical references

The [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) exposes the document's visibility state. Inferring other-app identity or partner-message content from it is outside that interface.

[Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) is synchronous. [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) is an asynchronous alternative for larger structured datasets. A storage migration must be driven by measured needs and verified recovery, not a stack rewrite alone.

The supplied research is useful competitive inspiration but includes 2024–2025 pricing and broad review-source names. Those prices were not revalidated here, and the document does not substantiate the proposed behavioral coefficients. Do not use it as empirical validation of wellness scoring.

## Review handoff

Read `WELLNESS_DESIGN_SPEC.md` for the proposed behavior and `DEVELOPMENT_PHASES.md` for delivery/test gates. Product implementation has not started in this review. Scope and design review precede schema and UI changes.
