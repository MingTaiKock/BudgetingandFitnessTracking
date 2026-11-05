import test from 'node:test';
import assert from 'node:assert/strict';
import {workoutSuggestion} from '../src/workoutSuggestion.ts';
import {freshState} from '../src/demo.ts';
import {weeklyWins} from '../src/guidance.ts';
const exercise={...freshState().routines[0].exercises[0],name:'Row',equipment:'dumbbell' as const,sets:3,repMin:8,repMax:12};
const day={date:'2026-10-20',sessions:1,sets:[{exercise:'Row',sets:3,reps:9,kg:12}]};
test('suggests a single extra rep or a repeat at the recorded load',()=>{
 const result=workoutSuggestion(exercise,day,'2026-10-24');
 assert.equal(result?.nextReps,10);
 assert.deepEqual(result?.repeat,{kg:'12',reps:'9'});
});
test('offers a load change only after complete comparable sets',()=>{
 const top={...day,sets:[{...day.sets[0],reps:12}]};
 assert.equal(workoutSuggestion(exercise,top,'2026-10-24')?.nextReps,null);
 for(const history of [{...day,sessions:2},{...day,date:'2026-07-01'},{...day,sets:[{...day.sets[0],sets:2}]},{...day,sets:[...day.sets,{...day.sets[0],kg:14}]}]){
   assert.equal(workoutSuggestion(exercise,history,'2026-10-24'),null);
 }
 assert.equal(workoutSuggestion({...exercise,name:'Assisted pull-up'},top,'2026-10-24'),null);
});
test('two pending meals count as one day of checking in',()=>{
 const state=freshState();
 state.foodEntries=['one','two'].map(id=>({id,date:'2026-10-20',meal:'Porridge',category:'Lunch',portion:'1 bowl',kcal:null,origin:'pending',assumptions:''}));
 assert.equal(weeklyWins(state,'2026-10-24').loggingDays,1);
});
