# Small Wins — revised flow design review

15 October 2026. Design artifacts only; production source and live deployment unchanged.

## What is preserved

The exact existing raster hamster artwork, original Habitat garden, soft blue backgrounds, pastel cards, rounded controls and original sidebar pattern. `prototype.html` crops the existing `../01-unified-wellness-dashboard.png`; `assets/habitat-clean.png` is an unchanged copy of the existing app asset. HTML components are static review compositions in the same visual language, not newly generated hamster illustrations. Primary blue was slightly darkened for readable white labels.

## Agreed flow

Home opens Habitat. The four primary destinations are Home, Money, Movement and Insights. The original Connection corner remains on the map as an optional secondary destination. Settings stays accessible from the profile and desktop sidebar. Weekly review is combined with Insights; Future Self and Plan Together become one comparison flow inside Money. Food and partner comments are deferred. Existing records must be preserved during implementation.

## Feedback coverage

| Feedback | Prototype response | Still required in implementation |
|---|---|---|
| Hamster images block movement controls | No decorative pair in routine/workout content | Check real data and all responsive layouts |
| Sixth exercise cannot be reached | Six clickable routine rows and full exercise selector | Reproduce saved-session mismatch; preserve completed sets when routine changes |
| Previous load missing | Last session, reps and weight visible; history link | Keep stable exercise identity; handle equipment variants and unmatched legacy records |
| Habitat hint blocks artwork | Hint below map; dedicated Connection button | Test all art/label breakpoints |
| Too much navigation | Four primary destinations; Habitat first | Redirect old deep links without deleting records |
| Mixed records | Money/Movement tabs and newest-first date groups | Real filters, week selector, empty states and stable sorting |
| Weekly review duplication | One Insights page | Consolidate existing components |
| Savings confusing | Surplus separate from goal contributions; Add to goal dialog | Avoid double counting and clarify starting balances |
| Plan A/B and avoided/replacement costs confusing | Usual cost, alternative cost, times per week | Suggest changes from actual records; preserve existing scenarios |
| Clearing browsing data / two devices | Supporting account explanation | Implement and verify private Google login, sync, migration and recovery |
| Cheer / food / partner comments | Deferred | Optional celebration after completion; food and sharing later |

## Walkthrough evaluation

This is a designer's cognitive walkthrough and browser check, not a usability study with the intended user.

- A person can choose Money or Movement directly from Habitat or ordinary navigation. The hint no longer occupies the Connection image area.
- The sixth exercise opens explicitly as Exercise 6 of 6. The history view gives dated sample loads. The working mobile layout places Complete set in the initial 390 × 844 viewport.
- The money flow explains that income minus spending is recorded surplus; Add to goal records money already set aside and does not transfer money. A sample S$50 contribution changed the preview from S$500 to S$550.
- Switching Insights to Movement shows only movement records, grouped 15 October then 12 October. Weekly review is no longer a separate primary destination.
- Changing a S$6 → S$2 habit to three times per week shows S$12/week and S$52/month. Negative frequency produces a validation message. Potential savings are explicitly not logged savings.
- Seven screens checked at 390 × 844 with no horizontal page overflow. Desktop captures use 1440 × 1000 and full-page height where needed. Main screenshots were visually inspected. Mobile screenshots show the first viewport; remaining content is reached by scrolling.
- No browser console errors observed in the tested interaction sequence. The design detector flagged button contrast, which was improved. Its generic font/glow suggestions were not followed because the user explicitly requested the existing visual language; the shadow is subtle elevation on a light garden, not a dark theme.

## Prototype limitations

All records are fixtures. Changes live in memory and reset on reload. Inputs and completed sets are illustrative; exercise state is not a complete workout engine. Routine editing, scheduling, rest timing, partial completion and some entry saves display explanatory previews. They do not prove the production bugs fixed. The Settings screen is an explanatory account concept, not a final working login form. Week selection, record filtering beyond the two domains, automatic spending suggestions, cloud login/sync and partner sharing are not connected. Longer-term planning is a collapsed concept.

## User review tasks before production work

1. From Home, find and open the sixth exercise; locate its previous weight.
2. Explain the difference between the surplus and goal contribution cards, then preview adding S$50 to a goal.
3. Find last week's movement without seeing spending records mixed in.
4. Compare a cafe habit with a cheaper alternative. Explain whether the estimate means money has already been saved.
5. Decide whether the simplified navigation feels lighter while still looking like the original Small Wins.

Acceptance needs the intended user's feedback. The prototype is ready for that review; production implementation and real data reliability remain separate work.
