import type {State} from '../model.ts';
import {weeklyWins} from '../guidance.ts';
import {Sticker,type StickerName} from '../Sticker.tsx';
import '../guidance.css';
export default function WeeklyWins({state,today,saveLabel}:{state:State,today:string,saveLabel:string}){
 const wins=weeklyWins(state,today);
 const items:{art:StickerName,title:string,body:string}[]=[
  {art:'reward-logging',title:wins.loggingDays?`${wins.loggingDays} ${wins.loggingDays===1?'day':'days'} of checking in`:'Your next little check-in',body:wins.loggingDays?'You made room to notice your habits.':'A money entry, movement or check-in can start your week.'},
  {art:'reward-savings',title:wins.savingsDays?`${wins.savingsDays} savings ${wins.savingsDays===1?'day':'days'}`:'Something to look forward to',body:wins.savingsDays?'You recorded money set aside for something you care about.':'When you set money aside, you can record it in a goal.'},
  {art:'reward-workout',title:wins.workouts?`${wins.workouts} ${wins.workouts===1?'workout':'workouts'} recorded`:'Movement at your pace',body:wins.workouts?'Your effort has a place here. Rest belongs in your week too.':'Start when it suits you. A quiet week is okay.'},
 ];
 return <details className="secondary-tools weekly-wins"><summary>Your little wins this week · {wins.loggingDays} recorded {wins.loggingDays===1?'day':'days'}</summary><section className="panel"><p className="settings-note">{wins.start} to {today} · {saveLabel}</p><div className="wins-grid">{items.map(item=><article key={item.art}><Sticker name={item.art} size={80} still={!state.preferences.gentleMotion}/><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div><p className="settings-note">Based on your current records. Multiple check-ins on one day count as one day; edits update this summary.</p></section></details>;
}
