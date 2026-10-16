import { useState } from 'react';
import type { State } from '../model.ts';
import { dateKey } from '../dates.ts';
import { exerciseHistory, historyOptions, type HistoryWindow } from '../exerciseProgress.ts';
import { EQUIPMENT_LABELS } from '../exercises.ts';
import { Field, SectionTitle } from '../components.tsx';
import type { FeatureProps } from '../components.tsx';
import LinkExerciseHistory from './LinkExerciseHistory.tsx';

export default function ExerciseProgress(props:Pick<FeatureProps,'state'> & Partial<Omit<FeatureProps,'state'>>) {
  const {state}=props;
  const options=historyOptions(state.workouts);
  const [selection,setSelection]=useState('');
  const [window,setWindow]=useState<HistoryWindow>(90);
  const [showAll,setShowAll]=useState(false);
  const selected=options.find(o=>o.value===selection)??options[0];
  const history=selected?exerciseHistory(state.workouts,selected,dateKey(),window):[];
  const missing=state.workouts.some(w=>w.sets.some(s=>!s.exerciseId||!s.equipment));
  return <section className="panel exercise-progress">
    <SectionTitle title="Your strength, over time" subtitle="Actual sets, reps and load for the same exercise and equipment."/>
    {selected?<>
      <div className="form-grid"><Field label="Exercise"><select value={selected.value} onChange={e=>{setSelection(e.target.value);setShowAll(false);}}>{options.map(o=><option value={o.value} key={o.value}>{o.name} · {EQUIPMENT_LABELS[o.equipment]}</option>)}</select></Field><Field label="Time range"><select value={window} onChange={e=>{setWindow(e.target.value==='all'?'all':Number(e.target.value) as 30|90);setShowAll(false);}}><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value="all">All recorded history</option></select></Field></div>
      <p className="history-context" role="status">{history.length} logged {history.length===1?'day':'days'}{window==='all'?' across all recorded history':` in the last ${window} days, including today`}.</p>
      {history.length?<ol className="exercise-history-days">{(showAll?history:history.slice(0,8)).map(day=><li key={day.date}><div><time dateTime={day.date}>{day.date}</time><span>{day.sessions} {day.sessions===1?'session':'sessions'}</span></div><ul>{day.sets.map((s,i)=><li key={i}>{s.sets} × {s.reps} reps · {s.kg} kg</li>)}</ul></li>)}</ol>:<p className="history-empty">No matching entries in this range. Try all recorded history.</p>}
      {history.length>8&&<button className="button secondary" onClick={()=>setShowAll(!showAll)}>{showAll?'Show latest 8 days':`Show all ${history.length} days`}</button>}
      <p className="history-context">Loads are as you recorded them. Use a consistent setup and weight convention; these entries are a reference, not a target to beat.</p>
    </>:<p className="history-empty">Your first library exercise starts this story. Add one to a routine in My fitness, then log a set with Mochi and Chonk.</p>}
    {missing&&props.change&&props.notice&&<LinkExerciseHistory state={state} change={props.change} notice={props.notice}/>}
  </section>;
}
