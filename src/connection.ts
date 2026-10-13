import { stateSchema, connectionSchema, type State } from './model.ts';
export function putConnection(s:State,input:unknown):State {
  if(!s.preferences.connectionEnabled)throw Error('Enable the optional connection diary first.');
  const entry=connectionSchema.parse(input);
  return stateSchema.parse({...s,connections:[...s.connections.filter(c=>c.id!==entry.id),entry]});
}
export function removeConnection(s:State,id:string):State {return {...s,connections:s.connections.filter(c=>c.id!==id)};}
export function beginReset(s:State,kind:'pause'|'connection',now=Date.now()):State {
  if(s.activeReset)return s;
  if(kind==='connection'&&!s.preferences.connectionEnabled)throw Error('Enable the optional connection diary first.');
  return stateSchema.parse({...s,activeReset:{id:crypto.randomUUID(),kind,startedAt:now,endsAt:now+90_000}});
}
export function resetRemaining(s:State,now=Date.now()):number {return s.activeReset?Math.max(0,Math.ceil((s.activeReset.endsAt-now)/1000)):0;}
