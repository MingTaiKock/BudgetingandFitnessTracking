import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import { parseBackup } from '../src/domain.ts';
import { loadState, saveState, STORAGE_KEY } from '../src/storage.ts';

function memoryStore() {
  const data=new Map<string,string>();
  return {data,getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{data.set(key,value);}};
}
test('legacy records migrate to version two without overwriting the original payload',()=>{
  const store=memoryStore(),old={...freshState(),version:1};
  const raw=JSON.stringify(old);store.setItem('little-wins:journey:v1',raw);
  const loaded=loadState(store);
  assert.equal(loaded.state.version,2);
  assert.equal(saveState(store,loaded.state),null);
  assert.equal(store.getItem('little-wins:journey:v1'),raw);
  assert.equal(JSON.parse(store.getItem(STORAGE_KEY)!).version,2);
  assert.deepEqual(loadState(store).state.routines,old.routines);
});
test('failed migrated writes leave legacy records available for another load',()=>{
  const raw=JSON.stringify({...freshState(),version:1});
  const store={getItem:(key:string)=>key==='little-wins:journey:v1'?raw:null,setItem:()=>{throw Error('quota');}};
  const loaded=loadState(store);
  assert.ok(saveState(store,loaded.state));
  assert.equal(loadState(store).state.version,2);
  assert.equal(store.getItem('little-wins:journey:v1'),raw);
});
test('dated backup envelopes restore while unknown envelopes are rejected',()=>{
  const state=freshState();
  assert.deepEqual(parseBackup(JSON.stringify({format:'little-wins',exportedAt:'2026-10-12T00:00:00.000Z',state})),state);
  assert.throws(()=>parseBackup(JSON.stringify({format:'other',exportedAt:'2026-10-12T00:00:00.000Z',state})));
});
test('a changed saved payload blocks a stale write and preserves the newer journey',()=>{
  const store=memoryStore();saveState(store,freshState());
  const expected=store.getItem(STORAGE_KEY);
  const newer={...freshState(),profile:{...freshState().profile,name:'Newer'}};
  saveState(store,newer);
  const error=saveState(store,freshState(),expected);
  assert.match(error??'',/another tab/i);
  assert.equal(loadState(store).state.profile.name,'Newer');
});
