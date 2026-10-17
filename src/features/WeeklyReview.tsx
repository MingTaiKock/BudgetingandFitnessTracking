import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewWeek } from '../wellness.ts';
import { money, dateKey } from '../domain.ts';
import { addDays, shortDate, weekStart } from '../dates.ts';
import { SectionTitle, Empty, Field, type FeatureProps } from '../components.tsx';
import { weeklyEvidence } from '../focused.ts';
import { CATEGORIES } from '../model.ts';

export default function WeeklyReview({state}:Pick<FeatureProps,'state'>) {
 const today=dateKey(),[selected,setSelected]=useState(weekStart(today)),[domain,setDomain]=useState<'money'|'movement'>('money'),[category,setCategory]=useState('all');
 const r=reviewWeek(state,selected);
 const rows=weeklyEvidence(state,selected,domain).filter(row=>domain!=='money'||category==='all'||(category==='income'||category==='savings'?row.kind===category:row.kind==='expense'&&row.category===category));
 const dates=[...new Set(rows.map(row=>row.date))];
 return <section className="weekly-review" aria-label="Weekly insights">
  <SectionTitle title="Your week, together" subtitle="Weekly review and your records, in one place." action={<div className="month-picker"><button className="icon-button" aria-label="Previous review week" onClick={()=>setSelected(addDays(selected,-7))}><ChevronLeft size={18}/></button><span>{shortDate(r.start)} – {shortDate(r.end)} {r.start.slice(0,4)}</span><button className="icon-button" aria-label="Next review week" disabled={selected>=weekStart(today)} onClick={()=>setSelected(addDays(selected,7))}><ChevronRight size={18}/></button></div>}/>
  <div className="filter-row flow-tabs">{(['money','movement'] as const).map(d=><button key={d} className={domain===d?'selected':''} aria-pressed={domain===d} onClick={()=>setDomain(d)}>{d==='money'?'Money':'Movement'}</button>)}</div>
  <section className="panel focused-evidence"><h2>{domain==='money'?`${money(r.spent,state.profile.currency)} spent`:`${r.workouts} workouts · ${r.minutes} minutes`}</h2><p>{domain==='money'?`${money(r.income,state.profile.currency)} income · ${money(r.saved,state.profile.currency)} added to goals`:`${r.restDays} rest days recorded`} in the selected week.</p>
   {domain==='money'&&<Field label="Show money records"><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All money records</option><option value="income">Income</option><option value="savings">Savings contributions</option>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name} expenses</option>)}</select></Field>}
   <p className="settings-note">{rows.length} records · newest dates first</p>
   {dates.map(date=><section className="evidence-day" key={date}><h3><time dateTime={date}>{shortDate(date)} {date.slice(0,4)}</time></h3>{rows.filter(row=>row.date===date).map(row=><div className="record-row" key={row.id}><div className="record-text"><strong>{row.label}</strong><span>{row.kind==='savings'?'Savings contribution':row.kind==='expense'?`Expense · ${CATEGORIES.find(c=>c.id===row.category)?.name}`:row.kind==='income'?'Income':row.kind==='rest'?'Rest':'Movement'}</span></div><strong>{row.amountCents!==undefined?money(row.amountCents,state.profile.currency):row.minutes!==undefined?`${row.minutes} min`:''}</strong></div>)}</section>)}
   {!rows.length&&<Empty title="No matching records this week" companion="cream-confused">Try another week or filter, or add an entry in Money or Movement.</Empty>}
   <p className="settings-note">Days without entries may be incomplete. They are not failed days.</p>
  </section>
 </section>;
}
