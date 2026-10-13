import {useEffect,useRef,useState,type FormEvent} from 'react';
import {ArrowLeft,ArrowRight,Check,Download,Heart} from 'lucide-react';
import {CATEGORIES,profileSchema,type Category,type State} from '../model.ts';
import {createPersonalJourney,type SetupChoices} from '../demo.ts';
import {starterRoutines} from '../routines.ts';
import {money} from '../domain.ts';
import {dateKey,monthLabel} from '../dates.ts';
import {downloadJSON} from '../download.ts';
import {Field,FormError} from '../components.tsx';
import {PrototypeArt} from '../PrototypeArt.tsx';

const STEPS=['Your little team','Your money plan','Your movement','Ready to begin'];
const ROUTINE_CHOICES=[
  {id:'gentle',name:'A gentle start',description:'Chair squat, wall push-up and calf raise.'},
  {id:'gym',name:'A gym session',description:'Goblet squat, seated cable row and floor press.'},
  {id:'both',name:'Keep both plans',description:'Choose what suits the day.'},
  {id:'later',name:'I’ll decide later',description:'Build your own plan in My fitness.'},
] as const;

export default function Onboarding({state,onFinish,onExplore}:{state:State,onFinish:(next:State)=>string|null,onExplore:()=>void}) {
  const [step,setStep]=useState(0);
  const [profile,setProfile]=useState({...state.profile});
  const [weeklyTarget,setWeeklyTarget]=useState(String(state.profile.weeklyTarget));
  const [planNow,setPlanNow]=useState(false);
  const [amounts,setAmounts]=useState<Record<Category,string>>({food:'',transport:'',shopping:'',fun:'',health:'',other:''});
  const [routineChoice,setRoutineChoice]=useState<SetupChoices['routines']>('gentle');
  const [preview,setPreview]=useState<State|null>(null);
  const [error,setError]=useState('');
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus();},[step]);
  function choices():SetupChoices {return {profile:{...profile,weeklyTarget:Number(weeklyTarget)},budget:planNow?amounts:null,routines:routineChoice};}
  function next(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setError('');
    try {
      if(step===0)profileSchema.parse(profile);
      if(step===1)createPersonalJourney(state,{...choices(),profile});
      if(step===2)setPreview(createPersonalJourney(state,choices()));
      if(step===3) {
        const failure=onFinish(createPersonalJourney(state,choices()));
        if(failure)setError(failure);
        return;
      }
      setStep(step+1);
    } catch {
      setError(step===0?'Enter both names (up to 30 characters) and choose a currency.':step===1?'Use amounts from 0 to 1,000,000 with up to 2 decimal places. Blank amounts mean 0.':'Choose a weekly target from 1–14 and a starter plan, or decide on a plan later.');
    }
  }
  const selected=starterRoutines().filter(r=>routineChoice==='both'||(routineChoice==='gentle'&&r.id==='starter-paws')||(routineChoice==='gym'&&r.id==='starter-chonk'));
  return <div className="setup-shell">
    <header className="setup-header"><span className="setup-brand">Wellness</span><button className="text-link" onClick={onExplore}>Explore the demo instead <ArrowRight size={16}/></button></header>
    <main className="setup-main">
      <aside className="setup-welcome"><PrototypeArt name="hero" label="Two fluffy hamsters sharing a sunny garden"/><h1>Your wellness,<br/>together.</h1><p>Make room for what matters. A little money planning, a little movement, and meaningful moments.</p><p className="setup-private"><Heart size={17}/>Your pace. Your private corner.</p></aside>
      <section className="setup-content" aria-label="Personal setup">
        <ol className="setup-steps" aria-label="Setup progress">{STEPS.map((title,i)=><li key={title} aria-current={step===i?'step':undefined} className={step>=i?'reached':''}><span aria-hidden="true">{step>i?<Check size={15}/>:i+1}</span><span className="sr-only">{title}{step>i?', complete':''}</span></li>)}</ol>
        <h2 ref={heading} tabIndex={-1}>{STEPS[step]}</h2>
        <p className="setup-step-count">Step {step+1} of {STEPS.length}</p>
        <form onSubmit={next}>
          {step===0&&<>
            <p className="setup-intro">Let’s make this yours. You can change these later.</p>
            <div className="form-grid"><Field label="Your hamster’s name"><input autoComplete="off" required maxLength={30} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></Field><Field label="Your hamster coach’s name"><input autoComplete="off" required maxLength={30} value={profile.coachName} onChange={e=>setProfile({...profile,coachName:e.target.value})}/></Field></div>
            <Field label="Currency"><select value={profile.currency} onChange={e=>setProfile({...profile,currency:e.target.value as State['profile']['currency']})}><option value="SGD">SGD · Singapore dollar</option><option value="MYR">MYR · Malaysian ringgit</option><option value="USD">USD · US dollar</option><option value="EUR">EUR · Euro</option><option value="GBP">GBP · British pound</option></select></Field>
            <p className="setup-help">Your records stay in this browser on this device. No account or partner sharing is required. Keep backups in Settings.</p>
          </>}
          {step===1&&<>
            <p className="setup-intro">Choose your limits for {monthLabel(dateKey().slice(0,7))}. You can log spending even without a plan.</p>
            <fieldset className="setup-options"><legend>When would you like to plan?</legend><label><input type="radio" name="budget-choice" checked={!planNow} onChange={()=>setPlanNow(false)}/><span><strong>I’ll plan later</strong><small>Start without assumed spending limits.</small></span></label><label><input type="radio" name="budget-choice" checked={planNow} onChange={()=>setPlanNow(true)}/><span><strong>Set my category limits now</strong><small>Your plan, not a bank balance.</small></span></label></fieldset>
            {planNow&&<><div className="form-grid">{CATEGORIES.map(c=><Field key={c.id} label={`${c.name} (${profile.currency})`}><input inputMode="decimal" placeholder="0.00" maxLength={14} value={amounts[c.id]} onChange={e=>setAmounts({...amounts,[c.id]:e.target.value})}/></Field>)}</div><p className="setup-help">Blank categories will have a limit of 0. No money is moved.</p></>}
          </>}
          {step===2&&<>
            <p className="setup-intro">Pick a starting point. Every exercise and rep range can be changed later.</p>
            <Field label="My weekly workout goal" hint="A personal reminder. Rest and partial workouts count as care, too."><input type="number" inputMode="numeric" min={1} max={14} step={1} required value={weeklyTarget} onChange={e=>setWeeklyTarget(e.target.value)}/></Field>
            <fieldset className="setup-options"><legend>Starter workout plans</legend>{ROUTINE_CHOICES.map(choice=><label key={choice.id}><input type="radio" name="routine-choice" checked={routineChoice===choice.id} onChange={()=>setRoutineChoice(choice.id)}/><span><strong>{choice.name}</strong><small>{choice.description}</small></span></label>)}</fieldset>
            {selected.length>0&&<details className="setup-routine-preview"><summary>See exercises and rep ranges</summary>{selected.map(r=><div key={r.id}><h3>{r.name}</h3><ul>{r.exercises.map(ex=><li key={ex.name}>{ex.name}<span>{ex.sets} × {ex.repMin}–{ex.repMax} reps</span></li>)}</ul></div>)}<p className="setup-help">Editable examples. Choose comfortable exercises and loads that suit you.</p></details>}
          </>}
          {step===3&&preview&&<>
            <p className="setup-intro">A fresh little beginning for {preview.profile.name} and {preview.profile.coachName}.</p>
            <dl className="setup-review"><div><dt>Currency</dt><dd>{preview.profile.currency}</dd></div><div><dt>Monthly plan</dt><dd>{planNow?money(preview.budgets.reduce((sum,b)=>sum+b.limitCents,0),preview.profile.currency):'I’ll plan later'}</dd></div><div><dt>Weekly goal</dt><dd>{preview.profile.weeklyTarget} workouts</dd></div><div><dt>Starter plans</dt><dd>{preview.routines.length?preview.routines.map(r=>r.name).join(' · '):'I’ll choose later'}</dd></div></dl>
            {planNow&&<details className="setup-routine-preview"><summary>Review category limits</summary><ul>{preview.budgets.map(b=><li key={b.category}>{CATEGORIES.find(c=>c.id===b.category)?.name}<span>{money(b.limitCents,preview.profile.currency)}</span></li>)}</ul></details>}
            <div className="setup-replacement"><h3>Your personal journey starts empty</h3><p>Finishing replaces this demo garden, including any changes you made while exploring. Its {state.transactions.length} money entries, {state.workouts.length} workouts, savings, check-ins and rewards won’t carry over. Any unfinished demo workout is also removed.</p><button type="button" className="text-link" onClick={()=>downloadJSON(JSON.stringify(state,null,2),`little-wins-demo-${dateKey()}.json`)}><Download size={17}/>Download this demo first</button></div>
          </>}
          <FormError error={error}/>
          <div className="setup-actions">{step>0&&<button type="button" className="button secondary" onClick={()=>{setError('');setStep(step-1);}}><ArrowLeft size={17}/>Back</button>}<button type="submit" className="button primary">{step===3?'Create my personal journey':'Continue'}<ArrowRight size={17}/></button></div>
        </form>
      </section>
    </main>
  </div>;
}
