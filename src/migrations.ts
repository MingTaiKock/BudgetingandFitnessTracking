import { stateSchema, type State } from './model.ts';

/** Pure migration; persistence retains the old key until the new write succeeds. */
export function migrateState(input:unknown):State {
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid journey');
  const record=input as Record<string,unknown>;
  if(record.version!==1&&record.version!==2)throw Error('Unsupported journey version');
  return stateSchema.parse({...record,version:2});
}
