# Mochi & Chonk animation plan

Status: tool setup complete; character asset preparation and Rive rig not yet implemented. Updated 8 October 2026. Companion tool research: [ANIMATION_TOOLS.md](ANIMATION_TOOLS.md).

A six-second Rive cutout-motion study is now available in [animation/sample](animation/sample/README.md). It demonstrates timing, a small hop, a delayed coach nod and paired lean; separate face/paw layers and the articulated rig remain future work.

## 1. Intended result

Mochi is the small gray hamster; Chonk is the larger warm brown hamster. Preserve the accepted LycheeGelly-derived appearance: soft painted texture, irregular dark-brown outlines, cream undersides, tiny paws, round cheeks and low, soft bodies. The latest hamster direction supersedes the earlier cat and pixel-art concepts.

Mochi moves with small, shy anticipation followed by a delighted reaction. Chonk is steadier and slightly slower: a reassuring coach who nods, counts alongside her and celebrates effort. His encouragement stays warm. Missed targets, rest days and budget overspending never trigger anger, shame or sad punishment animations.

The finished system must react to actual app events, preserve each character's identity between frames, and work at the small sizes used beside workout sets. Deliver editable source and reusable interactive assets as well as preview clips.

## 2. What we have and what we still need

| Asset | Current evidence | Consequence |
| --- | --- | --- |
| `assets/references/hamsters-cutouts.png` | Transparent, AI-processed reference sheet derived from the chosen video opening frame; 2172×724 | Accepted visual baseline, not the artist's original layered file or a pixel-exact source export. |
| `public/characters/mochi.png`, `chonk.png` | Individual crops with face/body/paws baked together | Good fallback. Independent blinking or paw movement requires separation and reconstruction underneath. |
| Source video frame observations | Several timestamps across the ~8.3-second video were inspected; see `ART_REFERENCES.md` | This was a sampled visual review, not exhaustive every-frame analysis. Front-facing expressions have not been saved locally. |
| CSS motion and GIF | Whole-image breathing, hops and nuzzle translations | Existing proof of placement and interaction; not the final articulated animation. |
| Rive starter check | Build, verify, inspect and headless render succeeded | Toolchain works locally; no character rig has been built yet. |

Keep original reference files immutable. Store new prepared artwork separately. If an accessible source video or original artwork is supplied, use FFmpeg to make a timestamped contact sheet, review changes frame by frame, and record which poses genuinely exist. Do not infer unseen front-facing anatomy from a side cutout. Existing browser export attempts did not produce those frames; do not treat their availability as settled.

## 3. Art preparation before animation

Create one small model sheet first: accepted neutral pair, Mochi neutral/blink/cheer and Chonk neutral/nod/encouragement. Keep the source pair's relative scale and ground line. Compare at actual display sizes, not only zoomed-in artwork. Added facial variants must keep the existing eye positions, cheek colors and outline character.

For each character, prepare a layered working file plus transparent PNG exports:

| Layer group | Required preparation |
| --- | --- |
| Body base | Clean paint underneath eyes and moving paws so motion does not expose duplicated features or holes. Retain original texture and silhouette. |
| Face | Eyes open, half-closed and closed; neutral mouth and restrained smile; nose and cheeks. Group these together so they track the face without stretching. |
| Ears | Separate only where the current pose permits a clean seam. Small rotation, no large rubbery flapping. |
| Paws | Extract visible paws; restore the small hidden body area underneath. Avoid inventing a standing full-body pose for the first pilot. |
| Extras | Separate the existing accent marks, optional bow, tiny heart/sparkle and contact shadow. The source marks should not remain permanently baked into every idle pose. |

Suggested paths: `animation/art/mochi/`, `animation/art/chonk/`, `animation/references/`, `animation/rig/`, and `output/characters/reviews/`. Keep a manifest describing source, crop, changes and layer dimensions. Every exported part shares the same registration origin; keep transparent padding until alignment is verified.

This stage is artwork editing, not something a rigging tool automatically solves. Prefer careful layer preparation and a few consistent expression drawings. If source art cannot support a proposed movement cleanly, narrow the movement or prepare a reviewed replacement pose before proceeding.

## 4. Rig design

Use Rive raster images with a small bone hierarchy. Proposed semantic parts: root → body → face, with ears and visible paws attached to suitable local pivots. These are design names; resolve exact RML types and properties through the installed CLI schema.

