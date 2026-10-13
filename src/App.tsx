import { useEffect, useRef, useState } from 'react';
import { Home, Wallet, Dumbbell, Sprout, Settings as SettingsIcon, Plus, Sun, ArrowUpRight, Heart, BarChart3, Zap, CalendarDays, ClipboardList, Bell, Leaf } from 'lucide-react';
import { dateKey } from './domain.ts';
import { stateSchema, type State, type Routine } from './model.ts';
import { startSession } from './routines.ts';
import WorkoutSession from './features/WorkoutSession.tsx';
import WorkoutRecap from './features/WorkoutRecap.tsx';
import { loadState, saveState, STORAGE_KEY } from './storage.ts';
import { Dialog, type View } from './components.tsx';
import Budget, { TransactionEditor } from './features/Budget.tsx';
import Fitness, { WorkoutEditor } from './features/Fitness.tsx';
import Settings from './features/Settings.tsx';
import Onboarding from './features/Onboarding.tsx';
import { ConnectionEditor } from './features/Connection.tsx';
import ResetChooser from './features/ResetChooser.tsx';
import ScenarioPlanner from './features/ScenarioPlanner.tsx';
import { PrototypeArt } from './PrototypeArt.tsx';
import { WellnessDashboard, IdentityJourney, WellnessHabitat, StreakPower, ConnectionSpace } from './features/WellnessWorkspace.tsx';
import WeeklyReview from './features/WeeklyReview.tsx';
import FutureView from './features/FutureView.tsx';
import ExerciseProgress from './features/ExerciseProgress.tsx';
const NAV=[{id:'today',label:'Dashboard',icon:Home},{id:'insights',label:'Insights',icon:BarChart3},{id:'journey',label:'Journey',icon:Sprout},{id:'connection',label:'Connection',icon:Heart},{id:'habitat',label:'Habitat',icon:Home},{id:'future',label:'Future self',icon:Sun},{id:'streaks',label:'Streak power',icon:Zap},{id:'planner',label:'Plan together',icon:CalendarDays},{id:'review',label:'Weekly review',icon:ClipboardList},{id:'budget',label:'My budget',icon:Wallet},{id:'fitness',label:'My fitness',icon:Dumbbell},{id:'settings',label:'Settings',icon:SettingsIcon}] as const;
const TITLES:Record<View,string>={today:'Your wellness, together',insights:'Your wellness insights',journey:'Your Identity Journey',connection:'Make room for connection',habitat:'Your Wellness Habitat',future:'Your Future Self',streaks:'Your Wellness Streak Power',planner:'Adjust Your Plan Together',review:'Your Weekly Wellness Summary',budget:'Your money, with a plan',fitness:'Your movement, at your pace',settings:'Your private corner'};
export default function App() {
  const [initial]=useState(()=>{try{return loadState(localStorage);}catch{return {state:null,error:'Browser storage is unavailable.',isNew:false};}});
  // The fallback uses the same storage recovery path without touching unavailable localStorage.
  const [state,setState]=useState<State>(()=>initial.state??loadState({getItem:()=>{throw Error();}}).state);
  const [warning,setWarning]=useState(initial.error),[blocked,setBlocked]=useState(Boolean(initial.error));
  const savedRaw=useRef('currentRaw' in initial?initial.currentRaw:null);
  useEffect(()=>{
    const onStorage=(event:StorageEvent)=>{if(event.key===STORAGE_KEY&&event.newValue!==savedRaw.current){setWarning('Another tab changed this journey. Download a backup of this tab before reloading the saved version.');}};
    window.addEventListener('storage',onStorage);return ()=>window.removeEventListener('storage',onStorage);
  },[]);
  const [workoutOpen,setWorkoutOpen]=useState(false);
  const [recapId,setRecapId]=useState<string|null>(null);
  const recap=state.workouts.find(w=>w.id===recapId);
  const [setupOpen,setSetupOpen]=useState(Boolean(initial.isNew));
  const [view,setView]=useState<View>('today'),[today,setToday]=useState(dateKey()),[toast,setToast]=useState(''),[entry,setEntry]=useState<'pick'|'transaction'|'workout'|'connection'|null>(null);
  const [resetOpen,setResetOpen]=useState(false);
  useEffect(()=>{const timer=setInterval(()=>setToday(dateKey()),30000);return ()=>clearInterval(timer);},[]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),4500);return ()=>clearTimeout(timer);},[toast]);
  function change(next:State,replace=false) {
    const result=stateSchema.safeParse(next);
    if(!result.success){setToast('Please check the entry. Use valid dates, amounts, and names.');return false;}
    if(blocked&&!replace){setState(result.data);return false;}
    let error:string|null;try{error=saveState(localStorage,result.data,savedRaw.current??null);}catch{error='Browser storage is unavailable. Download a backup before leaving.';}
    if(!error){savedRaw.current=JSON.stringify(result.data);setState(result.data);setBlocked(false);}
    else if(!replace)setState(result.data);
    setWarning(error);return !error;
  }
  const props={state,change,notice:setToast,go:setView};
  function beginRoutine(routine:Routine) {
    if(state.activeWorkout){setWorkoutOpen(true);return;}
    if(change({...state,activeWorkout:startSession(routine)}))setWorkoutOpen(true);
  }
  function finishSetup(next:State):string|null {
    if(!state.demo)return 'Your personal journey already exists. Use Settings to edit your preferences.';
    const parsed=stateSchema.safeParse(next);
    if(!parsed.success||parsed.data.demo)return 'Please check your setup choices and try again.';
    let error:string|null;
    try{error=saveState(localStorage,parsed.data,savedRaw.current??null);}catch{error='Browser storage is unavailable. Your demo is unchanged. Enable storage and try again.';}
    if(error)return `${error} Your current journey is unchanged; your setup choices are still here.`;
    savedRaw.current=JSON.stringify(parsed.data);setState(parsed.data);setWarning(null);setBlocked(false);setSetupOpen(false);setView('today');
    setToast('Your own little journey is ready. Welcome home.');return null;
  }
  if(setupOpen&&state.demo)return <Onboarding state={state} onFinish={finishSetup} onExplore={()=>{change(state);setSetupOpen(false);}}/>;
  return <div className={`app-shell ${state.preferences.gentleMotion?'':'motion-off'}`}>
    <aside className="sidebar"><a className="brand" href="#today" onClick={e=>{e.preventDefault();setView('today');}}><span className="wellness-logo"><Heart/><Leaf/></span><span>Wellness</span></a>
      <button className="sidebar-profile" onClick={()=>setView('settings')}><PrototypeArt name="avatar"/><strong>{state.profile.name}</strong><span>Your little wins, together</span></button>
      <nav aria-label="Main navigation">{NAV.map(({id,label,icon:Icon},i)=><div key={id}>{i===4&&<p className="nav-group-label">Your tools</p>}{i===9&&<p className="nav-group-label">Your records</p>}<button className={`nav-item ${view===id?'active':''}`} aria-current={view===id?'page':undefined} onClick={()=>setView(id)}><Icon size={22}/><span>{label}</span></button></div>)}</nav>
      <button className="privacy-link" onClick={()=>setView('settings')}>Private, saved on this device <ArrowUpRight size={13}/></button>
    </aside>
    <div className="main-shell"><header className="topbar"><span className="greeting">Good {new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, {state.profile.name}</span><div className="topbar-actions"><span className="header-date">{new Date(`${today}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span><button className="notification-button" onClick={()=>{setView('review');setToast('Your latest recorded week is ready to review.');}} aria-label="Open weekly update"><Bell size={23}/></button></div></header>
    <main>
      {warning&&<div className="storage-warning" role="alert">{warning} <button onClick={()=>setView('settings')}>Open Settings</button><button onClick={()=>window.location.reload()}>Reload saved journey</button></div>}
      {state.demo&&<div className="demo-banner"><span>🌱 You’re exploring a demo garden. These are sample entries.</span><button onClick={()=>setSetupOpen(true)}>Start my journey <ArrowUpRight size={14}/></button></div>}
      <div className="page-heading"><div><h1>{TITLES[view]}</h1>{view==='future'&&<p className="heading-description">See how your savings choices could add up. Two plans, your assumptions.</p>}{view==='streaks'&&<p className="heading-description">Small habits. Shared progress. A little more room for you.</p>}</div>{view==='habitat'&&<span className="morning-pill"><Sun size={23}/>Morning light</span>}</div>
      {view==='today'&&<WellnessDashboard {...props} today={today} reset={()=>setResetOpen(true)} logMoney={()=>setEntry('transaction')} logWorkout={()=>setEntry('workout')} logConnection={()=>setEntry('connection')}/>}
      {view==='budget'&&<Budget {...props}/>}{view==='fitness'&&<Fitness {...props} onRecap={setRecapId} onStartRoutine={beginRoutine} onResumeWorkout={()=>setWorkoutOpen(true)}/>}{view==='journey'&&<IdentityJourney {...props}/>}{view==='settings'&&<Settings {...props} onSetup={()=>setSetupOpen(true)} replace={s=>change(s,true)} raw={initial&&'raw' in initial?initial.raw:undefined}/>}
      {view==='habitat'&&<WellnessHabitat state={state} go={setView}/>}{view==='future'&&<FutureView state={state}/>}{view==='streaks'&&<StreakPower state={state} go={setView}/>}{view==='planner'&&<ScenarioPlanner {...props}/>}{view==='review'&&<WeeklyReview state={state}/>}{view==='insights'&&<><WeeklyReview state={state}/><ExerciseProgress state={state}/></>}{view==='connection'&&<ConnectionSpace {...props} reset={()=>setResetOpen(true)}/>}
      <footer className="app-footer"><span>Your little wins, together.</span><span>Saved on this device</span></footer>
    </main></div>
    <nav className="mobile-navigation" aria-label="Mobile navigation">{NAV.slice(0,4).map(({id,label,icon:Icon})=><button key={id} aria-current={view===id?'page':undefined} onClick={()=>setView(id)}><Icon size={23}/><span>{id==='today'?'Home':label}</span></button>)}</nav>
    <button className="floating-entry" onClick={()=>setEntry('pick')} aria-label="Add entry"><Heart/><Plus size={17}/></button>
    {entry==='pick'&&<Dialog title="A little win to log" onClose={()=>setEntry(null)}><p className="dialog-description">Keep a tiny record of today.</p><div className="entry-options"><button onClick={()=>setEntry('transaction')}><Wallet/><strong>Money entry</strong><span>An expense or some income</span></button><button onClick={()=>setEntry('workout')}><Dumbbell/><strong>Workout</strong><span>A walk, some reps, your movement</span></button></div></Dialog>}
    {entry==='transaction'&&<TransactionEditor {...props} onClose={()=>setEntry(null)}/>}{entry==='workout'&&<WorkoutEditor {...props} onClose={()=>setEntry(null)}/>}
    {entry==='connection'&&state.preferences.connectionEnabled&&<ConnectionEditor {...props} onClose={()=>setEntry(null)}/>}
    {resetOpen&&<ResetChooser {...props} onClose={()=>setResetOpen(false)} onLogConnection={()=>{setResetOpen(false);setEntry('connection');}}/>}
    {workoutOpen&&state.activeWorkout&&<WorkoutSession {...props} onFinished={id=>{setWorkoutOpen(false);setRecapId(id);}} storageWarning={warning} onClose={()=>setWorkoutOpen(false)}/>}
    {recap&&<WorkoutRecap workout={recap} storageWarning={warning} onClose={()=>setRecapId(null)}/>}
    {toast&&<div className="toast" role="status">✿ {toast}<button aria-label="Dismiss notification" onClick={()=>setToast('')}>×</button></div>}
  </div>;
}
