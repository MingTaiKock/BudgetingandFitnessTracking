import { z } from 'zod';
import { dateKey, asDate } from './dates.ts';

export const CATEGORIES = [
  {id:'food',name:'Food & drinks',emoji:'🍜',color:'#eeb890'},
  {id:'transport',name:'Transport',emoji:'🚌',color:'#a9c7b1'},
  {id:'shopping',name:'Shopping',emoji:'🛍️',color:'#ccaee3'},
  {id:'fun',name:'Fun & dates',emoji:'🎈',color:'#e9abc1'},
  {id:'health',name:'Health',emoji:'🌿',color:'#b2c4e1'},
  {id:'other',name:'Other',emoji:'🧺',color:'#e0c68f'},
] as const;
export const SHOP = [
  {id:'bow',name:'Little pink bow',cost:30,emoji:'🎀',description:'A tiny bow for a very big personality.'},
  {id:'plant',name:'Garden buddy',cost:60,emoji:'🪴',description:'A leafy friend for Mochi’s corner.'},
  {id:'rug',name:'Picnic blanket',cost:100,emoji:'🧺',description:'A cozy spot for your little wins.'},
] as const;
const category=z.enum(['food','transport','shopping','fun','health','other']);
const cents=z.number().int().positive().max(100_000_000);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>v>='1900-01-01'&&dateKey(asDate(v))===v,'Use a valid calendar date');
const loggedDate=date.refine(v=>v<=dateKey(),'Log dates cannot be in the future');
const month=z.string().regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])$/);
const id=z.string().min(1).max(100);
const text=z.string().max(300);
export const equipmentSchema=z.enum(['bodyweight','dumbbell','kettlebell','barbell','cable','machine','band','smith','trap-bar','suspension']);
export type Equipment=z.infer<typeof equipmentSchema>;
const exerciseMetadata={exerciseId:id.optional(),equipment:equipmentSchema.optional()};
export const transactionSchema=z.object({id,date:loggedDate,type:z.enum(['expense','income']),category,amountCents:cents,note:text}).strict();
export const setSchema=z.object({exercise:z.string().trim().min(1).max(80),...exerciseMetadata,sets:z.number().int().min(1).max(100),reps:z.number().int().min(1).max(1000),kg:z.number().min(0).max(1000)}).strict();
export const workoutSchema=z.object({id,routineId:id.optional(),date:loggedDate,activity:z.string().trim().min(1).max(80),minutes:z.number().int().min(1).max(1440),notes:text,sets:z.array(setSchema).max(30)}).strict();
export const routineExerciseSchema=z.object({name:z.string().trim().min(1).max(80),...exerciseMetadata,plannedKg:z.number().min(0).max(1000).optional(),sets:z.number().int().min(1).max(10),repMin:z.number().int().min(1).max(100),repMax:z.number().int().min(1).max(100),cue:z.string().max(200)}).strict().refine(e=>e.repMin<=e.repMax,'Minimum reps must not exceed maximum reps');
export const routineSchema=z.object({id,name:z.string().trim().min(1).max(60),description:z.string().max(200),exercises:z.array(routineExerciseSchema).min(1).max(10)}).strict().refine(r=>r.exercises.reduce((a,e)=>a+e.sets,0)<=30,'A routine can have up to 30 total sets');
export const sessionSchema=z.object({
  id,routine:routineSchema,date:loggedDate,startedAt:z.number().int().nonnegative(),
  index:z.number().int().nonnegative(),
  entries:z.array(z.object({exerciseIndex:z.number().int().nonnegative(),reps:z.number().int().min(1).max(1000),kg:z.number().min(0).max(1000)}).strict()).max(30),
  reps:z.string().max(20),kg:z.string().max(20),minutes:z.string().max(10).nullable(),
  inputs:z.record(z.string().regex(/^\d+$/),z.object({reps:z.string().max(20),kg:z.string().max(20)}).strict()).default({}),
  restSeconds:z.union([z.literal(0),z.literal(30),z.literal(60),z.literal(90),z.literal(120)]),
  restEndsAt:z.number().int().nonnegative().nullable(),
}).strict().superRefine((session,ctx)=>{
  if(!session.routine.exercises[session.index])ctx.addIssue({code:'custom',message:'Invalid current exercise'});
  if(Object.keys(session.inputs).some(key=>!session.routine.exercises[Number(key)]))ctx.addIssue({code:'custom',message:'Invalid exercise input'});
  const counts=new Map<number,number>();
  for(const entry of session.entries){
    const exercise=session.routine.exercises[entry.exerciseIndex];
    const count=(counts.get(entry.exerciseIndex)??0)+1;counts.set(entry.exerciseIndex,count);
    if(!exercise||count>exercise.sets)ctx.addIssue({code:'custom',message:'Invalid completed set'});
  }
});
export const goalSchema=z.object({id,name:z.string().trim().min(1).max(80),targetCents:cents,contributions:z.array(z.object({id,date:loggedDate,amountCents:cents}).strict()).max(10000)}).strict();
export const profileSchema=z.object({name:z.string().trim().min(1).max(30),coachName:z.string().trim().min(1).max(30),currency:z.enum(['SGD','MYR','USD','EUR','GBP']),weeklyTarget:z.number().int().min(1).max(14),waterTarget:z.number().int().min(1).max(20)}).strict();
export const scheduleEntrySchema=z.discriminatedUnion('kind',[
  z.object({day:z.number().int().min(0).max(6),kind:z.literal('routine'),routineId:id}).strict(),
  z.object({day:z.number().int().min(0).max(6),kind:z.literal('rest')}).strict(),
]);
export const connectionSchema=z.object({id,date:loggedDate,minutes:z.number().int().min(1).max(1440),activity:z.enum(['conversation','shared-meal','walk','shared-activity','other']),note:text,origin:z.literal('manual')}).strict();
export const navigationSchema=z.object({budget:z.boolean(),fitness:z.boolean(),insights:z.boolean(),connection:z.boolean()}).strict();
export const preferencesSchema=z.object({connectionEnabled:z.boolean(),gentleMotion:z.boolean(),navigation:navigationSchema.optional()}).strict();
export const resetSchema=z.object({id,kind:z.enum(['pause','connection']),startedAt:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),endsAt:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)}).strict().refine(r=>r.endsAt===r.startedAt+90_000,'Reset duration must be 90 seconds');
export const scenarioSchema=z.object({id,label:z.string().trim().min(1).max(80),costCents:z.number().int().min(0).max(100_000_000),extraCostCents:z.number().int().min(0).max(100_000_000),occurrencesPerWeek:z.number().int().min(0).max(100),extraMinutes:z.number().int().min(-1440).max(1440)}).strict();
export const intentionSchema=z.object({id,label:z.string().trim().min(1).max(80),domain:z.enum(['money','movement','connection']),startDate:loggedDate,revisions:z.array(z.object({effectiveDate:date,target:z.number().int().min(1).max(7)}).strict()).min(1).max(100),completions:z.array(loggedDate).max(10000),scenarioId:id.optional(),archived:z.boolean().default(false)}).strict().superRefine((v,ctx)=>{
  if(v.revisions[0].effectiveDate!==v.startDate||v.revisions.some((r,i)=>r.effectiveDate<v.startDate||(i>0&&r.effectiveDate<=v.revisions[i-1].effectiveDate)))ctx.addIssue({code:'custom',message:'Keep intention targets in dated order'});
  if(v.completions.some(d=>d<v.startDate)||new Set(v.completions).size!==v.completions.length)ctx.addIssue({code:'custom',message:'Use unique completion days after the intention began'});
});
export const stateSchema=z.object({
  version:z.literal(2),demo:z.boolean(),profile:profileSchema,
  activeWorkout:sessionSchema.nullable().default(null),
  schedule:z.array(scheduleEntrySchema).max(7).default([]),
  preferences:preferencesSchema.default({connectionEnabled:false,gentleMotion:true}),
  connections:z.array(connectionSchema).max(10000).default([]),
  activeReset:resetSchema.nullable().default(null),
  scenarios:z.array(scenarioSchema).max(100).default([]),
  scenarioApplications:z.array(z.object({scenarioId:id,month,category,deltaCents:z.number().int().min(-100_000_000).max(100_000_000)}).strict()).max(1000).default([]),
  intentions:z.array(intentionSchema).max(100).default([]),
  budgets:z.array(z.object({month,category,limitCents:z.number().int().min(0).max(100_000_000)}).strict()).max(10000),
  transactions:z.array(transactionSchema).max(10000),workouts:z.array(workoutSchema).max(10000),goals:z.array(goalSchema).max(100),routines:z.array(routineSchema).max(50).default([]),
  checkins:z.record(loggedDate,z.object({water:z.number().int().min(0).max(30),waterTarget:z.number().int().min(1).max(20).optional(),mood:z.enum(['happy','okay','low']).nullable(),rest:z.boolean()}).strict()),
  owned:z.array(z.enum(['bow','plant','rug'])).max(3),
}).strict().superRefine((s,ctx)=>{
  if(new Set(s.schedule.map(p=>p.day)).size!==s.schedule.length)ctx.addIssue({code:'custom',message:'Plan each weekday only once'});
  if(s.schedule.some(p=>p.kind==='routine'&&!s.routines.some(r=>r.id===p.routineId)))ctx.addIssue({code:'custom',message:'Choose an existing routine for the weekly plan'});
  const ids=[...s.transactions,...s.workouts,...s.goals,...s.routines,...s.connections,...s.scenarios,...s.intentions,...s.goals.flatMap(g=>g.contributions)].map(r=>r.id);
  if(new Set(ids).size!==ids.length)ctx.addIssue({code:'custom',message:'Record IDs must be unique'});
  if(s.activeWorkout&&ids.includes(s.activeWorkout.id))ctx.addIssue({code:'custom',message:'Active session has already been recorded'});
  if(new Set(s.owned).size!==s.owned.length)ctx.addIssue({code:'custom',message:'Cosmetics must be unique'});
  const budgetKeys=s.budgets.map(b=>`${b.month}:${b.category}`);
  if(new Set(budgetKeys).size!==budgetKeys.length)ctx.addIssue({code:'custom',message:'Budget categories must be unique within a month'});
  if(Object.keys(s.checkins).length>10000)ctx.addIssue({code:'custom',message:'Too many daily check-ins'});
  const durations=new Map<string,number>();
  for(const entry of s.connections)durations.set(entry.date,(durations.get(entry.date)??0)+entry.minutes);
  if([...durations.values()].some(m=>m>1440))ctx.addIssue({code:'custom',message:'Connection time cannot exceed 24 hours in a day'});
  if(s.intentions.some(i=>i.scenarioId&&!s.scenarios.some(p=>p.id===i.scenarioId)))ctx.addIssue({code:'custom',message:'An experiment must reference a saved scenario'});
  if(s.intentions.filter(i=>i.scenarioId&&!i.archived).length>1)ctx.addIssue({code:'custom',message:'Choose one active weekly experiment'});
  const applications=s.scenarioApplications.map(a=>`${a.scenarioId}:${a.month}`);
  if(new Set(applications).size!==applications.length||s.scenarioApplications.some(a=>!s.scenarios.some(p=>p.id===a.scenarioId)))ctx.addIssue({code:'custom',message:'Apply each saved scenario once per month'});
});
export type State=z.infer<typeof stateSchema>;
export type Transaction=z.infer<typeof transactionSchema>;
export type Workout=z.infer<typeof workoutSchema>;
export type Goal=z.infer<typeof goalSchema>;
export type Profile=z.infer<typeof profileSchema>;
export type Category=Transaction['category'];
export type Cosmetic=State['owned'][number];
export type Routine=z.infer<typeof routineSchema>;
export type WorkoutSession=z.infer<typeof sessionSchema>;
export type Connection=z.infer<typeof connectionSchema>;
export type Scenario=z.infer<typeof scenarioSchema>;
export type Intention=z.infer<typeof intentionSchema>;
