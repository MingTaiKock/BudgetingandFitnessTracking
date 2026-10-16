import { stateSchema, type State } from '../model.ts';
import type { JourneyRepository, Recovery, SyncSnapshot } from './contracts.ts';
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export const recoveryKey=(id:string)=>`small-wins:pending:v1:${id}`;
function personal(input:unknown){const s=stateSchema.parse(input);if(s.demo)throw Error('Demo records cannot be saved online.');return s;}
export function readRecovery(store:Store,userId:string):Recovery|null {
 const raw=store.getItem(recoveryKey(userId));if(raw===null)return null;
 const r=JSON.parse(raw);if(r.userId!==userId||!Number.isInteger(r.baseRevision)||r.baseRevision<0)throw Error('Invalid recovery copy. Download it before continuing.');return {...r,state:personal(r.state)};
}
export function writeRecovery(store:Store,userId:string,recovery:Recovery){
 if(recovery.userId!==userId||!Number.isInteger(recovery.baseRevision)||recovery.baseRevision<0)throw Error('Recovery owner or revision mismatch.');
 store.setItem(recoveryKey(userId),JSON.stringify({...recovery,state:personal(recovery.state)}));
}
export function createJourneyController({repository,store,userId}:{repository:JourneyRepository,store:Store,userId:string}){
 let snap:SyncSnapshot={state:null,revision:0,status:'loading',pending:false,error:null,recoveryError:null};
 let disposed=false,busy=false,loaded=false,serial=0,reading=false,recoveryRaw:string|null=null;
 const listeners=new Set<()=>void>();
 const emit=(patch:Partial<SyncSnapshot>)=>{if(disposed)return;snap={...snap,...patch};listeners.forEach(fn=>fn());};
 function recover(){if(!snap.state||!snap.pending)return;try{if(store.getItem(recoveryKey(userId))!==recoveryRaw)throw Error('Another tab owns the recovery copy');writeRecovery(store,userId,{userId,baseRevision:snap.revision,state:snap.state});recoveryRaw=store.getItem(recoveryKey(userId));emit({recoveryError:null});}catch{emit({recoveryError:'A recovery copy could not be saved on this device, or another tab has pending changes. These edits may be in memory only. Download a backup before closing.'});}}
 function clearRecovery(){try{if(store.getItem(recoveryKey(userId))===recoveryRaw)store.removeItem(recoveryKey(userId));recoveryRaw=null;emit({recoveryError:null});}catch{emit({recoveryError:'Could not remove the older local recovery copy. Download a backup before clearing browser data.'});}}
 async function flush(){
  if(disposed||busy||!loaded||!snap.pending||!snap.state||snap.status==='conflict')return;
  busy=true;
  try{while(!disposed&&snap.pending&&snap.state){
   const sent=structuredClone(snap.state),version=serial,base=snap.revision;emit({status:'saving',error:null});
   const result=await repository.save(sent,base);if(disposed)return;
   if(result.kind==='conflict'){emit({status:'conflict',error:'Another device saved a different version. Download your pending backup before loading online records.'});return;}
   if(result.record.revision!==base+1)throw Error('Unexpected server revision.');
   emit({revision:result.record.revision});
   if(version===serial){emit({pending:false,status:'saved',error:null});clearRecovery();}
   else recover();
  }}catch{if(!disposed)emit({status:'error',error:'Online save failed. Your changes are pending. Check your connection and retry; export a backup before leaving.'});}
  finally{busy=false;}
 }
 async function load(){
  if(disposed||reading||busy||loaded&&snap.pending)return;
  reading=true;const version=serial;if(!loaded)emit({status:'loading',error:null});
  try{
   let pending:Recovery|null=null;try{pending=readRecovery(store,userId);recoveryRaw=store.getItem(recoveryKey(userId));}catch{emit({status:'error',error:'Cannot read the local recovery copy. Export recovery data before resolving it.'});return;}
   const remote=await repository.read();if(disposed||serial!==version)return;loaded=true;
   if(pending){emit({state:pending.state,revision:pending.baseRevision,pending:true,status:pending.baseRevision===(remote?.revision??0)?'ready':'conflict',error:pending.baseRevision===(remote?.revision??0)?null:'Another device saved newer changes. Keep a backup before loading online records.'});if(snap.status!=='conflict')void flush();}
   else emit({state:remote?.state??null,revision:remote?.revision??0,status:remote?'saved':'ready',pending:false,error:null});
  }catch{emit({status:'error',error:'Could not load your online journey. No records were replaced. Check your connection and retry.'});}
  finally{reading=false;}
 }
 function edit(input:State){
  if(disposed||!loaded||snap.status==='conflict'||snap.status==='loading')return false;
  let next:State;try{next=personal(input);}catch{return false;}
  serial++;emit({state:next,pending:true});recover();void flush();return true;
 }
 async function reloadOnline(){
  if(disposed||busy||reading)return;reading=true;
  const version=serial;
  try{const remote=await repository.read();if(disposed)return;if(serial!==version){emit({error:'New edits were made while loading. They were kept. Download a backup and try again.'});return;}const raw=store.getItem(recoveryKey(userId));if(raw){store.setItem(`${recoveryKey(userId)}:archived:${Date.now()}`,raw);}recoveryRaw=raw;serial++;loaded=true;emit({state:remote?.state??null,revision:remote?.revision??0,pending:false,status:remote?'saved':'ready',error:null});clearRecovery();}
  catch{emit({error:'Could not reload online records. Your pending copy is still here.'});}
  finally{reading=false;}
 }
 return {getSnapshot:()=>snap,subscribe:(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};},load,edit,retry:async()=>{if(!loaded||!snap.pending)return load();if(snap.status==='conflict')return;await flush();},refresh:load,reloadOnline,dispose:()=>{disposed=true;listeners.clear();}};
}
