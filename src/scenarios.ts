import { z } from 'zod';
import { scenarioSchema, stateSchema } from './model.ts';
import type { State, Category } from './model.ts';
export function applyScenarioBudget(s:State,id:string,month:string,category:Category):State {
  const scenario=s.scenarios.find(p=>p.id===id);if(!scenario)throw Error('Choose a saved scenario');
  if(s.scenarioApplications.some(a=>a.scenarioId===id&&a.month===month))throw Error('This scenario has already been applied this month');
  const {id:unused,...input}=scenario;void unused;
  const deltaCents=compareScenario(input).monthlyNetCents;
  const current=s.budgets.find(b=>b.month===month&&b.category===category)?.limitCents??0;
  return stateSchema.parse({...s,budgets:[...s.budgets.filter(b=>b.month!==month||b.category!==category),{month,category,limitCents:current+deltaCents}],scenarioApplications:[...s.scenarioApplications,{scenarioId:id,month,category,deltaCents}]});
}
const assumptions=scenarioSchema.omit({id:true});
export function compareScenario(input:unknown) {
  const s=assumptions.parse(input);
  const weeklyGrossCents=s.costCents*s.occurrencesPerWeek;
  const weeklyNetCents=(s.costCents-s.extraCostCents)*s.occurrencesPerWeek;
  return {weeklyGrossCents,weeklyNetCents,monthlyNetCents:Math.round(weeklyNetCents*52/12),weeklyMinutes:s.extraMinutes*s.occurrencesPerWeek};
}
export function projectSavings(starting:number,monthly:number,months:number):number {
  const amount=z.number().int().min(0).max(100_000_000);
  amount.parse(starting);amount.parse(monthly);z.number().int().min(0).max(600).parse(months);
  const result=starting+monthly*months;
  if(!Number.isSafeInteger(result))throw Error('Projection exceeds safe money limits');
  return result;
}
