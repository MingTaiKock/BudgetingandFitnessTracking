import {useState} from 'react';
import type {State} from '../model.ts';
import {buildReferenceReview} from '../referenceReview.ts';
import {downloadJSON} from '../download.ts';
import {dateKey} from '../dates.ts';
import {EQUIPMENT_LABELS} from '../exercises.ts';

export default function ReferenceReview({state,kind}:{state:State,kind:'meals'|'exercises'}){
 const [error,setError]=useState('');
 const batch=buildReferenceReview(state),count=batch[kind].length;
 if(state.demo)return null;
 function download(){
  try{downloadJSON(JSON.stringify({...batch,exercises:kind==='exercises'?batch.exercises:[],meals:kind==='meals'?batch.meals:[]},null,2),`small-wins-${kind}-review-${dateKey()}.json`);setError('');}
  catch{setError('The download could not start. Your saved records are unchanged. Try again.');}
 }
 return <details className="secondary-tools reference-review"><summary>Reference review · {count} {kind==='meals'?(count===1?'meal':'meals'):(count===1?'exercise':'exercises')}</summary><section className="panel">
  <h3>{kind==='meals'?'Meals to look up':'Exercises needing hamster artwork'}</h3>
  <p>{kind==='meals'?'Saved meals without a matching calorie reference appear here. Your own calorie values stay unchanged.':'Saved custom exercises without matching artwork appear here. You can keep using them while their images are prepared.'}</p>
  {count?<><ul>{kind==='meals'?batch.meals.map(m=><li key={m.name}><strong>{m.name}</strong> · {m.portions.join(', ')}</li>):batch.exercises.map(e=><li key={`${e.name}-${e.equipment}`}><strong>{e.name}</strong> · {e.equipment?EQUIPMENT_LABELS[e.equipment]:'Equipment needs clarification'}</li>)}</ul><button className="button secondary" onClick={download}>Download review list</button></>:<p>No missing references in your saved {kind==='meals'?'meals':'exercises'}.</p>}
  <p className="settings-note">Download the list and attach it to our development chat when you want a batch reviewed. Nothing is sent automatically. The list includes only {kind==='meals'?'meal names and portions':'exercise names and equipment'}; you can inspect it before sharing. No background lookup, image generation or scheduled review is running.</p>
  {error&&<p role="alert">{error}</p>}
 </section></details>;
}
