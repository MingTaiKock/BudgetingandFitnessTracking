import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMoney, monthSummary, weekSummary, earnedSeeds, availableSeeds, parseBackup, weekStart, dateKey } from '../src/domain.ts';
import { freshState } from '../src/demo.ts';
import { loadState, saveState, STORAGE_KEY } from '../src/storage.ts';

test('money keeps cents exact and rejects invalid precision, negative, exponent and overflow', () => {
  assert.equal(parseMoney('12.30'),1230);
  assert.equal(parseMoney('0.01'),1);
  for (const input of ['0','-1','1.001','Infinity','1e3','1000001','']) assert.throws(()=>parseMoney(input));
});
test('monthly categories and income stay separate, including overspending', () => {
  const s=freshState(); s.budgets=[{month:'2026-10',category:'food',limitCents:1000}];
  s.transactions=[{id:'a',date:'2026-10-01',type:'expense',category:'food',amountCents:1200,note:'Lunch'},{id:'b',date:'2026-09-30',type:'expense',category:'food',amountCents:500,note:''},{id:'c',date:'2026-10-02',type:'income',category:'other',amountCents:2000,note:'Pay'}];
  assert.deepEqual(monthSummary(s,'2026-10'),{income:2000,spent:1200,planned:1000,remaining:-200,net:800});
});
test('Monday weeks include Sunday and cross year boundary', () => {
  assert.equal(weekStart('2026-01-04'),'2025-12-29');
  const s=freshState(); s.workouts=[{id:'a',date:'2025-12-29',activity:'Walk',minutes:20,notes:'',sets:[]},{id:'b',date:'2026-01-04',activity:'Walk',minutes:30,notes:'',sets:[]},{id:'c',date:'2026-01-05',activity:'Walk',minutes:40,notes:'',sets:[]}];
  assert.deepEqual(weekSummary(s,'2026-01-04'),{count:2,minutes:50});
});
test('rewards are capped per day and purchases spend once; deletion cannot make balance negative', () => {
  const s=freshState(); const d=dateKey();
  s.transactions=['a','b'].map(id=>({id,date:d,type:'expense' as const,category:'food' as const,amountCents:100,note:''}));
  s.workouts=['c','e'].map(id=>({id,date:d,activity:'Walk',minutes:20,notes:'',sets:[]}));
  s.checkins={[d]:{water:8,mood:'happy',rest:true}};
  assert.equal(earnedSeeds(s),30); s.owned=['bow']; assert.equal(availableSeeds(s),0);
  s.transactions=[];s.workouts=[];s.checkins={};assert.equal(availableSeeds(s),0);
});
test('backup rejects unknown schema, invalid dates, unknown references, duplicate ids and future logs', () => {
  const s=freshState(); assert.deepEqual(parseBackup(JSON.stringify(s)),s);
  assert.throws(()=>parseBackup('{bad'));
  assert.throws(()=>parseBackup(JSON.stringify({...s,version:99})));
  const transaction={id:'a',date:'2026-02-30',type:'expense',category:'food',amountCents:100,note:''};
  assert.throws(()=>parseBackup(JSON.stringify({...s,transactions:[transaction]})));
  assert.throws(()=>parseBackup(JSON.stringify({...s,transactions:[{...transaction,date:'2099-01-01'}]})));
  assert.throws(()=>parseBackup(JSON.stringify({...s,transactions:[{...transaction,date:dateKey(),category:'nope'}]})));
  const valid={...transaction,date:dateKey()};
  assert.throws(()=>parseBackup(JSON.stringify({...s,transactions:[valid,valid]})));
  assert.throws(()=>parseBackup(JSON.stringify({...s,owned:['bow','bow']})));
});
test('corrupt storage is retained, failed writes are visible, and good state reloads',()=>{
  const records=new Map<string,string>([[STORAGE_KEY,'broken']]);
  const store={getItem:(key:string)=>records.get(key)??null,setItem:(key:string,value:string)=>{records.set(key,value);}};
  assert.ok(loadState(store).error); assert.equal(records.get(STORAGE_KEY),'broken');
  assert.equal(saveState(store,freshState()),null); assert.equal(loadState(store).state.demo,false);
  assert.match(saveState({setItem:()=>{throw new Error('quota');}},freshState())??'',/saved/i);
});
