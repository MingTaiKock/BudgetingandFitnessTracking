import { parseBackup } from './domain.ts';
import { stateSchema, type State } from './model.ts';
import { demoState, freshState } from './demo.ts';
export const STORAGE_KEY='little-wins:journey:v2';
export const LEGACY_KEY='little-wins:journey:v1';
export type LoadResult={state:State,error:string|null,raw?:string,isNew?:boolean,currentRaw?:string|null};
export function loadState(store:Pick<Storage,'getItem'>):LoadResult {
  let raw:string|null=null,currentRaw:string|null=null;
  try {
    currentRaw=store.getItem(STORAGE_KEY);raw=currentRaw??store.getItem(LEGACY_KEY);
    return {state:raw!==null?parseBackup(raw):demoState(),error:null,isNew:raw===null,currentRaw};
  }
  catch {return {state:freshState(),error:raw!==null?'We couldn’t read your saved journey. The original data is kept. Export it in Settings, or explicitly start fresh.':'Browser storage is unavailable. Your changes stay in memory; download a backup before leaving.',raw:raw??undefined,currentRaw};}
}
export function saveState(store:Pick<Storage,'setItem'> & Partial<Pick<Storage,'getItem'>>,state:State,expectedRaw?:string|null):string|null {
  try {
    if(expectedRaw!==undefined&&(!store.getItem||store.getItem(STORAGE_KEY)!==expectedRaw))return 'Another tab changed this journey. Your changes stay in memory. Download a backup, then reload to see the saved version.';
    store.setItem(STORAGE_KEY,JSON.stringify(stateSchema.parse(state)));return null;
  }
  catch {return 'Your latest changes could not be saved in this browser. Download a backup before closing this tab.';}
}
