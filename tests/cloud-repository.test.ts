import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {parseCloudRecord,createRepository} from '../src/cloud/repository.ts';
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
