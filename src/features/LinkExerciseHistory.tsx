import { useState } from 'react';
import { Field, type FeatureProps } from '../components.tsx';
import { linkHistorySet } from '../focused.ts';
import { EQUIPMENT_LABELS } from '../exercises.ts';
export default function LinkExerciseHistory({state,change,notice}:FeatureProps) {
 const [record,setRecord]=useState(''),[target,setTarget]=useState('');
 const records=state.workouts.flatMap(w=>w.sets.map((s,i)=>({w,s,i,value:JSON.stringify([w.id,i])}))).filter(r=>!r.s.exerciseId||!r.s.equipment);
 const choices=state.routines.flatMap(r=>r.exercises).filter((e,i,all)=>e.exerciseId&&e.equipment&&all.findIndex(x=>x.exerciseId===e.exerciseId&&x.equipment===e.equipment)===i);
 const selected=records.find(r=>r.value===record),exercise=choices.find(e=>JSON.stringify([e.exerciseId,e.equipment])===target);
 if(!records.length)return null;
 return <details className="secondary-tools"><summary>Connect older exercise records ({records.length})</summary><p>Select one recorded row and its matching routine exercise. Names alone never merge your history.</p><Field label="Older recorded set"><select value={record} onChange={e=>setRecord(e.target.value)}><option value="">Choose a record</option>{records.map(r=><option value={r.value} key={r.value}>{r.w.date} · {r.s.exercise} · {r.s.sets} × {r.s.reps} · {r.s.kg} kg</option>)}</select></Field><Field label="Match to routine exercise and equipment"><select value={target} onChange={e=>setTarget(e.target.value)}><option value="">Choose exercise</option>{choices.map(e=><option key={JSON.stringify([e.exerciseId,e.equipment])} value={JSON.stringify([e.exerciseId,e.equipment])}>{e.name} · {EQUIPMENT_LABELS[e.equipment!]}</option>)}</select></Field>{!choices.length&&<p>Edit your routine and select equipment first.</p>}{selected&&exercise&&<p>Only the selected {selected.w.date} record ({selected.s.exercise}, {selected.s.kg} kg) will be linked to {exercise.name} / {EQUIPMENT_LABELS[exercise.equipment!]}. Its name, date, reps and weight stay unchanged.</p>}<button className="button secondary" disabled={!selected||!exercise} onClick={()=>{if(selected&&exercise&&change(linkHistorySet(state,selected.w.id,selected.i,exercise))){setRecord('');notice('Selected record connected. Your previous loads are now included.');}}}>Confirm this match</button></details>;
}
