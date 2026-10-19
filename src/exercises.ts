import type { Equipment, Routine } from './model.ts';

export const EQUIPMENT_LABELS:Record<Equipment,string>={bodyweight:'Bodyweight',dumbbell:'Dumbbells',kettlebell:'Kettlebell',barbell:'Barbell',cable:'Cable station',machine:'Weight machine',band:'Resistance band',smith:'Smith machine','trap-bar':'Trap bar',suspension:'Suspension straps'};
type Exercise={id:string,name:string,equipment:Equipment,cue:string};
export const EXERCISES:Exercise[]=[
  {id:'dumbbell-reverse-fly',name:'Dumbbell reverse fly',equipment:'dumbbell',cue:'Use light weights, a supported or steady hinged position, and a small controlled arc without shrugging.'},
  {id:'dumbbell-romanian-deadlift',name:'Dumbbell Romanian deadlift',equipment:'dumbbell',cue:'Hinge at your hips with soft knees. Keep weights close and stop within a controlled range.'},
  {id:'dumbbell-bench-press',name:'Dumbbell bench press',equipment:'dumbbell',cue:'Use a stable bench, keep feet planted and lower with control.'},
  {id:'dumbbell-split-squat',name:'Dumbbell split squat',equipment:'dumbbell',cue:'Use a comfortable staggered stance and stable support. Reps are per side.'},
  {id:'dumbbell-lateral-raise',name:'Dumbbell lateral raise',equipment:'dumbbell',cue:'Choose light weights and raise without shrugging or swinging.'},
  {id:'dumbbell-curl',name:'Dumbbell curl',equipment:'dumbbell',cue:'Keep upper arms steady and avoid swinging.'},
  {id:'dumbbell-triceps-extension',name:'Dumbbell triceps extension',equipment:'dumbbell',cue:'Use a comfortable shoulder position and control the weight through a pain-free range.'},
  {id:'dumbbell-glute-bridge',name:'Dumbbell glute bridge',equipment:'dumbbell',cue:'Rest the weight securely across your hips. Lift with control without arching your back.'},
  {id:'chair-squat',name:'Chair squat',equipment:'bodyweight',cue:'Use a sturdy chair and a comfortable range.'},
  {id:'wall-push-up',name:'Wall push-up',equipment:'bodyweight',cue:'Use a stable wall and keep each rep controlled.'},
  {id:'standing-calf-raise',name:'Standing calf raise',equipment:'bodyweight',cue:'Use stable support if needed. Rise and lower slowly.'},
  {id:'dumbbell-goblet-squat',name:'Dumbbell goblet squat',equipment:'dumbbell',cue:'Keep the dumbbell close and move at your own pace.'},
  {id:'dumbbell-floor-press',name:'Dumbbell floor press',equipment:'dumbbell',cue:'Choose comfortable dumbbells and lower with control.'},
  {id:'dumbbell-row',name:'Dumbbell row',equipment:'dumbbell',cue:'Use stable support and avoid swinging the weight.'},
  {id:'dumbbell-shoulder-press',name:'Dumbbell shoulder press',equipment:'dumbbell',cue:'Use a comfortable range and a load you can control.'},
  {id:'kettlebell-deadlift',name:'Kettlebell deadlift',equipment:'kettlebell',cue:'Keep the bell close and lift smoothly.'},
  {id:'kettlebell-goblet-squat',name:'Kettlebell goblet squat',equipment:'kettlebell',cue:'Hold the bell close. Choose a comfortable depth.'},
  {id:'barbell-deadlift',name:'Barbell deadlift',equipment:'barbell',cue:'Use a familiar setup and a controlled load.'},
  {id:'barbell-curl',name:'Barbell curl',equipment:'barbell',cue:'Keep your movement steady without swinging.'},
  {id:'cable-seated-row',name:'Seated cable row',equipment:'cable',cue:'Pull smoothly and return with control.'},
  {id:'cable-rope-pressdown',name:'Cable rope pressdown',equipment:'cable',cue:'Keep your upper arms steady and move smoothly.'},
  {id:'cable-curl',name:'Cable curl',equipment:'cable',cue:'Choose a comfortable handle and avoid swinging.'},
  {id:'machine-leg-press',name:'Machine leg press',equipment:'machine',cue:'Adjust the seat to fit. Use a comfortable range.'},
  {id:'machine-chest-press',name:'Machine chest press',equipment:'machine',cue:'Adjust the seat and choose a controlled load.'},
  {id:'machine-leg-extension',name:'Machine leg extension',equipment:'machine',cue:'Adjust the pads to fit and move without rushing.'},
  {id:'machine-seated-leg-curl',name:'Seated leg curl',equipment:'machine',cue:'Adjust the seat and pads before starting.'},
  {id:'machine-lat-pulldown',name:'Lat pulldown',equipment:'machine',cue:'Pull smoothly in front of you and return with control.'},
  {id:'band-pull-apart',name:'Band pull-apart',equipment:'band',cue:'Use a light band and a comfortable range.'},
  {id:'band-side-step',name:'Band side step',equipment:'band',cue:'Take small controlled steps. Count reps per side.'},
  {id:'smith-squat',name:'Smith machine squat',equipment:'smith',cue:'Set the safety stops and choose a familiar setup.'},
  {id:'trap-bar-deadlift',name:'Trap bar deadlift',equipment:'trap-bar',cue:'Use a comfortable handle height and controlled load.'},
  {id:'suspension-row',name:'Suspension row',equipment:'suspension',cue:'Check the anchor is secure. Adjust your angle for comfort.'},
];
export function searchExercises(query:string,equipment:Equipment|'all'='all'):Exercise[] {
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return EXERCISES.filter(e=>(equipment==='all'||e.equipment===equipment)&&words.every(word=>`${e.name} ${EQUIPMENT_LABELS[e.equipment]}`.toLowerCase().includes(word)));
}
export function exerciseToRoutine(id:string):Routine['exercises'][number] {
  const exercise=EXERCISES.find(e=>e.id===id);
  if(!exercise)throw new Error('Choose an exercise from the library.');
  return {exerciseId:exercise.id,name:exercise.name,equipment:exercise.equipment,sets:2,repMin:8,repMax:12,cue:exercise.cue};
}
