# Mochi & Chonk motion sample

Six-second looping Rive sample using the accepted PNG artwork. Mochi is the small gray hamster on the right; Chonk is the brown hamster on the left.

Sequence: a quiet breath, Mochi's small hop, Chonk's delayed approving nod, a gentle paired lean with a heart, then return to the starting pose.

This is a **body-motion and timing study**. The images remain whole cutouts; independent eye blinks and paw movement are not implemented. It is not the articulated rig described in `../../ANIMATION_PLAN.md` and has not replaced the production app's CSS animation.

## Source and playback

- `scene.rml`: image assets, eased transform keyframes and looping state machine.
- `rive.yaml`: project configuration.
- `build/mochi-chonk-sample.riv`: local Rive build.
- `../../output/characters/rive-sample/mochi-chonk-sample.gif`: looping preview.
- `../../output/characters/rive-sample/mochi-chonk-sample.mp4`: higher-quality video.
- `../../output/characters/rive-sample/contact-sheet.png`: six sampled poses.

Regenerate with `rtk proxy powershell -NoProfile -ExecutionPolicy Bypass -File scripts/render-rive-sample.ps1` from the application root. This takes 108 headless Rive screenshots at 18 fps, then uses FFmpeg only to encode them. The source timeline is authored at 30 fps and lasts six seconds. No account or cloud upload is involved.

Rive verify completed with zero errors and warnings; inspect reported no problems. The source PNGs are referenced from `public/characters/` and are embedded in the local `.riv`. This sample does not validate browser runtime compatibility or mobile performance.
