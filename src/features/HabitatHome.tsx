import { ArrowRight, Wallet, Dumbbell, Heart } from 'lucide-react';
import type { FeatureProps, View } from '../components.tsx';
import { planForDay } from '../routines.ts';
export default function HabitatHome({state,go,resume}:{state:FeatureProps['state'],go:(view:View)=>void,resume:()=>void}) {
 const planned=planForDay(state),routine=planned?.kind==='routine'?state.routines.find(r=>r.id===planned.routineId):undefined;
 return <div className="focused-home">
  <section className="focused-habitat" aria-label="Your wellness habitat">
   <img src="/prototype/habitat-clean.png" alt="Mochi and Chonk in their familiar garden, with a savings terrace, movement space and connection picnic"/>
   <button className="home-zone money" onClick={()=>go('budget')}><Wallet/>Money</button>
   <button className="home-zone movement" onClick={()=>go('fitness')}><Dumbbell/>Movement</button>
   <button className="home-zone connection" onClick={()=>go('connection')}><Heart/>Connection corner</button>
  </section>
  <div className="habitat-below"><p>Choose a zone to explore your little wins.</p><button className="text-link" onClick={()=>go('insights')}>This week’s insights <ArrowRight size={18}/></button></div>
  <section className="panel habitat-next"><div><h2>{state.activeWorkout?'Your workout is waiting':routine?routine.name:planned?.kind==='rest'?'Make room for rest':'Your movement, at your pace'}</h2><p>{state.activeWorkout?`${state.activeWorkout.routine.name} · ${state.activeWorkout.entries.length} sets recorded`:routine?`${routine.exercises.length} exercises · your plan for today`:'Choose a routine, log a walk, or take a rest day.'}</p></div><button className="button primary" onClick={()=>state.activeWorkout?resume():go('fitness')}>{state.activeWorkout?'Resume workout':'Open movement'}<ArrowRight size={17}/></button></section>
 </div>;
}
