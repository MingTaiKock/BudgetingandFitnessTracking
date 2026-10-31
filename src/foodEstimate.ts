import type {FoodEstimate} from './food.ts';
import type {FoodEntry} from './model.ts';
const RECIPE_SOURCE='https://www.healthhub.sg/sites/assets/Assets/PDFs/HPB/Healthier%20Meals%20in%20Childcare%20Centres%20Programme/Brown%20Chicken%20Rice.pdf';
export const FOOD_SOURCE='https://www.myheart.org.sg/techniques/common-food-drinks-sauces-content/';
// Singapore Heart Foundation, citing HPB; retrieved 2026-10-25.
// Values are reference dishes, not measured portions or a complete food database.
export const COMMON_FOODS=[
 {name:'Brown chicken rice (HPB recipe)',aliases:[],kcal:302.4,unit:'serving',grams:260,source:RECIPE_SOURCE},
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
export function foodOptions(entries:Pick<FoodEntry,'meal'>[]):string[]{
 const names=new Map<string,string>();
 for(const name of [...COMMON_FOODS.map(f=>f.name),...entries.map(e=>e.meal.trim())])if(name&&!names.has(normalize(name)))names.set(normalize(name),name);
 return [...names.values()];
}
export function estimateFood(meal:string,portion:string,kcalPer100g?:number):Result {
 const name=normalize(meal),food=COMMON_FOODS.find(f=>normalize(f.name)===name||f.aliases.some(a=>a===name));
 const weight=normalize(portion).match(/^(\d+(?:\.\d+)?)\s*(g|grams?|kg|kilograms?)$/);
 if(weight){
  const grams=Number(weight[1])*(weight[2].startsWith('k')?1000:1);
  if(!Number.isFinite(grams)||grams<=0||grams>5000)return {kind:'portion',message:'Enter a weight greater than 0 and up to 5,000 g.'};
  if(kcalPer100g!==undefined){
   if(!Number.isFinite(kcalPer100g)||kcalPer100g<0||kcalPer100g>1000)return {kind:'portion',message:'Use a label value from 0 to 1,000 kcal per 100 g.'};
   const kcal=Math.round(grams*kcalPer100g/100);
   if(kcal>10000)return {kind:'portion',message:'This portion exceeds 10,000 kcal. Check the weight and label value.'};
   return {kind:'estimate',name:meal.trim(),value:{kcal,assumptions:`${grams} g × your supplied ${kcalPer100g} kcal per 100 g. Check the label and whether the weight is cooked or uncooked.`}};
  }
  if(food&&'grams' in food)return {kind:'estimate',name:food.name,value:{kcal:Math.round(food.kcal*grams/food.grams),source:food.source,assumptions:`${grams} g of the HPB brown chicken rice recipe, based on ${food.kcal} kcal per ${food.grams} g. Includes cooked rice, skinless chicken and vegetables in the recipe proportions; not interchangeable with hawker chicken rice.`}};
  return {kind:'portion',message:'This meal has no verified weight reference. Enter kcal per 100 g from its label, or enter the total calories yourself. A plate cannot be converted to grams without a weight reference.'};
 }
 if(!food)return {kind:'unknown',message:'This meal is not in the common-meal list yet. Choose a matching meal from the suggestions or enter your own calories. Extra dishes and drinks should be logged separately.'};
 let p=normalize(portion).replace(/½/g,'0.5').replace(/¼/g,'0.25').replace(/^half(?: a)? /,'0.5 ').replace(/^quarter(?: of a| a)? /,'0.25 ').replace(/^one /,'1 ').replace(/^two /,'2 ').replace(/^three /,'3 ').replace(/^1\/2 /,'0.5 ').replace(/^1\/4 /,'0.25 ');
 const match=p.match(/^(\d+(?:\.\d+)?)\s+(plates?|bowls?|pieces?|servings?)$/);
 const quantity=match?Number(match[1]):NaN,unit=match?.[2].replace(/s$/,'');
 if(!Number.isFinite(quantity)||quantity<=0||quantity>10||(unit!==food.unit&&unit!=='serving'))return {kind:'portion',message:`Roughly how many ${food.unit}s? Try “1 ${food.unit}” or “half a ${food.unit}”. This reference cannot convert grams or vague sizes reliably.`};
 return {kind:'estimate',name:food.name,value:{kcal:Math.round(food.kcal*quantity),source:'source' in food?food.source:FOOD_SOURCE,assumptions:`Matched ${food.name}. ${quantity} × ${'grams' in food?`${food.grams} g recipe serving`:food.unit==='piece'?'one piece':'one typical reference dish'} (${food.kcal} kcal each). ${food.unit==='piece'?'Prata reference: 326 kcal for two plain pieces. ':''}Portion sizes and preparation vary; drinks and extra sides are not included. Check this match before saving.`}};
}
