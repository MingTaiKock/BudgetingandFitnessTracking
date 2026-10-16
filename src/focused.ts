import { stateSchema, type Routine, type State, type Category } from './model.ts';
import { addDays } from './dates.ts';

export function editExercise(exercise:Routine['exercises'][number],patch:Partial<Routine['exercises'][number]>):Routine['exercises'][number] {
  // Display names can change. Only choosing a replacement exercise changes identity.
  return {...exercise,...patch,exerciseId:exercise.exerciseId??`custom-${crypto.randomUUID()}`};
}
export function linkHistorySet(state:State,workoutId:string,index:number,key:Routine['exercises'][number]):State {
  const row=state.workouts.find(w=>w.id===workoutId)?.sets[index];
  if(!row||!key.exerciseId||!key.equipment)throw Error('Choose a recorded set and an exercise with equipment.');
  return stateSchema.parse({...state,workouts:state.workouts.map(w=>w.id!==workoutId?w:{...w,sets:w.sets.map((s,i)=>i!==index?s:{...s,exerciseId:key.exerciseId,equipment:key.equipment})})});
}
export type Evidence={id:string,date:string,label:string,kind:string,amountCents?:number,minutes?:number,category?:Category};
export function weeklyEvidence(state:State,start:string,domain:'money'|'movement'):Evidence[] {
  const end=addDays(start,7);
  const rows:Evidence[]=domain==='money'?[
    ...state.transactions.map(t=>({id:t.id,date:t.date,label:t.note||t.category,kind:t.type,amountCents:t.amountCents,category:t.category})),
    ...state.goals.flatMap(g=>g.contributions.map(c=>({id:c.id,date:c.date,label:g.name,kind:'savings',amountCents:c.amountCents})))
  ]:[...state.workouts.map(w=>({id:w.id,date:w.date,label:w.activity,kind:'movement',minutes:w.minutes})),...Object.entries(state.checkins).filter(([,c])=>c.rest).map(([date])=>({id:`rest-${date}`,date,label:'Rest day',kind:'rest'}))];
  return rows.filter(r=>r.date>=start&&r.date<end).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
