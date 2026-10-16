# Small Wins: a lighter, Habitat-first experience

Status: design proposal and prototype evaluation, 15 October 2026. No product implementation in this phase.

**User correction — binding visual constraint:** Simplify the existing interface without a drastic visual redesign. Reuse the earlier approved prototypes, original hamster assets and current design components exactly. The newly generated sage/ivory three-screen boards are rejected as visual direction: they introduced different hamsters and a different Habitat illustration. They are not approved references. Do not generate a replacement character family or another visual world. The separately requested sprout-hamster logo is not a replacement for Mochi/Chonk or existing scene artwork.

User confirmed first-release focus: Habitat/Home, Money, Movement, Insights. Food tracking and partner comments follow later. Google login and durable private storage remain core reliability requirements; the previous cloud implementation plan is retained but must be reconciled with the new navigation and UI before execution.

## What success means

A person opening the app can start/resume a workout, log spending, or inspect progress without learning wellness terminology. Hamsters make the home welcoming and celebrate effort without covering information. Every record has a clear saved state and remains recoverable. Screen count is reduced without deleting existing records or hiding core tasks behind a map.

## Audit: evidence versus hypotheses

- App.tsx defines 12 main destinations. Insights renders WeeklyReview plus ExerciseProgress, while Weekly review separately renders WeeklyReview. This is confirmed duplication. Earlier commentary incorrectly said 14; 12 is the verified count.
- Live Habitat uses the existing illustrated garden. The hint and controls are absolute overlays; connection is also near the bottom. This creates collision risk at narrow sizes. The user's exact overlap is reported; this audit did not reproduce every device width.
- WorkoutSession renders a two-hamster cheer panel beside the controls; competing legacy/mobile CSS is present. Remove that panel from the active task rather than patching its position. Exact reported occlusion remains a user-reported defect, not a claimed browser reproduction.
- model.ts allows 1–10 exercises and up to 30 total sets. A read-only six-exercise fixture successfully selected index 5. There is no five-exercise ceiling in this code.
- startSession clones the routine; editing a routine cannot change an already-started session. App resumes the old active session. This is a plausible explanation for a sixth exercise appearing in the routine but not the current workout; confirm against the reported steps before claiming root cause.
- exerciseHistory requires both exerciseId and equipment. RoutineEditor.update clears exerciseId when editing name OR equipment. Custom and older manual entries lack this metadata and are omitted from comparable history. This is a confirmed failure mechanism; it does not prove which mechanism affected the user's records.
- The weekly evidence list concatenates transactions, workouts, contributions and connection records without visible category headings. It is not a unified date-sorted feed.
- Savings contributions are goal notes, separate from income and spending. The accounting distinction exists but the user cannot discover it easily.
- Future Self starts with zero-valued manual assumptions and separate Plan A/Plan B labels. Plan Together asks for abstract avoided/replacement costs and time inputs. Both make the user construct a model before seeing a useful example.
- Current production remains browser-local. Supabase project and Google provider exist, but login/cloud persistence have not been implemented or verified in the application.
- PRODUCT.md has stale deployment statements (it says no deployed service); record this drift here, do not silently rewrite product truth during a planning-only audit.

## Organized feedback and acceptance criteria

| ID | Request | Priority | Proposed change and proof |
|---|---|---|---|
| M1 | Hamsters cover workout words | Core defect | Remove two-character panel from active workout; no artwork overlaps text/input at 320/390/768/1440 widths or 200% zoom. |
| M2 | Sixth exercise cannot be performed | Core defect investigation | Verify new/resumed/edited 6- and 10-exercise routines. All exercises selectable; explain frozen active routine and offer a deliberate updated-session choice without losing completed sets. |
| M3 | Previous weights missing | Core defect | Stable identity for library and custom exercises, separate display name from identity, explicit history linking for old records; show last matching logged sets beside current inputs. |
| H1 | Habitat hint blocks image/Connection | Core defect | Instructions below map, controls outside art, fixed reserved space for each hotspot and readable equivalent destination links. |
| H2 | Habitat first, fewer navigation items | Core structure | Home opens Habitat; four primary destinations; profile opens Settings. Map is optional navigation, not the only route. |
| I1 | Mixed evidence records | Core clarity | Money/Movement filters, newest-first date groups, dated category labels, empty states and counts. |
| I2 | Weekly review duplicates Insights | Core simplification | One Insights destination with date range and domain sections. Redirect legacy review links. |
| S1 | Unclear how to save | Core clarity | Separate recorded surplus from savings-goal contributions; visible Add to goal action and explanatory example. |
| P1 | Plan A/B confusing | Core simplification | Fold into Money → Save more; Current habit versus Small change, seeded from selected logged spending and editable estimates. |
| P2 | What-if/avoided/replacement logging confusing | Core simplification | One guided comparison, plain language, no auto-created financial records. |
| D1 | Data lost on browser clearing | Core reliability | Complete private login/cloud saving with explicit local import and cross-device verification. Only confirmed online saves survive local clearing. |
| O1 | Hamster cheers/kisses | Later polish | Brief opt-in celebration after workout completion, no blocking overlay, respect reduced motion; not after every tap. |
| O2 | Shared progress/comments | Later separate feature | Different-account sharing requires invitations, selected shared data, revocation and comment permissions; never treat same-account sync as partner sharing. |
| O3 | Food/calories log | Later separate feature | Manual food name, meal/date and optional calories under Movement/Wellbeing; no new top-level destination. No automated calorie accuracy claim. |

