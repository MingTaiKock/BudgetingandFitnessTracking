# Little Wins — Mochi & Chonk

A personal mobile-friendly budgeting and fitness companion. Mochi is the small gray hamster, Chonk is the big brown hamster coach, and the default currency is SGD.

## Run locally

On Windows, after installing dependencies, double-click **Start Little Wins.cmd** in this folder and keep its window open. Then visit **http://127.0.0.1:5173/** in your browser. Run the preview in a normal Windows terminal; a restricted agent command environment can report that Vite is ready while browser requests still time out.

Requires Node.js 22.12+ (tested with Node 24).

```powershell
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm run build` for the production bundle, `npm run preview` to preview it, and `npm test` for domain checks. `package-lock.json` pins the resolved dependencies.

## Included

- Contextual Mochi/Chonk artwork for budgeting, movement, rest, progress and setup, plus a 31-pose gallery at `/?characters`. See [CHARACTER_PLACEMENTS.md](CHARACTER_PLACEMENTS.md).
- Category budgets by month, income/expenses, editable logs, and manual savings goals.
- Workout diary with duration, notes, optional strength details, weekly rhythm, and historical charts.
- Editable preplanned workout routines with sets, target rep ranges, and exercise cues.
- A searchable 24-exercise strength library across 10 equipment types, replacements, ordering, and optional planned weights.
- A repeating weekly workout/rest plan with today's routine offered on Today; plans count only after logging.
- Previous matching reps/load during workouts, exercise history with date filters, and factual session recaps that can be reopened from the diary.
- Guided sessions with Mochi/Chonk, persistent drafts, resume from Today/Fitness, optional rest timer, actual reps/load, and partial workout completion.
- Early daily action buttons and monthly budget planning with a last-month preview.
- Daily water, mood, and rest check-ins; capped seed rewards, milestone badges, and a little cosmetic shop.
- Profile preferences, backup export/import, confirmed reset, and clearly labelled demo data.
- Hamster portraits from the [LycheeGelly video](https://www.instagram.com/p/C7nU9AloIn9/) and generated pose studies reused across the app. The gallery at `/?characters` shows everyday, workout and gym-equipment artwork. Existing breathing, hop and nuzzle motions use CSS transforms and respect reduced-motion settings. See `ART_REFERENCES.md` for the source-frame review and `CHARACTER_PLACEMENTS.md` for current usage.

On first visit, personal setup helps you choose names/SGD, optional budget limits and editable starter workouts. You can explore the demo instead and return through **Start my journey**. A final review explains replacement of sample data and offers a backup first. Existing personal journeys open normally. Starter routines are editable examples; budget limits are set only when you choose them.

## Data and privacy

Records stay in localStorage on this browser/device/origin. No account, cloud sync, analytics, remote font, bank connection, or partner sharing is implemented. The app does not encrypt browser storage. Clearing browser data removes the journey unless a backup exists. Use **Settings → Download backup** regularly. Invalid imports leave existing records intact; restoring a valid backup asks for confirmation.

“Left in budget” means category limits minus recorded expenses, not a bank balance. Net cash flow means recorded income minus expenses. Savings contributions are a separate manual ledger, not bank transfers. Currency changes relabel amounts without conversion and require confirmation when amounts already exist.

Workout targets are editable preferences. Routines are examples; actual reps may differ from the target. Chonk's encouragement is generated from simple local rules, not a live coach, messages from the boyfriend, or AI exercise prescription.

Guided workouts save a draft after each change when browser storage is available. Close and resume from Today or My fitness. Completed sets, pending input, the routine snapshot and rest deadline survive reload and backup/restore. Finish records completed sets and clears the draft together; Discard explicitly removes it. Elapsed time includes breaks and time away; adjust duration before finishing. Storage failures show a warning: keep the tab open and download a backup. Stale writes from another tab are rejected with a warning and a reload option; automatic conflict merging is not implemented.

The current Wellness interface includes the prototype-inspired dashboard, identity journey, habitat, record-based weekly review, optional connection diary, scenario planning and editable no-interest savings projections. Verification on 12 October 2026 passed 49 domain tests, the production build, and browser checks across 11 screens and four viewport widths. See [plan/CONTINUATION_VERIFICATION.md](plan/CONTINUATION_VERIFICATION.md) for evidence and limits.

## Project documents

- [EXERCISE_PROGRESS_DELIVERY.md](EXERCISE_PROGRESS_DELIVERY.md): comparable exercise history and workout recaps, 31 passing tests, successful build, and pending browser/phone checks.
- [EXERCISE_PROGRESS_SPEC.md](EXERCISE_PROGRESS_SPEC.md): identity matching, date windows, and recap behavior.
- [GYM_PLANNING_DELIVERY.md](GYM_PLANNING_DELIVERY.md): exercise library and weekly schedule, 26 passing tests, successful build, and live-preview limitation.
- [GYM_PLANNING_SPEC.md](GYM_PLANNING_SPEC.md): equipment, routine editing, schedule and data compatibility requirements.
- [DELIVERY_2026-10-10.md](DELIVERY_2026-10-10.md): personal setup implementation, 19 passing tests, successful build and remaining live-phone verification.
- [ONBOARDING_PLAN.md](ONBOARDING_PLAN.md): setup flow and data-preservation requirements.
- [DELIVERY_2026-10-09.md](DELIVERY_2026-10-09.md): latest implemented changes, passing checks and live-preview limitations; supersedes older validation notes for these flows.
- [APP_EXPERIENCE_AUDIT.md](APP_EXPERIENCE_AUDIT.md): evidence, design gaps and inspection limits.
- [FEATURE_PLAN.md](FEATURE_PLAN.md): current increment and prioritized feature acceptance criteria.
- [PRODUCT.md](PRODUCT.md): confirmed product and character commitments.
- [ROADMAP.md](ROADMAP.md): prioritized development phases after the local MVP.
- [RESEARCH.md](RESEARCH.md): 24-app representative market survey with primary sources and product conclusions.
- [SPEC.md](SPEC.md): first-release product, calculation, reward, and design contracts.
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md): implementation tasks and decisions.
- [ART_REFERENCES.md](ART_REFERENCES.md): user-supplied artist directions and saved reference captures.
- [LYCHEEGELLY_ART_RESEARCH.md](LYCHEEGELLY_ART_RESEARCH.md): expanded artist review, downloaded source illustration and eight generated pose studies.
- [CUTE_POSE_RESEARCH.md](CUTE_POSE_RESEARCH.md): broader pose/costume research, 24 new action concepts, gallery and animation handoff.
- [ANIMATION_PLAN.md](ANIMATION_PLAN.md): artwork layers, character rigs, motion clips, app triggers and staged validation.
- [ANIMATION_TOOLS.md](ANIMATION_TOOLS.md): tool comparison, installed Rive CLI, reproducible setup and verified limits.
- [VALIDATION.md](VALIDATION.md): actual verification results and limits.

Source is in `src/`; the character crops are in `public/characters/`; routine logic is in `routines.ts` and `features/Routines.tsx`. Reference captures and previews are in `output/playwright/`.

## Next steps

Test daily use with the intended user before expanding. Next planned releases: character expression animation, installable/offline PWA, opt-in partner accounts and secure cloud backups, then individually evaluated bank or wearable integrations. This build has not been deployed.
