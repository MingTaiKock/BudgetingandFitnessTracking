# Approved workout prototype

Start with `index.html` in this folder, served from the repository root. The prototype references the original hamster artwork in `public/prototype` and links to the earlier revised flow in the parent folder.

This is a standalone interactive design artifact. It is **not integrated into the React application or included in the Cloudflare production build**. Sample workout records stay in a dedicated browser session-storage key. No online account data is read or changed.

## Included
- Five screens: next workout, preview, active logging, completion and comparable exercise progress.
- Rolling upper/lower sequence; gym/home options using dumbbells and bench.
- Expandable programme, session and exercise descriptions.
- Optional example progression nudges, actual-set logging, pause/resume and partial completion.
- Desktop/mobile images, design brief and review notes.

## Fresh pre-push verification — 17 October 2026
- Application tests: 67 passed, 0 failed.
- Application production build: passed. Existing large-chunk and dependency-comment warnings remain.
- Prototype workout browser checks: 25 passed, no page-script errors.
- Descriptive-plan browser checks: 6 passed, no page-script errors.
- Literal relative asset/link check: no missing files.
- Credential-pattern check of the design text files: no matches.

Browser checks are the `verify.cjs` and `verify-description.cjs` functions, run with Playwright CLI `run-code --filename` against a local server at port 5199. They exercise only sample prototype data. Full application implementation and its production release remain separate work.