## Navigation and feature disposition

Four top-level destinations on desktop and mobile: **Home · Money · Movement · Insights**. Settings is behind the profile button, reachable in one action. An ongoing workout has a persistent Resume action and becomes a dedicated focus screen with Save & close.

| Current surface | New home |
|---|---|
| Dashboard + Habitat | Home / Habitat with one useful next action |
| My budget | Money: overview, entries, goals |
| My fitness | Movement: routines, history; schedule inside routines |
| Insights + Weekly review | Insights: one date range, Money/Movement tabs |
| Future self + Plan together | Money → Save more: one comparison flow |
| Journey + Streak power | Small optional progress section inside Insights; no separate destinations |
| Connection + check-ins | Home → Your corner; preserve existing optional diary and entries |
| Settings | Profile → Settings: account, saving, preferences, backup |

No deletion of records when a page is folded away. Old deep links and navigation actions map to their new parent and section. No automatic partner sharing. Remove redundant hero panels, duplicated statistics and routine art banners from task pages. Reserve rich habitat imagery for Home; small mascot mark elsewhere, no endless idle animation.

## Core flows

### 1. Open and choose

Home keeps the original Habitat illustration and its three labeled zones: Money, Movement, Connection corner. The instruction and this week's Insights link sit beneath the map. Connection remains optional without an extra primary navigation destination. A single current-action row shows Resume workout if a draft exists; otherwise today's selected routine or a neutral Choose a routine. An empty personal account gets setup guidance, never synthetic progress. The design prototype uses explicitly labeled sample data.

All four destinations remain ordinary labeled navigation controls. Artwork failure must not block navigation. Desktop preserves the original sidebar styling with only four primary destinations and Settings below. Mobile keeps a four-item bottom bar with safe-area padding. Active workout hides bottom navigation to protect focus but always offers Save & close. Cloud save status is an implementation requirement, not a working feature of the prototype.

### 2. Complete exercise six

Movement shows Routines and History, not several overlapping dashboards. A routine exposes all exercises in a numbered list. Each row can open exercise details; starting a session uses a clearly identified routine snapshot. During a session: Exercise 6 of 6, an All exercises selector, last session date/sets/load, current reps and kg, Complete set, rest timer, Previous/Next. No mid-page mascot panel.

When a routine has changed since the active session started, show “This workout uses your earlier routine.” Offer Continue saved workout and Review updated routine. Updating an active session is not a silent index remap: preserve original completed sets, match stable exercise IDs, preview added/removed items, and retain removed completed exercises in the workout record. If safe reconciliation is not yet implemented, finish/save the old partial workout then start the updated routine; never discard it automatically.

History is a real action: View history opens dated records for that exercise and equipment. Renaming a display label keeps identity. Changing equipment creates a distinct comparable series with a clear reason. Custom exercise creation assigns a stable custom ID. Older unlinked rows can be linked after a preview and explicit confirmation; never fuzzy-merge by name. Explain no history versus no matching equipment versus outside date range.

### 3. Understand and record money

Income and spending calculate **Left from recorded income**, or **Recorded deficit** for a negative result. “Budget remaining” remains separately labeled and is never a bank balance. “Added to goals” means money the user says they set aside; it is not another expense.

