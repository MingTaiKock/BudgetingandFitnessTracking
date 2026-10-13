import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as demo from '../src/demo.ts';
import {loadState,saveState} from '../src/storage.ts';
import {dateKey} from '../src/dates.ts';

test('only a browser without stored records is marked as new',()=>{
  assert.equal(loadState({getItem:()=>null}).isNew,true);
  assert.equal(loadState({getItem:()=>JSON.stringify(demo.demoState())}).isNew,false);
  assert.equal(loadState({getItem:()=>JSON.stringify(demo.freshState())}).isNew,false);
  assert.notEqual(loadState({getItem:()=>'{bad'}).isNew,true);
});

test('personal setup creates a clean journey without mutating the demo',()=>{
  assert.equal(typeof demo.createPersonalJourney,'function');
  const source=demo.demoState(),before=JSON.stringify(source);
  const next=demo.createPersonalJourney(source,{profile:{...source.profile,name:' Little Mochi '},budget:null,routines:'gym'});
  assert.equal(next.demo,false);assert.equal(next.profile.name,'Little Mochi');
  for(const field of ['transactions','workouts','goals','budgets','owned'] as const)assert.equal(next[field].length,0);
  assert.deepEqual(next.checkins,{});assert.equal(next.activeWorkout,null);
  assert.deepEqual(next.routines.map(r=>r.id),['starter-chonk']);
  assert.equal(JSON.stringify(source),before);
});

test('setup records only deliberately chosen budget limits with exact cents',()=>{
  assert.equal(typeof demo.createPersonalJourney,'function');
  const source=demo.demoState();
  const next=demo.createPersonalJourney(source,{profile:source.profile,budget:{food:'125.75',transport:'',shopping:'0',fun:'20',health:'0.00',other:'0'},routines:'later'});
  assert.equal(next.budgets.length,6);assert.equal(next.budgets[0].limitCents,12575);
  assert.equal(next.budgets[1].limitCents,0);assert.equal(next.budgets[0].month,dateKey().slice(0,7));
  assert.equal(next.routines.length,0);
});

test('setup rejects invalid choices and cannot replace a personal journey',()=>{
  assert.equal(typeof demo.createPersonalJourney,'function');
  const source=demo.demoState(),input={profile:source.profile,budget:null,routines:'both' as const};
  assert.throws(()=>demo.createPersonalJourney(demo.freshState(),input));
  assert.throws(()=>demo.createPersonalJourney(source,{...input,profile:{...source.profile,name:' '}}));
  assert.throws(()=>demo.createPersonalJourney(source,{...input,routines:'unknown' as never}));
  assert.throws(()=>demo.createPersonalJourney(source,{...input,budget:{food:'-2',transport:'',shopping:'',fun:'',health:'',other:''}}));
  assert.deepEqual(demo.createPersonalJourney(source,input).routines.map(r=>r.id),['starter-paws','starter-chonk']);
});

test('a failed setup write leaves the stored demo intact',()=>{
  assert.equal(typeof demo.createPersonalJourney,'function');
  const source=demo.demoState(),raw=JSON.stringify(source);
  const store={getItem:()=>raw,setItem:()=>{throw Error('quota');}};
  const next=demo.createPersonalJourney(source,{profile:source.profile,budget:null,routines:'gentle'});
  assert.ok(saveState(store,next));assert.equal(loadState(store).state.demo,true);
});
