import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as routines from '../src/routines.ts';
import { stateSchema } from '../src/model.ts';
import { freshState } from '../src/demo.ts';
import { loadState, saveState } from '../src/storage.ts';

test('old journeys load with no active workout', () => {
  const legacy = JSON.parse(JSON.stringify(freshState()));
  delete legacy.activeWorkout;
  assert.equal(stateSchema.parse(legacy).activeWorkout, null);
});

test('a workout draft survives storage with its routine snapshot, input and rest deadline', () => {
  assert.equal(typeof routines.startSession, 'function', 'startSession must create a recoverable workout');
  const state = freshState();
  const draft = routines.startSession(state.routines[0], 100000);
  draft.entries = [{exerciseIndex:0,reps:7,kg:2.5}];
  draft.reps = '9'; draft.kg = '2.5'; draft.restEndsAt = 190000;
  state.activeWorkout = draft;
  state.routines[0].exercises[0].name = 'Changed template';
  let raw = '';
  assert.equal(saveState({setItem:(_key,value)=>{raw=value;}},state),null);
  const restored=loadState({getItem:()=>raw});
  assert.equal(restored.error,null);
  assert.equal(restored.state.activeWorkout?.routine.exercises[0].name,'Chair squat');
  assert.deepEqual(restored.state.activeWorkout?.entries,draft.entries);
  assert.equal(restored.state.activeWorkout?.reps,'9');
  assert.equal(restored.state.activeWorkout?.restEndsAt,190000);
});

test('finishing a partial workout clears its draft and cannot duplicate the session', () => {
  assert.equal(typeof routines.finishSession,'function','finishSession must commit and clear together');
  const state=freshState();
  state.activeWorkout=routines.startSession(state.routines[0]);
  const id=state.activeWorkout.id;
  state.activeWorkout.entries=[{exerciseIndex:0,reps:7,kg:2.5}];
  const result=routines.finishSession(state,12);
  assert.equal(result.activeWorkout,null);
  assert.equal(result.workouts[0].id,id);
  assert.equal(result.workouts[0].sets[0].reps,7);
  assert.match(result.workouts[0].notes,/1\/6 sets/);
  assert.throws(()=>routines.finishSession(result,12));
  assert.throws(()=>routines.finishSession({...result,activeWorkout:state.activeWorkout},12));
});

test('invalid draft indices or extra sets are rejected without changing the source state', () => {
  assert.equal(typeof routines.startSession,'function');
  const state=freshState();
  state.activeWorkout=routines.startSession(state.routines[0]);
  assert.equal(stateSchema.safeParse({...state,activeWorkout:{...state.activeWorkout,index:100}}).success,false);
  assert.equal(stateSchema.safeParse({...state,activeWorkout:{...state.activeWorkout,entries:Array.from({length:3},()=>({exerciseIndex:0,reps:8,kg:0}))}}).success,false);
  assert.throws(()=>routines.finishSession(state,15));
  assert.equal(state.workouts.length,0);
});

test('switching exercises preserves unfinished reps and load inputs independently', () => {
  assert.equal(typeof routines.selectExercise,'function','exercise navigation must keep unfinished input');
  const session=routines.startSession(freshState().routines[0]);
  session.reps='';session.kg='7.25';
  const next=routines.selectExercise(session,1);
  next.reps='9';next.kg='3.5';
  const back=routines.selectExercise(next,0);
  assert.equal(back.reps,'');assert.equal(back.kg,'7.25');
  const again=routines.selectExercise(back,1);
  assert.equal(again.reps,'9');assert.equal(again.kg,'3.5');
  assert.throws(()=>routines.selectExercise(session,99));
});
