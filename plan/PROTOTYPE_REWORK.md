# Prototype implementation rework — 12 October 2026

The supplied web and mobile designs are the visual reference. The previous Little Wins dashboard composition has been replaced by the Wellness shell, an illustrated dashboard, direct tool navigation, pastel domain cards, navy typography, and a mobile bottom navigation.

## Development and verification

1. **Visual foundation — delivered:** Wellness brand and profile sidebar; responsive navigation; prototype illustration regions; consistent typography, spacing, buttons, cards, dialogs and setup styling.
2. **Screen implementation — delivered:** dashboard, insights, identity journey with editable intentions, optional connection diary, illustrated habitat with zone links and zoom, two editable future savings plans, recorded streaks, illustrated scenario planning, weekly review, budget, fitness and settings.
3. **Verification — passed:** 49 domain tests; TypeScript and production build; browser navigation across 11 screens; 390, 768, 1280 and 1536 px layouts; water logging and persistence after reload; reset/entry dialogs; habitat zoom. The browser verification script is `scripts/verify-prototype.cjs`; screenshots are in `output/playwright/rework-*.png`.

## Product behavior

Figures use the existing local records. The dashboard financial figure is rounded to whole currency units for display; its title and budget detail retain exact cents. Streaks include a run ending yesterday when no entry exists today, stop at gaps, and ignore future dates. Rest days count as movement care. Connection is opt-in. The scenario calculator uses user-entered assumptions and retains confirmation before changing a budget. Future scenes are illustrations; their totals use starting amount + monthly contributions × months, with no health or relationship prediction.

Existing money, workout sessions, exercise history, routine plans, backups and recovery behavior remain available. No account, partner sharing, bank connection, passive surveillance or unified scientific wellness score is implied by the new interface. Native device testing and offline installation remain separate roadmap work; this visual rework does not claim to deliver them.

## Illustration sources

Approved prototype images were copied into `public/prototype/`; `src/PrototypeArt.tsx` displays illustration regions through SVG viewports while the surrounding interface and records remain live HTML/React controls. The original design directory is unchanged.

`public/prototype/habitat-clean.png` was created with the built-in image generation tool using the habitat prototype as an edit reference. Prompt: faithfully recreate the sunny storybook habitat scene with the golden and cream hamsters, cottage, financial and fitness objects, garden, pond and bridge, removing every application control, label, streak count and text. This lets the app render real zone labels and zoom controls over a clean illustration.

## Running and checking

- `npm run dev -- --port 5173 --strictPort`
- `npm test`
- `npm run build`
- With an isolated Playwright CLI session open on the app: `npx --yes --package @playwright/cli playwright-cli -s=wellness run-code --filename=scripts/verify-prototype.cjs`

The browser test changes only its isolated demo journey. It does not reset the user's browser records.
