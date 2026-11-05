import type { Routine } from './model.ts';
import type { HistoryDay } from './exerciseProgress.ts';
import { addDays } from './dates.ts';

export function workoutSuggestion(exercise:Routine['exercises'][number], previous:HistoryDay|undefined, today:string) {
  if (!previous || previous.date < addDays(today,-30) || previous.sessions !== 1 || !previous.sets.length) return null;
  const load = previous.sets[0].kg;
  if (!previous.sets.every(set => set.kg === load)) return null;
  const reps = Math.min(...previous.sets.map(set => set.reps));
  const count = previous.sets.reduce((sum,set) => sum + set.sets, 0);
  const repeat = { kg:String(load), reps:String(reps) };
  if (count !== exercise.sets || reps < exercise.repMin) return null;
  if (reps < exercise.repMax) {
    return {repeat, nextReps:reps+1, message:`If the last set felt comfortable, try ${reps+1} reps for one set at the same load.`};
  }
  if (!load || /assist/i.test(exercise.name) || exercise.equipment === 'band') return null;
  return {repeat, nextReps:null, message:`You reached the top of your range on every set. If that felt comfortable, try the smallest available weight increase and start at ${exercise.repMin} reps. Enter the load you actually use below.`};
}