- Ground the root on the resting contact line. Body breathing changes the upper contour while paws stay planted.
- Use a low-complexity mesh on the body only where deformation helps. Begin with a 1–2% breath and cap celebratory squash near 4%; tune by visual comparison.
- Keep eyes, nose, mouth and cheeks on a stable face group. Do not mesh-stretch the facial features or thicken/thin the outlines to simulate blinking.
- Blink by switching consistent eye drawings. Rotate a separated paw about its attachment point, with enough overlap to conceal the seam.
- Limit head/face turn to what the existing view supports. A true front view is a separate pose, not a large rotation of a flat side image.
- Use separate timing for the two hamsters, so their reactions do not look mechanically synchronized.
- Start with declarative timelines and state machines, without embedded scripting. Validate production export/runtime compatibility during the pilot.

## 5. Motion library

Durations are initial authoring targets, not locked measurements. Author at 30 fps; allow the runtime to interpolate display frames. Movements should remain legible at roughly 80–160 px character width.

| Clip | Character performance | Duration / repetition | App trigger |
| --- | --- | --- | --- |
| Idle | Mochi softly breathes; Chonk breathes more slowly, with a subtle ear settle | 3.2 s / 4 s seamless loops | Neutral screen state |
| Blink | Close, brief hold, reopen; stagger characters | 0.17–0.23 s; occasional, not every breath | Idle variation; deterministic staggered schedule initially |
| Ready | Chonk looks attentive and raises one small paw; Mochi perks up | 0.9–1.2 s once | User starts a workout or deliberately advances exercise |
| Encouragement | Chonk gives a small nod; Mochi makes a restrained paw lift | 1.2 s once | First explicit prompt for the active exercise |
| Set complete | Mochi anticipates, gives a little paw cheer and settles; Chonk nods after her | 1.6 s once | Newly completed set, regardless of target attainment |
| Rest | Relaxed posture and slow breathing; no hopping | 4 s loop | Explicit rest state, when rest UI exists |
| Workout complete | Mochi perk/cheer, Chonk approving bounce, one brief heart/sparkle | 2.2–2.6 s once | Successful save of a completed session |
| Savings progress | Mochi delighted blink; Chonk small nod | 1.4 s once | Successful new positive savings contribution |
| Goal reached | Larger but restrained paired celebration | 2.4 s once | First crossing of a savings target |
| Nuzzle | Tiny look/lean toward each other, contact hold, soft return | 2.8 s once; manual replay | Character preview or occasional milestone reward |

Expense entries get neutral acknowledgment, not automatic celebration of spending. Failed saves and imported historical data do not produce celebration events. Avoid constant idle sparkles and repeated attention grabbing beside a live exercise.

### First pilot: Mochi's 1.6-second set cheer

| Time / frame at 30 fps | Pose and purpose |
| --- | --- |
| 0.00 s / 0 | Exact neutral silhouette; planted body and relaxed paw. |
| 0.13 s / 4 | Tiny anticipation: body lowers about 2%, paw prepares. |
| 0.33 s / 10 | Body perks up, face stays registered; paw reaches the cheerful pose. Keep body close to the ground. |
| 0.50–0.70 s / 15–21 | Hold the readable expression; one gentle paw pulse. |
| 1.00 s / 30 | Paw returns, body settles with a very small overshoot. |
| 1.60 s / 48 | Match neutral exactly; blend into idle without a snap. |

Render frames 0, 4, 10, 15, 21, 30 and 48 into a contact sheet, plus a transparent preview and an in-app-size preview. Only expand the library after the pilot preserves the accepted appearance throughout the motion. For Chonk, offset the response by roughly 0.15–0.25 s and make the nod more grounded than Mochi's perk.

## 6. Workout and budget integration

Use a shared character controller behind the existing character components. Planned placements: workout companion pair, Today/garden, character preview and achievement feedback. A single paired scene is preferred in the workout UI to avoid two separate WebGL canvases.

Proposed app interface (not yet implemented):

```ts
type CompanionEvent =
  | { id: string; kind: 'exercise-ready'; exerciseName: string; repMin: number; repMax: number }
  | { id: string; kind: 'set-completed'; exerciseId: string; setId: string }
  | { id: string; kind: 'workout-saved'; sessionId: string }
  | { id: string; kind: 'savings-added'; contributionId: string }
  | { id: string; kind: 'goal-reached'; goalId: string };
type CompanionMode = 'idle' | 'working' | 'rest';
```

