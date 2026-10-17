import { useEffect, useRef } from 'react';
import { COMPANIONS, type CompanionName } from './stickers.generated.ts';
export type { CompanionName };

// A still hamster that leans toward the pointer with a damped spring, like a
// card under a lamp. It never loops on its own: motion only answers the user,
// settles back to rest, ignores the pointer while off screen, and stays still when motion is
// reduced (OS preference or the in-app gentle-motion setting).
const MAX_TILT=9, MAX_SHIFT=5, REACH=420, STIFFNESS=0.075, DAMPING=0.8;

export function Companion({name,size=120,className='',label,still=false}:{name:CompanionName,size?:number,className?:string,label?:string,still?:boolean}) {
  const art=COMPANIONS[name];
  const ref=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el||still||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    let tx=0,ty=0,x=0,y=0,vx=0,vy=0,lift=0,targetLift=0,frame=0;
    const step=()=>{
      vx=(vx+(tx-x)*STIFFNESS)*DAMPING; vy=(vy+(ty-y)*STIFFNESS)*DAMPING; x+=vx; y+=vy;
      lift+=(targetLift-lift)*0.12;
      el.style.setProperty('--tilt-x',`${(-y*MAX_TILT).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y',`${(x*MAX_TILT).toFixed(2)}deg`);
      el.style.setProperty('--shift-x',`${(x*MAX_SHIFT).toFixed(2)}px`);
      el.style.setProperty('--shift-y',`${(y*MAX_SHIFT).toFixed(2)}px`);
      el.style.setProperty('--lift',lift.toFixed(3));
      const moving=Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)+Math.abs(targetLift-lift)>0.002;
      frame=moving?requestAnimationFrame(step):0;
    };
    const wake=()=>{if(!frame)frame=requestAnimationFrame(step);};
    const onMove=(e:PointerEvent)=>{
      // The app's gentle-motion setting puts .motion-off on the shell; honour it live.
      if(el.closest('.motion-off')){rest();return;}
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight||r.width===0)return; // off screen: no work at all
      const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      // Full attention up close, fading to nothing past REACH px.
      const pull=Math.max(0,1-Math.hypot(dx,dy)/REACH);
      tx=Math.max(-1,Math.min(1,dx/(r.width*1.5)))*pull; ty=Math.max(-1,Math.min(1,dy/(r.height*1.5)))*pull;
      targetLift=Math.abs(dx)<r.width/2&&Math.abs(dy)<r.height/2?1:0;
      wake();
    };
    const rest=()=>{tx=0;ty=0;targetLift=0;wake();};
    window.addEventListener('pointermove',onMove,{passive:true});
    document.documentElement.addEventListener('pointerleave',rest);
    window.addEventListener('blur',rest);
    return ()=>{window.removeEventListener('pointermove',onMove);document.documentElement.removeEventListener('pointerleave',rest);window.removeEventListener('blur',rest);cancelAnimationFrame(frame);};
  },[still]);
  return <span ref={ref} className={`companion ${still?'companion-still':''} ${className}`} style={{width:size}}>
    <img src={`/stickers/companion-${name}.webp`} width={size} height={Math.round(size*art.height/art.width)} alt={label??''} aria-hidden={label?undefined:true} loading="lazy" decoding="async" draggable={false}/>
    <span className="companion-shadow" aria-hidden="true"/>
  </span>;
}
