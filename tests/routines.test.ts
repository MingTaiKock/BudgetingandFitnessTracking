import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routineWorkout } from '../src/routines.ts';
import { routineSchema } from '../src/model.ts';
import { freshState } from '../src/demo.ts';
import { parseBackup, dateKey } from '../src/domain.ts';
const routine={id:'r',name:'Test routine',description:'',exercises:[{name:'Squat',sets:2,repMin:8,repMax:12,cue:'Slow and steady'},{name:'Row',sets:1,repMin:10,repMax:15,cue:''}]};
test('routines reject reversed rep ranges and missing exercises',()=>{
  assert.throws(()=>routineSchema.parse({...routine,exercises:[{...routine.exercises[0],repMin:20}]}));
  assert.throws(()=>routineSchema.parse({...routine,exercises:[]}));
});
test('completed sets log actual reps/load and can finish early without invented sets',()=>{
  const workout=routineWorkout(routine,[{exerciseIndex:0,reps:7,kg:7.25},{exerciseIndex:0,reps:9,kg:7.25}],18,dateKey());
  assert.equal(workout.sets.length,2);assert.equal(workout.sets[0].reps,7);assert.equal(workout.sets[0].kg,7.25);assert.equal(workout.sets[1].reps,9);
  assert.match(workout.notes,/2\/3 sets/);
  assert.throws(()=>routineWorkout(routine,[],18,dateKey()));
  assert.throws(()=>routineWorkout(routine,[{exerciseIndex:9,reps:10,kg:0}],18,dateKey()));
  assert.throws(()=>routineWorkout(routine,Array.from({length:3},()=>({exerciseIndex:0,reps:10,kg:0})),18,dateKey()));
});
test('routine library round trips and legacy v1 backups get an empty library',()=>{
  const s=freshState();s.routines=[routine];assert.deepEqual(parseBackup(JSON.stringify(s)).routines,[routine]);
  const {routines,...legacy}=s;assert.deepEqual(parseBackup(JSON.stringify(legacy)).routines,[]);
});
