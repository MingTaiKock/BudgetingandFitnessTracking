# Little Wins Implementation Plan

Goal: deliver the locally stored first release described in SPEC.md.
Architecture: typed React feature views over a validated versioned state; pure domain calculations; storage wrapper; original SVG mascots.
Tech stack: React, TypeScript, Vite, Zod, lucide-react, Node's test runner.
Spec: SPEC.md. Execution: native in the current session, authorized by the user's instruction to research, draft, and start building.

## Constraints and review focus

- Follow the exact currency, date, reward, consent, and privacy contracts in SPEC.md.
- Review invalid monetary/date values, month boundaries, duplicate rewards, broken browser storage, and invalid imports.
- Keep illustrations local and all data user-controlled. No deployment or external accounts.

## Task 1 — domain and persistence

Files: package.json, index.html, tsconfig.json, vite.config.ts, src/model.ts, src/domain.ts, src/demo.ts, src/storage.ts, tests/domain.test.ts.

- [x] Define tests first for cents conversion, month filtering, Monday week boundaries, rewards, cosmetic affordability, backup validation, and storage recovery. Run `npm test` and observe missing implementation.
- [x] Implement schema and pure interfaces: `parseMoney(string): number`, `monthSummary(State, month)`, `weekSummary(State, date)`, `earnedSeeds(State)`, `availableSeeds(State)`, `parseBackup(string): State`, and `loadState(Storage): LoadResult`.
- [x] Add explicitly labelled sample state and zero-history state factories. Save only validated state; preserve corrupt input.
- [x] Run `npm test`; all meaningful calculation and recovery cases must pass.

## Task 2 — usable companion app

Files: src/main.tsx, src/App.tsx, src/components.tsx, src/Mascots.tsx, src/styles.css, src/features/Today.tsx, Budget.tsx, Fitness.tsx, Journey.tsx, Settings.tsx.

- [x] Build the responsive shell, garden, seed counter, accessible dialog and feedback.
- [x] Implement budget limits, transaction editor/history, goals/contributions, and month selection using domain interfaces.
- [x] Implement workout editor/history, daily check-ins, week totals, trend charts, badges, and seed shop.
- [x] Implement settings, validated backup/restore, confirmed reset/demo actions, and explicit demo/privacy labels.
- [x] Run `npm run build` and domain tests.

## Task 3 — review and handoff

Files: README.md, VALIDATION.md, output/playwright/*.

- [x] Use the installed Playwright skill for real desktop and phone browser flow checks. Check fresh start, money/workout entry, reload, settings, and dialogs.
- [x] Review financial correctness, keyboard behavior, 375px overflow, and console errors; fix material findings and repeat affected checks.
- [x] Record actual command results and remaining limitations; open the local app for the user.

## Ledger

- Scope chosen: comprehensive representative research, followed by an independently usable local MVP. “All apps” is not an enumerable deliverable; the report makes its coverage explicit.
- User confirmed web, Mochi, Chonk, SGD. Existing project directory was empty at inspection.
- User's explicit instruction to proceed overrides repeated approval gates in workflow skills. No external publishing is authorized or needed.
- User added editable preplanned routines, target rep ranges, and pixel Mochi/Chonk exercise encouragement. Implemented in `src/routines.ts`, `src/features/Routines.tsx`, and `src/PixelPals.tsx`; completed sets store actual reps/load and partial sessions are supported.
- User supplied LycheeGelly hamster and Bichi Mao cat references. Public frames/post captures and a processed transparent two-hamster extraction are saved locally; source attribution and similar-character research are in ART_REFERENCES.md.
- Final production build and 9 domain tests passed. Browser flows verified fresh start, financial persistence, guided routine logging, focus containment, backups, daily rewards, cosmetics, and all five screens at 375px. Practical limits documented in README.md and VALIDATION.md.