Example: income S$3,000 minus spending S$2,200 gives a recorded surplus of S$800. If S$500 was deliberately set aside for a trip, record S$500 against that goal. Do not subtract it from spending again. Do not assume the remaining S$300 is truly available: unrecorded bills and balances are unknown. Existing savings from previous months can be contributed without fabricating current income.

Goal flow: Money → goal → Add to goal → amount/date → “Record money you have already set aside. This does not move money.” → save. Keep income, expense, contribution, budget and projection distinct in the data model and copy. Expose edit/undo with original-record preservation where appropriate; no investment advice or automatic bank transfer.

### 4. Find last week's evidence

One Insights page, week selector, Money/Movement tabs, and category filters inside Money. Sort descending by date with deterministic ID tie-breaks where time-of-day is absent; never invent ordering within a day. Money contains income/expense/savings clearly labeled; Movement contains workouts/rest with previous weights reached from exercise detail. “All” is optional and still grouped by date with category labels, not appended arrays. Weekly summary and its evidence share the same selected date range. Empty/partially logged periods say so.

### 5. Try a small saving change

Money → Save more → choose a spending category or habit from recorded entries → review the evidence window → edit “What I usually spend”, “What I'd spend instead”, and “Times per week” → see estimate → Save idea or Try this week.

Example uses illustrative data: a S$6 drink replaced with a S$2 drink twice weekly yields (6−2)×2 = S$8/week, approximately S$34.67/month using 52÷12. Explain this is potential, not recorded savings. No auto-posted income, negative expense, contribution, or budget change. Advanced projection is collapsed: Starting savings + chosen monthly contribution × months, labeled estimate with no returns assumption.

Suggestions are explainable rules on recorded data, not an opaque automatic adviser. “You logged 6 cafe purchases in the selected period” links to the records. Ask the person to choose a frequency; don't extrapolate incomplete data as complete spending. Exclude essential categories from unsolicited cutback suggestions and allow dismissing ideas. User may still build a custom comparison. Claims of actually saved money require the user's own recorded contribution; an avoided purchase alone proves no transfer.

## Reliability and privacy

The same Google account on phone and computer sees its own journey after cloud integration. Another person's Google account does not share those records by default. Cloud saving precedes announcing cross-device support. Existing browser records are imported deliberately, backed up, and never replaced automatically by demo or another account.

Current app: clearing browser storage can erase its only copy; export first. Proposed app: after Saved online is confirmed, clearing local browser data should be safe for those synced records; sign in again to retrieve them. Pending offline edits can still be lost if browser data is cleared. Test this rather than relying on UI copy. The free service can pause; preserve export/recovery paths.

Account Settings shows Google identity, Saved online / Saving / Offline with changes / Save failed / Conflict. Sign-out with pending work offers backup and cancel/discard choices. A conflict protects both device versions; do not silently merge entire journey JSON. Settings removes redundant hero art, puts account and data above cosmetic preferences.

## Design and performance constraints

- Preserve the palette, typography, buttons, cards, rounded shapes and illustrations from the earlier approved prototypes and current components. Simplify composition and information architecture only; do not replace the visual system with the generated boards' ivory/sage treatment.
- Reuse `src/PrototypeArt.tsx` for approved scene crops, `src/SupportingArt.tsx` for approved Budget/Fitness/Settings characters, and the existing artwork registry in `src/hamsterArtwork.ts`. Habitat must use the existing `public/prototype/habitat-clean.png`. Never redraw these as merely similar-looking characters.
- Use one product name: Small Wins. Treat legacy Wellness/Little Wins labels as copy migration, not data-key migration.
- Body copy at least 16px, form labels at least 14px, touch targets at least 44px; verify actual contrast and keyboard use in the eventual implementation.
- Artwork and labels occupy separate layout regions. Reserve image dimensions; no absolutely positioned decorative characters in forms.
- No required map zoom/pan. Map works with taps, keyboard and equivalent text navigation. Avoid a scrolling image taller than the initial screen.
- Use appropriately sized WebP/AVIF derivatives where supported, lazy-load non-home art and feature routes, avoid loading all pose sheets on Home. Measure byte sizes and network use before setting final performance budgets; no unsupported performance claims.
- Proposal targets: at most four primary destinations, one dominant action per view, no more than two actions from Home to spending-entry form or routine start (excluding sign-in/setup).
- Honor reduced motion. Celebration is brief, dismissible and never hides the next action. No punishment for missed days.

