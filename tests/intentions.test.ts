import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import { addIntention, reviseIntention, completeIntention, intentionProgress } from '../src/intentions.ts';
test('intentions keep dated targets so a new week does not rewrite earlier progress',()=>{
  let s=addIntention(freshState(),{id:'i',label:'A walk after lunch',domain:'movement',target:3,startDate:'2026-10-01'});
  assert.equal(s.intentions?.length,1);
  s=completeIntention(s,'i','2026-10-05');s=completeIntention(s,'i','2026-10-05');
  assert.equal(intentionProgress(s.intentions[0],'2026-10-05').completed,1);
  s=reviseIntention(s,'i',2,'2026-10-12');
  assert.equal(intentionProgress(s.intentions[0],'2026-10-05').target,3);
  assert.equal(intentionProgress(s.intentions[0],'2026-10-12').target,2);
  assert.equal(s.workouts.length,0);assert.equal(s.transactions.length,0);
});
test('intentions reject completions before creation and future records',()=>{
  const s=addIntention(freshState(),{id:'i',label:'Check my plan',domain:'money',target:1,startDate:'2026-10-01'});
  assert.throws(()=>completeIntention(s,'i','2026-09-30'));
  assert.throws(()=>completeIntention(s,'i','2099-01-01'));
  assert.throws(()=>reviseIntention(s,'missing',2,'2026-10-12'));
});
