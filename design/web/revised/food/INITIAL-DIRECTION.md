# Food tracking and workout art assessment

25 October 2026 — initial direction, not an approved implementation specification.

## Workout artwork decision

Recommend selective regeneration. Compare every candidate to `public/prototype/habitat-clean.png`; the existing workout sheets are secondary pose references only. Visual comparison of Habitat, `mochi-1.png` and `chonk-4.png` confirms facial exaggeration: larger eyes/ears on Mochi, repeated wide-open smiles on Chonk, and taller silhouettes in some standing or overhead poses. This is a representative assessment, not a completed audit of all 64 images.

Preserve the explicitly approved Mochi and Chonk seated leg-curl pose and current originals. Do not restart the rejected lying-leg-curl direction. First refine one matched pair (dumbbell curl is a useful simple pose), compare it to Habitat at full and UI size, and confirm the character match before producing further replacements. Then inventory all 32 exercise pairs as keep, style correction, or pose correction. Check exercise mechanics separately from identity. Replace individual images with versioned originals; avoid a wholesale sheet regeneration that can introduce new defects.

Acceptance: cream Mochi/golden Chonk; natural small glossy eyes; compact rounded furry body; tiny limbs; equipment sized to the hamster; natural occlusion; no extra anatomy; soft Habitat-like rendering. Preserve gentle expression variation without making every face a wide grin. See `design/HAMSTER-STYLE.md`.

Subsequent user clarification: preserve the original emotion of EACH image. Open smiles and closed happy eyes must not be removed merely to match Habitat's calmer scene. Earlier observations about exaggerated smiles are not instructions to neutralize them. The approved curl pair guides identity and rendering only; retain each source pose's distinct expression.

## Food: user intent already established

Track food intake and calories with estimates derived from input, and let the user refine estimates. Keep the app lightweight. Follow the existing components and Habitat artwork. This first feature is a food diary, not a meal-planning programme.

Confirmed input preference: she enters the meal and a rough portion, and expects the system to estimate calories. Do not require ingredients or a known calorie value in the primary flow. Manual entry is an optional correction/fallback.

The primary form has a meal description and rough portion (for example, one plate, half a bowl, or a small serving). Offer common portion choices while retaining free text. The estimate review shows approximate kcal, the interpreted meal and portion, and material assumptions such as preparation or included sauce. Let her adjust these without restarting. Ask one focused follow-up only when ambiguity materially changes the result; do not interrogate her about every ingredient. If no supported match exists, say so and retain the draft rather than fabricate a calorie value. Approximate output should avoid spurious precision. Any displayed range must have a defensible basis, not an arbitrary confidence percentage.

## Proposed experience

Food is an independently configurable destination using the same visibility rules as the other destinations. Do not bury it behind Movement's visibility setting. Reuse the current app shell, colors, typography, cards and form controls. Reuse approved art sparingly.

Daily screen:

    Food                                 [Log food]
    [Previous day]  Today, 25 Oct  [Next day]
    Calories logged: — kcal · No meals logged yet
    Breakfast / Lunch / Dinner / Snacks
    Meal description · portion · kcal · Estimated or Manual
    [Edit] [Log again] [Delete]

Entry flow:

    Describe meal + rough portion → Estimate calories
      → review matched foods, portions and assumptions
      → edit the estimate or switch to manual calories
      → choose meal and date → Save
      → diary updates; gentle acknowledgement + Undo

Show total calories logged, not presumed complete daily intake. Missing meals are not zero-calorie days. Support backdated entries, cancel, edit and delete. Repeated meals copy into a draft for review rather than saving immediately. Avoid automatic calorie targets, deficit advice, red failure states, workout-calorie subtraction or rewards for low intake. Celebrate the act of logging only; edits/repeated saves must not farm rewards.

## Estimation approach

Two inputs should remain available: known calories (fast, offline-capable) and estimated calories from food plus amount. An estimate must retain the food source, serving basis and assumptions. Unknown foods must remain unresolved or allow manual entry, never silently contribute zero. Changing food or portion invalidates a previous estimate until recalculated.

USDA FoodData Central is a candidate source for ingredient and packaged-food nutrition. Its official API supports food search and details, requires an API key, and says that key must not be public. Therefore a live integration would require a server-side proxy, not a browser-bundled key. Its documented API does not itself constitute a free-text meal understanding service. Mixed/local meals require an explicit recipe match or reviewed ingredient breakdown; do not pretend a generic match is precise. Assess local meal coverage before selecting the provider. No paid provider or AI service has been selected.

Source checked 25 October 2026: https://fdc.nal.usda.gov/api-guide/

## Implementation implications from current code

`src/model.ts` uses strict Zod schemas and currently has no food-entry collection. `src/navigation.ts` has explicit destination and visibility types. `src/storage.ts` validates the state before saving and guards against competing tabs. Food needs coordinated schema, navigation, defaults, backup and account-sync compatibility, rather than an isolated local-only page.

Proposed record: stable ID, local calendar date, meal category, description, portion text, confirmed kcal, estimate/manual origin, and optional structured items/source metadata. Keep saved values stable if a provider changes later. Keep incomplete estimation drafts out of saved daily totals. Preserve all existing budget, workout and connection records through migration. Verify signed-in sync behavior before claiming cross-device persistence for food.

## Next design and QA work

Input preference is resolved. Next produce a concrete mobile/desktop prototype in this folder: empty diary, filled diary, meal-plus-portion entry, estimate review, one-question clarification, edit, and estimation-unavailable states. Prototype estimates must be labeled illustrative until backed by a working provider. Review user flow before production implementation, as requested for this project.

Implementation checks: serving calculations and unit conversions; decimal portions; zero/negative/nonfinite inputs; unresolved foods; source/manual override preservation; date boundaries; duplicate submit prevention; edit/delete/undo totals; old-backup migration; export/import; signed-in ownership and sync; guest/offline behavior; configurable navigation; keyboard/mobile use; no dead buttons or artwork overlap.
