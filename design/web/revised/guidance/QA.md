# Guidance implementation QA

19 October 2026.

## Passed

- Production build: TypeScript and Vite pass. Existing bundle-size and third-party annotation warnings remain; no build errors.
- Full automated suite: 77 tests, 77 passed. New tests cover weekly date boundaries/distinct days, exact previous-month spending, income/future exclusion, evidence thresholds and cents rounding, all ten split/equipment combinations, canonical exercise identity, non-destructive/idempotent preset installation and the 50-routine boundary.
- Browser `verify-app.cjs`: original reward artwork and distinct-day feedback; budget preview does not write; cancel/save behavior; lifestyle prompt/evidence, explicit replacement cost and scenario save; mobile 320/390px with no horizontal overflow; repeat preset add disabled; added preset starts an actual workout. No JavaScript page errors.
- Browser `verify-edge.cjs`: gentle empty rewards; failed browser-storage save exposes retry; retry persists once; full-library Add disabled with actionable capacity explanation.
- Design prototype checked at 390px before final feature testing. Implemented rewards and preset screenshots inspected at 390px and 320px. Existing art/components retained.
- Independent review identified a missing routine-capacity guard; corrected and covered by pure and browser tests. A home-template duplicate exercise substitution and unclear accessible select names were also corrected during testing.

## Boundaries

Tests use isolated local records. No real user records were changed. Existing online persistence remains in use, with no migration; live authenticated multi-device behavior for this new feature set was not separately exercised. Suggestions are transparent heuristics, not clinically individualized workout prescriptions or evidence that incomplete financial records represent an affordable budget. Presets preserve existing schedules; the user assigns weekdays in Weekly plan.

The new guidance features are implemented locally, not yet deployed. Navigation commit 2c6dc23 was separately confirmed live and passed its production demo smoke check.

## Repeat

Run the local Vite server on port 5202 and execute the two browser scripts with the existing Playwright CLI. Both scripts seed an isolated browser's local storage and should never run in a real user's session. Prototype: index.html. Source research and feature rationale: PLAN.md. Implementation sequence: IMPLEMENTATION.md.
