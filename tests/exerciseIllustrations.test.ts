import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {EXERCISES} from '../src/exercises.ts';
import {exerciseIllustration,EXERCISE_ILLUSTRATIONS} from '../src/exerciseIllustrations.ts';

test('each library exercise has matching Mochi and Chonk image files',()=>{
 assert.equal(Object.keys(EXERCISE_ILLUSTRATIONS).length,EXERCISES.length);
 for(const exercise of EXERCISES){
  for(const character of ['mochi','chonk'] as const){
   const art=exerciseIllustration(exercise.id,exercise.equipment,character);
   assert.ok(art);
   assert.equal(art.character,character);
   assert.ok(existsSync(new URL(`../public${art.src}`,import.meta.url)),art.src);
  }
 }
});
test('custom, missing and mismatched-equipment exercises never show an unrelated pose',()=>{
 assert.equal(exerciseIllustration(undefined),undefined);
 assert.equal(exerciseIllustration('custom-curl'),undefined);
 assert.equal(exerciseIllustration('dumbbell-curl','barbell'),undefined);
});
test('the default library includes both companions',()=>{
 const characters=new Set(EXERCISES.map(e=>exerciseIllustration(e.id)?.character));
 assert.deepEqual([...characters].sort(),['chonk','mochi']);
});
