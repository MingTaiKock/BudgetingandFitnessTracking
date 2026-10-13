import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import * as wellness from '../src/wellness.ts';

test('weekly review separates spending, income, savings and rest with inclusive local boundaries',()=>{
  const s=freshState();
  s.transactions=[{id:'a',date:'2026-10-05',type:'expense',category:'food',amountCents:1234,note:''},{id:'b',date:'2026-10-11',type:'income',category:'other',amountCents:5000,note:''},{id:'c',date:'2026-10-04',type:'expense',category:'food',amountCents:9999,note:''}];
  s.goals=[{id:'g',name:'Trip',targetCents:10000,contributions:[{id:'save',date:'2026-10-06',amountCents:2000}]}];
  s.workouts=[{id:'w',date:'2026-10-11',activity:'Walk',minutes:20,notes:'',sets:[]}];
  s.checkins={'2026-10-07':{water:0,mood:null,rest:true}};
  const result=wellness.reviewWeek(s,'2026-10-11','2026-10-11');
  assert.equal(result.start,'2026-10-05');assert.equal(result.end,'2026-10-11');
  assert.equal(result.spent,1234);assert.equal(result.income,5000);assert.equal(result.saved,2000);
  assert.equal(result.minutes,20);assert.equal(result.workouts,1);assert.equal(result.restDays,1);
  assert.equal(result.loggedDays,4);assert.equal(result.days[0].money,true);assert.equal(result.days[6].movement,true);
});
test('current-week comparison uses equal elapsed days and zero baseline has no percent',()=>{
  const s=freshState();
  s.workouts=[{id:'prev-mon',date:'2026-10-05',activity:'Walk',minutes:10,notes:'',sets:[]},{id:'prev-sun',date:'2026-10-11',activity:'Walk',minutes:99,notes:'',sets:[]},{id:'mon',date:'2026-10-12',activity:'Walk',minutes:20,notes:'',sets:[]}];
  const r=wellness.reviewWeek(s,'2026-10-12','2026-10-12');
  assert.equal(r.previousMinutes,10);assert.equal(r.elapsedDays,1);
  assert.deepEqual(wellness.metricChange(20,10),{absolute:10,percent:100});
  assert.deepEqual(wellness.metricChange(20,0),{absolute:20,percent:null});
});
