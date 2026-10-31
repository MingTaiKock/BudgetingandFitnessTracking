import {test} from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../src/demo.ts';
import {stateSchema} from '../src/model.ts';
import {createBackup,parseBackup} from '../src/domain.ts';
import {foodDayTotal,saveFoodEntry,removeFoodEntry} from '../src/food.ts';
import {estimateFood,foodOptions} from '../src/foodEstimate.ts';
const meal={id:'food-1',date:'2026-10-01',meal:'Chicken rice',portion:'1 plate',category:'Lunch' as const,kcal:600,origin:'manual' as const,assumptions:''};

test('meal options start populated and include saved free text without case duplicates',()=>{
 const options=foodOptions([{...meal,meal:'My oats'},{...meal,meal:' my OATS '}]);
 assert.ok(options.includes('Roasted chicken rice'));
 assert.equal(options.filter(x=>x.toLowerCase()==='my oats').length,1);
});
test('weight estimates scale known recipe grams or a supplied label without guessing dish weights',()=>{
 const recipe=estimateFood('Brown chicken rice (HPB recipe)','130 g');
 assert.equal(recipe.kind,'estimate');if(recipe.kind==='estimate')assert.equal(recipe.value.kcal,151);
 const label=estimateFood('My oats','250 grams',160);
 assert.equal(label.kind,'estimate');if(label.kind==='estimate'){assert.equal(label.value.kcal,400);assert.match(label.value.assumptions,/160 kcal per 100 g/);}
 assert.equal(estimateFood('Chicken rice','200 g').kind,'portion');
 for(const value of [NaN,Infinity,-1,1001])assert.equal(estimateFood('My oats','100 g',value).kind,'portion');
 assert.equal(estimateFood('My oats','0 g',160).kind,'portion');
 assert.equal(estimateFood('My oats','2 bowls',160).kind,'unknown');
});
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
