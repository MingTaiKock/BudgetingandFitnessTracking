# Configurable navigation

## Approved direction
Use the existing Small Wins components, colors and hamster identities. Home is fixed; Money, Movement, Insights and Connection are optional shortcuts in that order. Settings remains accessible. Defaults are Home, Money, Movement and Insights. Choices sync with the signed-in account on phone and computer. Hidden destinations remain accessible from Habitat and retain all records. Connection diary enablement remains separate from shortcut visibility.

## Prototype delivery
`index.html` is a standalone, responsive interaction prototype. It uses existing artwork and no application data or storage. Review controls show default, all-five and Home-only layouts and simulate successful or failed saves. Settings provides a draft preview, explicit save, restore defaults, failure and retry. Changes apply to both navigation surfaces only on successful simulated save. Other destinations are labelled previews to demonstrate access, not working trackers.

Review this prototype before changing production code. No deployment is part of this prototype step.

## Implementation after prototype approval
1. Define one ordered list of destinations and a navigation-visibility preference for the four optional destinations. Both navigation surfaces and the Settings controls consume it. Home and Settings cannot be hidden. Use existing view identifiers (`budget`, `fitness`, `insights`, `connection`) and icons.
2. Add a defaulted preference to the strict state schema. Existing journeys/backups with no navigation preference keep today's defaults. Update demo/fresh state constructors and relevant fixtures. Keep visibility separate from `connectionEnabled`. Verify existing local and cloud record parsing before release; no database schema change is expected for the existing state document.
3. Add the Navigation settings card with a local draft. Save the full set of choices through the current change/save controller; do not claim online success from a queued write. Preserve edits on a failed save and expose the existing retry/recovery mechanism. Restore defaults edits the draft only. Keep the draft while navigating within the app; discard it when switching accounts or loading another journey. On incoming remote preferences, refresh a clean draft; if the draft is dirty, explain that saved choices changed and let the user reload them or explicitly save their draft through existing conflict handling.
4. Keep all Habitat entry points, including Insights. Add Home → Connection Corner. Hidden destinations remain valid views, without adding temporary tabs. Selected styling applies only to the currently visible destination, with no misleading Home highlight on hidden sections.
5. Use the same saved choices on desktop and mobile. Keep existing responsive breakpoints; five mobile labels fit at 320px with at least 44px touch targets. Home-only mode still exposes Settings through the header.

## Acceptance and release
Prototype: default/all/minimal layouts; draft/save distinction; restore defaults; retry; hidden-section access; Connection diary independence; keyboard switches; mobile overflow; no missing artwork or script errors. Capture desktop and 320/390px evidence.

Application: test old backups and default migration, account/local/demo isolation, reload and sync, failed/conflicting saves, incoming remote preference updates, all optional tabs hidden, five visible tabs, and Connection enabled/disabled independently. Run regression suite and production build. After implementation approval and verification, deploy and smoke-test production in demo mode.

No reordering, partner sharing, new trackers or illustration redesign in this change.
