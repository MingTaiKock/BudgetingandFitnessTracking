import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as scenarios from '../src/scenarios.ts';
const input={label:'Cook one extra meal',costCents:2200,extraCostCents:600,occurrencesPerWeek:1,extraMinutes:30};
test('scenario compares net money and time with explicit weekly and monthly periods',()=>{
  const result=scenarios.compareScenario(input);
  assert.equal(result.weeklyGrossCents,2200);assert.equal(result.weeklyNetCents,1600);
  assert.equal(result.monthlyNetCents,6933);assert.equal(result.weeklyMinutes,30);
  assert.equal(scenarios.compareScenario({...input,extraCostCents:3000}).weeklyNetCents,-800);
});
test('scenario rejects invalid precision, bounds and nonfinite assumptions',()=>{
  for(const patch of [{costCents:1.5},{occurrencesPerWeek:-1},{extraMinutes:Infinity},{occurrencesPerWeek:101},{costCents:Number.MAX_SAFE_INTEGER}])assert.throws(()=>scenarios.compareScenario({...input,...patch}));
});
test('future projection is exact no-interest arithmetic and allows a zero horizon',()=>{
  assert.equal(scenarios.projectSavings(10000,1234,12),24808);
  assert.equal(scenarios.projectSavings(10000,1234,0),10000);
  assert.throws(()=>scenarios.projectSavings(-1,100,12));
  assert.throws(()=>scenarios.projectSavings(100,100,1.5));
});
