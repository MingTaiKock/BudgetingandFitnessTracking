import { useState } from 'react';
import { Plus, Play, Pencil } from 'lucide-react';
import type { Routine } from '../model.ts';
import { SupportingArt } from '../SupportingArt.tsx';
import { SectionTitle, Empty, DeleteButton, type FeatureProps } from '../components.tsx';
import { removeRoutine } from '../routines.ts';
import { EQUIPMENT_LABELS } from '../exercises.ts';
import RoutineEditor from './RoutineEditor.tsx';
import WorkoutPresetPicker from './WorkoutPresetPicker.tsx';
export type RoutineActions={onStartRoutine:(routine:Routine,index?:number)=>void,onResumeWorkout:()=>void};
export default function Routines({onStartRoutine,onResumeWorkout,...props}:FeatureProps & RoutineActions) {
  const {state,change}=props;
  const [editor,setEditor]=useState<Routine|null|undefined>(undefined);
  return <>
    <WorkoutPresetPicker {...props}/>
    {state.activeWorkout&&<section className="resume-workout"><div><h2>Your workout is waiting</h2><p>{state.activeWorkout.routine.name} · {state.activeWorkout.entries.length} sets recorded</p></div><button className="button primary" onClick={onResumeWorkout}><Play size={17}/>Resume workout</button></section>}
    <SectionTitle title="Your little workout plans" subtitle="A plan to follow, with Mochi and Chonk by your side." action={<button className="button secondary compact" onClick={()=>setEditor(null)}><Plus size={15}/>New routine</button>}/>
    {state.routines.length===0?<Empty title="Plan a little movement" companion="golden-barbell-press"><p>Add exercises and rep ranges, then let Mochi and Chonk cheer you on.</p></Empty>:<div className="routine-grid">{state.routines.map((routine,i)=><section className="routine-card" key={routine.id}>
      <div className="routine-card-header"><div className="routine-pals"><SupportingArt name={i%2?'chonkRoutine':'mochiRoutine'}/></div><div><h3>{routine.name}</h3><span>{routine.exercises.length} exercises · {routine.exercises.reduce((a,e)=>a+e.sets,0)} sets</span></div><button className="icon-button" aria-label={`Edit routine ${routine.name}`} onClick={()=>setEditor(routine)}><Pencil size={15}/></button><DeleteButton label={`routine ${routine.name}`} description="This removes the routine and opens any weekdays assigned to it. Your movement diary and any workout already in progress are kept." onDelete={()=>change(removeRoutine(state,routine.id))}/></div>
      <p>{routine.description}</p><ol className="routine-exercise-list">{routine.exercises.map((e,j)=><li key={j}><button className="routine-exercise-link" onClick={()=>state.activeWorkout?onResumeWorkout():onStartRoutine(routine,j)} aria-label={`${state.activeWorkout?'Resume saved workout; planned exercise':'Start at exercise'} ${j+1}: ${e.name}`}><span>{j+1}. {e.name}{(e.equipment||e.plannedKg!==undefined)&&<small className="routine-equipment">{e.equipment?EQUIPMENT_LABELS[e.equipment]:'Custom exercise'}{e.plannedKg!==undefined?` · ${e.plannedKg} kg planned`:''}</small>}</span><strong>{e.sets} × {e.repMin}–{e.repMax}</strong></button></li>)}</ol>
      <button className="button primary full" disabled={Boolean(state.activeWorkout)} onClick={()=>onStartRoutine(routine)}><Play size={15}/>{state.activeWorkout?'Resume your active workout above':'Start this routine'}</button>
    </section>)}</div>}
    <p className="routine-safety-note">Starter routines are editable examples. Choose exercises and loads that suit you; your actual reps can differ from the target.</p>
    {editor!==undefined&&<RoutineEditor {...props} existing={editor??undefined} onClose={()=>setEditor(undefined)}/>}
  </>;
}
