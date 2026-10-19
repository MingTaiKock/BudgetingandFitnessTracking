import {CATEGORIES,type State} from './model.ts';
import {addDays,shiftMonth,weekStart} from './dates.ts';

export function weeklyWins(state:State,today:string){
 const start=weekStart(today),inWeek=(date:string)=>date>=start&&date<=today;
 const transactions=state.transactions.filter(t=>inWeek(t.date));
 const savings=state.goals.flatMap(g=>g.contributions).filter(c=>inWeek(c.date));
 const workouts=state.workouts.filter(w=>inWeek(w.date));
 const checkins=Object.entries(state.checkins).filter(([date,c])=>inWeek(date)&&(c.water>0||c.mood!==null||c.rest));
 return {start,loggingDays:new Set([...transactions,...savings,...workouts].map(r=>r.date).concat(checkins.map(([date])=>date))).size,savingsDays:new Set(savings.map(c=>c.date)).size,workouts:workouts.length};
}

export function spendingBaseline(state:State,month:string){
 const sourceMonth=shiftMonth(month,-1),rows=state.transactions.filter(t=>t.type==='expense'&&t.date.startsWith(sourceMonth));
 return {sourceMonth,count:rows.length,days:new Set(rows.map(r=>r.date)).size,total:rows.reduce((n,r)=>n+r.amountCents,0),amounts:Object.fromEntries(CATEGORIES.map(c=>[c.id,rows.filter(r=>r.category===c.id).reduce((n,r)=>n+r.amountCents,0)]))};
}

const IDEAS={food:'Try a packed meal when it suits your day',transport:'Compare one journey with a suitable lower-cost option',shopping:'Plan one purchase before buying',fun:'Try one lower-cost outing you would enjoy'} as const;
export function lifestyleSuggestions(state:State,today:string){
 const start=addDays(today,-29);
 return Object.entries(IDEAS).flatMap(([category,label])=>{
  const rows=state.transactions.filter(t=>t.type==='expense'&&t.category===category&&t.date>=start&&t.date<=today);
  if(rows.length<2)return [];
  return [{category,label,start,end:today,count:rows.length,averageCents:Math.round(rows.reduce((n,r)=>n+r.amountCents,0)/rows.length)}];
 });
}
