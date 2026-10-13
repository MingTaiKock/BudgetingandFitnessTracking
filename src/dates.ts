export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function asDate(value: string): Date { return new Date(`${value}T12:00:00`); }
export function addDays(value: string, days: number): string {
  const d=asDate(value); d.setDate(d.getDate()+days); return dateKey(d);
}
export function weekStart(value: string): string {
  const day=asDate(value).getDay(); return addDays(value,-((day+6)%7));
}
export function shiftMonth(month: string, shift: number): string {
  const d=asDate(`${month}-01`);d.setMonth(d.getMonth()+shift);return dateKey(d).slice(0,7);
}
export function monthLabel(month: string): string { return asDate(`${month}-01`).toLocaleDateString('en-SG',{month:'long',year:'numeric'}); }
export function shortDate(value: string): string { return asDate(value).toLocaleDateString('en-SG',{day:'numeric',month:'short'}); }
