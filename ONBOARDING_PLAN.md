# Personal setup — 10 October 2026

## Intended experience

A first-time visitor meets the approved Mochi and Chonk, then chooses names/currency, a monthly plan (or later), and editable starter routines. A final review explains exactly what will be created before entering Today. Existing personal journeys never reopen setup automatically.

## Flow

1. Names and currency, prefilled with the existing Mochi/Chonk and SGD preferences.
2. Choose to plan this calendar month or leave it unplanned. Blank category amounts mean zero only when deliberately choosing a plan. No sample budget is copied silently.
3. Choose an editable home/gym starter routine, both, or none yet; review exercises/rep ranges and choose a weekly target.
4. Review names, currency, budget total and routine selection. Explicitly explain replacement of the demo garden, including any edits. Offer a download of the current demo before replacement.

Back preserves fields within setup. Explore demo exits without applying setup values. Opening setup again is available from the demo banner and Settings. Saving validates and writes the full personal journey first; a storage failure keeps the review open and the old journey intact. No account or cloud service is added.

## Implementation and verification

Use a focused setup page, a pure demo-to-personal builder and the existing storage schema. Guard against replacing personal data through this flow. Load metadata distinguishes a genuinely new browser from an existing demo or personal journey. Tests cover no mixed sample data, zero/unplanned budgets, precise money, starter selection, invalid input and preservation on failure. Build the whole app; record browser limitations separately.
