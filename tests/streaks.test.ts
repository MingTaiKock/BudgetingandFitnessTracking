import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as wellness from '../src/wellness.ts';
test('streak includes yesterday when today has no entry and stops at missing dates',()=>{
  assert.equal(wellness.consecutiveDays(['2026-10-09','2026-10-10','2026-10-11','2026-10-11','2026-10-07'],'2026-10-12'),3);
  assert.equal(wellness.consecutiveDays(['2026-10-09','2026-10-10','2026-10-12'],'2026-10-12'),1);
  assert.equal(wellness.consecutiveDays(['2026-10-10'],'2026-10-12'),0);
});
test('streak ignores future entries and crosses month boundaries',()=>{
  assert.equal(wellness.consecutiveDays(['2026-09-29','2026-09-30','2026-10-01','2026-10-03'],'2026-10-01'),3);
  assert.equal(wellness.consecutiveDays([],'2026-10-01'),0);
});
