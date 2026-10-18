import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {stateSchema} from '../src/model.ts';
import {parseBackup,createBackup} from '../src/domain.ts';
import {loadState,saveState,STORAGE_KEY} from '../src/storage.ts';
import {DEFAULT_NAVIGATION,resolveNavigation,visibleDestinations} from '../src/navigation.ts';
import {createJourneyController} from '../src/cloud/controller.ts';
import type {CloudRecord,JourneyRepository} from '../src/cloud/contracts.ts';
const store=()=>{const data=new Map<string,string>();return {getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};};
const tick=()=>new Promise(r=>setTimeout(r,0));
const minimal={budget:false,fitness:false,insights:false,connection:false};
test('existing journeys and backups keep default navigation without changing records',()=>{
 const state=freshState();assert.equal(state.preferences.navigation,undefined);
 assert.deepEqual(resolveNavigation(parseBackup(createBackup(state)).preferences.navigation),DEFAULT_NAVIGATION);
 assert.deepEqual(visibleDestinations().map(d=>d.id),['habitat','budget','fitness','insights']);
 const withoutPreferences={...state} as Record<string,unknown>;delete withoutPreferences.preferences;
 assert.deepEqual(resolveNavigation(stateSchema.parse(withoutPreferences).preferences.navigation),DEFAULT_NAVIGATION);
 const legacy={...state,version:1};assert.deepEqual(resolveNavigation(parseBackup(JSON.stringify(legacy)).preferences.navigation),DEFAULT_NAVIGATION);
});
test('Home remains reachable for every optional-tab combination and Connection is independent',()=>{
 for(let mask=0;mask<16;mask++){const prefs={budget:!!(mask&1),fitness:!!(mask&2),insights:!!(mask&4),connection:!!(mask&8)};const parsed=stateSchema.parse({...freshState(),preferences:{connectionEnabled:false,gentleMotion:true,navigation:prefs}});const ids=visibleDestinations(parsed.preferences.navigation).map(d=>d.id);assert.equal(ids[0],'habitat');assert.equal(ids.includes('connection'),prefs.connection);assert.equal(parsed.preferences.connectionEnabled,false);}
 assert.deepEqual(visibleDestinations(minimal).map(d=>d.id),['habitat']);
 assert.equal(visibleDestinations({...DEFAULT_NAVIGATION,connection:true}).length,5);
});
test('navigation round trips through local storage and backup, and rejects malformed choices',()=>{
 const state=freshState();state.preferences.navigation=minimal;const memory=store();assert.equal(saveState(memory,state,null),null);assert.deepEqual(loadState(memory).state.preferences.navigation,minimal);assert.deepEqual(parseBackup(createBackup(state)).preferences.navigation,minimal);
 assert.equal(stateSchema.safeParse({...state,preferences:{...state.preferences,navigation:{...minimal,habitat:false}}}).success,false);
 assert.equal(stateSchema.safeParse({...state,preferences:{...state.preferences,navigation:{...minimal,budget:'false'}}}).success,false);
 const raw=memory.getItem(STORAGE_KEY);const failing={getItem:memory.getItem,setItem:()=>{throw Error('full');}};assert.ok(saveState(failing,{...state,preferences:{...state.preferences,navigation:{...DEFAULT_NAVIGATION}}},raw));assert.equal(memory.getItem(STORAGE_KEY),raw);
});
test('account navigation syncs to another device and failed saves remain pending until retry',async()=>{
 let server:CloudRecord={state:freshState(),revision:1,updatedAt:'now'},offline=false;
 const repo:JourneyRepository={read:async()=>structuredClone(server),save:async(state,revision)=>{if(offline)throw Error('offline');if(revision!==server.revision)return {kind:'conflict'};server={state:structuredClone(state),revision:revision+1,updatedAt:'now'};return {kind:'saved',record:structuredClone(server)};}};
 const a=createJourneyController({repository:repo,store:store(),userId:'A'}),b=createJourneyController({repository:repo,store:store(),userId:'A'});await a.load();await b.load();
 offline=true;const next={...a.getSnapshot().state!,preferences:{...a.getSnapshot().state!.preferences,navigation:minimal}};assert.equal(a.edit(next),true);await tick();assert.equal(a.getSnapshot().status,'error');assert.equal(a.getSnapshot().pending,true);assert.equal(server.state.preferences.navigation,undefined);
 offline=false;await a.retry();await b.refresh();assert.equal(a.getSnapshot().status,'saved');assert.deepEqual(b.getSnapshot().state?.preferences.navigation,minimal);
 const c=createJourneyController({repository:{read:async()=>null,save:async()=>{throw Error('unexpected');}},store:store(),userId:'B'});await c.load();assert.equal(c.getSnapshot().state,null);a.dispose();b.dispose();c.dispose();
});
