import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import { startSession, selectExercise, finishSession } from '../src/routines.ts';
import { stateSchema } from '../src/model.ts';
import { editExercise, linkHistorySet, weeklyEvidence } from '../src/focused.ts';
import { exerciseHistory } from '../src/exerciseProgress.ts';

test('renaming and equipment edits retain identity but separate comparable equipment',()=>{
 const s=freshState(),exercise=s.routines[0].exercises[0];
 const renamed=editExercise(exercise,{name:'My squat'});
 assert.equal(renamed.exerciseId,exercise.exerciseId);
 assert.equal(editExercise(renamed,{equipment:'machine'}).exerciseId,exercise.exerciseId);
 s.workouts=[{id:'w',date:'2026-10-01',activity:'Strength',minutes:10,notes:'',sets:[{exercise:exercise.name,exerciseId:exercise.exerciseId,equipment:exercise.equipment,sets:1,reps:10,kg:8}]}];
 assert.equal(exerciseHistory(s.workouts,renamed,'2026-10-15').length,1);
 assert.equal(exerciseHistory(s.workouts,editExercise(renamed,{equipment:'machine'}),'2026-10-15').length,0);
 assert.ok(editExercise({...exercise,exerciseId:undefined},{name:'Custom'}).exerciseId);
});
test('explicit legacy linking changes only the selected record and preserves values',()=>{
 const s=freshState(),key=s.routines[0].exercises[0];
 s.workouts=[{id:'w',date:'2026-10-01',activity:'Strength',minutes:10,notes:'',sets:[{exercise:'Old squat',sets:2,reps:8,kg:10},{exercise:'Old squat',sets:1,reps:12,kg:5}]}];
 const before=JSON.stringify(s),next=linkHistorySet(s,'w',0,key);
 assert.equal(next.workouts[0].sets[0].exerciseId,key.exerciseId);
 assert.equal(next.workouts[0].sets[0].kg,10);
 assert.equal(next.workouts[0].sets[1].exerciseId,undefined);
 assert.equal(JSON.stringify(s),before);
 assert.throws(()=>linkHistorySet(s,'missing',0,key));
});
for(const count of [6,10])test(`${count} exercises survive reload; last exercise logs; template edits preserve active snapshot`,()=>{
 const s=freshState(),r=s.routines[0];r.exercises=Array.from({length:count},(_,i)=>({...r.exercises[0],name:`Exercise ${i+1}`,sets:2}));
 s.activeWorkout=startSession(r);s.routines[0].exercises[0].name='Edited template';
 const restored=stateSchema.parse(JSON.parse(JSON.stringify(s)));
 restored.activeWorkout=selectExercise(restored.activeWorkout!,count-1);
 assert.equal(restored.activeWorkout.index,count-1);
 restored.activeWorkout.entries=[{exerciseIndex:count-1,reps:12,kg:25}];
 assert.equal(finishSession(restored,15).workouts[0].sets[0].exercise,`Exercise ${count}`);
 assert.equal(restored.activeWorkout.routine.exercises[0].name,'Exercise 1');
});
test('weekly evidence stays within domain, selected dates, and deterministic newest-first order',()=>{
 const s=freshState();s.transactions=[{id:'a',date:'2026-10-13',type:'expense',category:'food',amountCents:800,note:'Lunch'},{id:'b',date:'2026-10-12',type:'income',category:'other',amountCents:1000,note:'Gift'}];
 s.workouts=[{id:'w',date:'2026-10-14',activity:'Walk',minutes:20,notes:'',sets:[]}];
 s.goals=[{id:'g',name:'Trip',targetCents:10000,contributions:[{id:'c',date:'2026-10-14',amountCents:500}]}];
 assert.deepEqual(weeklyEvidence(s,'2026-10-12','money').map(r=>r.id),['c','a','b']);
 assert.deepEqual(weeklyEvidence(s,'2026-10-12','movement').map(r=>r.id),['w']);
 assert.deepEqual(weeklyEvidence(s,'2026-10-05','money'),[]);
});
