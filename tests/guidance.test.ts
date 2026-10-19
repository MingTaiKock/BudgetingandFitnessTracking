import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {weeklyWins,spendingBaseline,lifestyleSuggestions} from '../src/guidance.ts';
import {SPLITS,presetRoutines,installPreset} from '../src/workoutPresets.ts';
import {routineSchema,stateSchema} from '../src/model.ts';
import {EXERCISES} from '../src/exercises.ts';

test('weekly encouragement counts days once and excludes old/future entries',()=>{
 const s=freshState();s.transactions=[{id:'a',type:'expense',date:'2026-10-13',amountCents:100,category:'food',note:''},{id:'b',type:'income',date:'2026-10-13',amountCents:100,category:'other',note:''},{id:'old',type:'expense',date:'2026-10-11',amountCents:100,category:'food',note:''}];
 s.goals=[{id:'g',name:'Trip',targetCents:10000,contributions:[{id:'c',date:'2026-10-14',amountCents:100},{id:'d',date:'2026-10-14',amountCents:100},{id:'future',date:'2026-10-17',amountCents:100}]}];
 s.workouts=[{id:'w',date:'2026-10-15',activity:'Walking',minutes:20,notes:'',sets:[]}];
 s.checkins['2026-10-15']={water:1,mood:null,rest:false};s.checkins['2026-10-16']={water:0,mood:null,rest:false};
 assert.deepEqual(weeklyWins(s,'2026-10-16'),{start:'2026-10-12',loggingDays:3,savingsDays:1,workouts:1});
 assert.equal(weeklyWins(freshState(),'2026-10-16').loggingDays,0);
});
test('budget baseline is preceding calendar month expenses only with exact cents',()=>{
 const s=freshState();s.transactions=[{id:'a',type:'expense',date:'2025-12-31',amountCents:125,category:'food',note:''},{id:'b',type:'expense',date:'2025-12-31',amountCents:275,category:'food',note:''},{id:'c',type:'income',date:'2025-12-31',amountCents:50000,category:'other',note:''},{id:'d',type:'expense',date:'2026-01-01',amountCents:900,category:'transport',note:''}];
 const b=spendingBaseline(s,'2026-01');assert.equal(b.sourceMonth,'2025-12');assert.equal(b.count,2);assert.equal(b.days,1);assert.equal(b.total,400);assert.equal(b.amounts.food,400);assert.equal(b.amounts.transport,0);
 assert.equal(spendingBaseline(s,'2026-03').count,0);
});
test('lifestyle suggestions require evidence, exclude income and future, and round average cents',()=>{
 const s=freshState();s.transactions=[{id:'a',type:'expense',date:'2026-09-17',amountCents:100,category:'food',note:''},{id:'b',type:'expense',date:'2026-10-16',amountCents:201,category:'food',note:''},{id:'c',type:'expense',date:'2026-09-16',amountCents:99000,category:'food',note:''},{id:'d',type:'income',date:'2026-10-16',amountCents:99000,category:'food',note:''},{id:'e',type:'expense',date:'2026-10-17',amountCents:99000,category:'food',note:''}];
 const ideas=lifestyleSuggestions(s,'2026-10-16');assert.equal(ideas.length,1);assert.equal(ideas[0].count,2);assert.equal(ideas[0].averageCents,151);assert.equal(lifestyleSuggestions(freshState(),'2026-10-16').length,0);
});
test('all split and equipment presets validate and use canonical comparable exercise IDs',()=>{
 for(const split of SPLITS)for(const place of ['gym','home'] as const){const routines=presetRoutines(split.id,place);assert.equal(routines.length,split.days);for(const r of routines){assert.ok(routineSchema.safeParse(r).success);assert.ok(r.exercises.length>=3);for(const e of r.exercises){assert.ok(EXERCISES.some(x=>x.id===e.exerciseId&&x.equipment===e.equipment));assert.equal(e.plannedKg,undefined);if(place==='home')assert.ok(['dumbbell','bodyweight'].includes(e.equipment!));}}}
});
test('preset installation is idempotent and preserves custom routines and schedule',()=>{
 const s=freshState(),originalCount=s.routines.length,first=installPreset(s,'full','home');const addedIndex=originalCount;first.routines[addedIndex].name='My customized routine';first.schedule=[{day:1,kind:'routine',routineId:first.routines[addedIndex].id}];
 const second=installPreset(first,'full','home');assert.equal(second.routines.length,originalCount+3);assert.equal(second.routines[addedIndex].name,'My customized routine');assert.deepEqual(second.schedule,first.schedule);assert.deepEqual(second.workouts,s.workouts);assert.equal(second.activeWorkout,s.activeWorkout);assert.ok(stateSchema.safeParse(second).success);assert.equal(s.routines.length,originalCount);
});
test('preset capacity limit never removes routines and permits an exact fit',()=>{
 const s=freshState();s.routines=Array.from({length:48},(_,i)=>({...presetRoutines('full','home')[0],id:`custom-${i}`}));
 assert.throws(()=>installPreset(s,'upper-lower','gym'),/Not enough room/);assert.equal(s.routines.length,48);
 s.routines=s.routines.slice(0,46);const installed=installPreset(s,'upper-lower','gym');assert.equal(installed.routines.length,50);assert.ok(stateSchema.safeParse(installed).success);assert.equal(installPreset(installed,'upper-lower','gym').routines.length,50);
});
