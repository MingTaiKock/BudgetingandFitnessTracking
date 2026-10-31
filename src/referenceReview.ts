import type {State,Equipment} from './model.ts';
import {exerciseIllustration} from './exerciseIllustrations.ts';
import {estimateFood} from './foodEstimate.ts';

const key=(value:string)=>value.trim().toLowerCase().replace(/\s+/g,' ');
export type ReferenceReview={version:1,exercises:{name:string,equipment:Equipment|null}[],meals:{name:string,portions:string[]}[]};

// Derived from saved records: no duplicate request store, background jobs or external calls.
// The export intentionally excludes dates, profile, loads, amounts and private notes.
export function buildReferenceReview(state:State):ReferenceReview{
 const exercises=new Map<string,ReferenceReview['exercises'][number]>();
 const addExercise=(name:string,exerciseId?:string,equipment?:Equipment)=>{
  if(exerciseIllustration(exerciseId,equipment))return;
  const identity=JSON.stringify([key(name),equipment??null]);
  if(!exercises.has(identity))exercises.set(identity,{name:name.trim(),equipment:equipment??null});
 };
 for(const routine of state.routines)for(const e of routine.exercises)addExercise(e.name,e.exerciseId,e.equipment);
 for(const workout of state.workouts)for(const e of workout.sets)addExercise(e.exercise,e.exerciseId,e.equipment);
 if(state.activeWorkout)for(const e of state.activeWorkout.routine.exercises)addExercise(e.name,e.exerciseId,e.equipment);
 const meals=new Map<string,ReferenceReview['meals'][number]>();
 for(const entry of state.foodEntries){
  if(entry.origin==='estimate'&&entry.source)continue;
  if(estimateFood(entry.meal,entry.portion).kind==='estimate')continue;
  const identity=key(entry.meal),request=meals.get(identity)??{name:entry.meal.trim(),portions:[]};
  if(!request.portions.some(p=>key(p)===key(entry.portion)))request.portions.push(entry.portion.trim());
  meals.set(identity,request);
 }
 return {version:1,exercises:[...exercises.values()],meals:[...meals.values()]};
}
