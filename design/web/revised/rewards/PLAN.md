# Small Wins: companion feedback

Keep the existing app, palette, controls and hamster identities. Art should acknowledge an action, never compete with the task.

| Placement | Artwork | Trigger and behavior |
| --- | --- | --- |
| New money entry | Cream hamster with a notebook | Compact, dismissible acknowledgment after the form accepts a new entry. Edits and deletions stay text-only. |
| Savings contribution | Golden hamster with a savings jar | Celebrate setting money aside, regardless of amount. Do not equate income minus spending with an actual savings transfer. |
| Manual movement entry | Cream and golden high-five | Celebrate showing up; no pressure to lift more or train through discomfort. |
| Finished workout recap | Same high-five pair | Replace repeated routine illustrations. Partial sessions deserve the same encouragement. Keep totals and save status visible. |
| Habitat | Existing habitat illustration | Keep this as the primary illustrated landing page. No extra floating characters. |
| Insights / Settings / active workout | Existing restrained treatment | No new decorative art among charts, account controls or exercise inputs. |

## Feedback contract

- Visual acknowledgment is separate from persistence: show the current local/demo/online save status explicitly.
- Do not show a reward when validation or synchronous saving rejects the action. Hide celebration art if a storage warning appears.
- Do not award new currency, multiply seeds, or reward repeated editing. Existing seed accounting is unchanged.
- One acknowledgment at a time; dismissible; no sound, confetti, blocking modal or focus stealing.
- Respect reduced motion and the existing gentle-motion setting.
- On mobile, keep the acknowledgment above navigation and below any open dialog; constrain its width to the viewport.

## Asset direction

Use the original cream hopeful hamster and golden waving hamster as identity references. Fluffy softly shaded fur, rounded natural bodies, glossy dark eyes, peach ears and paws. Transparent backgrounds. Two forepaws and two feet per character. No text in images.

Generate three individual assets: notebook acknowledgment, savings jar, and paired high-five. Use small optimized runtime copies; retain originals for future design work.

## Evaluation

Verify new entry, edit, contribution, manual workout and session recap. Check broken image requests, mobile overflow, dismissal, keyboard use, reduced motion, and explicit demo/save status. Confirm no schema or seed-accounting changes. Run the existing tests and production build.
