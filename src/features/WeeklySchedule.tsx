import { useState, type FormEvent } from 'react';
import { Pencil, CalendarDays } from 'lucide-react';
import type { State } from '../model.ts';
import { SectionTitle, Field, type FeatureProps } from '../components.tsx';
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export default function WeeklySchedule({state,change,notice}:FeatureProps) {
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState<string[]>([]);
  function edit() {
    setDraft(DAYS.map((_,day)=>{const plan=state.schedule.find(p=>p.day===day);return !plan?'':plan.kind==='rest'?'rest':`routine:${plan.routineId}`;}));
    setEditing(true);
  }
  function save(e:FormEvent) {
    e.preventDefault();
    const schedule:State['schedule']=draft.flatMap((value,day)=>!value?[]:[value==='rest'?{day,kind:'rest' as const}:{day,kind:'routine' as const,routineId:value.slice(8)}]);
    if(change({...state,schedule})){setEditing(false);notice('Your weekly rhythm is saved.');}
  }
  return <section className="panel weekly-schedule" aria-label="Weekly workout plan">
    <SectionTitle title="Make a little room for movement" subtitle="A repeating weekly plan. Change it whenever life changes." action={!editing&&<button className="button secondary compact" onClick={edit}><Pencil size={15}/>Edit weekly plan</button>}/>
    {editing?<form onSubmit={save}><div className="schedule-fields">{DAYS.map((day,i)=><Field label={day} key={day}><select value={draft[i]??''} onChange={e=>setDraft(draft.map((v,j)=>i===j?e.target.value:v))}><option value="">Leave open</option><option value="rest">Rest day</option>{state.routines.map(r=><option key={r.id} value={`routine:${r.id}`}>{r.name}</option>)}</select></Field>)}</div>
      {!state.routines.length&&<p>Create a routine below, then add it to your week.</p>}
      <div className="form-actions"><button type="button" className="button secondary" onClick={()=>setEditing(false)}>Cancel</button><button type="submit" className="button primary">Save weekly plan</button></div>
    </form>:<ul className="schedule-days">{DAYS.map((day,i)=>{const plan=state.schedule.find(p=>p.day===i);return <li key={day} className={plan?'planned':''}><span>{day.slice(0,3)}</span><strong>{!plan?'Open day':plan.kind==='rest'?'Rest day':state.routines.find(r=>r.id===plan.routineId)?.name}</strong></li>;})}</ul>}
    <p className="schedule-note"><CalendarDays size={16}/>Plans are reminders. Workouts and rest days count when you log them.</p>
  </section>;
}
