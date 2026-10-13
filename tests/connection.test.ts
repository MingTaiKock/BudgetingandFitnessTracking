import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshState } from '../src/demo.ts';
import { dateKey } from '../src/domain.ts';
import { putConnection, removeConnection, beginReset, resetRemaining } from '../src/connection.ts';
import { parseBackup } from '../src/domain.ts';
const entry={id:'connection-a',date:dateKey(),minutes:20,activity:'conversation' as const,note:'',origin:'manual' as const};
test('connection requires deliberate enablement and duplicate submits update rather than duplicate',()=>{
  const s=freshState();assert.throws(()=>putConnection(s,entry));
  s.preferences.connectionEnabled=true;
  const next=putConnection(s,entry),again=putConnection(next,entry);
  assert.equal(again.connections.length,1);assert.equal(s.connections.length,0);
  assert.equal(parseBackup(JSON.stringify(again)).connections[0].minutes,20);
  assert.equal(removeConnection(again,entry.id).connections.length,0);
});
test('connection rejects future dates, invalid durations and impossible daily totals',()=>{
  const s=freshState();s.preferences.connectionEnabled=true;
  for(const minutes of [0,-1,1.5,1441])assert.throws(()=>putConnection(s,{...entry,minutes}));
  assert.throws(()=>putConnection(s,{...entry,date:'2099-01-01'}));
  const next=putConnection(s,{...entry,minutes:1440});
  assert.throws(()=>putConnection(next,{...entry,id:'another',minutes:1}));
});
test('reset timers persist absolute deadlines without auto-completing an activity',()=>{
  const s=beginReset(freshState(),'pause',1000);
  assert.equal(resetRemaining(s,1000),90);
  assert.equal(resetRemaining(s,31000),60);
  assert.equal(resetRemaining(parseBackup(JSON.stringify(s)),100000),0);
  assert.equal(s.workouts.length,0);assert.equal(s.connections.length,0);
});
