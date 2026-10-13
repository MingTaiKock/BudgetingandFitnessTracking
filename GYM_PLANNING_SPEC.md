# Equipment library and weekly planning

10 October 2026. Implement the next feature-plan increment in the existing React app.

## User flow

In My fitness, create/edit a routine → search a strength exercise library by name or equipment → add or replace a movement → adjust sets, rep range, cue and optional planned load → reorder with accessible up/down buttons → save. The active workout shows equipment and pre-fills planned load; actual reps/load remain editable.

A separate weekly plan assigns one routine, a rest day, or no plan to each weekday. It repeats weekly without creating diary entries or rewards. Today prioritizes an unfinished workout, then today's planned routine. A logged routine is described as logged, including partial sessions, without claiming all prescribed sets were completed.

## Data contract

- Optional exercise ID, equipment and planned kg extend routine exercises. Older backups remain valid.
- Completed strength sets retain optional exercise ID/equipment; completed workouts retain optional routine ID. Never infer stable IDs from historical typed names.
- Weekly schedule defaults to empty for old journeys. Unique weekdays, valid routine references, seven entries maximum.
- Deleting a routine removes its future schedule links, while retaining completed records and any active snapshot.
- Library names/equipment are editable. Renaming a catalog movement or changing its equipment detaches its catalog ID to avoid false future comparisons.
- No timed/cardio movements are forced into a rep-based runner. They remain loggable in the existing movement diary; timed workout support is a separate extension.

## Acceptance

Filter/search finds relevant strength movements; no-result state permits a custom exercise. Replacing/reordering preserves other exercise settings. Planned weights reach the runner and actual weights reach history. Save/reload/backup round trips retain schedule and metadata. Plans never award seeds. Bad references/duplicate weekdays reject cleanly. Tests cover these rules plus the existing suite. Browser inspection limits remain explicit.
