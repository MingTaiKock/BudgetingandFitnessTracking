import {foodEntrySchema,stateSchema,type FoodEntry,type State} from './model.ts';
export function foodDayTotal(state:State,date:string):number|null {
 const rows=state.foodEntries.filter(e=>e.date===date);
 return rows.length?rows.reduce((sum,e)=>sum+e.kcal,0):null;
}
export function saveFoodEntry(state:State,input:unknown):State {
 const entry=foodEntrySchema.parse(input);
 return stateSchema.parse({...state,foodEntries:state.foodEntries.some(e=>e.id===entry.id)?state.foodEntries.map(e=>e.id===entry.id?entry:e):[...state.foodEntries,entry]});
}
export function removeFoodEntry(state:State,id:string):State {
 return stateSchema.parse({...state,foodEntries:state.foodEntries.filter(e=>e.id!==id)});
}
export type FoodEstimate=Pick<FoodEntry,'kcal'|'assumptions'|'source'>;
