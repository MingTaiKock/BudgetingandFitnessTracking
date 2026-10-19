import {exerciseToRoutine} from './exercises.ts';
import {routineSchema,type Routine,type State} from './model.ts';

export const SPLITS=[
 {id:'full',name:'Full body',days:3,why:'A practical fit for three days or a variable week: each session includes upper and lower body.',rhythm:'Try Monday, Wednesday and Friday, with recovery days between sessions.'},
 {id:'upper-lower',name:'Upper / lower',days:4,why:'A practical fit for four days: upper and lower sessions repeat across the week.',rhythm:'Try upper Monday, lower Tuesday, upper Thursday and lower Friday.'},
 {id:'ppl',name:'Push / pull / legs',days:3,why:'Focused sessions. At three days, each area gets one main session; full body spreads work more often. This is an alternative, not the default recommendation.',rhythm:'Try push Monday, pull Wednesday and legs Friday. Avoid doubling the schedule suddenly.'},
 {id:'body-part',name:'Body-part split',days:4,why:'Focused chest, back, legs and shoulders/arms days. Lower frequency per area makes this a preference-based alternative for a four-day week.',rhythm:'Try chest Monday, back Tuesday, legs Thursday and shoulders/arms Saturday.'},
 {id:'hybrid',name:'Upper / lower / full body',days:3,why:'Three sessions combine focused upper and lower days with a whole-body day.',rhythm:'Try upper Monday, lower Wednesday and full body Friday.'},
] as const;
export type Split=typeof SPLITS[number]['id'];
export type TrainingPlace='gym'|'home';

export function presetRoutines(split:Split,place:TrainingPlace):Routine[]{
 const gym=place==='gym';
 const squat=gym?'machine-leg-press':'dumbbell-goblet-squat',press=gym?'machine-chest-press':'dumbbell-bench-press';
 const row=gym?'cable-seated-row':'dumbbell-row',pull=gym?'machine-lat-pulldown':'dumbbell-reverse-fly';
 const hinge='dumbbell-romanian-deadlift',legCurl=gym?'machine-seated-leg-curl':'dumbbell-glute-bridge',shoulder='dumbbell-shoulder-press',lateral='dumbbell-lateral-raise',curl='dumbbell-curl',triceps=gym?'cable-rope-pressdown':'dumbbell-triceps-extension',calf='standing-calf-raise',single='dumbbell-split-squat';
 const fullA=[squat,press,row,hinge,lateral],fullB=[single,pull,shoulder,legCurl,calf],fullC=[squat,press,row,hinge,curl];
 const upperA=[press,row,shoulder,pull,triceps],upperB=[press,pull,lateral,row,curl],lowerA=[squat,hinge,single,legCurl,calf],lowerB=[single,legCurl,squat,hinge,calf];
 const sessions:Record<Split,[string,string[]][]>={full:[['Full body A',fullA],['Full body B',fullB],['Full body C',fullC]],'upper-lower':[['Upper A',upperA],['Lower A',lowerA],['Upper B',upperB],['Lower B',lowerB]],ppl:[['Push',[press,shoulder,lateral,triceps]],['Pull',[pull,row,curl]],['Legs',lowerA]],'body-part':[['Chest',[press,'dumbbell-floor-press',triceps]],['Back',[row,pull,curl]],['Legs',lowerA],['Shoulders & arms',[shoulder,lateral,curl,triceps]]],hybrid:[['Upper',upperA],['Lower',lowerA],['Full body',fullA]]};
 return sessions[split].map(([name,ids],index)=>routineSchema.parse({
  id:`preset-v1-${split}-${place}-${index}`,name:`${name} · ${gym?'gym':'home'}`,
  description:'Editable starting point. Warm up first. Choose a controlled load; leave about 2 reps in reserve. Rest 1–3 minutes as needed.',
  exercises:[...new Set(ids)].map(id=>({...exerciseToRoutine(id),sets:[lateral,curl,triceps,calf,'dumbbell-reverse-fly'].includes(id)?2:3,repMin:[lateral,curl,triceps,calf,'dumbbell-reverse-fly'].includes(id)?10:8,repMax:[lateral,curl,triceps,calf,'dumbbell-reverse-fly'].includes(id)?15:12})),
 }));
}
export function installPreset(state:State,split:Split,place:TrainingPlace):State{
 const missing=presetRoutines(split,place).filter(r=>!state.routines.some(existing=>existing.id===r.id));
 if(state.routines.length+missing.length>50)throw new Error('Not enough room in the 50-routine library.');
 return {...state,routines:[...state.routines,...missing]};
}
