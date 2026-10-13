# Exercise history and session recap

Continue the approved feature plan with comparable exercise history and an encouraging factual recap. Preserve the approved hamster art and existing local storage behavior.

- During a guided workout, show the latest logged day for the exact library exercise ID and equipment. Include its date, actual sets/reps/load, and whether several sessions contributed. Never match names alone or suggest a heavier target.
- My journey replaces the existing name-only maximum-weight cards with exercise history. Choose an exercise and 30 days, 90 days, or all recorded history. List daily actual set groups newest first. Multiple sessions on one date are grouped explicitly rather than assigned an invented order.
- Old/custom records without both ID and equipment remain in the movement diary. Explain why they are absent from comparisons. No automatic relabeling of old data.
- Finishing a guided session opens a recap derived from the saved diary record: duration, actual set count, total reps, and actual exercises/loads. A partial workout gets the same supportive treatment without claiming completion of its plan.
- Recaps can be reopened from strength entries in the movement diary. Refresh may close the modal but does not remove the saved entry. Deleting/editing the diary record changes its recap/history immediately.
- Exclude the active/summarized workout ID and dates after the session date from previous-history lookup. Date filters use local calendar days and include today.
- No schema migration, inferred personal best, cross-equipment comparison, automatic load progression, or medical coaching.

Verification: tests for strict identity/equipment matching, same-day grouping, inclusive date windows, current-record exclusion, and counting grouped sets/reps. Build the full app and inspect UI where the preview is reachable.
