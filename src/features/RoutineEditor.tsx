import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, ArrowDown, Plus, X, Search } from 'lucide-react';
import { routineSchema, type Routine, type Equipment } from '../model.ts';
import { EQUIPMENT_LABELS, searchExercises, exerciseToRoutine } from '../exercises.ts';
import { reorderExercises } from '../routines.ts';
import { editExercise } from '../focused.ts';
import { Dialog, Field, FormError, type FeatureProps } from '../components.tsx';

const blankExercise=():Routine['exercises'][number]=>({name:'',exerciseId:`custom-${crypto.randomUUID()}`,sets:2,repMin:8,repMax:12,cue:''});
export default function RoutineEditor({state,change,notice,onClose,existing}:FeatureProps&{onClose:()=>void,existing?:Routine}) {
  const [exercises,setExercises]=useState<Routine['exercises']>(existing?.exercises??[]);
  const [error,setError]=useState('');
  const [picker,setPicker]=useState<number|'add'|null>(existing?null:'add');
  const [query,setQuery]=useState('');
  const [equipment,setEquipment]=useState<Equipment|'all'>('all');
  const searchInput=useRef<HTMLInputElement>(null);
  const exerciseInputs=useRef<(HTMLInputElement|null)[]>([]);
  const nextFocus=useRef<number|null>(null);
  useEffect(()=>{
    if(picker!==null)searchInput.current?.focus();
    else if(nextFocus.current!==null){exerciseInputs.current[nextFocus.current]?.focus();nextFocus.current=null;}
  },[picker]);
  const results=searchExercises(query,equipment);
  const total=exercises.reduce((sum,e)=>sum+e.sets,0);
  function update(i:number,patch:Partial<Routine['exercises'][number]>) {
    setExercises(exercises.map((e,j)=>i===j?editExercise(e,patch):e));
  }
  function choose(id:string) {
    const entry=exerciseToRoutine(id);
    nextFocus.current=picker==='add'?exercises.length:picker;
    setExercises(picker==='add'?[...exercises,entry]:exercises.map((e,i)=>i===picker?entry:e));
    setPicker(null);setError('');
  }
  function save(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const f=new FormData(e.currentTarget);
      const routine=routineSchema.parse({id:existing?.id??crypto.randomUUID(),name:f.get('name'),description:f.get('description'),exercises});
      if(!change({...state,routines:existing?state.routines.map(r=>r.id===existing.id?routine:r):[...state.routines,routine]}))return;
      notice('Your little workout plan is ready.','cream-thumbs-up');onClose();
    }catch {setError('Add 1–10 named exercises, with 1–10 sets each and a rep range from 1–100 (minimum ≤ maximum). Keep the total within 30 sets and loads within 0–1000 kg.');}
  }
  return <Dialog title={existing?'Edit workout routine':'Plan a little workout'} onClose={onClose} wide><form onSubmit={save}>
    <Field label="Routine name"><input name="name" maxLength={60} required defaultValue={existing?.name??''} placeholder="Our Monday movement"/></Field>
    <Field label="A little description"><input name="description" maxLength={200} defaultValue={existing?.description??''} placeholder="A steady little full-body day"/></Field>
    <p className="routine-editor-summary" role="status">{exercises.length} / 10 exercises · {total} / 30 sets</p>
    {picker!==null&&<section className="exercise-library" aria-label="Exercise library">
      <div className="exercise-library-heading"><div><h3>{picker==='add'?'Find your next exercise':`Replace exercise ${picker+1}`}</h3><p>24 strength movements. Starting sets and reps are yours to adjust.</p></div><button className="icon-button" type="button" aria-label="Close exercise library" onClick={()=>setPicker(null)}><X size={18}/></button></div>
      <div className="form-grid"><Field label="Search exercises"><input ref={searchInput} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try row, press, squat…"/></Field><Field label="Available equipment"><select value={equipment} onChange={e=>setEquipment(e.target.value as Equipment|'all')}><option value="all">All equipment</option>{Object.entries(EQUIPMENT_LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></Field></div>
      <p className="library-result-count" role="status">{results.length} {results.length===1?'exercise':'exercises'} found</p>
      <ul className="exercise-library-results">{results.map(e=><li key={e.id}><div><strong>{e.name}</strong><span>{EQUIPMENT_LABELS[e.equipment]}</span></div><button className="button secondary compact" type="button" disabled={picker==='add'&&exercises.length>=10} aria-label={`${picker==='add'?'Add':'Use'} ${e.name}`} onClick={()=>choose(e.id)}>{picker==='add'?'Add':'Use'}</button></li>)}</ul>
      {!results.length&&<p>No matching exercises. Try another search or add your own below.</p>}
      <button type="button" className="text-link" disabled={picker==='add'&&exercises.length>=10} onClick={()=>{nextFocus.current=picker==='add'?exercises.length:picker;setExercises(picker==='add'?[...exercises,blankExercise()]:exercises.map((e,i)=>i===picker?blankExercise():e));setPicker(null);}}>Write a custom exercise</button>
    </section>}
    {exercises.map((exercise,i)=><section className="routine-exercise-editor" key={i}>
      <div className="exercise-editor-heading"><h3>Exercise {i+1}</h3><div className="exercise-row-actions">
        <button type="button" className="icon-button" disabled={i===0||picker!==null} aria-label={`Move exercise ${i+1} up`} onClick={()=>setExercises(reorderExercises(exercises,i,i-1))}><ArrowUp size={17}/></button>
        <button type="button" className="icon-button" disabled={i===exercises.length-1||picker!==null} aria-label={`Move exercise ${i+1} down`} onClick={()=>setExercises(reorderExercises(exercises,i,i+1))}><ArrowDown size={17}/></button>
        <button type="button" className="icon-button" disabled={picker!==null} aria-label={`Remove planned exercise ${i+1}`} onClick={()=>setExercises(exercises.filter((_,j)=>j!==i))}><X size={17}/></button>
      </div></div>
      <Field label="Exercise name"><input ref={el=>{exerciseInputs.current[i]=el;}} required maxLength={80} value={exercise.name} onChange={e=>update(i,{name:e.target.value})}/></Field>
      <div className="form-grid"><Field label="Equipment"><select value={exercise.equipment??''} onChange={e=>update(i,{equipment:e.target.value?e.target.value as Equipment:undefined})}><option value="">Not specified</option>{Object.entries(EQUIPMENT_LABELS).map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></Field><Field label="Planned load (kg, optional)" hint="Use the same load convention each time."><input type="number" inputMode="decimal" min={0} max={1000} step="any" value={exercise.plannedKg??''} onChange={e=>update(i,{plannedKg:e.target.value===''?undefined:Number(e.target.value)})}/></Field></div>
      <div className="routine-number-grid">{(['sets','repMin','repMax'] as const).map(k=><Field key={k} label={k==='sets'?'Sets':k==='repMin'?'Minimum reps':'Maximum reps'}><input type="number" required min={1} max={k==='sets'?10:100} step={1} value={exercise[k]} onChange={e=>update(i,{[k]:Number(e.target.value)})}/></Field>)}</div>
      <Field label="Chonk’s exercise cue (optional)"><input maxLength={200} value={exercise.cue} onChange={e=>update(i,{cue:e.target.value})} placeholder="Slow reps. Comfortable range. You’ve got this."/></Field>
      <button type="button" className="text-link" onClick={()=>{setPicker(i);setQuery('');setEquipment('all');}}><Search size={16}/>Replace from library</button>
    </section>)}
    <button type="button" className="button secondary" disabled={exercises.length>=10||picker!==null} onClick={()=>{setPicker('add');setQuery('');setEquipment('all');}}><Plus size={16}/>Add exercise</button>
    <FormError error={error}/><div className="form-actions"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit" disabled={!exercises.length}>Save routine</button></div>
  </form></Dialog>;
}
