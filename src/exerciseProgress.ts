import type { Equipment, Workout } from './model.ts';
import { addDays } from './dates.ts';

export type ExerciseKey={exerciseId?:string,equipment?:Equipment};
export type HistoryWindow=30|90|'all';
export type HistoryDay={date:string,sessions:number,sets:Workout['sets']};
export function exerciseHistory(workouts:Workout[],key:ExerciseKey,asOf:string,window:HistoryWindow='all',excludeId?:string):HistoryDay[] {
  if(!key.exerciseId||!key.equipment)return [];
  const start=window==='all'?'1900-01-01':addDays(asOf,1-window);
  const days=new Map<string,HistoryDay>();
  for(const workout of workouts){
    if(workout.id===excludeId||workout.date>asOf||workout.date<start)continue;
    const sets=workout.sets.filter(s=>s.exerciseId===key.exerciseId&&s.equipment===key.equipment);
    if(!sets.length)continue;
    const day=days.get(workout.date)??{date:workout.date,sessions:0,sets:[]};
    day.sessions++;
    for(const set of sets){
      const existing=day.sets.find(s=>s.reps===set.reps&&s.kg===set.kg);
      if(existing)existing.sets+=set.sets;
      else day.sets.push({...set});
    }
    days.set(workout.date,day);
  }
  return [...days.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
export function historyOptions(workouts:Workout[]):{value:string,name:string,exerciseId:string,equipment:Equipment}[] {
  const options=new Map<string,{value:string,name:string,exerciseId:string,equipment:Equipment}>();
  for(const workout of [...workouts].sort((a,b)=>a.date.localeCompare(b.date)))for(const set of workout.sets){
    if(!set.exerciseId||!set.equipment)continue;
    const value=JSON.stringify([set.exerciseId,set.equipment]);
    options.set(value,{value,name:set.exercise,exerciseId:set.exerciseId,equipment:set.equipment});
  }
  return [...options.values()].sort((a,b)=>a.name.localeCompare(b.name)||a.equipment.localeCompare(b.equipment));
}
export function workoutTotals(workout:Workout):{sets:number,reps:number,minutes:number} {
  return {sets:workout.sets.reduce((n,s)=>n+s.sets,0),reps:workout.sets.reduce((n,s)=>n+s.sets*s.reps,0),minutes:workout.minutes};
}