## Prototype deliverables

The initial two generated boards (Home / Movement / Workout and Money / Insights / Save more) are rejected visual explorations, not deliverables for implementation. They are archived as rejected drafts. Their structure can inform the feedback analysis, but no styling or new artwork is approved. The next prototype must be a controlled rearrangement of existing components and exact original artwork, preferably an isolated static component composition so image generation cannot alter hamster identity. Do not modify production source to produce it. Show a before/after comparison of existing and simplified layout; keep all new controls in the current design language. Static prototypes demonstrate layout and copy, not functional persistence, focus order or tappability.

### Existing visual source map

| Surface | Authoritative source |
|---|---|
| Home / Habitat | `public/prototype/habitat-clean.png`, current Habitat frame, existing zone controls |
| Shared dashboard imagery | `public/prototype/dashboard.png`, `src/PrototypeArt.tsx` crop registry |
| Money | `public/prototype/budget-supporting.png`, `src/SupportingArt.tsx`, existing Budget controls |
| Movement | `public/prototype/fitness-supporting.png`, existing Routine/Workout components |
| Settings | `public/prototype/settings-supporting.png`, existing Settings components |
| Individual hamster poses | `assets/characters/`, selected through the existing artwork registry |

### Evaluation of the rejected boards

The intended task hierarchy improved: four destinations, all six exercises visible, prior load beside inputs, separate savings contribution and potential-saving copy, and dated domain-filtered evidence. A visual pass corrected an inaccurate exercise dot count and a misleading goal progress bar. However, these strengths do not outweigh a failed brand-continuity requirement: the habitat and characters were newly invented and the component styling drifted. Overall verdict: reject as visual reference; retain only the explicitly accepted information architecture. No claim of actual user testing or production readiness.

## Evaluation method and acceptance gates

First pass is a designer cognitive walkthrough, not a user-test claim. Review each image once against the tasks below, record defects and corrections, then invite the actual user to point at controls. Do not assign fabricated usability scores or claim measured speed improvements.

| Task | What must be visible | Failure condition |
|---|---|---|
| Find Money from Home | Labeled map zone and bottom Money tab | Image obscures label or map is only route |
| Reach sixth exercise | 6-row routine, Exercise 6 of 6, All exercises | Five-row truncation or hidden navigation |
| Find previous load | Last time date, kg/reps and history link | Blank unexplained history or planned load mislabeled actual |
| Record a goal contribution | Add to goal and amount/date explanation | Contribution counts as an expense |
| Inspect Money on a date | Domain tabs and newest-first dated records | Mixed unlabeled list |
| Compare a cheaper habit | Current/new cost, frequency, explicit estimate | Potential saving posted as actual |
| Recover across devices | Account and honest save state | Offline work shown as online saved |

Actual user walkthrough after prototype review: “Where would you tap to start exercise six?”, “What does Last time mean?”, “How would you record S$50 set aside?”, “Show only spending from last week”, “Does this estimate mean money has already been saved?” Record hesitation and misunderstanding; revise before implementation. No need for the user to understand OAuth, stable IDs or database revisions.

## Planned implementation sequence (after design approval)

1. Protect data: backup migration fixtures; add regression tests for 6/10 exercises, active snapshot editing, identity loss, and weekly sorting. Confirm exact sixth-exercise reproduction with a sanitized fixture or observed steps, not private exported data by default.
2. Establish approved four-destination shell and Habitat home; adapt old routes without deleting content; remove obstructive exercise art and Habitat overlays.
3. Fix movement identity/history and explicit active-routine behavior; test preserved drafts and partial workouts.
4. Consolidate Insights and clarify Money/savings. Replace separate planning pages with the guided comparison, retaining old scenario records through a compatibility adapter.
5. Integrate the approved private cloud persistence architecture into the new account/settings/import flow. Reconcile `PRIVATE_CLOUD_IMPLEMENTATION_PLAN.md` before coding; preserve its owner isolation, conflict and recovery requirements.
6. Verify real-user tasks, keyboard/mobile layouts, cross-device recovery, account isolation, production build and release diff. Deployment requires the still-outstanding explicit publication authorization.
7. Only after the core is understandable and reliable: food journal, partner invitations/comments, and optional hamster celebration polish as separate scoped designs.

This proposal replaces the previous account-only UI plan as the immediate design priority. It does not cancel durable private storage or authorize implementation, deletion, or deployment.
