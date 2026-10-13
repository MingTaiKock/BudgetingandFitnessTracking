# Animation tools and setup

Researched and checked on 8 October 2026. Scope: interactive Mochi and Chonk in the existing React mobile web app.

## Decision

Use **Rive** for the interactive character rig, **layered PNG artwork** for the existing painted appearance, and **FFmpeg** for review videos/GIFs. Use **Krita** when preparing the layered artwork. Keep the current PNG/CSS implementation as the fallback until the rig passes visual and browser checks.

Rive can deform raster images with meshes and bones; it does not require replacing the accepted artwork with smooth vector drawings. Its state machines support switching between idle, encouragement, rest and celebration. These are tool capabilities, not evidence that the hamster rig is already finished. [Raster meshes](https://rive.app/docs/editor/manipulating-shapes/meshes), [state machines](https://rive.app/docs/editor/state-machine/state-machine).

## Options considered

| Tool | What it would do here | Decision and constraints |
| --- | --- | --- |
| [Rive CLI and RML](https://github.com/rive-app/rive-docs/blob/main/cli/getting-started.mdx) | Editable animation source, bones/meshes, timelines, state machines, local compile and rendered previews | **Installed locally.** Best first trial for an interactive React app. New CLI workflow: pin the version and prove browser compatibility before committing the whole animation set. |
| [Rive editor](https://rive.app/) | Visual mesh weights, pivots, timeline editing, inspecting the rig | Available in browser; desktop editor not needed for setup. Login needed for CLI publishing/editor handoff. |
| [Krita](https://krita.org/en/download/) | Separate eyes, paws and ears; paint clean areas under moving parts; frame-by-frame expression variants | Free artwork-preparation option. Not installed yet: this turn establishes tooling and the plan, and no layer painting has begun. Use its official Windows release if manual preparation is needed. [Animation manual](https://docs.krita.org/en/user_manual/animation.html). |
| [Spine](https://esotericsoftware.com/spine-meshes) | Mature skeletal character rigging and mesh deformation | Capable alternative, but introduces paid editor/runtime licensing considerations. No purchase or installation. [License and editions](https://esotericsoftware.com/spine-purchase). |
| CSS / Web Animations | Translate/rotate existing cutouts, gentle idle, simple hop | Already in the app. Useful fallback and layout motion; cannot independently move eyes/paws embedded in one image. |
| FFmpeg | Inspect available video files, make contact sheets, encode review clips/GIFs | Already installed: `9.0.1-full_build-www.gyan.dev`. Useful for review, not a character rig editor. |
| HyperFrames | Compose presentation videos from rendered assets | Available skill, but unnecessary for the interactive runtime. No extra install. |

We do not need a text-to-video generator for the first rig. Repeatable poses, transparent edges and exact event timing matter more than generating a different-looking hamster in each clip.

## Installed and verified

- Rive **1.5.0**, official Windows x64 release.
- Project-local executable: `.tools/rive/bin/rive.exe`.
- Version payload and bundled docs/samples: `.tools/rive/versions/1.5.0/`.
- Official archive: `https://releases.rive.app/cli/v1.5.0/rive-windows-x64.tar.gz`.
- Archive SHA-256 matched the official manifest: `12ea8a713642887150e25414acca6b219645b7a60ae1aa708fe17b3d8b2b6761`.
- Installer: `scripts/install-rive-local.ps1`; launcher: `scripts/rive.ps1`.
- No global PATH change, package purchase, account login, cloud upload or production React dependency was needed.
- `.tools/` is ignored. The scripts pin the release and checksum so the setup is reproducible.

The official installer was downloaded and inspected. A project-local installer follows the official archive layout without changing the user's PATH. It downloads only from the official release host and verifies the pinned hash before extracting the executable and bundled documentation.

| Check | Actual result |
| --- | --- |
| `--version` | `rive 1.5.0` |
| `doctor` | Installation OK, live-link port available. Update lookup unavailable because DNS could not resolve; not logged in. |
| `create animation/tool-check` | Starter project generated locally. |
| `animation/tool-check --once` | `.riv` built; 0 errors, 0 warnings. |
| `animation/tool-check --verify` | Verified; 0 errors, 0 warnings. |
| `inspect animation/tool-check --summary` | No problems; artboard, timeline and state machine present. |
| `animation/tool-check --screenshot --advance=1` | Headless PNG rendered successfully at 500×500. |

The tool-check is the unmodified, blank starter scene. It proves installation, compilation and headless rendering; it does **not** prove hamster animation quality, raster skinning, production export or mobile runtime performance. Those are explicit pilot gates in [ANIMATION_PLAN.md](ANIMATION_PLAN.md). No production app source changed during this setup.

## Commands

Run from the repository root in PowerShell (RTK is installed on this machine):

```powershell
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install-rive-local.ps1
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rive.ps1 --version
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rive.ps1 doctor
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rive.ps1 docs rigging
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rive.ps1 animation/tool-check --verify
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rive.ps1 inspect animation/tool-check --summary
rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rive.ps1 animation/tool-check --screenshot --advance=1
```

Use `-Offline` on the installer to reuse the downloaded archive. `--once`, `--verify`, and `--screenshot` finish without keeping an editor window open. Running a project without a mode flag opens the interactive preview window; use that only when a visible editor is wanted. Consult the bundled `docs`, `schema`, and `samples` commands before authoring RML rather than guessing property names.

## Publication and runtime gate

Local build and preview work without login. CLI `--publish`, `.rev` export and editor handoff require authentication; publishing can send project material to Rive. The CLI distinguishes unsigned local builds from signed production builds, especially for scripts. Start with declarative animation and no embedded scripts, then explicitly test a browser build before promising a production export path. The local starter check does not establish that path. [Official CLI publishing documentation](https://github.com/rive-app/rive-docs/blob/main/cli/publishing.mdx).

At research time, Rive's pricing page lists free `.riv` export with a splash screen and paid options that remove it. Confirm the actual account/export behavior at the pilot gate; no paid subscription is assumed. [Current pricing](https://rive.app/pricing).

When the pilot is ready, evaluate the official [`@rive-app/react-webgl2` runtime](https://rive.app/docs/runtimes/react/react) with explicit canvas dimensions and a PNG fallback. Install and pin it only for that integration trial. Test WebGL failure, load failure and low-memory mobile behavior; self-host required runtime assets if offline support is subsequently implemented.
