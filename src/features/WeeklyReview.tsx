import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { reviewWeek, metricChange } from '../wellness.ts';
import { money, dateKey } from '../domain.ts';
import { addDays, shortDate, weekStart } from '../dates.ts';
import { SectionTitle, Empty, type FeatureProps } from '../components.tsx';
import { PrototypeArt } from '../PrototypeArt.tsx';

export default function WeeklyReview({state}:Pick<FeatureProps,'state'>) {
  const today=dateKey(),[selected,setSelected]=useState(weekStart(today));
  const r=reviewWeek(state,selected),delta=metricChange(r.minutes,r.previousMinutes);
  return <section className="weekly-review" aria-label="Weekly review">
    <SectionTitle title="Your week, together" subtitle="A clear view of the little things you recorded." action={<div className="month-picker"><button className="icon-button" aria-label="Previous review week" onClick={()=>setSelected(addDays(selected,-7))}><ChevronLeft size={18}/></button><span>{shortDate(r.start)} – {shortDate(r.end)}</span><button className="icon-button" aria-label="Next review week" disabled={selected>=weekStart(today)} onClick={()=>setSelected(addDays(selected,7))}><ChevronRight size={18}/></button></div>}/>
    <div className="wellness-cards"><article className="wellness-card finance"><PrototypeArt name="finance"/><span>Logged spending</span><strong>{money(r.spent,state.profile.currency)}</strong><small>{money(r.income,state.profile.currency)} income logged</small></article><article className="wellness-card movement"><PrototypeArt name="fitness"/><span>Movement recorded</span><strong>{r.minutes}<small> min</small></strong><small>{r.workouts} workouts · {r.restDays} rest days logged</small></article><article className="wellness-card savings"><PrototypeArt name="finance"/><span>Savings recorded</span><strong>{money(r.saved,state.profile.currency)}</strong><small>Your recorded contributions</small></article>{state.preferences.connectionEnabled&&<article className="wellness-card connection"><PrototypeArt name="connection"/><span>Connection recorded</span><strong>{r.connectionMinutes}<small> min</small></strong><small>{r.connections.length} moments you chose to log</small></article>}</div>
    <div className="panel review-details"><div className="review-coverage"><CalendarDays size={20}/><p><strong>{r.loggedDays} of {r.elapsedDays} elapsed days have entries.</strong><br/>Days without an entry are unknown, not failed days.</p></div><div className="consistency-days">{r.days.map(d=><div key={d.date} className={d.future?'future':d.money||d.movement||d.checkin||d.connection?'recorded':''}><span>{new Date(`${d.date}T12:00:00`).toLocaleDateString('en-SG',{weekday:'short'})}</span><strong>{d.future?'—':d.rest?'Rest':d.movement?'Move':d.money?'Money':d.connection?'Connect':d.checkin?'Check-in':'No entry'}</strong></div>)}</div>
      <p className="settings-note">Movement: {delta.absolute>=0?'+':''}{delta.absolute} minutes versus the same {r.elapsedDays} days last week{delta.percent===null?' (no percentage: the previous period had zero recorded minutes).':` (${delta.percent>=0?'+':''}${delta.percent}%).`}</p>
      <details><summary>See the records behind this week</summary><div className="evidence-list">{r.transactions.map(t=><p key={t.id}>{shortDate(t.date)} · {t.note||t.category} · {t.type} · {money(t.amountCents,state.profile.currency)}</p>)}{r.workoutRecords.map(w=><p key={w.id}>{shortDate(w.date)} · {w.activity} · {w.minutes} min</p>)}{r.contributions.map(c=><p key={c.id}>{shortDate(c.date)} · savings contribution · {money(c.amountCents,state.profile.currency)}</p>)}{r.connections.map(c=><p key={c.id}>{shortDate(c.date)} · {c.activity.replaceAll('-',' ')} · {c.minutes} min connection</p>)}{r.loggedDays===0&&<Empty title="A quiet page, ready for your week">Add a money entry, workout or check-in from Today.</Empty>}</div></details>
    </div>
  </section>;
}
