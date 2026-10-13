import { stateSchema, SHOP, type State, type Category } from './model.ts';
import { dateKey, addDays, weekStart, shiftMonth } from './dates.ts';
import { migrateState } from './migrations.ts';
export { dateKey, weekStart } from './dates.ts';
export function parseMoney(input:string):number {
  if(!/^\d+(\.\d{1,2})?$/.test(input.trim()))throw new Error('Enter a positive amount with up to 2 decimal places.');
  const [whole,decimal='']=input.trim().split('.');
  const amount=Number(whole)*100+Number(decimal.padEnd(2,'0'));
  if(!Number.isSafeInteger(amount)||amount<=0||amount>100_000_000)throw new Error('Amount must be between 0.01 and 1,000,000.');
  return amount;
}
export function money(cents:number,currency='SGD'):string { return new Intl.NumberFormat('en-SG',{style:'currency',currency,currencyDisplay:'narrowSymbol',minimumFractionDigits:2}).format(cents/100); }
export function monthSummary(s:State,month:string) {
  const rows=s.transactions.filter(t=>t.date.startsWith(month));
  const spent=rows.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amountCents,0);
  const income=rows.filter(t=>t.type==='income').reduce((a,t)=>a+t.amountCents,0);
  const planned=s.budgets.filter(b=>b.month===month).reduce((a,b)=>a+b.limitCents,0);
  return {income,spent,planned,remaining:planned-spent,net:income-spent};
}
export function categorySummary(s:State,month:string,category:Category) {
  const planned=s.budgets.find(b=>b.month===month&&b.category===category)?.limitCents??0;
  const spent=s.transactions.filter(t=>t.type==='expense'&&t.category===category&&t.date.startsWith(month)).reduce((a,t)=>a+t.amountCents,0);
  return {planned,spent,remaining:planned-spent};
}
export function weekSummary(s:State,date=dateKey()) {
  const start=weekStart(date),end=addDays(start,7);
  const rows=s.workouts.filter(w=>w.date>=start&&w.date<end);
  return {count:rows.length,minutes:rows.reduce((a,w)=>a+w.minutes,0)};
}
export function activeDays(s:State):string[] {
  return [...new Set([...s.transactions.map(t=>t.date),...s.workouts.map(w=>w.date),...Object.entries(s.checkins).filter(([,c])=>c.water>0||c.mood||c.rest).map(([d])=>d)])].sort();
}
export function earnedSeeds(s:State):number {
  return new Set(s.transactions.map(t=>t.date)).size*5+new Set(s.workouts.map(w=>w.date)).size*10+Object.values(s.checkins).reduce((a,c)=>a+(c.water>=(c.waterTarget??s.profile.waterTarget)?5:0)+(c.mood?5:0)+(c.rest?5:0),0);
}
export function availableSeeds(s:State):number { return Math.max(0,earnedSeeds(s)-SHOP.filter(item=>s.owned.includes(item.id)).reduce((a,item)=>a+item.cost,0)); }
export function buyCosmetic(s:State,id:State['owned'][number]):State {
  const item=SHOP.find(i=>i.id===id);
  if(!item||s.owned.includes(id))throw new Error('You already have this little treasure.');
  if(availableSeeds(s)<item.cost)throw new Error('A few more seeds, and it’s yours!');
  return {...s,owned:[...s.owned,id]};
}
export function parseBackup(raw:string):State {
  if(new TextEncoder().encode(raw).length>2*1024*1024)throw new Error('Backup is too large. Maximum size: 2 MB.');
  try {
    const value=JSON.parse(raw);
    if(value&&typeof value==='object'&&Object.hasOwn(value,'format')) {
      if(value.format!=='little-wins'||typeof value.exportedAt!=='string'||!Number.isFinite(Date.parse(value.exportedAt))||Object.keys(value).some(k=>!['format','exportedAt','state'].includes(k)))throw Error('Invalid backup envelope');
      return migrateState(value.state);
    }
    return migrateState(value);
  }catch{throw new Error('This backup is invalid or uses an unsupported version. Your journey has not been replaced.');}
}
export function createBackup(state:State,at=new Date()):string {
  return JSON.stringify({format:'little-wins',exportedAt:at.toISOString(),state:stateSchema.parse(state)},null,2);
}
export function movementTrend(s:State,today=dateKey()) {return Array.from({length:8},(_,i)=>{const start=addDays(weekStart(today),(i-7)*7);return {label:start,...weekSummary(s,start)};});}
export function spendingTrend(s:State,today=dateKey()) {return Array.from({length:6},(_,i)=>{const month=shiftMonth(today.slice(0,7),i-5);return {label:month,value:monthSummary(s,month).spent};});}
export function coachMessage(s:State,today=dateKey()):string {
  if(s.checkins[today]?.rest)return 'Rest is part of getting stronger. Take your little paws off the gas today.';
  if(s.workouts.some(w=>w.date===today))return 'You showed up for yourself. That’s the win. I’m one proud hamster.';
  if(monthSummary(s,today.slice(0,7)).remaining<0)return 'A spending jar needs a little attention. Let’s review it together, one entry at a time.';
  return 'Small steps, little hamster. A bit of movement and an honest money check-in. You’ve got this.';
}
