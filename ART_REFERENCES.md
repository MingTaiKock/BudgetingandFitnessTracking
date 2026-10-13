# Mochi and Chonk: source frame review

The chosen source is [LycheeGelly's “Hampters <3” animation](https://www.instagram.com/p/C7nU9AloIn9/) on the [artist's profile](https://www.instagram.com/lycheegelly.art/). Chonk is the larger brown hamster and Mochi is the smaller gray hamster. The earlier cat and hand-drawn SVG versions have been removed from the app.

I inspected the 8.3-second video at several points rather than treating its opening still as the only pose:

| Approximate time | Frame content | Design use |
| --- | --- | --- |
| 0–1.5 s | Both hamsters lie side by side, with Chonk rounder and taller and Mochi low and elongated. | Source for the in-app paired character cutouts. |
| 1.8–2.3 s | Chonk faces forward with tiny paws, orange cheeks, and sparkles. | Reference for future expressive states. |
| 2.6–4 s | Mochi faces forward with wide glossy eyes, pink cheeks, and flowers. | Reference for future expressive states. |
| 5–8.3 s | The front-facing poses alternate before the pair returns. | Motion and timing reference. |

`assets/references/hamsters-cutouts.png` is a transparent, AI-processed reference derived from the video, not an original layered artwork export. `public/characters/chonk.png` and `public/characters/mochi.png` are crops of that sheet used in this local prototype. `scripts/crop-source-hamsters.ps1` records the crop coordinates. Video frames were inspected visually at sampled timestamps. The attempted browser exports did not produce saved front-facing assets, and a subsequent data-URL export attempt was rejected by browser security; this does not establish a blanket Instagram export restriction. Front-facing poses are not represented as local assets. This is a private prototype using the artist's imagery; obtain the artist's permission before distributing or publishing it.

## Motion in the prototype

The 8 October follow-up is recorded in [LYCHEEGELLY_ART_RESEARCH.md](LYCHEEGELLY_ART_RESEARCH.md): one additional original illustration was downloaded, recent post covers were reviewed, and separate generated Mochi/Chonk pose sheets were saved without replacing the existing character assets.

The detailed next-stage plan and tool setup are in [ANIMATION_PLAN.md](ANIMATION_PLAN.md) and [ANIMATION_TOOLS.md](ANIMATION_TOOLS.md).

The app animates these cutouts with small CSS transforms: a slow breath at rest, a squash-and-hop cheer after each completed workout set, and a nuzzle in the character preview. No new facial features are generated. `output/characters/mochi-chonk-nuzzle.gif` is a shareable preview made from the same two cutouts. A future pose-by-pose animation would need the artist's original frames or a licensed export; the current motion is intentionally limited to the available image assets.
