# Budget, Fitness and Settings — design consistency plan
Date: 12 October 2026.
Status: user approved the plan and mockups on 12 October 2026. Implementation and verification completed on 13 October 2026; see BUDGET_FITNESS_SETTINGS_DELIVERY.md.

## Purpose and evidence
Make these three everyday task screens feel consistent with Dashboard, Journey and Habitat. Preserve records, calculations and task behavior.
Desktop (1440px) and phone (390px) screenshots are in output/playwright/design-audit-*.png. The shared shell is coherent, but these screens use flatter outlined pose artwork. Settings visibly shows fragments from neighboring atlas poses. Numeric typography and illustration scale also differ from the newer screens. Fitness has both recorded activity and a repeating plan; their meanings must remain distinct.
The actual dashboard is the visual authority. PixelPal currently wraps HamsterArt; its name does not itself prove pixel artwork is rendered.

## Confirmed artwork direction
Use the existing fluffy, softly shaded pair: Mochi remains the smaller cream/gray-white hamster; Chonk remains the larger golden-brown coach. Preserve their faces, colors and relative size. Do not assign a different character merely because a mockup places it on the left.
Keep the existing pale background, navy sans-serif headings, blue actions, sage/lavender accents and sidebar. Use sans-serif tabular numbers.
Budget gets planning and savings poses; Fitness gets gentle movement and routine poses; Settings gets quiet portraits and a small pair vignette. No giant habitat scene in Settings. Alternative flat-art unification was declined by the user's direction.

## Artwork rules
- Clean isolated regions, full ears/faces/paws, no neighboring sprite fragments or baked-in UI text.
- Desktop Budget/Fitness banners about 120–160px; Settings uses modest portraits. Routine thumbnails 48–72px; phone banners about 100–120px.
- Reuse approved fluffy regions where they fit the task; generate missing isolated poses from the dashboard reference and inspect them before use.
- All UI controls and values remain live HTML. Mockup screenshots are composition references, not application backgrounds.
- Hide decorative art from assistive technology, reserve image space, lazy-load assets, provide text-first fallback and respect reduced motion.
- Art never covers actions or numbers, and never expresses punishment for rest, gaps or overspending.

## My Budget
Hierarchy: title/month and Money entry → shallow planning banner → four exact summaries → category jars/savings → money diary.
Preserve six categories, filters, editing/deletion, goals, contributions and history. Use exact cents and currency. Budget remainder is limits minus expenses; net cash flow is income minus expenses, not bank balance. Savings is a manual record, not a transfer.
Desktop: category/diary workspace left, savings right. Phone: two-by-two summary grid and stacked sections.
States: unplanned month, empty entries/goals, overspending, previous month, invalid input, blocked saving and long labels.

## My Fitness
Hierarchy: title/week and Log workout → shallow movement banner → recorded counts/day strip → Start or Resume → repeating weekly plan → diary.
Keep completed movement, planned movement, rest and missing data distinct. Preserve partial sessions, drafts, actual reps/load, history and recaps.
Desktop: routines left, schedule/diary right. Phone: active Resume first, then summary and routines; a day strip may scroll within its own container. No fixed empty spacers.
States: no history/routines, active workout, rest, long names, deleted plan references and storage recovery.

## Settings
Hierarchy: preferences and Save → optional tools → backup/recovery → privacy facts → separate journey replacement options.
Keep names, currency-label confirmation, personal targets, connection/motion preferences, backup validation/preview, unreadable-data recovery and confirmed replacement.
Desktop: preferences left; backup/privacy/journey options right. Phone: single column, backups prominent, replacement actions last.
Retain the fact that browser storage is not encrypted by the app. Starting a personal journey and loading a demo are different actions.
States: demo/personal mode, long names, failed saves, invalid backups, restore preview, currency confirmation, connection disabled with entries retained and storage warnings.

## Mockups and implementation sequence
Prompts are saved in design/supporting before image generation. Mockup values are labeled sample data and do not change personal records. Correct any character-role or factual-copy drift in generated concepts before implementation.
After review:
1. Obtain clean isolated planning, savings, movement and portrait assets; define reusable roles and crop bounds.
2. Refine Budget.tsx, Fitness.tsx, Settings.tsx and scoped styles. Update Routines.tsx only for artwork and placement.
3. Preserve shared shell, module interfaces and unrelated approved screens. Avoid global substitutions.
4. Run the existing 49 tests and production build. Batch browser checks at 390, 768 and 1440px; fix findings together, then confirm once.
5. Check money CRUD/savings, Start/Resume, settings saving, currency confirmation, backup restore, focus, long content, image cleanliness and overflow in an isolated demo.

## Acceptance
One recognizable fluffy pair across all three screens, with correct Mochi/Chonk roles. No fragments, clipped faces or covered controls. Phone actions remain usable. Existing records and privacy facts remain intact. No schema or formula changes. Delivery includes screenshots and actual check results.

