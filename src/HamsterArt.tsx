import { HAMSTER_ART, type HamsterPose } from './hamsterArtwork.ts';
import { useEffect, useRef, useState } from 'react';

export function HamsterArt({pose,className='',decorative=false,x,y,width='100%',height='100%'}:{pose:HamsterPose,className?:string,decorative?:boolean,x?:number,y?:number,width?:number|string,height?:number|string}) {
  const art=HAMSTER_ART[pose];
  const ref=useRef<SVGSVGElement>(null),[visible,setVisible]=useState(false);
  useEffect(()=>{
    if(!('IntersectionObserver' in window)){setVisible(true);return;}
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{rootMargin:'160px'});
    if(ref.current)observer.observe(ref.current);return ()=>observer.disconnect();
  },[]);
  return <svg ref={ref} className={`hamster-art ${className}`} viewBox={art.box} width={width} height={height} x={x} y={y} preserveAspectRatio="xMidYMid meet" overflow="hidden" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={decorative?undefined:art.label} focusable="false">
    {visible&&<image href={art.src} width="1536" height="1024"/>}
  </svg>;
}
