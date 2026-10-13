import { routineSchema, workoutSchema, stateSchema, sessionSchema, type Routine, type Workout, type WorkoutSession, type State } from './model.ts';
import { dateKey } from './dates.ts';
import { exerciseToRoutine } from './exercises.ts';
export type CompletedSet={exerciseIndex:number,reps:number,kg:number};
export function startSession(routine:Routine,now=Date.now()):WorkoutSession {
  return sessionSchema.parse({id:crypto.randomUUID(),routine:structuredClone(routine),date:dateKey(),startedAt:now,index:0,entries:[],reps:String(routine.exercises[0].repMin),kg:String(routine.exercises[0].plannedKg??0),minutes:null,restSeconds:60,restEndsAt:null});
}
export function selectExercise(session:WorkoutSession,index:number):WorkoutSession {
  const exercise=session.routine.exercises[index];
  if(!exercise)throw new Error('Choose a valid exercise.');
  const inputs:Record<string,{reps:string,kg:string}>={...session.inputs,[session.index]:{reps:session.reps,kg:session.kg}};
  const last=session.entries.filter(e=>e.exerciseIndex===index).at(-1);
  const values=inputs[index]??{reps:String(last?.reps??exercise.repMin),kg:String(last?.kg??exercise.plannedKg??0)};
  return sessionSchema.parse({...session,index,inputs,...values});
}
export function finishSession(state:State,minutes:number):State {
  const session=state.activeWorkout;
  if(!session)throw new Error('There is no workout to finish.');
  if(state.workouts.some(w=>w.id===session.id))throw new Error('This workout is already in your diary.');
  sessionSchema.parse(session);
  const workout={...routineWorkout(session.routine,session.entries,minutes,session.date),id:session.id};
  return stateSchema.parse({...state,activeWorkout:null,workouts:[...state.workouts,workout]});
}
export function starterRoutines():Routine[] {return [
  {id:'starter-paws',name:'Mochi’s first little steps',description:'An editable example for a gentle full-body session. Choose comfortable movements and loads.',exercises:[exerciseToRoutine('chair-squat'),exerciseToRoutine('wall-push-up'),{...exerciseToRoutine('standing-calf-raise'),repMin:10,repMax:15}]},
  {id:'starter-chonk',name:'Chonk’s steady strength',description:'An editable gym example. Adjust the exercise selection, load, and rep ranges to your ability.',exercises:[{...exerciseToRoutine('dumbbell-goblet-squat'),sets:3},{...exerciseToRoutine('cable-seated-row'),sets:3,repMin:10},{...exerciseToRoutine('dumbbell-floor-press'),sets:3}]},
];}
export function routineWorkout(routine:Routine,entries:CompletedSet[],minutes:number,date=dateKey()):Workout {
  routineSchema.parse(routine);
  if(!entries.length)throw new Error('Complete at least one set before logging this session.');
  const groups=new Map<string,Workout['sets'][number]>(),counts=new Map<number,number>();
  for(const entry of entries){
    const exercise=routine.exercises[entry.exerciseIndex];
    if(!Number.isInteger(entry.exerciseIndex)||!exercise)throw new Error('Choose a valid exercise.');
    const count=(counts.get(entry.exerciseIndex)??0)+1;counts.set(entry.exerciseIndex,count);
    if(count>exercise.sets)throw new Error('This exercise already has all its planned sets.');
    const key=`${entry.exerciseIndex}:${entry.reps}:${entry.kg}`;
    const previous=groups.get(key);
    groups.set(key,{exercise:exercise.name,exerciseId:exercise.exerciseId,equipment:exercise.equipment,sets:(previous?.sets??0)+1,reps:entry.reps,kg:entry.kg});
  }
  const total=routine.exercises.reduce((a,e)=>a+e.sets,0);
  return workoutSchema.parse({id:crypto.randomUUID(),routineId:routine.id,date,activity:routine.name,minutes,notes:`Routine: ${routine.name}. Completed ${entries.length}/${total} sets.`,sets:[...groups.values()]});
}
export function removeRoutine(state:State,id:string):State {
  return stateSchema.parse({...state,routines:state.routines.filter(r=>r.id!==id),schedule:state.schedule.filter(p=>p.kind==='rest'||p.routineId!==id)});
}
export function planForDay(state:State,date=dateKey()):State['schedule'][number]|undefined {
  const day=(new Date(`${date}T12:00:00`).getDay()+6)%7;
  return state.schedule.find(p=>p.day===day);
}
export function reorderExercises(exercises:Routine['exercises'],from:number,to:number):Routine['exercises'] {
  if(!Number.isInteger(from)||!Number.isInteger(to)||!exercises[from]||!exercises[to])throw new Error('Choose a valid exercise position.');
  const next=[...exercises];const [moved]=next.splice(from,1);next.splice(to,0,moved);return next;
}
