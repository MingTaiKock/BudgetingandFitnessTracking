# Daily food diary implementation plan

Goal: add the reviewed meal-and-rough-portion diary to the existing app without disrupting saved journeys.

Architecture: validated food entries join the existing state and saving path. A standalone estimation module returns either a sourced estimate or an explicit unsupported result; UI never invents a fallback number. Provider selection is pending the user's response. Existing UI components and configurable navigation are reused.

## Tasks

- [ ] Add `foodEntrySchema`, default-empty `foodEntries`, unique-ID validation, and a backwards-compatible optional Food navigation preference. Test old state loading, bad dates/calories, duplicate IDs, save/export roundtrip.
- [ ] Add `src/food.ts` estimation interface and daily total helper. Test unresolved meals, invalid portions, immutable source assumptions and date-specific totals. Broader provider implementation waits for the requested service preference; diary does not.
- [ ] Add `src/features/Food.tsx`: date selection, grouped meals, add/edit/repeat/delete/undo, meal and rough portion input, estimate review, manual fallback. Invalidate estimates on changed meal/portion. Use the existing `change` callback so saving failures never report success.
- [ ] Wire Food to navigation, settings, Home access and quick log. Keep mobile navigation usable with six destinations.
- [ ] Run automated tests and production build, then exercise the diary at desktop and mobile sizes, including estimation unavailable, editing, deleting, undo, reload and old-data compatibility.

Review focus: missing meals are not zero-intake days; whitespace-only entries cannot save; unknown descriptions do not produce arbitrary calories; old clients cannot silently discard new food data; edits/repeats must not create duplicate submissions or farm rewards. No automatic diet target or exercise-calorie subtraction.

Artwork runs first: install the reviewed expressive curl pair after preserving original source files. Do not ship rejected batch attempts. Remaining artwork must pass identity, source-expression and exercise-mechanics checks independently; approved seated leg curls stay unchanged.
