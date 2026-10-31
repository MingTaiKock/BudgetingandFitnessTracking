import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {foodDayTotal,saveFoodEntry} from '../src/food.ts';
import {createBackup,parseBackup} from '../src/domain.ts';
import {weeklyEvidence} from '../src/focused.ts';
import {buildReferenceReview} from '../src/referenceReview.ts';

const pending={id:'pending-meal',date:'2026-10-01',meal:'Homemade noodles',portion:'1 bowl',category:'Lunch',kcal:null,origin:'pending',assumptions:''};
test('unknown meals survive backup and remain distinct from zero calories',()=>{
 let state=saveFoodEntry(freshState(),pending);
 assert.equal(foodDayTotal(state,pending.date),null);
 assert.deepEqual(parseBackup(createBackup(state)).foodEntries,[pending]);
 assert.equal(buildReferenceReview(state).meals[0].name,pending.meal);
 state=saveFoodEntry(state,{...pending,id:'known',kcal:400,origin:'manual'});
 assert.equal(foodDayTotal(state,pending.date),400);
 state=saveFoodEntry(state,{...pending,kcal:500,origin:'manual'});
 assert.equal(foodDayTotal(state,pending.date),900);
 assert.equal(state.foodEntries.length,2);
});
test('pending and resolved calorie statuses cannot contradict each other',()=>{
 for(const patch of [{kcal:0},{origin:'manual'},{origin:'estimate'},{source:'https://example.com'},{assumptions:'An estimate'}])
  assert.throws(()=>saveFoodEntry(freshState(),{...pending,...patch}));
});
test('weekly food evidence separates pending calories and excludes adjacent weeks',()=>{
 let state=saveFoodEntry(freshState(),pending);
 state=saveFoodEntry(state,{...pending,id:'earlier',date:'2026-09-29',kcal:300,origin:'manual'});
 state=saveFoodEntry(state,{...pending,id:'outside',date:'2026-10-05'});
 const rows=weeklyEvidence(state,'2026-09-28','food');
 assert.deepEqual(rows.map(r=>[r.id,r.kcal]),[['pending-meal',null],['earlier',300]]);
 assert.equal(weeklyEvidence(state,'2026-09-28','money').length,0);
});
