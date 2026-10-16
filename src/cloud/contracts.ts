import type { State } from '../model.ts';
export type CloudRecord={state:State,revision:number,updatedAt:string};
export type SaveResult={kind:'saved',record:CloudRecord}|{kind:'conflict'};
export interface JourneyRepository{read():Promise<CloudRecord|null>;save(state:State,expectedRevision:number):Promise<SaveResult>}
export type SyncSnapshot={state:State|null,revision:number,status:'loading'|'ready'|'saving'|'saved'|'error'|'conflict',pending:boolean,error:string|null,recoveryError:string|null};
export type Recovery={userId:string,baseRevision:number,state:State};