Issue event IDs from successful user actions, not render counts. Keep a bounded consumed-ID set at the app/controller level and start with an empty transient event queue on page load. Do not generate celebrations by scanning restored records. Use distinct completion-action IDs for later redo actions while preventing duplicate dispatch of the same action.

Priority: workout/goal completion → set celebration → exercise-ready/encouragement → mode idle. Show one celebration at a time; coalesce rapid repeated set taps instead of building a long queue. After completion, return to the current mode. Rest mode suppresses idle attention prompts but does not erase a celebration already earned by the completed set. Hidden-tab events update data normally; discard expired transient motion on return rather than replaying a backlog.

Examples of text beside the characters:

- Before a set: “Squats · 8–12 reps. You've got this, Mochi.”
- After any logged set: “Set saved. Nice effort!”
- Rest: “Take your time. Start when you're ready.”
- Savings contribution: “A little closer to your goal.”

Rep ranges come from the selected routine. Show the exercise name, target range, set number and actual reps in accessible HTML. The hamster gestures encourage; they are not exercise-form demonstrations or a metronome that pushes the user to match an animation's speed. Automatic per-rep reactions require an explicit rep input mechanism and are outside this phase.

## 7. Implementation sequence and deliverables

| Phase | Work | Evidence required before continuing |
| --- | --- | --- |
| 0 — Tools, complete | Install pinned Rive locally; inspect docs; run starter build and screenshot | Recorded in `ANIMATION_TOOLS.md`. |
| 1 — Prepare art | Model sheet, cleaned body plates, face variants and visible paw layers for existing poses | Aligned contact sheet matches accepted reference at 80/160 px; no seams or duplicate features. |
| 2 — Prove Mochi | Neutral, breath, blink and one set cheer; minimal Rive rig | Editable RML/layers, `.riv`, sampled frames, real browser runtime/export trial. Resolve splash/login requirements here. |
| 3 — Add Chonk and pair | Chonk idle/nod/cheer; paired layout; nuzzle; remaining events | Both identities and relative scale preserved; no overlap/clipping during transitions. |
| 4 — Integrate | Runtime behind character components; event controller; routine and savings hookups; static fallback | Events fire exactly once on the intended successful actions; no replay on load/undo/navigation. |
| 5 — Validate | Actual Android/iPhone checks, reduced motion, loading failure, backgrounding, small layouts and sustained playback | Results recorded with devices, versions and measurements; failures fixed or fallback retained. |

Do not replace every production character placement during the first experiment. Prove one side-by-side preview first, then switch the workout placement, then the rest of the app. Preserve the current PNGs throughout.

Final deliverables: layered art sources, exported PNG parts and provenance manifest; Rive/RML source with named clips and controls; versioned `.riv` output; preview contact sheets and clips; React integration and event tests; measured validation notes. A GIF alone is insufficient because it cannot respond to app state.

## 8. Acceptance criteria

**Visual:** Mochi stays visibly smaller and gray; Chonk stays brown and larger. Faces never drift, eye shapes remain consistent, no transparent halos or exposed seams, no cut-off paws/ears, and silhouettes return to neutral cleanly. Check light and dark backdrops and all intermediate frames. No large stretch, plastic smoothing or replacement generic hamster art.

**Interaction:** New set completion gets one cheer; undo gets none. Saving a partial workout does not claim the whole workout is complete. Repeated renders, failed saves, restoring a backup and reopening the app do not replay achievements. A genuine new completion action after an undo may receive its own event. Text and controls remain usable while an animation runs. Character preview supports deliberate replay and a pause control.

**Accessibility:** Honor `prefers-reduced-motion` and an in-app animation toggle with a meaningful static pose. Describe results in HTML; decorative canvas is hidden from assistive technology when adjacent text supplies the meaning. Avoid duplicate announcements. Pause offscreen/hidden-tab rendering and offer static fallback for unavailable WebGL or asset load failure.

**Performance:** Initial targets to measure, not claims: one active paired workout canvas; total first-load character assets near or below 1 MB compressed if texture quality permits; smooth playback without delaying set controls. Test 320/390 px layouts and ordinary mobile devices, avoid continuous GPU use when hidden, cap render density if needed, and measure transferred bytes, initialization time and dropped frames. Retain static mode if the runtime cost is unsuitable.

**Publication:** Resolve the artist's permission before distributing their imagery. Confirm Rive's actual production export and splash behavior on the chosen account. These do not prevent preparing a local rig, but must not be silently treated as completed release requirements.
