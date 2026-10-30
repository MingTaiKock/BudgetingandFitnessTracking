# Mochi and Chonk: character consistency

Persistent user requirement, recorded 24 October 2026: all workout and reward hamsters must remain consistent with the original Habitat hamsters. Keep them short, cute and fluffy. This applies to all future work in this project.

## Reference hierarchy

1. **Canonical character design:** `public/prototype/habitat-clean.png`, the actual Habitat artwork used by `src/features/HabitatHome.tsx`. Inspect the cream and golden pair at the picnic blanket.
2. **Original design context:** `design/web` in the original `C:/Users/KOCK MING TAI/project/Claude_Code/budgeting-and-fitness-tracking` tree, especially `04-character-motivation-habitat.png` and `supporting/10-my-fitness.png`.
3. **Approved seated leg-curl pose:** Chonk in `design/web/revised/exercise-hamsters/mochi-chonk-workout-set/chonk-4.png`, top row, second cell; approved Mochi counterpart in that directory's `mochi-seated-leg-curl-approved.png`. These establish this particular pose, not a replacement for Habitat's overall character design.

Older lying-leg-curl and elongated Mochi iterations are superseded. Do not use them as references or restore them through export scripts. The user returned to the seated Chonk reference and approved the matching cream Mochi.

## Required visual traits

- Mochi: warm cream fur, pale cheeks and belly, small pink nose, ears and paws.
- Chonk: golden-orange fur, cream cheeks and belly, small pink features. Habitat's headband is an optional contextual accessory; it must not redefine the face.
- Compact rounded body, soft cheek volume, barely visible neck, short natural limbs. No human torso, muscular anatomy or lanky silhouette.
- Small glossy dark eyes proportioned like Habitat, while preserving each source pose's emotion and expression. Intentional closed happy eyes, open smiles, excitement, calm and exertion must remain. Habitat is the character identity reference, not a requirement for a neutral expression. Adjust facial anatomy without flattening the emotion.
- Fine soft fluffy fur with warm dimensional shading. Avoid flat vector treatment, hard plastic surfaces, harsh outlines or changing rendering style between characters.
- Equipment scales to the hamster. Preserve believable contact with seats, handles and rollers. Do not stretch the hamster to reach equipment.
- Exactly two forelimbs and two hindlimbs; natural occlusion is preferable to forcing all paws or palms into view. Feet may be hidden behind a roller. No extra ears or limbs.

## Generation and acceptance process

View and attach the canonical image and the closest approved character/pose reference before generation. Human exercise photos inform mechanics only, never hamster anatomy or art style. Change the requested pose or defect while preserving character identity.

Compare the result side by side with Habitat, then with the other character doing the same exercise. Review at full size and at the actual small UI size. Reject identity drift, stretched proportions, extra anatomy, floating grips, incorrect machine contact or a different exercise. Keep approved originals and clearly name replacements. Update the individual asset, runtime asset and gallery together.

## Audit findings — 24 October 2026

The actual Habitat artwork and representative workout sheets (`mochi-1.png`, `chonk-4.png`) were visually compared. The set shares cream/golden colors and fluffy rendering, but is **not an exact character-style match**: Mochi's sheet uses larger eyes and ears, while Chonk's sheet repeatedly uses an exaggerated open-mouth grin. Some standing and overhead poses also lengthen the silhouette relative to Habitat.

These differences remain an artwork refinement backlog; do not describe the whole collection as fully normalized. Preserve the explicitly approved seated leg-curl pose. Future targeted replacements should reduce facial exaggeration and retain compact silhouettes, using Habitat directly rather than recursively referencing generated workout sheets.

## User correction — preserve emotion

The user explicitly clarified that the emotion of each image must be preserved. This supersedes any earlier recommendation to soften every smile or eliminate open mouths. Rework proportions, fur, rendering and identity while keeping the source image's emotional intent and expressive cues. Use both Habitat and the original individual exercise image as references; the approved curl pair is an identity reference, not an expression template for every exercise. Review expression preservation separately from anatomy and exercise mechanics.

## Rebuild integrated — 29 October 2026

The runtime workout collection now uses 31 regenerated individual poses per character plus the approved seated leg curl (64 WebP assets). The earlier sheet audit above describes the superseded workout artwork. Regeneration used Habitat and original pose/expression references. Bench press, floor press, glute bridge and lateral raise received additional corrections. Individual PNGs are exported to the user's requested `05-workout/revised/mochi` and `chonk` collection folders.

New artwork was reviewed at source size and representative routine/session placements at mobile and desktop sizes. These remain companion illustrations, not anatomical exercise diagrams. Continue to check identity, contact with equipment and emotional continuity on every future replacement; do not infer approval for new generations from this integration.
