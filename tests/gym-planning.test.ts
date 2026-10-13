import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as exercises from '../src/exercises.ts';
import * as routines from '../src/routines.ts';
import {routineSchema,stateSchema} from '../src/model.ts';
import {freshState} from '../src/demo.ts';
import {earnedSeeds,parseBackup} from '../src/domain.ts';

test('library provides diverse stable exercises and filters names and equipment',()=>{
  assert.ok(exercises.EXERCISES.length>=20,'provide at least 20 strength movements');
  assert.equal(typeof exercises.searchExercises,'function');
  const found=exercises.searchExercises('press','dumbbell');
  assert.ok(found.length>=1);assert.ok(found.every(e=>e.equipment==='dumbbell'&&/press/i.test(e.name)));
  assert.deepEqual(exercises.searchExercises('nothing matches','all'),[]);
  assert.equal(new Set(exercises.EXERCISES.map(e=>e.id)).size,exercises.EXERCISES.length);
});

test('catalog metadata and planned load round trip into actual workout history',()=>{
  assert.equal(typeof exercises.exerciseToRoutine,'function');
  const exercise={...exercises.exerciseToRoutine('dumbbell-floor-press'),plannedKg:7.5};
  const routine=routineSchema.parse({id:'custom',name:'My gym',description:'',exercises:[exercise]});
  const state=freshState();state.routines=[routine];state.activeWorkout=routines.startSession(routine);
  assert.equal(state.activeWorkout.kg,'7.5');
  state.activeWorkout.entries=[{exerciseIndex:0,reps:9,kg:6.25}];
  const saved=routines.finishSession(state,15);
  const loaded=parseBackup(JSON.stringify(saved));
  assert.equal(loaded.workouts[0].routineId,'custom');
  assert.equal(loaded.workouts[0].sets[0].exerciseId,'dumbbell-floor-press');
  assert.equal(loaded.workouts[0].sets[0].equipment,'dumbbell');
  assert.equal(loaded.workouts[0].sets[0].kg,6.25);
});

test('weekly plans stay separate from completed records and reject broken references',()=>{
  const state=freshState();
  const schedule=[{day:0,kind:'routine',routineId:state.routines[0].id},{day:1,kind:'rest'}];
  const parsed=stateSchema.safeParse({...state,schedule});
  assert.equal(parsed.success,true,'weekly plans should be accepted');
  if(!parsed.success)return;
  assert.equal(earnedSeeds(parsed.data),0);assert.equal(parsed.data.workouts.length,0);
  assert.equal(stateSchema.safeParse({...state,schedule:[schedule[0],schedule[0]]}).success,false);
  assert.equal(stateSchema.safeParse({...state,schedule:[{day:0,kind:'routine',routineId:'missing'}]}).success,false);
  assert.deepEqual(parseBackup(JSON.stringify(parsed.data)).schedule,schedule);
  const legacy=JSON.parse(JSON.stringify(state));delete legacy.schedule;
  assert.deepEqual(parseBackup(JSON.stringify(legacy)).schedule,[]);
});

test('deleting a routine clears only its schedule and preserves the active snapshot',()=>{
  assert.equal(typeof routines.removeRoutine,'function');
  const state=freshState(),id=state.routines[0].id;
  state.activeWorkout=routines.startSession(state.routines[0]);
  state.schedule=[{day:0,kind:'routine',routineId:id},{day:2,kind:'routine',routineId:state.routines[1].id},{day:3,kind:'rest'}];
  const next=routines.removeRoutine(state,id);
  assert.equal(next.routines.some(r=>r.id===id),false);
  assert.deepEqual(next.schedule.map(s=>s.day),[2,3]);
  assert.equal(next.activeWorkout?.routine.id,id);
  assert.equal(state.routines.length,2);
});

test('today schedule uses local weekdays and preserves custom ordering',()=>{
  assert.equal(typeof routines.planForDay,'function');
  const state=freshState();
  state.schedule=[{day:6,kind:'rest'},{day:0,kind:'routine',routineId:state.routines[0].id}];
  assert.equal(routines.planForDay(state,'2026-10-12')?.kind,'routine');
  assert.equal(routines.planForDay(state,'2026-10-11')?.kind,'rest');
  assert.equal(routines.planForDay(state,'2026-10-13'),undefined);
  assert.equal(typeof routines.reorderExercises,'function');
  const before=state.routines[0].exercises;
  const after=routines.reorderExercises(before,0,2);
  assert.equal(after[2].name,before[0].name);
  assert.equal(before[0].name,'Chair squat');
  assert.throws(()=>routines.reorderExercises(before,0,99));
});

test('each exercise starts at its planned load while unfinished edits survive switching',()=>{
  const routine=routineSchema.parse({id:'loads',name:'Planned loads',description:'',exercises:[
    {...exercises.exerciseToRoutine('dumbbell-floor-press'),plannedKg:7.5},
    {...exercises.exerciseToRoutine('machine-leg-press'),plannedKg:35},
  ]});
  const session=routines.startSession(routine);
  const next=routines.selectExercise({...session,kg:'6.25',reps:'9'},1);
  assert.equal(next.kg,'35');
  const previous=routines.selectExercise({...next,kg:'30'},0);
  assert.equal(previous.kg,'6.25');assert.equal(previous.reps,'9');
  assert.equal(routines.selectExercise(previous,1).kg,'30');
  assert.equal(routine.exercises[0].plannedKg,7.5);
});

test('a deleted routine can still finish from its snapshot and history can be restored',()=>{
  const state=freshState(),routine=state.routines[0];
  state.activeWorkout=routines.startSession(routine);
  state.activeWorkout.entries=[{exerciseIndex:0,reps:8,kg:0}];
  const finished=routines.finishSession(routines.removeRoutine(state,routine.id),5);
  const restored=parseBackup(JSON.stringify(finished));
  assert.equal(restored.workouts[0].routineId,routine.id);
  assert.equal(restored.workouts[0].sets[0].exercise,'Chair squat');
  assert.equal(restored.activeWorkout,null);
});
