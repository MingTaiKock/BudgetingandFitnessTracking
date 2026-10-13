import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, X, Trash2, ArrowUpRight } from 'lucide-react';
import { monthLabel, shiftMonth } from './dates.ts';
import type { State } from './model.ts';
export type View='today'|'budget'|'fitness'|'journey'|'settings'|'insights'|'connection'|'habitat'|'future'|'streaks'|'planner'|'review';
export type FeatureProps={state:State,change:(next:State)=>boolean,notice:(text:string)=>void};
export function Progress({value,max,color,label='Progress'}: {value:number,max:number,color?:string,label?:string}) {
  const pct=max>0?Math.min(100,Math.max(0,value/max*100)):value>0?100:0;
  return <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label} aria-valuetext={`${value} of ${max}`}><span style={{width:`${pct}%`,background:color}}/></div>;
}
export function SectionTitle({title,subtitle,action}:{title:string,subtitle?:string,action?:ReactNode}) {return <div className="section-title"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>;}
export function MonthPicker({month,onChange}:{month:string,onChange:(v:string)=>void}) {
  return <div className="month-picker"><button className="icon-button" aria-label="Previous month" onClick={()=>onChange(shiftMonth(month,-1))}><ChevronLeft size={17}/></button><label><span className="sr-only">Budget month</span><input type="month" value={month} onChange={e=>e.target.value&&onChange(e.target.value)} min="1900-01" max="2099-12" aria-label={monthLabel(month)}/></label><button className="icon-button" aria-label="Next month" onClick={()=>onChange(shiftMonth(month,1))}><ChevronRight size={17}/></button></div>;
}
export function Dialog({title,onClose,children,wide=false}:{title:string,onClose:()=>void,children:ReactNode,wide?:boolean}) {
  const ref=useRef<HTMLDivElement>(null),closeRef=useRef(onClose);closeRef.current=onClose;
  const titleId=useRef(`dialog-${crypto.randomUUID()}`);
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement; const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    const focusable=()=>Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')??[]).filter(el=>el.getClientRects().length>0);
    (ref.current?.querySelector<HTMLElement>('input, select, textarea')??focusable()[0])?.focus();
    const ensureFocus=()=>{const active=document.activeElement as HTMLElement;const list=focusable();if(!ref.current?.contains(active)||active.matches(':disabled'))(list[0]??ref.current)?.focus();};
    const observer=new MutationObserver(ensureFocus);if(ref.current)observer.observe(ref.current,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();closeRef.current();}if(e.key==='Tab'){const list=focusable(),first=list[0],last=list.at(-1);if(!list.includes(document.activeElement as HTMLElement)){e.preventDefault();(e.shiftKey?last:first)?.focus();}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};
    document.addEventListener('keydown',onKey);return ()=>{observer.disconnect();document.removeEventListener('keydown',onKey);document.body.style.overflow=overflow;previous?.focus();};
  },[]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div ref={ref} className={`dialog ${wide?'dialog-wide':''}`} role="dialog" aria-modal="true" aria-labelledby={titleId.current}><header><h2 id={titleId.current}>{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={22}/></button></header>{children}</div></div>;
}
export function ConfirmButton({children,title,description,onConfirm,className='button secondary'}:{children:ReactNode,title:string,description:string,onConfirm:()=>void|boolean,className?:string}) {
  const [open,setOpen]=useState(false);
  return <><button className={className} onClick={()=>setOpen(true)}>{children}</button>{open&&<Dialog title={title} onClose={()=>setOpen(false)}><p className="dialog-description">{description}</p><div className="form-actions"><button className="button secondary" onClick={()=>setOpen(false)}>Keep my journey</button><button className="button danger" onClick={()=>{if(onConfirm()!==false)setOpen(false);}}>Confirm</button></div></Dialog>}</>;
}
export function DeleteButton({label,onDelete,description='This entry will be removed and its totals and rewards recalculated. Download a backup in Settings if you want to keep a copy.'}:{label:string,onDelete:()=>void,description?:string}) {return <ConfirmButton className="icon-button delete-button" title={`Delete ${label}?`} description={description} onConfirm={onDelete}><Trash2 size={16}/><span className="sr-only">Delete {label}</span></ConfirmButton>;}
export function Field({label,children,hint}:{label:string,children:ReactNode,hint?:string}) {return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>;}
export function FormError({error}:{error:string}) {return error?<p className="form-error" role="alert">{error}</p>:null;}
export function Empty({title,children}:{title:string,children?:ReactNode}) {return <div className="empty"><span className="empty-sprout">🌱</span><h3>{title}</h3>{children}</div>;}
export function TextLink({children,onClick}:{children:ReactNode,onClick:()=>void}) {return <button className="text-link" onClick={onClick}>{children}<ArrowUpRight size={15}/></button>;}
