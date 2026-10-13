# LycheeGelly: expanded hamster reference and art study

Reviewed 8 October 2026. User direction: Mochi is the small gray hamster; Chonk is the larger brown hamster. Preserve the accepted artwork's character while expanding expressions and app situations.

## Sources actually inspected

The [artist's Instagram profile](https://www.instagram.com/lycheegelly.art/) identifies the artist as Heather and describes hamsters and other cute critters as subjects. I inspected the currently visible twelve-post grid and opened the two relevant posts below. This is a focused review, not a complete archive survey. Broad web searches did not produce reliable additional artist sources and were excluded.

| Source | Evidence and access | Useful visual information |
| --- | --- | --- |
| [Original paired hamster animation](https://www.instagram.com/p/C7nU9AloIn9/) | Previously sampled visually at multiple timestamps; accepted processed cutouts are already local. No fresh exhaustive frame extraction in this pass. | Larger warm brown partner, small low gray partner, cream undersides, pink/orange cheeks, tiny paws and expressive silhouette. |
| [September 23 lemon reel](https://www.instagram.com/lycheegelly.art/reel/Ddp-H5SuLEn/) | Paired upright poses visible in the profile cover; opened post and verified lemon-related caption. The opened page exposed no video element, so motion and frame timing could not be inspected. | Cover shows both characters upright, tiny feet, compact forepaws and simple dot/line facial expressions. Treat this as a still reference only. |
| [August 13 sleepy hamster illustration](https://www.instagram.com/lycheegelly.art/p/Db_-tIrJ2SQ/) | Opened and downloaded the actual image through the browser's media download. Saved intact, including signature. | Very round cream belly, warm gray cap, little pink paws, closed eyes, curved smiling mouth, toast/crumb details and blue gingham background. |
| [September 9 resting hamster reel](https://www.instagram.com/lycheegelly.art/reel/DdFWldZphEl/) | Thumbnail inspected in the profile and related-post grid only; reel playback not inspected. | Low flattened resting silhouette; useful distinction from an upright ready pose. Do not infer a motion sequence from the thumbnail. |
| [Artist's shop](https://lycheegelly.etsy.com/) | Linked by the profile. Profile displayed a vacation-break notice; web-tool access to the shop failed. | No products, licenses or additional poses were inferred from an inaccessible shop. |

## What makes these characters recognizable

- Dark warm-brown, slightly irregular outlines instead of black geometric contours.
- Large soft bodies and very small ears/paws; the expression is carried by a few marks.
- Cream lower face/belly with warm gray or golden brown upper fur.
- Blush circles close to the muzzle, tiny pink nose, and simple dot/open-arc eyes.
- Low loaf poses communicate rest; sitting poses make paws readable for encouragement and holding objects.
- Small accent marks and very brief holds can communicate more than large continuous movement.

These are visual observations and design inferences. They are not claims about the artist's software or production process.

## Files saved in this pass

| File | Provenance and purpose |
| --- | --- |
| `assets/references/lycheegelly-2026-10-08/sleepy-source.jpg` | Downloaded original post image, 3500×3500. Reference only, signature retained. |
| `output/characters/pose-studies/mochi-poses-v1.png` | New generated transparent pose sheet, 1536×1024. Uses the accepted pair for identity and sleepy illustration for expression/shape reference. |
| `output/characters/pose-studies/chonk-poses-v1.png` | New generated transparent pose sheet, 1536×1024. Uses the accepted pair for identity. |
| `scripts/save-pose-studies.ps1` | Copies the generated outputs into the project and reports size/pixel-format and alpha samples. |

The generated sheets are new AI-created interpretations, not extracted original frames or artwork by Heather. They are versioned separately and have not replaced the app's accepted PNGs. The original downloads and generated source outputs are preserved.

## Eight generated poses

Each sheet uses a 2×2 arrangement, read left to right, top to bottom.

| Position | Mochi | Chonk | Intended app use |
| --- | --- | --- | --- |
| Top left | Attentive, paws resting together | Upright, attentive coach | Exercise ready / neutral companion |
| Top right | Closed happy eyes, shy paw cheer | Warm approving expression, raised paw | Completed set / encouragement |
| Bottom left | Sleeping gray loaf | Sleeping golden-brown loaf | Rest and quiet mode |
| Bottom right | Holding a golden savings coin | Holding a sage-green water bottle | Savings progress / hydration reminder |

Both images contain 32-bit RGBA data. Corner and gutter sample pixels had alpha 0; this confirms actual transparency at those points, not a painted checkerboard. It is not a full edge-quality audit. The image-generation viewer can display residual background RGB; compositing must honor alpha.

## Quality assessment and next animation work

The sheets keep the warm outlines, cream bellies, blush and tiny paws, and add clearer expressions than the initial flat side-pose cutouts. There are still differences to review: the new seated bodies are rounder/upright, some face spacing differs, and Chonk's pose heights vary. The accepted source pair remains the authority for identity and relative scale.

These sheets are **pose studies, not aligned animation frames**. Do not immediately cycle the four cells as a sprite loop: the changed views, size and positions would jump. First choose the best neutral and cheer silhouettes, then make intermediate drawings or prepare separate parts.

| Next loop | Required preparation | Intended sequence |
| --- | --- | --- |
| Mochi happy cheer | Align neutral and happy face; isolate front paw; add half-closed eye drawing | Neutral → anticipation → closed-eye paw lift → small hold → settle. About 1.6 s. |
| Chonk encouragement | Stable seated body; face/paw layers; small head pivot | Attentive → slight nod → paw encouragement → return. About 1.2 s. |
| Rest pair | Use loaf poses on a common ground line; remove or separately animate accent marks | Tiny body breath, staggered between partners. About 4 s. |
| Savings / hydration | Align held prop and paws; avoid rotating the whole character to imply arm action | Look at prop → happy expression → settle. About 1.4 s. |

The existing six-second Rive cutout-motion sample remains in `animation/sample/`; this pass adds new art and verified source material, not another completed articulated animation. See [ANIMATION_PLAN.md](ANIMATION_PLAN.md) for rigging and integration criteria. Public distribution of the artist's source imagery still requires permission; none was inferred from public availability.
