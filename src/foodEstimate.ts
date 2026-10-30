import type {FoodEstimate} from './food.ts';
export const FOOD_SOURCE='https://www.myheart.org.sg/techniques/common-food-drinks-sauces-content/';
// Singapore Heart Foundation, citing HPB; retrieved 2026-10-25.
// Values are reference dishes, not measured portions or a complete food database.
export const COMMON_FOODS=[
 {name:'Roasted chicken rice',aliases:['chicken rice'],kcal:525,unit:'plate'},
 {name:'Wanton noodles dry',aliases:['dry wanton noodles','wanton mee dry'],kcal:441,unit:'plate'},
 {name:'Fried fish beehoon soup with milk',aliases:[],kcal:642,unit:'bowl'},
 {name:'Minced pork porridge',aliases:[],kcal:320,unit:'bowl'},
 {name:'Hokkien mee',aliases:[],kcal:522,unit:'plate'},
 {name:'Chicken nasi briyani',aliases:['chicken biryani','chicken briyani'],kcal:719,unit:'plate'},
 {name:'Plain roti prata',aliases:['roti prata kosong','plain prata'],kcal:163,unit:'piece'},
 {name:'Thosai masala',aliases:['masala thosai'],kcal:362,unit:'serving'},
 {name:'Mee siam',aliases:[],kcal:562,unit:'bowl'},
 {name:'Nasi lemak with chicken wing',aliases:[],kcal:657,unit:'plate'},
 {name:'Mee rebus',aliases:[],kcal:559,unit:'bowl'},
 {name:'Nasi goreng',aliases:[],kcal:742,unit:'plate'},
] as const;
type Result={kind:'estimate',name:string,value:FoodEstimate}|{kind:'unknown'|'portion',message:string};
const normalize=(s:string)=>s.toLowerCase().trim().replace(/\s+/g,' ');
export function estimateFood(meal:string,portion:string):Result {
 const name=normalize(meal),food=COMMON_FOODS.find(f=>normalize(f.name)===name||f.aliases.some(a=>a===name));
 if(!food)return {kind:'unknown',message:'This meal is not in the common-meal list yet. Choose a matching meal from the suggestions or enter your own calories. Extra dishes and drinks should be logged separately.'};
 let p=normalize(portion).replace(/½/g,'0.5').replace(/¼/g,'0.25').replace(/^half(?: a)? /,'0.5 ').replace(/^quarter(?: of a| a)? /,'0.25 ').replace(/^one /,'1 ').replace(/^two /,'2 ').replace(/^three /,'3 ').replace(/^1\/2 /,'0.5 ').replace(/^1\/4 /,'0.25 ');
 const match=p.match(/^(\d+(?:\.\d+)?)\s+(plates?|bowls?|pieces?|servings?)$/);
 const quantity=match?Number(match[1]):NaN,unit=match?.[2].replace(/s$/,'');
 if(!Number.isFinite(quantity)||quantity<=0||quantity>10||(unit!==food.unit&&unit!=='serving'))return {kind:'portion',message:`Roughly how many ${food.unit}s? Try “1 ${food.unit}” or “half a ${food.unit}”. This reference cannot convert grams or vague sizes reliably.`};
 return {kind:'estimate',name:food.name,value:{kcal:Math.round(food.kcal*quantity),source:FOOD_SOURCE,assumptions:`Matched ${food.name}. ${quantity} × ${food.unit==='piece'?'one piece':'one typical reference dish'} (${food.kcal} kcal each). ${food.unit==='piece'?'Prata reference: 326 kcal for two plain pieces. ':''}Portion sizes and preparation vary; drinks and extra sides are not included. Check this match before saving.`}};
}
