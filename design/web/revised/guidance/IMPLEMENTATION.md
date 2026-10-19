# Guidance Implementation Plan

**Goal:** Useful encouragement and transparent suggestions within existing flows.
**Architecture:** Pure functions derive evidence from current State; React cards and editors use existing change/save infrastructure. No schema migration or new service.
**Tech stack:** React, TypeScript, Zod, existing CSS and hamster assets.
**Spec:** PLAN.md. Execution is authorized by the user's explicit research/design/implement request; implement natively in this session.

## Tasks

All five tasks below are complete. Validation and known limits are recorded in QA.md. A reviewer identified the routine capacity edge case, now guarded and tested; failed local preset saves also expose an explicit retry.

- [ ] Rewards: `src/guidance.ts` exports weeklyWins(state,today), returning distinct logging/savings days and completed workout count. `WeeklyWins.tsx` shows original reward images and save status under Habitat, within native details. Tests exclude previous/future dates, collapse duplicate dates and never count active workouts.
- [ ] Money: guidance.ts exports spendingBaseline(state,month) for previous-month totals/counts and lifestyleSuggestions(state,today) for eligible categories with at least two entries in last 30 days. BudgetPlanner uses baseline only to fill a draft, then validates normal limits. ScenarioPlanner offers optional prompts and displays average/count/date evidence; selecting resets stale editing ID, replacement, frequency and time assumptions. Tests exclude income/savings/future records and verify cents rounding.
- [ ] Presets: `workoutPresets.ts` defines five split types and gym/home variants, stable exercise IDs, validated routines and idempotent installation. Add missing canonical exercises to exercises.ts. `WorkoutPresetPicker.tsx` uses native selects and details; default 3-day full-body or 4-day upper/lower based on current target. Install never changes schedule/history/active workout and doesn't overwrite customized existing preset IDs. Tests cover every split/environment, schema limits and state preservation.
- [ ] Integration: mount picker in Routines, weekly rewards under Habitat; add scoped guidance CSS. Preserve existing components and save semantics. Explain routine progression as one extra rep with controlled form, then smallest available load increase after reaching the upper range; never prescribe a load automatically.
- [ ] QA: run focused tests, full suite/build, desktop and 320/390px browser flows including draft/cancel/save, preset add twice, start routine and lifestyle estimate. Review code diff and screenshots. Record results and limitations in QA.md.

## Review focus

Missing data must not be interpreted as zero real spending; preview must never write; repeated Add must not duplicate or overwrite; home templates must not require gym equipment; online queued saves must not claim durable success. Validation exercises these cases with pure tests and mock storage where appropriate.
