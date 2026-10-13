import { CATEGORIES, profileSchema, stateSchema, type State, type Profile, type Category } from './model.ts';
import { parseMoney } from './domain.ts';
import { dateKey, addDays, weekStart, shiftMonth } from './dates.ts';
import { starterRoutines } from './routines.ts';
export function freshState(profile?:Profile):State {
  return {version:2,demo:false,activeWorkout:null,activeReset:null,preferences:{connectionEnabled:false,gentleMotion:true},connections:[],scenarios:[],scenarioApplications:[],intentions:[],schedule:[],profile:profile??{name:'Mochi',coachName:'Chonk',currency:'SGD',weeklyTarget:3,waterTarget:8},budgets:[],transactions:[],workouts:[],goals:[],routines:starterRoutines(),checkins:{},owned:[]};
}
export type SetupChoices={profile:Profile,budget:Record<Category,string>|null,routines:'gentle'|'gym'|'both'|'later'};
export function createPersonalJourney(source:State,choices:SetupChoices):State {
  if(!source.demo)throw new Error('You already have a personal journey. Edit your preferences in Settings.');
  const next=freshState(profileSchema.parse(choices.profile));
  const selections:Record<SetupChoices['routines'],string[]>={gentle:['starter-paws'],gym:['starter-chonk'],both:['starter-paws','starter-chonk'],later:[]};
  if(!Object.hasOwn(selections,choices.routines))throw new Error('Choose a starter routine or decide later.');
  next.routines=next.routines.filter(r=>selections[choices.routines].includes(r.id));
  if(choices.budget) {
    const month=dateKey().slice(0,7);
    next.budgets=CATEGORIES.map(category=>{
      const value=choices.budget![category.id].trim();
      return {month,category:category.id,limitCents:!value||/^0(\.0{1,2})?$/.test(value)?0:parseMoney(value)};
    });
  }
  return stateSchema.parse(next);
}
export function demoState():State {
  const s=freshState();s.demo=true;
  const today=dateKey(),month=today.slice(0,7),start=weekStart(today);
  s.budgets=[{month,category:'food',limitCents:45000},{month,category:'transport',limitCents:15000},{month,category:'shopping',limitCents:20000},{month,category:'fun',limitCents:20000},{month,category:'health',limitCents:15000},{month,category:'other',limitCents:15000}];
  s.transactions=[{id:'demo-pay',date:`${month}-01`,type:'income',category:'other',amountCents:320000,note:'Monthly salary'},{id:'demo-lunch',date:today,type:'expense',category:'food',amountCents:850,note:'A cozy little lunch'},{id:'demo-mrt',date:today,type:'expense',category:'transport',amountCents:220,note:'MRT ride'},{id:'demo-date',date:addDays(today,-1),type:'expense',category:'fun',amountCents:2400,note:'Coffee date with Chonk'}];
  for(let i=0;i<6;i++){
    const m=shiftMonth(month,-i);s.transactions.push({id:`demo-spend-${i}`,date:`${m}-01`,type:'expense',category:'food',amountCents:[14600,38200,40500,35000,46200,49000][i],note:'Sample monthly spending'});
  }
  for(let i=0;i<8;i++){
    const d=addDays(start,-7*i);s.workouts.push({id:`demo-walk-${i}`,date:d,activity:'Evening walk',minutes:35+i*2,notes:'A little fresh air and a lot of good feelings.',sets:[]});
    if(i>0)s.workouts.push({id:`demo-strength-${i}`,date:addDays(d,2),activity:'Strength training',minutes:35+(7-i)*3,notes:'Slow and steady.',sets:[{exercise:'Goblet squat',sets:3,reps:10,kg:8+(7-i)}]});
  }
  s.checkins={[today]:{water:4,waterTarget:8,mood:'happy',rest:false},[addDays(today,-1)]:{water:8,waterTarget:8,mood:'okay',rest:false},[addDays(today,-2)]:{water:8,waterTarget:8,mood:'happy',rest:true}};
  s.goals=[{id:'demo-goal',name:'Our little getaway',targetCents:100000,contributions:[{id:'demo-contribution',date:today,amountCents:36000}]}];s.owned=['bow'];return s;
}
