import { useEffect, useRef, useState, type ReactNode } from 'react';
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
import HabitatHome from './features/HabitatHome.tsx';
import DailyCheckin from './features/DailyCheckin.tsx';
import { Sticker, type StickerName } from './Sticker.tsx';
import { demoState } from './demo.ts';
import NavigationSettings, {NAVIGATION_ICONS} from './features/NavigationSettings.tsx';
import {resolveNavigation,sameNavigation,visibleDestinations} from './navigation.ts';
type ExternalJourney={state:State,change:(next:State)=>boolean,status:string,warning:string|null,accountPanel:ReactNode,retry?:()=>void};
const TITLES:Record<View,string>={today:'Your wellness, together',insights:'Your wellness insights',journey:'Your Identity Journey',connection:'Make room for connection',habitat:'Your Wellness Habitat',future:'Your Future Self',streaks:'Your Wellness Streak Power',planner:'Adjust Your Plan Together',review:'Your Weekly Wellness Summary',budget:'Your money, with a plan',fitness:'Your movement, at your pace',settings:'Your private corner'};
export default function App({external,demoOnly=false,accountEntry,onRequestSignIn}:{external?:ExternalJourney,demoOnly?:boolean,accountEntry?:ReactNode,onRequestSignIn?:()=>void}) {
  const [initial]=useState(()=>{if(external)return {state:external.state,error:null,isNew:false};if(demoOnly)return {state:demoState(),error:null,isNew:false};try{return loadState(localStorage);}catch{return {state:null,error:'Browser storage is unavailable.',isNew:false};}});
  // The fallback uses the same storage recovery path without touching unavailable localStorage.
  const [localState,setState]=useState<State>(()=>initial.state??loadState({getItem:()=>{throw Error();}}).state);
  const state=external?.state??localState;
  const [warning,setWarning]=useState(initial.error),[blocked,setBlocked]=useState(Boolean(initial.error));
  const savedRaw=useRef('currentRaw' in initial?initial.currentRaw:null);
  useEffect(()=>{
    if(external||demoOnly)return;
    const onStorage=(event:StorageEvent)=>{if(event.key===STORAGE_KEY&&event.newValue!==savedRaw.current){setWarning('Another tab changed this journey. Download a backup of this tab before reloading the saved version.');}};
    window.addEventListener('storage',onStorage);return ()=>window.removeEventListener('storage',onStorage);
  },[]);
  const [workoutOpen,setWorkoutOpen]=useState(false);
  const [recapId,setRecapId]=useState<string|null>(null);
  const recap=state.workouts.find(w=>w.id===recapId);
  const [setupOpen,setSetupOpen]=useState(Boolean(initial.isNew));
  const [view,setPage]=useState<View>('habitat'),[today,setToday]=useState(dateKey()),[toast,setToast]=useState<{text:string,sticker?:StickerName}|null>(null),[entry,setEntry]=useState<'pick'|'transaction'|'workout'|'connection'|null>(null);
  function setView(next:View){setPage(next==='today'?'habitat':next==='review'?'insights':next==='future'?'planner':next);window.scrollTo(0,0);}
  const activeView=['journey','streaks'].includes(view)?'insights':view==='planner'?'budget':view;
  const [navigationEpoch,setNavigationEpoch]=useState(0);
  const [confirmedNavigation,setConfirmedNavigation]=useState(()=>resolveNavigation(external&&external.status!=='Saved online'?undefined:state.preferences.navigation));
  const navigationKey=JSON.stringify(state.preferences.navigation);
  useEffect(()=>{if(!warning&&!external?.warning&&(!external||external.status==='Saved online')){const next=resolveNavigation(state.preferences.navigation);setConfirmedNavigation(previous=>sameNavigation(previous,next)?previous:next);}},[navigationKey,warning,external?.warning,external?.status]);
  const NAV=visibleDestinations(confirmedNavigation).map(item=>({...item,icon:NAVIGATION_ICONS[item.id]}));
  const [resetOpen,setResetOpen]=useState(false);
  useEffect(()=>{const timer=setInterval(()=>setToday(dateKey()),30000);return ()=>clearInterval(timer);},[]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),toast.sticker?8000:4500);return ()=>clearTimeout(timer);},[toast]);
  function change(next:State,replace=false) {
    const result=stateSchema.safeParse(next);
    if(!result.success){setToast({text:'Please check the entry. Use valid dates, amounts, and names.'});return false;}
    if(external){const accepted=external.change(result.data);if(accepted&&replace)setNavigationEpoch(n=>n+1);return accepted;}
    if(demoOnly){if(!result.data.demo){onRequestSignIn?.();return false;}setState(result.data);return true;}
    if(blocked&&!replace){setState(result.data);return false;}
    let error:string|null;try{error=saveState(localStorage,result.data,savedRaw.current??null);}catch{error='Browser storage is unavailable. Download a backup before leaving.';}
    if(!error){savedRaw.current=JSON.stringify(result.data);setState(result.data);setBlocked(false);if(replace)setNavigationEpoch(n=>n+1);}
    else if(!replace)setState(result.data);
    setWarning(error);return !error;
  }
  const props={state,change,notice:(message:string,sticker?:StickerName)=>setToast({text:external&&!sticker?`${message} Check the online save status for confirmation.`:message,sticker}),go:setView};
  const saveLabel=external?.status??(demoOnly?'Demo · changes reset when closed':warning?'Not saved · download a backup':'Saved on this device');
  const openSetup=()=>demoOnly?onRequestSignIn?.():setSetupOpen(true);
  function beginRoutine(routine:Routine,index=0) {
    if(state.activeWorkout){setWorkoutOpen(true);return;}
    if(change({...state,activeWorkout:{...startSession(routine),index,reps:String(routine.exercises[index].repMin),kg:String(routine.exercises[index].plannedKg??0)}}))setWorkoutOpen(true);
  }
  function finishSetup(next:State):string|null {
    if(!state.demo)return 'Your personal journey already exists. Use Settings to edit your preferences.';
    const parsed=stateSchema.safeParse(next);
    if(!parsed.success||parsed.data.demo)return 'Please check your setup choices and try again.';
    let error:string|null;
    try{error=saveState(localStorage,parsed.data,savedRaw.current??null);}catch{error='Browser storage is unavailable. Your demo is unchanged. Enable storage and try again.';}
    if(error)return `${error} Your current journey is unchanged; your setup choices are still here.`;
    savedRaw.current=JSON.stringify(parsed.data);setState(parsed.data);setWarning(null);setBlocked(false);setSetupOpen(false);setView('today');
    setToast({text:'Your own little journey is ready. Welcome home.',sticker:'cream-celebrating'});return null;
  }
  if(setupOpen&&state.demo)return <Onboarding state={state} onFinish={finishSetup} onExplore={()=>{change(state);setSetupOpen(false);}}/>;
  return <div className={`app-shell ${state.preferences.gentleMotion?'':'motion-off'}`}>
    <aside className="sidebar"><a className="brand" href="#home" onClick={e=>{e.preventDefault();setView('habitat');}}><span className="wellness-logo"><Heart/><Leaf/></span><span>Small Wins</span></a>
      <button className="sidebar-profile" onClick={()=>setView('settings')}><PrototypeArt name="avatar"/><strong>{state.profile.name}</strong><span>Your little wins, together</span></button>
      <nav aria-label="Main navigation">{NAV.map(({id,label,icon:Icon})=><button key={id} className={`nav-item ${activeView===id?'active':''}`} aria-current={activeView===id?'page':undefined} onClick={()=>setView(id)}><Icon size={22}/><span>{label}</span></button>)}</nav>
      <button className="nav-item settings-nav" onClick={()=>setView('settings')}><SettingsIcon size={22}/>Settings</button>
      <button className="privacy-link" onClick={()=>setView('settings')}>{saveLabel}<ArrowUpRight size={13}/></button>
    </aside>
    <div className="main-shell"><header className="topbar"><span className="greeting">Good {new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, {state.profile.name}</span><div className="topbar-actions"><span className="header-date">{new Date(`${today}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span><button className="notification-button" onClick={()=>{setView('review');setToast({text:'Your latest recorded week is ready to review.'});}} aria-label="Open weekly update"><Bell size={23}/></button></div></header>
    <main>
      {(external?.warning||warning)&&<div className="storage-warning" role="alert">{external?.warning||warning} <button onClick={()=>setView('settings')}>Open Settings</button>{!external&&<button onClick={()=>window.location.reload()}>Reload saved journey</button>}</div>}
      {state.demo&&<div className="demo-banner"><span>You’re exploring a demo garden. These are sample entries.</span><button onClick={openSetup}>Start my journey <ArrowUpRight size={14}/></button></div>}
      {view==='connection'&&<nav className="connection-breadcrumb" aria-label="Breadcrumb"><button onClick={()=>setView('habitat')}>Home</button><span aria-hidden="true">›</span><span aria-current="page">Connection Corner</span></nav>}
      <div className="page-heading"><div><h1>{view==='planner'?'A small change':TITLES[view]}</h1></div><button className="icon-button" aria-label="Account and settings" onClick={()=>setView('settings')}><SettingsIcon size={22}/></button></div>
      <div className="navigation-settings-container" hidden={view!=='settings'}><NavigationSettings key={navigationEpoch} value={confirmedNavigation} onSave={navigation=>change({...state,preferences:{...state.preferences,navigation}})} saveLabel={saveLabel} warning={external?.warning??warning} pending={external?.status==='Saving online…'||external?.status==='Loading online records'} conflict={external?.status==='Newer version on another device'} onRetry={external?.retry} cloud={Boolean(external)} demo={demoOnly}/></div>
      {view==='budget'&&<Budget {...props} onPlan={()=>setView('planner')}/>}{view==='fitness'&&<Fitness {...props} onRecap={setRecapId} onStartRoutine={beginRoutine} onResumeWorkout={()=>setWorkoutOpen(true)}/>}{view==='journey'&&<IdentityJourney {...props}/>}{view==='settings'&&<Settings {...props} cloud={Boolean(external)} accountPanel={external?.accountPanel??accountEntry} onSetup={openSetup} replace={s=>change(s,true)} raw={initial&&'raw' in initial?initial.raw:undefined}/>}
      {view==='habitat'&&<HabitatHome state={state} go={setView} resume={()=>setWorkoutOpen(true)}/>}{view==='streaks'&&<StreakPower state={state} go={setView}/>}{view==='planner'&&<ScenarioPlanner {...props}/>}{view==='insights'&&<><WeeklyReview {...props}/><details className="secondary-tools"><summary>Progress & little wins</summary><div className="form-actions"><button className="button secondary" onClick={()=>setView('journey')}>My intentions</button><button className="button secondary" onClick={()=>setView('streaks')}>Recorded streaks</button></div></details></>}{view==='connection'&&<ConnectionSpace {...props} reset={()=>setResetOpen(true)}/>}
      {view==='habitat'&&<DailyCheckin {...props}/>}
      <footer className="app-footer"><span>Your little wins, together.</span><span role="status">{saveLabel}</span></footer>
    </main></div>
    <nav className="mobile-navigation" aria-label="Mobile navigation">{NAV.map(({id,label,icon:Icon})=><button key={id} aria-current={activeView===id?'page':undefined} onClick={()=>setView(id)}><Icon size={23}/><span>{label}</span></button>)}</nav>
    <button className="floating-entry" onClick={()=>setEntry('pick')} aria-label="Add entry"><Heart/><Plus size={17}/></button>
    {entry==='pick'&&<Dialog title="A little win to log" onClose={()=>setEntry(null)}><p className="dialog-description">Keep a tiny record of today.</p><div className="entry-options"><button onClick={()=>setEntry('transaction')}><Wallet/><strong>Money entry</strong><span>An expense or some income</span></button><button onClick={()=>setEntry('workout')}><Dumbbell/><strong>Workout</strong><span>A walk, some reps, your movement</span></button></div></Dialog>}
    {entry==='transaction'&&<TransactionEditor {...props} onClose={()=>setEntry(null)}/>}{entry==='workout'&&<WorkoutEditor {...props} onClose={()=>setEntry(null)}/>}
    {entry==='connection'&&state.preferences.connectionEnabled&&<ConnectionEditor {...props} onClose={()=>setEntry(null)}/>}
    {resetOpen&&<ResetChooser {...props} onClose={()=>setResetOpen(false)} onLogConnection={()=>{setResetOpen(false);setEntry('connection');}}/>}
    {workoutOpen&&state.activeWorkout&&<WorkoutSession {...props} saveLabel={saveLabel} onFinished={id=>{setWorkoutOpen(false);setRecapId(id);}} storageWarning={external?.warning??warning} onClose={()=>setWorkoutOpen(false)}/>}
    {recap&&<WorkoutRecap workout={recap} saveLabel={saveLabel} still={!state.preferences.gentleMotion} storageWarning={external?.warning??warning} onClose={()=>setRecapId(null)}/>}
    {toast&&<div className={`toast ${toast.sticker?'toast-with-sticker':''}`} role="status" aria-atomic="true">{toast.sticker&&!(external?.warning??warning)?<Sticker name={toast.sticker} size={76} still={!state.preferences.gentleMotion}/>:null}<div className="toast-copy"><strong>{toast.sticker&&(external?.warning??warning)?'Your entry needs attention':toast.text}</strong>{toast.sticker&&<small>{external?.warning??warning??saveLabel}</small>}</div><button aria-label="Dismiss notification" onClick={()=>setToast(null)}>×</button></div>}
  </div>;
}
