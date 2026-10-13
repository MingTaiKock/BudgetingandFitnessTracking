import type { State } from './model.ts';
import { addDays, weekStart, dateKey } from './dates.ts';

export function consecutiveDays(dates:string[],today:string):number {
  const set=new Set(dates);let count=0,cursor=set.has(today)?today:addDays(today,-1);
  while(set.has(cursor)){count++;cursor=addDays(cursor,-1);}return count;
}

export function reviewWeek(s:State,date:string,today=dateKey()) {
  const start=weekStart(date),fullEnd=addDays(start,6),end=fullEnd>today?today:fullEnd;
  const elapsedDays=Math.max(0,Array.from({length:7},(_,i)=>addDays(start,i)).filter(d=>d<=end).length);
  const within=(d:string)=>d>=start&&d<=end;
  const transactions=s.transactions.filter(t=>within(t.date)),workouts=s.workouts.filter(w=>within(w.date));
  const contributions=s.goals.flatMap(g=>g.contributions).filter(c=>within(c.date));
  const connections=s.preferences.connectionEnabled?s.connections.filter(c=>within(c.date)):[];
  const days=Array.from({length:7},(_,i)=>{
    const d=addDays(start,i),checkin=s.checkins[d];
    return {date:d,future:d>today,money:transactions.some(t=>t.date===d)||contributions.some(c=>c.date===d),movement:workouts.some(w=>w.date===d),connection:connections.some(c=>c.date===d),rest:Boolean(checkin?.rest),checkin:Boolean(checkin&&(checkin.water||checkin.mood||checkin.rest))};
  });
  const previousStart=addDays(start,-7),previousEnd=addDays(previousStart,elapsedDays-1);
  return {start,end,elapsedDays,days,transactions,workoutRecords:workouts,contributions,connections,connectionMinutes:connections.reduce((sum,c)=>sum+c.minutes,0),
    spent:transactions.filter(t=>t.type==='expense').reduce((sum,t)=>sum+t.amountCents,0),
    income:transactions.filter(t=>t.type==='income').reduce((sum,t)=>sum+t.amountCents,0),
    saved:contributions.reduce((sum,c)=>sum+c.amountCents,0),
    minutes:workouts.reduce((sum,w)=>sum+w.minutes,0),workouts:workouts.length,
    restDays:days.filter(d=>!d.future&&d.rest).length,
    loggedDays:days.filter(d=>!d.future&&(d.money||d.movement||d.checkin||d.connection)).length,
    previousMinutes:s.workouts.filter(w=>w.date>=previousStart&&w.date<=previousEnd).reduce((sum,w)=>sum+w.minutes,0),
  };
}
export function metricChange(current:number,previous:number) {return {absolute:current-previous,percent:previous===0?null:Math.round((current-previous)/previous*100)};}
