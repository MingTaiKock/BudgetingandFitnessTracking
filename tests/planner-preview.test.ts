import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compareScenario} from '../src/scenarios.ts';
test('saved and live-preview ideas include IDs and still compare correctly',()=>{
 const idea={id:'preview',label:'Pack lunch',costCents:1200,extraCostCents:500,occurrencesPerWeek:3,extraMinutes:0};
 assert.equal(compareScenario(idea).weeklyNetCents,2100);
 assert.equal(compareScenario({...idea,id:'saved-id'}).monthlyNetCents,9100);
});
