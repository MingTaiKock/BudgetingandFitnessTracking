# Budgeting, fitness, and companion-app research

Research date: 6 October 2026. Audience: one couple, with Mochi as the girlfriend's hamster companion and Chonk as her boyfriend's cat coach. Currency: SGD. Platform confirmed: mobile-friendly web app.

## Scope and method

This is a broad representative survey, not a claim to enumerate every app in either market. It covers 12 money products, 10 fitness/health products, and 2 gamified habit products. Official product pages and help articles were checked on the research date. Feature claims below describe the vendors' published offerings; we did not subscribe to or independently benchmark these products. Prices, bank coverage, and country availability vary and are intentionally not treated as verified purchase recommendations. Singapore bank connectivity is not assumed.

## Budgeting landscape

| Product and official source | Published focus | Design inference for this app |
| --- | --- | --- |
| [YNAB](https://www.ynab.com/) | Intentional allocation of money before spending; flexible planning | Show a clear plan for each category, with a friendly monthly review |
| [Monarch](https://www.monarch.com/) | Account aggregation, budgets, goals, and partner collaboration | Make the overview understandable; future partner access must be opt-in |
| [Copilot Money](https://www.copilot.money/) | Organized spending, budgets, and personal finance tracking | Prioritize a quick transaction review and readable charts |
| [Quicken Simplifi](https://www.quicken.com/products/simplifi/) | Spending plans and financial tracking | Distinguish planned spending from actual spending |
| [Goodbudget](https://goodbudget.com/how-it-works/) | Envelope budgeting and household coordination | Represent categories as approachable spending jars |
| [EveryDollar](https://www.ramseysolutions.com/money/everydollar/features) | Giving income a purpose through monthly budgeting | Let people set their limits explicitly, without prescribing a budgeting ideology |
| [PocketGuard](https://pocketguard.com/) | Budget methods, spending tracking, and a leftover view | Name our number “left in budget”; do not imply it is a bank balance or safe-to-spend estimate |
| [Rocket Money](https://www.rocketmoney.com/) | Subscription tracking, spending categories, and budgets | Recurring bill awareness is useful later; no bank-linked cancellation in MVP |
| [Honeydue](https://www.honeydue.com/) | Couples' finances with control over what is shared | Supportive couple identity should not automatically expose her finances |
| [Spendee](https://help.spendee.com/article/224-shared-wallets) | Shared wallets; [budgets retain personal settings](https://help.spendee.com/article/215-is-it-possible-to-share-budgets) | A shared identity and shared data are separate product decisions |
| [Wallet by BudgetBakers](https://budgetbakers.com/en/products/wallet/features/) | Financial management and multiple budget types | Keep categories configurable and records exportable |
| [Money Lover](https://moneylover.me/) | Fast category-based expense/income recording and budgets | Use short manual-entry forms suitable for everyday purchases |

## Fitness and health landscape

| Product and official source | Published focus | Design inference for this app |
| --- | --- | --- |
| [Hevy](https://www.hevyapp.com/) | Workout logs, routines, sets, charts, personal records, community | Save real workout details and make personal improvement visible |
| [Strong](https://www.strong.app/) | A simple workout notebook | Keep logging faster than the workout itself |
| [Fitbod](https://fitbod.me/) | Personalized workout planning | A future coach needs experience, equipment, and recovery context; MVP uses general encouragement |
| [JEFIT](https://www.jefit.com/) | Workout planning and progress tracking | Reusable routines and exercise history are sensible later additions |
| [Strava](https://support.strava.com/en-us/articles/15401848-goals-on-the-strava-website) | Activity goals and progress; [strength detail via supported apps](https://support.strava.com/en-us/articles/15401547-strength-training) | Use weekly movement progress; GPS and social feeds add complexity unnecessary for the first release |
| [Nike Run Club](https://www.nike.com/nrc-app) | Running tracking and guided running experiences | Coach tone can provide companionship without a full AI system |
| [MyFitnessPal](https://support.myfitnesspal.com/hc/en-us/articles/39985611667341-Your-Today-tab) | Food diary, water, exercise, and weight logging | A daily home makes logging discoverable; calorie counting is not necessary for this brief |
| [Cronometer](https://cronometer.com/) | Detailed nutrition tracking | Nutrition is a separate deep domain; defer nutrient databases and barcode scanning |
| [Garmin Connect](https://connect.garmin.com/) | Activity and health data in a connected ecosystem | Device sync requires integrations; manual logging makes the first app usable on any phone |
| [Apple Health](https://www.apple.com/health/) | Health information, trends, and sharing controls | Consent and trend clarity matter; browser MVP cannot directly read HealthKit |

## Companion mechanics

- [Finch's approach](https://help.finchcare.com/hc/en-us/articles/37935669335309-Our-Approach-to-Self-Care) and [product overview](https://finchcare.com/about-finch): small self-care actions paired with a pet. Inference: emotional attachment can make mundane entries feel more inviting; this needs testing with the intended user.
- [Habitica](https://habitica.com/static/front?iframe=yes): habits, daily goals, tasks, and game rewards. Inference: use a small reward loop, but avoid a complicated RPG or penalties for missing days.

## Synthesis and recommendation

The useful intersection is **fast logging + visible progress + an affectionate companion**. Broad finance dashboards can overwhelm a beginner; specialist fitness tools can demand too much structure. This is an inference from the feature comparison, not a claim about measured user satisfaction.

Recommended: a responsive, locally stored web app with category budgets, income/expense history, savings goals, workout notes and optional strength sets, daily water/mood/rest check-ins, monthly/weekly summaries, and a hamster room that grows through consistency. Chonk is a gentle accountability coach. Rewards are earned from recording and reflection, never from spending more, eating less, or losing weight.

Alternative 1: a spreadsheet plus Finch/Hevy. Faster to adopt but does not create the personalized couple experience.
Alternative 2: native app plus cloud backend and health/bank integrations. Better device capabilities and cross-device continuity, but increases setup, cost, consent flows, and development scope before validating whether she enjoys the daily loop.

## Product decisions mapped to evidence

| Decision | Supporting pattern | MVP consequence |
| --- | --- | --- |
| Manual transactions first | Money Lover, Goodbudget | Any currency-supported purchase can be logged without assuming bank coverage |
| Budget remaining is not account balance | PocketGuard, Simplifi | Separate income, expenses, and category limits; honest labels |
| Workout logs before adaptive programs | Strong, Hevy | Duration, activity, notes, optional sets/reps/load |
| Progress over punishment | Finch, Habitica | Earn seeds; no pet sickness or negative points |
| User controls her records | Honeydue, Apple Health | Local storage, export/import, explicit reset; no partner account in MVP |

## Validation with her

Try a week of real use: can she record a purchase or workout comfortably on her phone, understand the budget calculation, find previous logs, restore a backup, and feel encouraged by Chonk? Collect feedback before adding cloud sync, reminders, detailed nutrition, or wearables. No retention or health-improvement claims are established by this desk research.
