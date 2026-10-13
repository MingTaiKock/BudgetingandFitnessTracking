# Validation — Little Wins

Checked 7 October 2026, Windows, Node 24.20.0, Chrome through the official Playwright CLI.

## Automated domain checks

`npm test`: **9 passed, 0 failed**.

- Integer-cent money parsing; zero/negative/exponent/non-finite/excess-precision/oversized amounts rejected.
- Month filtering, overspending, income/expense separation, Monday weeks crossing a year boundary.
- Daily seed caps, purchase deduction, and nonnegative available seeds after deleting source logs.
- Version/date/reference/duplicate-ID validation on backups.
- Corrupt saved data retained; write failures reported; good saved state reloads.
- Routine range validation, completed-set actual reps/load, partial sessions, invalid indexes, excessive completed sets, backup round-trip, and legacy version-1 backups without a routine library.

Tests were written before their corresponding domain/routine implementation and observed failing due to missing implementation, then passing after implementation.

## Real browser checks

`output/playwright/check-flows.js`: completed with all assertions passing.

- Explicit fresh start removes sample history and rewards.
- SGD 12.30 expense becomes exactly 1,230 cents and survives reload.
- Guided workout saves one completed set at 9 reps and 7.25 kg, with 18 minutes duration; no incomplete sets are invented.
- Escape enters discard confirmation, and Tab stays in the dialog; resuming also retains containment.
- Editing notes on a workout with a fractional 7.25 kg load succeeds.

`output/playwright/check-mobile.js`: completed with all assertions passing.

- Today, Budget, Fitness, Journey, and Settings checked at **375 × 812** with no document horizontal overflow.
- Both pixel companions appear inside the guided-session dialog alongside actual-rep controls.
- Guided-session dialog has no horizontal overflow at phone width.
- Desktop (1440 × 1000) and phone screenshots saved.

`output/playwright/check-backup.js`: **PASS**.

- Backup download succeeds.
- Malformed backup displays an error and leaves local data unchanged.
- Valid backup requires explicit confirmation.
- Confirmed restore round-trips the saved journey exactly.

App-tab browser console: **0 errors, 0 warnings** at the final check. Third-party Instagram pages produce their own network errors; those are unrelated to the app.

`output/playwright/check-rewards.js`: **PASS**. Water/mood/rest rewards reached the expected daily total; purchasing the bow saved ownership, deducted seeds once, and disabled duplicate purchase.

## Review fixes

A separate read-only source review identified low contrast on explanatory backup/privacy text, decimal-load editing mismatch, and focus escape during the routine discard/resume transition. All were fixed and the affected browser flows checked. The phone check found a 5px Add entry label overflow, fixed before the successful five-view phone pass.

## Artwork

- Original garden characters and pixel companions visually inspected in the character sheet and actual guided workout.
- Public LycheeGelly post/profile and Bichi Mao profile/posts inspected in browser; contextual source captures saved with attribution in ART_REFERENCES.md.
- Both hamsters extracted through the imagegen edit tool. `assets/references/hamsters-cutouts.png`: **2172 × 724, RGBA, alpha range 0–255**. This is a processed cutout sheet, not a pixel-perfect original export.
- Source reference extraction is separate from the currently shipped original code-drawn app characters.

## Practical limits

Local prototype, not deployed. Browser/origin-specific storage, no cloud accounts or cross-device sync. Guided sessions remain temporary until saved. Native health/bank integrations, offline installation, and personalized exercise prescription are outside this release. Manual browser checks cover the listed flows; this is not an exhaustive accessibility, medical, or security certification.

## Build

`npm run build` runs TypeScript validation and Vite production bundling. Successful builds produced `dist/`. Rollup reports two upstream Zod comment-annotation warnings and removes those comments; they are not application compilation failures. Dependency installation audit reported 0 vulnerabilities at installation time.
