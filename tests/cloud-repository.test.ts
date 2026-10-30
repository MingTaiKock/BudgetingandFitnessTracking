import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {parseCloudRecord,createRepository} from '../src/cloud/repository.ts';

test('food entries survive online save and a second device read',async()=>{
 let row:any=null;
 const client={
  rpc:async(_name:string,args:any)=>{row={user_id:args.p_owner,state:JSON.parse(JSON.stringify(args.p_state)),revision:1,updated_at:'now'};return {data:[row],error:null};},
  from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:row,error:null})})})}),
 };
 const state=freshState();
 state.foodEntries=[{id:'food-online-test',date:'2026-10-27',meal:'Chicken rice',portion:'half plate',category:'Lunch',kcal:263,origin:'estimate',assumptions:'Half of the reference portion.'}];
 const saved=await createRepository(client as any,'owner').save(state,null);
 assert.equal(saved.kind,'saved');
 const secondDevice=await createRepository(client as any,'owner').read();
 assert.deepEqual(secondDevice?.state.foodEntries,state.foodEntries);
});
test('online records validate owner, revision and personal data',()=>{
 const row={user_id:'owner',revision:1,state:{...freshState(),demo:false},updated_at:'now'};
 assert.equal(parseCloudRecord(row,'owner').revision,1);
 assert.throws(()=>parseCloudRecord(row,'other'));
 assert.throws(()=>parseCloudRecord({...row,revision:0},'owner'));
 assert.throws(()=>parseCloudRecord({...row,state:{...row.state,demo:true}},'owner'));
});
test('save binds account and revision; rejected and stale writes cannot report success',async()=>{
 let input:unknown;let response:any={data:[],error:null};
 const client={rpc:async(_name:string,args:unknown)=>{input=args;return response;}};
 const repo=createRepository(client as any,'owner');const state={...freshState(),demo:false};
 assert.deepEqual(await repo.save(state,2),{kind:'conflict'});
 assert.equal((input as any).p_owner,'owner');assert.equal((input as any).p_expected_revision,2);
 response={data:null,error:Error('permission denied')};await assert.rejects(repo.save(state,2));
 await assert.rejects(repo.save({...state,demo:true},2));
});
