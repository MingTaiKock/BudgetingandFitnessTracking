import { useEffect, useId, useRef, useState } from 'react';

// Clean illustration regions from the reviewed concepts. All controls and copy
// remain HTML; character roles are independent of their position in a scene.
const regions = {
  planning: ['budget', 1504, 1046, 650, 190, 820, 155],
  savings: ['budget', 1504, 1046, 1090, 586, 360, 126],
  movement: ['fitness', 1505, 1045, 670, 240, 795, 164],
  mochiRoutine: ['fitness', 1505, 1045, 305, 617, 137, 153],
  chonkRoutine: ['fitness', 1505, 1045, 305, 826, 137, 152],
  privatePair: ['settings', 1505, 1045, 965, 140, 500, 150],
  mochiPortrait: ['settings', 1505, 1045, 370, 343, 164, 111],
  chonkPortrait: ['settings', 1505, 1045, 653, 327, 163, 127],
} as const;

export function SupportingArt({name,className=''}:{name:keyof typeof regions,className?:string}) {
  const [file,imageWidth,imageHeight,x,y,width,height]=regions[name];
  const ref=useRef<HTMLDivElement>(null);
  const clipId=useId();
  const [visible,setVisible]=useState(false),[failed,setFailed]=useState(false);
  useEffect(()=>{
    if(!('IntersectionObserver' in window)){setVisible(true);return;}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();}
    },{rootMargin:'160px'});
    if(ref.current)observer.observe(ref.current);
    return ()=>observer.disconnect();
  },[]);
  return <div ref={ref} className={`supporting-art supporting-art-${name} ${className}`} style={{aspectRatio:`${width}/${height}`}} aria-hidden="true">
    {!failed&&visible&&<svg viewBox={`${x} ${y} ${width} ${height}`} preserveAspectRatio="xMidYMid meet" overflow="hidden" focusable="false"><defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height}/></clipPath></defs><image clipPath={`url(#${clipId})`} href={`/prototype/${file}-supporting.png`} width={imageWidth} height={imageHeight} onError={()=>setFailed(true)}/></svg>}
  </div>;
}

export function CompanionBanner({kind,title,description}:{kind:'planning'|'movement',title:string,description:string}) {
  return <section className={`companion-banner companion-banner-${kind}`}>
    <div className="companion-banner-copy"><h2>{title}</h2><p>{description}</p></div>
    <SupportingArt name={kind}/>
  </section>;
}
