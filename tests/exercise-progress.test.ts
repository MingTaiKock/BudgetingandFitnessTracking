import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exerciseHistory, historyOptions, workoutTotals } from '../src/exerciseProgress.ts';
import type { Workout } from '../src/model.ts';
import { starterRoutines } from '../src/routines.ts';
const key={exerciseId:'dumbbell-floor-press',equipment:'dumbbell' as const};
const entry=(id:string,date:string,patch={}):Workout=>({id,date,activity:'Strength',minutes:15,notes:'',sets:[{exercise:'Floor press',...key,sets:2,reps:8,kg:7.5,...patch}]});

test('comparison matches identity and equipment, never a shared name',()=>{
  const rows=[entry('one','2026-10-01'),entry('two','2026-10-02',{equipment:'machine'}),entry('three','2026-10-03',{exerciseId:undefined}),entry('four','2026-10-04',{exerciseId:'different'}),entry('five','2026-10-05',{equipment:undefined})];
  assert.deepEqual(exerciseHistory(rows,key,'2026-10-10').map(d=>d.date),['2026-10-01']);
  assert.deepEqual(exerciseHistory(rows,{equipment:'dumbbell'},'2026-10-10'),[]);
  assert.equal(historyOptions(rows).length,3);
});
test('history groups same-day sessions and actual set variants without mutating records',()=>{
  const rows=[entry('one','2026-10-01'),entry('two','2026-10-01',{reps:10,kg:6.25}),entry('three','2026-10-02')];
  const before=JSON.stringify(rows),history=exerciseHistory(rows,key,'2026-10-10');
  assert.equal(history[0].date,'2026-10-02');
  assert.equal(history[1].sessions,2);assert.equal(history[1].sets.length,2);
  assert.equal(JSON.stringify(rows),before);
});
test('previous history excludes current ID and later dates and uses inclusive windows',()=>{
  const rows=[entry('old','2026-09-10'),entry('boundary','2026-09-11'),entry('same-day','2026-10-10'),entry('current','2026-10-10'),entry('later','2026-10-11')];
  assert.deepEqual(exerciseHistory(rows,key,'2026-10-10',30,'current').map(d=>d.date),['2026-10-10','2026-09-11']);
  assert.equal(exerciseHistory(rows,key,'2026-10-10','all','current').length,3);
});
test('recap counts grouped actual sets and reps, including bodyweight',()=>{
  const workout=entry('one','2026-10-01');
  workout.sets.push({exercise:'Calf raise',sets:3,reps:12,kg:0});
  assert.deepEqual(workoutTotals(workout),{sets:5,reps:52,minutes:15});
});

test('new starter routines include explicit equipment identities for progress',()=>{
  for(const routine of starterRoutines())for(const exercise of routine.exercises){
    assert.ok(exercise.exerciseId);assert.ok(exercise.equipment);
  }
});
