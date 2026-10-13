import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, ChevronLeft, ChevronRight, RotateCcw, Timer, X } from 'lucide-react';
import type { WorkoutSession as Session } from '../model.ts';
import { finishSession, selectExercise } from '../routines.ts';
import { exerciseHistory } from '../exerciseProgress.ts';
import { EXERCISE_ART } from '../hamsterArtwork.ts';
import { EQUIPMENT_LABELS } from '../exercises.ts';
import { SupportingArt } from '../SupportingArt.tsx';
import { Dialog, Field, FormError, Progress, type FeatureProps } from '../components.tsx';

export default function WorkoutSession({state,change,notice,onClose,onFinished,storageWarning}:FeatureProps & {
  onClose:()=>void; onFinished:(id:string)=>void; storageWarning:string|null;
}) {
  const [now,setNow]=useState(Date.now());
  const [error,setError]=useState('');
  const [discard,setDiscard]=useState(false);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
  const session=state.activeWorkout;
  const previous=useMemo(()=>session?exerciseHistory(state.workouts,session.routine.exercises[session.index],session.date,'all',session.id)[0]:undefined,[state.workouts,session?.routine,session?.index,session?.date,session?.id]);
  if(!session)return null;
  const {routine,index,entries,reps,kg}=session;
  const exercise=routine.exercises[index];
  const done=entries.filter(e=>e.exerciseIndex===index).length;
  const total=routine.exercises.reduce((sum,e)=>sum+e.sets,0);
  const elapsed=Math.max(0,Math.floor((now-session.startedAt)/1000));
  const exerciseArt=exercise.exerciseId?EXERCISE_ART[exercise.exerciseId]:undefined;
  const rest=Math.max(0,Math.ceil(((session.restEndsAt??0)-now)/1000));
  const duration=session.minutes??String(Math.max(1,Math.ceil(elapsed/60)));
  function update(patch:Partial<Session>) {
    if(!session)return false;
    return change({...state,activeWorkout:{...session,...patch}});
  }
  function go(next:number) {
    if(session)change({...state,activeWorkout:selectExercise(session,next)});
    setError('');
  }
  function complete() {
    const actual=Number(reps),load=Number(kg);
    if(done>=exercise.sets)return;
    if(!reps.trim()||!kg.trim()||!Number.isInteger(actual)||actual<1||actual>1000||!Number.isFinite(load)||load<0||load>1000) {
      setError('Enter 1–1000 whole reps and a load from 0–1000 kg. Use 0 for bodyweight.');return;
    }
    const time=Date.now();setNow(time);
    update({entries:[...entries,{exerciseIndex:index,reps:actual,kg:load}],restEndsAt:session!.restSeconds?time+session!.restSeconds*1000:null});
    setError('');
  }
  function finish(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if(!change(finishSession(state,Number(duration))))return;
      notice(`${entries.length} sets recorded. Your movement diary is updated.`);onFinished(session!.id);
    } catch (err) {setError(err instanceof Error?err.message:'Check your session duration and try again.');}
  }
  return <Dialog title={routine.name} onClose={onClose} wide>
    {storageWarning?<p className="storage-warning" role="alert">{storageWarning} Keep this tab open and download a backup in Settings.</p>:<p className="session-save-status">Saved in this browser · close and resume whenever you need.</p>}
    {discard?<>
      <p className="dialog-description">Discard this workout and its {entries.length} completed sets? Your movement diary will stay unchanged.</p>
      <div className="form-actions"><button className="button secondary" onClick={()=>setDiscard(false)}>Keep workout</button><button className="button danger" onClick={()=>{if(change({...state,activeWorkout:null}))onClose();}}>Discard workout</button></div>
    </>:<>
      <div className="session-top"><span>{entries.length} / {total} sets completed</span><span>{Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')} elapsed</span></div>
      <Progress value={entries.length} max={total} label="Workout sets completed" color="#a18ac5"/>
      <div className="guided-layout">
        <div className="guided-exercise">
          <p className="exercise-position">Exercise {index+1} of {routine.exercises.length}</p>
          <h3>{exercise.name}</h3>
          {(exercise.equipment||exercise.plannedKg!==undefined)&&<p className="workout-equipment">{exercise.equipment?EQUIPMENT_LABELS[exercise.equipment]:'Custom exercise'}{exercise.plannedKg!==undefined?` · ${exercise.plannedKg} kg planned`:''}</p>}
          <div className="rep-target"><strong>{exercise.repMin}–{exercise.repMax}</strong><span>target reps · {exercise.sets} sets</span></div>
          <p className="exercise-cue">{exercise.cue||'Move at your own pace. Use a comfortable range and load.'}</p>
          <aside className="previous-exercise" aria-label="Previous exercise history">{previous?<><strong>Last logged day · {previous.date}</strong><p>{previous.sets.map(s=>`${s.sets} × ${s.reps} reps at ${s.kg} kg`).join(' · ')}</p><small>{previous.sessions} {previous.sessions===1?'session':'sessions'} · Same exercise and equipment. A reference, not a target.</small></>:<p>{exercise.exerciseId&&exercise.equipment?'No earlier matching entries yet. Your first sets start the story.':'Choose a library exercise in your routine to track comparable history. Your existing entries stay in the diary.'}</p>}</aside>
          <div className="set-dots" aria-label={`${done} of ${exercise.sets} sets completed for ${exercise.name}`}>{Array.from({length:exercise.sets},(_,i)=><span key={i} className={i<done?'complete':''}>{i<done?<Check size={16}/>:i+1}</span>)}</div>
          <div className="form-grid">
            <Field label="Actual reps"><input aria-label="Actual reps" type="number" inputMode="numeric" min={1} max={1000} step={1} value={reps} onChange={e=>update({reps:e.target.value.slice(0,20)})}/></Field>
            <Field label="Load (kg)" hint="0 for bodyweight"><input aria-label="Load in kilograms" type="number" inputMode="decimal" min={0} max={1000} step="any" value={kg} onChange={e=>update({kg:e.target.value.slice(0,20)})}/></Field>
          </div>
          <button className="button primary full" disabled={done>=exercise.sets} onClick={complete}><Check size={18}/>{done>=exercise.sets?'Exercise complete':`Complete set ${done+1}`}</button>
          {done>0&&<button className="text-link undo-set" onClick={()=>{const last=entries.map(e=>e.exerciseIndex).lastIndexOf(index);update({entries:entries.filter((_,i)=>i!==last),restEndsAt:null});}}><RotateCcw size={15}/>Undo last set</button>}
          <FormError error={error}/>
        </div>
        <aside className="pixel-cheer-squad">
          <div className="session-pals"><SupportingArt name="mochiRoutine"/><SupportingArt name="chonkRoutine"/></div>
          <p><strong>{done>=exercise.sets?state.profile.name:state.profile.coachName}</strong>{done>=exercise.sets?'Tiny paws, big win. Take a breather with us.':`Aim for ${exercise.repMin}–${exercise.repMax} comfortable reps. We’re right here.`}</p>
        </aside>
      </div>
      <section className="session-rest" aria-label="Rest between sets">
        <div><Timer size={20}/><strong>{rest>0?`${Math.floor(rest/60)}:${String(rest%60).padStart(2,'0')}`:'Take your time'}</strong><span role="status">{rest>0?'Rest between sets':session.restEndsAt?'Rest timer finished. Continue when ready.':'Your pace, always.'}</span></div>
        <Field label="Rest after each set"><select value={session.restSeconds} onChange={e=>update({restSeconds:Number(e.target.value) as Session['restSeconds'],restEndsAt:null})}><option value={0}>Timer off</option><option value={30}>30 seconds</option><option value={60}>60 seconds</option><option value={90}>90 seconds</option><option value={120}>2 minutes</option></select></Field>
        {rest>0&&<button className="button secondary" onClick={()=>update({restEndsAt:null})}>Skip rest</button>}
      </section>
      <div className="exercise-navigation"><button className="button secondary" disabled={index===0} onClick={()=>go(index-1)}><ChevronLeft size={16}/>Previous</button><span>{done}/{exercise.sets} sets here</span><button className="button secondary" disabled={index===routine.exercises.length-1} onClick={()=>go(index+1)}>Next exercise<ChevronRight size={16}/></button></div>
      {entries.length>0&&<details className="session-history"><summary>Completed sets ({entries.length})</summary>{entries.map((entry,i)=><p key={i}>{routine.exercises[entry.exerciseIndex].name} · {entry.reps} reps · {entry.kg} kg</p>)}</details>}
      <p className="routine-safety-note">Your actual reps can differ from the plan. Finishing early counts, too.</p>
      <form onSubmit={finish} className="session-finish">
        <Field label="Session duration (minutes)" hint="Elapsed time includes breaks and time away. Adjust before finishing."><input aria-label="Session duration" type="number" inputMode="numeric" min={1} max={1440} step={1} required value={duration} onChange={e=>update({minutes:e.target.value.slice(0,10)})}/></Field>
        <div className="session-finish-actions"><button className="button secondary" type="button" onClick={onClose}>Close & keep workout</button><button className="button primary" type="submit" disabled={!entries.length}>Finish {entries.length===total?'workout':'partial workout'}</button></div>
      </form>
      <button className="text-link discard-workout" onClick={()=>setDiscard(true)}><X size={15}/>Discard this workout</button>
    </>}
  </Dialog>;
}
