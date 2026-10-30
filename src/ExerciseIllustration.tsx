import {Dumbbell} from 'lucide-react';
import {useState} from 'react';
import type {Equipment} from './model.ts';
import {exerciseIllustration} from './exerciseIllustrations.ts';
import './exerciseIllustration.css';

export default function ExerciseIllustration({exerciseId,equipment,name,size=64}:{exerciseId?:string,equipment?:Equipment,name:string,size?:number}){
 const art=exerciseIllustration(exerciseId,equipment);
 const [failed,setFailed]=useState<string>();
 const visible=art&&failed!==art.src;
 return <span className={`exercise-illustration ${visible?'':'exercise-illustration-fallback'}`} style={{width:size,height:size}}>
  {visible?<img src={art.src} alt={`${art.character==='mochi'?'Mochi':'Chonk'}: ${name}`} width={size} height={size} loading="lazy" decoding="async" onError={()=>setFailed(art.src)}/>:<Dumbbell aria-hidden="true" size={24}/>}
 </span>;
}
