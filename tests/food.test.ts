import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {stateSchema} from '../src/model.ts';
import {createBackup,parseBackup} from '../src/domain.ts';
import {foodDayTotal,saveFoodEntry,removeFoodEntry} from '../src/food.ts';
import {estimateFood} from '../src/foodEstimate.ts';
const meal={id:'food-1',date:'2026-10-01',meal:'Chicken rice',portion:'1 plate',category:'Lunch' as const,kcal:600,origin:'manual' as const,assumptions:''};
test('estimates use a sourced reference and scale only understood portions',()=>{
 const full=estimateFood('roasted chicken rice','1 plate');assert.equal(full.kind,'estimate');if(full.kind!=='estimate')return;assert.equal(full.value.kcal,525);assert.match(full.value.source!,/^https:/);
 const half=estimateFood('roasted chicken rice','half a plate');assert.equal(half.kind,'estimate');if(half.kind==='estimate')assert.equal(half.value.kcal,263);
 assert.equal(estimateFood('roasted chicken rice','a bit').kind,'portion');
 assert.equal(estimateFood('roasted chicken rice','-1 plate').kind,'portion');
 assert.equal(estimateFood('roasted chicken rice','200 g').kind,'portion');
 assert.equal(estimateFood('chicken rice and bubble tea','1 plate').kind,'unknown');
 assert.equal(estimateFood('pizza','1 slice').kind,'unknown');
 const prata=estimateFood('plain roti prata','1 piece');assert.equal(prata.kind,'estimate');if(prata.kind==='estimate')assert.equal(prata.value.kcal,163);
});
test('old journeys acquire an empty food diary without losing records',()=>{
 const old={...freshState()} as Record<string,unknown>;delete old.foodEntries;
 const parsed=stateSchema.parse(old);assert.deepEqual(parsed.foodEntries,[]);assert.deepEqual(parsed.transactions,old.transactions);
});
test('food entries edit in place, total by date and survive backup',()=>{
 let state=saveFoodEntry(freshState(),meal);state=saveFoodEntry(state,{...meal,kcal:550});
 assert.equal(state.foodEntries.length,1);assert.equal(foodDayTotal(state,'2026-10-01'),550);assert.equal(foodDayTotal(state,'2026-10-02'),null);
 assert.deepEqual(parseBackup(createBackup(state)).foodEntries,state.foodEntries);
 assert.equal(foodDayTotal(removeFoodEntry(state,meal.id),meal.date),null);
});
test('invalid calories, blank descriptions, impossible dates and duplicate IDs fail',()=>{
 for(const source of ['javascript:alert(1)','data:text/html,test','http://example.com'])assert.throws(()=>saveFoodEntry(freshState(),{...meal,source}));
 for(const patch of [{kcal:NaN},{kcal:-1},{kcal:Infinity},{meal:'  '},{portion:''},{date:'2026-02-30'},{date:'2999-01-01'}])assert.throws(()=>saveFoodEntry(freshState(),{...meal,...patch}));
 assert.equal(stateSchema.safeParse({...freshState(),foodEntries:[meal,meal]}).success,false);
 const state=saveFoodEntry(freshState(),meal);state.transactions=[{id:meal.id,date:meal.date,type:'expense',category:'food',amountCents:100,note:''}];assert.equal(stateSchema.safeParse(state).success,false);
});
