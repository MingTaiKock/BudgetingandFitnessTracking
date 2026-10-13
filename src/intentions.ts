import { stateSchema, type State, type Intention } from './model.ts';
import { weekStart, addDays } from './dates.ts';
export type NewIntention={id:string,label:string,domain:Intention['domain'],target:number,startDate:string,scenarioId?:string};
export function addIntention(s:State,input:NewIntention):State {
  if(s.intentions.some(i=>i.id===input.id))return s;
  if(input.domain==='connection'&&!s.preferences.connectionEnabled)throw Error('Enable the optional connection diary first.');
  const {target,...rest}=input;
  return stateSchema.parse({...s,intentions:[...s.intentions,{...rest,revisions:[{effectiveDate:input.startDate,target}],completions:[],archived:false}]});
}
export function reviseIntention(s:State,id:string,target:number,date:string):State {
  const current=s.intentions.find(i=>i.id===id);if(!current)throw Error('Intention not found');
  const revisions=[...current.revisions.filter(r=>r.effectiveDate!==date),{effectiveDate:date,target}].sort((a,b)=>a.effectiveDate.localeCompare(b.effectiveDate));
  return stateSchema.parse({...s,intentions:s.intentions.map(i=>i.id===id?{...i,revisions}:i)});
}
export function completeIntention(s:State,id:string,date:string):State {
  const current=s.intentions.find(i=>i.id===id);if(!current||current.archived)throw Error('Choose an active intention');
  if(current.domain==='connection'&&!s.preferences.connectionEnabled)throw Error('Enable connection first');
  return stateSchema.parse({...s,intentions:s.intentions.map(i=>i.id===id?{...i,completions:[...new Set([...i.completions,date])].sort()}:i)});
}
export function intentionProgress(i:Intention,date:string) {
  const start=weekStart(date),end=addDays(start,6),active=i.startDate<=end;
  const revision=[...i.revisions].reverse().find(r=>r.effectiveDate<=start)??i.revisions[0];
  return {start,end,active,target:active?revision.target:0,completed:i.completions.filter(d=>d>=start&&d<=end).length};
}
