import type { SupabaseClient } from '@supabase/supabase-js';
import { stateSchema } from '../model.ts';
import type { CloudRecord, JourneyRepository } from './contracts.ts';
export function parseCloudRecord(row:unknown,userId:string):CloudRecord{
 const r=row as {user_id?:string,state:unknown,revision:number,updated_at:string};
 if(!r||r.user_id!==userId||!Number.isSafeInteger(r.revision)||r.revision<1||typeof r.updated_at!=='string')throw Error('Invalid online record.');
 const state=stateSchema.parse(r.state);if(state.demo)throw Error('Invalid demo in personal account.');return {state,revision:r.revision,updatedAt:r.updated_at};
}
export function createRepository(client:SupabaseClient,userId:string):JourneyRepository{return {
 async read(){const {data,error}=await client.from('journeys').select('user_id,state,revision,updated_at').eq('user_id',userId).maybeSingle();if(error)throw error;return data?parseCloudRecord(data,userId):null;},
 async save(input,expectedRevision){const state=stateSchema.parse(input);if(state.demo)throw Error('Demo cannot upload.');const {data,error}=await client.rpc('save_journey',{p_owner:userId,p_state:state,p_expected_revision:expectedRevision});if(error)throw error;if(!data?.length)return {kind:'conflict'};return {kind:'saved',record:parseCloudRecord(data[0],userId)};}
};}
