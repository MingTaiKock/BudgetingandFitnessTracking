# Mochi & Chonk artwork placements — 11 October 2026

Reused the existing generated artwork throughout the app. No replacement characters or new generated art were introduced. Mochi remains the small gray hamster; Chonk remains the larger brown hamster.

| Page or moment | Artwork now used |
| --- | --- |
| Today | Mochi with her strawberry in the garden; Chonk with a stopwatch in the coach message; Chonk's water bottle at hydration; pajama Mochi beside rest |
| My budget | Calculator-and-notebook Chonk beside category planning; coin-jar Mochi beside savings goals |
| My fitness | Stopwatch Chonk beside the movement message; stretching Mochi and coach Chonk on routine cards |
| Guided workout | Matching equipment drawings for supported library exercises; towel Mochi and water-bottle Chonk during timed rests; smiling Mochi and medal Chonk after finishing an exercise |
| Workout recap | Smiling Mochi and medal Chonk |
| My journey | Gardening Chonk and telescope Mochi in the existing garden; purchased garden items remain visible |
| Settings | Heart-drawing Mochi and reading Chonk |
| Personal setup | Welcoming poses, saving/planning poses during budget setup, and stretching/coaching poses during routine setup |
| Sidebar | Chonk's pose follows Today, Budget, Fitness, Journey, or Settings |
| Character page | Updated motion preview and a 31-pose gallery: everyday moments, movement/rest/celebration, and gym buddies |

Small profile avatars keep the source portrait because it remains readable at that size. Existing budget records, workouts, schedules, rewards, and backups are unchanged.

## Asset handling

`src/hamsterArtwork.ts` is the single placement manifest. `HamsterArt.tsx` displays selected areas of the original transparent sheets using SVG viewports. This preserves the original pixels and does not redraw or alter the source files. The source PNGs remain in `output/characters`; Vite emits them as versioned assets in production.

Thirteen sheets supply 31 selected poses. All selected viewports are inside the corresponding 1536 × 1024 source dimensions. The full sheet assets total approximately 27.3 MB across all collections; each sheet is reusable/cached, and only the selected gallery collection is mounted. Per-pose optimized exports remain a potential performance improvement before a hosted phone release.

Equipment drawings are companions, not exercise-form instructions. Matching uses known library IDs. Unsupported/custom exercises keep general coach/stretching poses rather than an unrelated machine illustration.

## Verification

The TypeScript and production build pass. The Impeccable source scan reported no findings. All 31 viewport bounds were checked against their source PNG dimensions. Source review covered Today, Budget, Fitness, Journey, Settings, setup, the character gallery, and the workout/recap flows.

The browser automation inventory did not expose the user's open tab. No fresh browser screenshots or complete interactive walkthrough are claimed. Refresh the live app and open **Meet the characters** to review the new collection.
