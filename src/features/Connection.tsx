import { useRef, useState, type FormEvent } from 'react';
import { Heart, Pencil } from 'lucide-react';
import { type Connection, type State } from '../model.ts';
import { dateKey } from '../domain.ts';
import { shortDate } from '../dates.ts';
import { putConnection, removeConnection } from '../connection.ts';
import { Dialog, Field, FormError, Empty, DeleteButton, SectionTitle, type FeatureProps } from '../components.tsx';

export function ConnectionEditor({state,change,notice,onClose,entry}:FeatureProps&{onClose:()=>void,entry?:Connection}) {
  const id=useRef(entry?.id??crypto.randomUUID()),[error,setError]=useState('');
  function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();const f=new FormData(e.currentTarget);
    try {const next=putConnection(state,{id:id.current,date:f.get('date'),minutes:Number(f.get('minutes')),activity:f.get('activity'),note:f.get('note'),origin:'manual'});
      if(change(next)){notice('Your connection time is recorded.');onClose();}else setError('This entry is in memory. Download a backup in Settings before leaving.');
    }catch{setError('Use a valid past or present date and whole minutes from 1 to 1440. Daily connection entries cannot total more than 24 hours.');}
  }
  return <Dialog title={entry?'Edit connection time':'A moment of connection'} onClose={onClose}><p className="dialog-description">A voluntary record of time together. No messages or partner activity are collected.</p><form onSubmit={submit}><div className="form-grid"><Field label="Connection date"><input type="date" name="date" required max={dateKey()} min="1900-01-01" defaultValue={entry?.date??dateKey()}/></Field><Field label="Connection minutes"><input name="minutes" type="number" min={1} max={1440} step={1} required defaultValue={entry?.minutes??20}/></Field></div><Field label="Connection activity"><select name="activity" defaultValue={entry?.activity??'conversation'}><option value="conversation">Conversation</option><option value="shared-meal">Shared meal</option><option value="walk">Walk together</option><option value="shared-activity">Shared activity</option><option value="other">Other</option></select></Field><Field label="Connection note (optional)"><textarea name="note" maxLength={300} defaultValue={entry?.note??''}/></Field><FormError error={error}/><div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit">Save connection</button></div></form></Dialog>;
}
export default function ConnectionDiary(props:FeatureProps) {
  const {state,change}=props,[editing,setEditing]=useState<Connection|null|undefined>(undefined);
  if(!state.preferences.connectionEnabled)return null;
  const rows=[...state.connections].sort((a,b)=>b.date.localeCompare(a.date));
  return <section className="panel connection-diary"><SectionTitle title="Time for connection" subtitle="Only the moments you choose to record." action={<button className="button secondary compact" onClick={()=>setEditing(null)}><Heart size={16}/>Log connection</button>}/>{rows.length===0?<Empty title="Make room for a little together time">Record a conversation, meal or shared activity whenever you like.</Empty>:<div className="connection-list">{rows.map(c=><article key={c.id}><span className="connection-heart"><Heart size={20}/></span><div><strong>{c.activity.replaceAll('-',' ')} · {c.minutes} min</strong><p>{shortDate(c.date)}{c.note?` · ${c.note}`:''}</p></div><button className="icon-button" aria-label={`Edit connection ${c.date}`} onClick={()=>setEditing(c)}><Pencil size={16}/></button><DeleteButton label={`connection ${c.date}`} onDelete={()=>change(removeConnection(state,c.id))}/></article>)}</div>}{editing!==undefined&&<ConnectionEditor {...props} entry={editing??undefined} onClose={()=>setEditing(undefined)}/>}</section>;
}
export function enableConnection(s:State):State {return {...s,preferences:{...s.preferences,connectionEnabled:true}};}
