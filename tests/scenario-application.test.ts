import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import { applyScenarioBudget } from '../src/scenarios.ts';
test('budget application changes one monthly limit once without inventing transactions',()=>{
  const s=freshState();s.scenarios=[{id:'s',label:'Cook',costCents:2200,extraCostCents:600,occurrencesPerWeek:1,extraMinutes:30}];
  const next=applyScenarioBudget(s,'s','2026-10','food');
  assert.equal(next.budgets[0].limitCents,6933);
  assert.equal(next.transactions.length,0);assert.equal(next.goals.length,0);
  assert.throws(()=>applyScenarioBudget(next,'s','2026-10','food'));
  assert.equal(s.budgets.length,0);
});
test('budget application rejects unknown options and negative resulting limits',()=>{
  const s=freshState();assert.throws(()=>applyScenarioBudget(s,'missing','2026-10','food'));
  s.scenarios=[{id:'s',label:'Time saver',costCents:0,extraCostCents:1000,occurrencesPerWeek:1,extraMinutes:-30}];
  assert.throws(()=>applyScenarioBudget(s,'s','2026-10','food'));
});
