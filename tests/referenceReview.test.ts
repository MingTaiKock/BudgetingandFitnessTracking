import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {buildReferenceReview} from '../src/referenceReview.ts';
import {saveFoodEntry} from '../src/food.ts';
import {createBackup,parseBackup} from '../src/domain.ts';

test('review list has no requests for a fresh journey or supported food',()=>{
 let state=freshState();assert.deepEqual(buildReferenceReview(state),{version:1,exercises:[],meals:[]});
 state=saveFoodEntry(state,{id:'m1',date:'2026-10-01',meal:'Chicken rice',portion:'1 plate',category:'Lunch',kcal:525,origin:'manual',assumptions:''});
 assert.equal(buildReferenceReview(state).meals.length,0);
});
test('unknown meals group names and portions without leaking diary or profile details',()=>{
 let state=freshState();
 for(const [id,meal,portion] of [['m1','My oats','1 bowl'],['m2',' my OATS ','1 bowl'],['m3','My oats','200 g']])state=saveFoodEntry(state,{id,date:'2026-10-01',meal,portion,category:'Lunch',kcal:200,origin:'manual',assumptions:''});
 const batch=buildReferenceReview(state);
 assert.equal(batch.meals.length,1);assert.deepEqual(batch.meals[0].portions,['1 bowl','200 g']);
 assert.equal(JSON.stringify(batch).includes('2026-10-01'),false);
 assert.equal(JSON.stringify(batch).includes('profile'),false);
 assert.deepEqual(buildReferenceReview(parseBackup(createBackup(state))),batch);
});
test('custom exercises deduplicate by name and equipment and skip existing artwork',()=>{
 const state=freshState();state.routines=[{id:'routine1',name:'Test',description:'Private note',exercises:[
 {name:'Hip thrust',exerciseId:'custom-a',equipment:'barbell',sets:2,repMin:8,repMax:12,cue:''},
 {name:' hip THRUST ',exerciseId:'custom-b',equipment:'barbell',sets:2,repMin:8,repMax:12,cue:''},
 {name:'Hip thrust',exerciseId:'custom-c',equipment:'machine',sets:2,repMin:8,repMax:12,cue:''},
 {name:'Chair squat',exerciseId:'chair-squat',equipment:'bodyweight',sets:2,repMin:8,repMax:12,cue:''},
 ]}];
 const batch=buildReferenceReview(state);assert.equal(batch.exercises.length,2);
 assert.deepEqual(batch.exercises.map(e=>e.equipment),['barbell','machine']);
 assert.equal(JSON.stringify(batch).includes('Private note'),false);
});
test('weight references and sourced custom meals do not create misleading duplicate requests',()=>{
 const state=freshState();state.foodEntries=[
 {id:'a',date:'2026-10-01',meal:'Chicken rice',portion:'200 g',category:'Lunch',kcal:250,origin:'manual',assumptions:''},
 {id:'b',date:'2026-10-01',meal:'Reviewed dish',portion:'1 bowl',category:'Dinner',kcal:300,origin:'estimate',assumptions:'Reviewed source',source:'https://example.com/nutrition'},
 ];
 assert.deepEqual(buildReferenceReview(state).meals,[{name:'Chicken rice',portions:['200 g']}]);
});
