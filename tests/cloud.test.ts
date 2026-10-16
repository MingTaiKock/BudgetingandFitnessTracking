import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import { createJourneyController, readRecovery, writeRecovery } from '../src/cloud/controller.ts';
import type { CloudRecord, JourneyRepository } from '../src/cloud/contracts.ts';
const personal=()=>({...freshState(),demo:false});
const store=()=>{const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};};
const record=(revision=1):CloudRecord=>({state:personal(),revision,updatedAt:'2026-10-15T00:00:00Z'});
const tick=()=>new Promise(r=>setTimeout(r,0));
test('retry reloads a failed clean refresh',async()=>{
 let fails=false;const c=createJourneyController({repository:{read:async()=>{if(fails)throw Error('offline');return record();},save:async()=>({kind:'conflict'})},store:store(),userId:'A'});
 await c.load();fails=true;await c.refresh();assert.equal(c.getSnapshot().status,'error');fails=false;await c.retry();assert.equal(c.getSnapshot().status,'saved');c.dispose();
});
test('explicit reload archives corrupt recovery and restores an account',async()=>{
 const s=store();s.setItem('small-wins:pending:v1:A','broken');const c=createJourneyController({repository:{read:async()=>record(),save:async()=>({kind:'conflict'})},store:s,userId:'A'});await c.load();assert.equal(c.getSnapshot().status,'error');await c.reloadOnline();assert.equal(c.getSnapshot().status,'saved');assert.equal(s.getItem('small-wins:pending:v1:A'),null);c.dispose();
});
test('reload never overwrites edits made while the remote read is pending',async()=>{
 let resolve:(r:CloudRecord)=>void=()=>{};let reads=0;const c=createJourneyController({repository:{read:()=>++reads===1?Promise.resolve(record()):new Promise(r=>{resolve=r;}),save:async()=>{throw Error('offline');}},store:store(),userId:'A'});await c.load();const loading=c.reloadOnline();const changed=personal();changed.profile.name='Keep me';c.edit(changed);resolve(record());await loading;assert.equal(c.getSnapshot().state?.profile.name,'Keep me');assert.equal(c.getSnapshot().pending,true);c.dispose();
});
test('competing tab cannot replace or clear a different pending recovery snapshot',async()=>{
 const shared=store();let finishA:()=>void=()=>{};
 const repo:JourneyRepository={read:async()=>record(),save:(state,revision)=>new Promise(resolve=>{finishA=()=>resolve({kind:'saved',record:{state,revision:revision+1,updatedAt:'now'}});})};
 const a=createJourneyController({repository:repo,store:shared,userId:'A'}),b=createJourneyController({repository:{read:async()=>record(),save:async()=>{throw Error('offline');}},store:shared,userId:'A'});
 await a.load();await b.load();const first=personal();first.profile.name='First';a.edit(first);const second=personal();second.profile.name='Second';b.edit(second);await tick();assert.equal(readRecovery(shared,'A')?.state.profile.name,'First');assert.match(b.getSnapshot().recoveryError??'',/memory only/);finishA();await tick();assert.equal(b.getSnapshot().state?.profile.name,'Second');assert.equal(b.getSnapshot().pending,true);a.dispose();b.dispose();
});
test('recovery is owner scoped, validated and preserves corrupt bytes',()=>{const s=store();writeRecovery(s,'A',{userId:'A',baseRevision:1,state:personal()});assert.equal(readRecovery(s,'B'),null);assert.equal(readRecovery(s,'A')?.baseRevision,1);assert.throws(()=>writeRecovery(s,'A',{userId:'B',baseRevision:1,state:personal()}));assert.throws(()=>writeRecovery(s,'A',{userId:'A',baseRevision:1,state:{...personal(),demo:true}}));s.setItem('small-wins:pending:v1:A','bad');assert.throws(()=>readRecovery(s,'A'));assert.equal(s.getItem('small-wins:pending:v1:A'),'bad');});
test('serialized saves preserve newer edits and acknowledge only the latest snapshot',async()=>{
 let resolve:(v:any)=>void=()=>{};let calls=0;const revisions:number[]=[];
 const repo:JourneyRepository={read:async()=>record(),save:(state,revision)=>{calls++;revisions.push(revision);return new Promise(r=>{resolve=()=>r({kind:'saved',record:{state,revision:revision+1,updatedAt:'now'}});});}};
 const c=createJourneyController({repository:repo,store:store(),userId:'A'});await c.load();const a=personal(),b=personal();a.profile.name='A';b.profile.name='B';c.edit(a);c.edit(b);assert.equal(calls,1);resolve(null);await tick();assert.equal(calls,2);assert.equal(c.getSnapshot().state?.profile.name,'B');assert.equal(c.getSnapshot().pending,true);resolve(null);await tick();assert.equal(c.getSnapshot().status,'saved');assert.deepEqual(revisions,[1,2]);c.dispose();
});
test('lost response and stale revision never silently overwrite a newer device',async()=>{
 let attempts=0;const repo:JourneyRepository={read:async()=>record(),save:async()=>{if(!attempts++)throw Error('Network lost');return {kind:'conflict'};}};const c=createJourneyController({repository:repo,store:store(),userId:'A'});await c.load();c.edit(personal());await tick();assert.equal(c.getSnapshot().pending,true);await c.retry();assert.equal(c.getSnapshot().status,'conflict');assert.equal(c.getSnapshot().pending,true);assert.equal(c.edit(personal()),false);c.dispose();
});
test('disposed read cannot populate a later account, and demo cannot upload',async()=>{
 let resolve:(r:CloudRecord)=>void=()=>{};const repo:JourneyRepository={read:()=>new Promise(r=>{resolve=r;}),save:async()=>{throw Error('must not write');}};const c=createJourneyController({repository:repo,store:store(),userId:'A'});const p=c.load();c.dispose();resolve(record());await p;assert.equal(c.getSnapshot().state,null);assert.equal(c.edit({...personal(),demo:true}),false);
});
test('dirty recovery keeps its original revision and reaches conflict instead of rebasing',async()=>{
 const s=store();const p=personal();p.profile.name='Pending';writeRecovery(s,'A',{userId:'A',state:p,baseRevision:1});const c=createJourneyController({repository:{read:async()=>record(2),save:async()=>({kind:'conflict'})},store:s,userId:'A'});await c.load();assert.equal(c.getSnapshot().status,'conflict');assert.equal(c.getSnapshot().revision,1);assert.equal(c.getSnapshot().state?.profile.name,'Pending');c.dispose();
});
test('failed remote read is not an empty account and storage failure remains visible',async()=>{
 const c=createJourneyController({repository:{read:async()=>{throw Error('Offline');},save:async()=>({kind:'conflict'})},store:store(),userId:'A'});await c.load();assert.equal(c.getSnapshot().status,'error');assert.equal(c.getSnapshot().state,null);assert.equal(c.edit(personal()),false);
 const full={getItem:()=>null,setItem:()=>{throw Error('Full');},removeItem:()=>{}};const d=createJourneyController({repository:{read:async()=>record(),save:async()=>{throw Error('Offline');}},store:full,userId:'B'});await d.load();d.edit(personal());await tick();assert.match(d.getSnapshot().recoveryError??'',/backup/i);assert.equal(d.getSnapshot().pending,true);c.dispose();d.dispose();
});
