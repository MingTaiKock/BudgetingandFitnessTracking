import type { Workout } from '../model.ts';
import { Dialog } from '../components.tsx';
import { Sticker } from '../Sticker.tsx';
import { workoutTotals } from '../exerciseProgress.ts';
import { EQUIPMENT_LABELS } from '../exercises.ts';

export default function WorkoutRecap({workout,onClose,storageWarning,still=false}:{workout:Workout,onClose:()=>void,storageWarning:string|null,still?:boolean}) {
  const totals=workoutTotals(workout);
  return <Dialog title="A little movement to be proud of" onClose={onClose}>
    {storageWarning&&<p className="storage-warning" role="alert">{storageWarning} Keep this tab open and download a backup in Settings.</p>}
    <div className="recap-pals"><Sticker name="pair-lift-and-cheer" size={150} still={still}/></div>
    <p className="recap-intro"><strong>{workout.activity}</strong><span>{workout.date} · Your logged movement</span></p>
    <dl className="recap-totals"><div><dt>Minutes</dt><dd>{totals.minutes}</dd></div><div><dt>Sets recorded</dt><dd>{totals.sets}</dd></div><div><dt>Total reps</dt><dd>{totals.reps}</dd></div></dl>
    <ul className="recap-exercises">{workout.sets.map((s,i)=><li key={i}><strong>{s.exercise}</strong>{s.equipment&&<span>{EQUIPMENT_LABELS[s.equipment]}</span>}<p>{s.sets} × {s.reps} reps · {s.kg} kg</p></li>)}</ul>
    {workout.notes&&<p className="recap-notes">{workout.notes}</p>}
    <p className="history-context">Every recorded set belongs here, even when you finish early. Mochi and Chonk are cheering for you.</p>
    <div className="form-actions"><button className="button primary" onClick={onClose}>Done for now</button></div>
  </Dialog>;
}
