import {useState} from 'react';
import type {FeatureProps} from '../components.tsx';
import {Field} from '../components.tsx';
import {SPLITS,presetRoutines,installPreset,type Split,type TrainingPlace} from '../workoutPresets.ts';

export default function WorkoutPresetPicker({state,change,notice}:FeatureProps){
 const recommended=state.profile.weeklyTarget>=4?'upper-lower':'full';
 const [split,setSplit]=useState<Split>(recommended),[place,setPlace]=useState<TrainingPlace>('gym'),[message,setMessage]=useState('');
 const [failed,setFailed]=useState(false);
 const plan=SPLITS.find(p=>p.id===split)!,routines=presetRoutines(split,place),missing=routines.filter(r=>!state.routines.some(s=>s.id===r.id)).length;
 const available=50-state.routines.length,hasRoom=missing<=available;
 function add(){
  if((!missing&&!failed)||!hasRoom)return;
  if(change(installPreset(state,split,place))){
   setFailed(false);setMessage('Routine library updated. Your schedule is unchanged. Choose days in Weekly plan, or start a routine below. Check the saving status for confirmation.');
   notice('Preset routines added. Choose days in Weekly plan.');
  }else {setFailed(true);setMessage('Could not confirm the save. Check the saving notice before retrying.');}
 }
 return <details className="secondary-tools preset-picker">
  <summary>Browse preset workout plans</summary>
  <section className="panel">
   <h2>Find a rhythm you can keep</h2>
   <p>For a 3-day week, start with full body; for 4 days, try upper/lower. These are editable examples for balanced muscle development.</p>
   <div className="form-grid">
    <Field label="Workout split"><select aria-label="Workout split" value={split} onChange={e=>{setSplit(e.target.value as Split);setMessage('');}}>{SPLITS.map(p=><option key={p.id} value={p.id}>{p.name} · {p.days} days{p.id===recommended?' · suggested':''}</option>)}</select></Field>
    <Field label="Training equipment"><select aria-label="Training equipment" value={place} onChange={e=>{setPlace(e.target.value as TrainingPlace);setMessage('');}}><option value="gym">Gym</option><option value="home">Home · dumbbells and bench</option></select></Field>
   </div>
   <h3>{plan.name} · {plan.days} sessions</h3><p>{plan.why}</p><p>{plan.rhythm}</p>
   {place==='home'&&<p>Home sessions use dumbbells, a stable bench and bodyweight. Rows and reverse flies cover back work; this version has no vertical-pull exercise.</p>}
   {routines.map(r=><details className="preset-session" key={r.id}>
    <summary>{r.name} · {r.exercises.length} exercises</summary><p>{r.description}</p>
    <ol>{r.exercises.map(e=><li key={e.exerciseId}><strong>{e.name} · {e.sets} × {e.repMin}–{e.repMax}</strong><small>{e.cue}</small></li>)}</ol>
   </details>)}
   <p>Keep familiar exercises for several weeks so your history stays comparable. When all sets reach the upper rep range with controlled form and effort to spare, consider the smallest available weight increase and return to the lower range. Repeat a load or reduce it when needed; never push through pain.</p>
   <p className="settings-note">Working sets only; warm up first. Start with fewer sets if recovery needs it. Presets are starting points, not a personalized assessment. Edit loads and exercises in your routine.</p>
   {!hasRoom&&<p role="status">This plan needs {missing} routine slots; {available} remain in your 50-routine library. Remove unused routines before adding this plan. Nothing has been removed automatically.</p>}
   <div className="form-actions"><button className="button primary" disabled={(!missing&&!failed)||!hasRoom} onClick={add}>{failed?'Retry saving routines':missing?`Add ${missing} routines to my library`:'Already in your library'}</button></div>
   <p role="status">{message}</p><p className="settings-note">Existing routines, workout history and your weekly schedule are kept.</p>
  </section>
 </details>;
}
