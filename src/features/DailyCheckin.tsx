import { Droplets, Minus, Plus } from 'lucide-react';
import { dateKey } from '../dates.ts';
import type { FeatureProps } from '../components.tsx';
import { Sticker, type StickerName } from '../Sticker.tsx';
// Gentle reactions only: a low day gets a soft wave, never a punishment.
const MOOD_STICKER:Record<'happy'|'okay'|'low',StickerName>={happy:'cream-celebrating',okay:'cream-thumbs-up',low:'cream-teary-wave'};
export default function DailyCheckin({state,change}:FeatureProps){
 const date=dateKey(),check=state.checkins[date]??{water:0,waterTarget:state.profile.waterTarget,mood:null,rest:false};
 const update=(patch:Partial<typeof check>)=>change({...state,checkins:{...state.checkins,[date]:{...check,...patch}}});
 return <details className="secondary-tools"><summary>Daily check-in · water, mood & rest</summary><section className="panel"><div className="form-actions"><Droplets/><span>{check.water} / {check.waterTarget??state.profile.waterTarget} glasses</span><button className="icon-button" aria-label="Remove a glass of water" disabled={check.water===0} onClick={()=>update({water:check.water-1})}><Minus/></button><button className="icon-button" aria-label="Add a glass of water" disabled={check.water>=30} onClick={()=>update({water:check.water+1})}><Plus/></button></div><p>How are you feeling?</p><div className="filter-row">{(['happy','okay','low'] as const).map(m=><button key={m} aria-pressed={check.mood===m} className={check.mood===m?'selected':''} onClick={()=>update({mood:check.mood===m?null:m})}>{m}</button>)}</div>{check.mood&&<Sticker key={check.mood} name={MOOD_STICKER[check.mood]} size={88} className="checkin-sticker" still={!state.preferences.gentleMotion}/>}<button className="button secondary" aria-pressed={check.rest} onClick={()=>update({rest:!check.rest})}>{check.rest?'Rest day recorded · undo':'Log a rest day'}</button>{check.rest&&<Sticker name="cream-yawning" size={88} className="checkin-sticker" still={!state.preferences.gentleMotion}/>}</section></details>;
}
