import {EXERCISES} from './exercises.ts';
import type {Equipment} from './model.ts';

const SHEETS:Record<string,readonly string[]>={
 a:['dumbbell-reverse-fly','dumbbell-romanian-deadlift','dumbbell-bench-press','dumbbell-split-squat','dumbbell-lateral-raise','dumbbell-curl','dumbbell-triceps-extension','dumbbell-glute-bridge'],
 b:['chair-squat','wall-push-up','standing-calf-raise','dumbbell-goblet-squat','dumbbell-floor-press','dumbbell-row','dumbbell-shoulder-press','kettlebell-deadlift'],
 c:['kettlebell-goblet-squat','barbell-deadlift','barbell-curl','cable-seated-row','cable-rope-pressdown','cable-curl','machine-leg-press','machine-chest-press'],
 d:['machine-leg-extension','machine-seated-leg-curl','machine-lat-pulldown','band-pull-apart','band-side-step','smith-squat','trap-bar-deadlift','suspension-row'],
};
export type WorkoutCharacter='mochi'|'chonk';
export const EXERCISE_ILLUSTRATIONS=Object.fromEntries(Object.values(SHEETS).flat().map((id,index)=>[id,{character:(index%2?'chonk':'mochi') as WorkoutCharacter}]));
export function exerciseIllustration(id:string|undefined,equipment?:Equipment,character?:WorkoutCharacter){
 const exercise=EXERCISES.find(e=>e.id===id);
 if(!exercise||(equipment&&equipment!==exercise.equipment))return undefined;
 const selected=character??EXERCISE_ILLUSTRATIONS[exercise.id]?.character;
 return selected?{src:`/exercise-hamsters/${selected}/${exercise.id}.webp`,character:selected}:undefined;
}
