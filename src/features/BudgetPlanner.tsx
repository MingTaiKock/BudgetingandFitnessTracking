import { useState, type FormEvent } from 'react';
import { Copy } from 'lucide-react';
import { CATEGORIES } from '../model.ts';
import { parseMoney } from '../domain.ts';
import { monthLabel, shiftMonth } from '../dates.ts';
import { Dialog, Field, FormError, type FeatureProps } from '../components.tsx';

export default function BudgetPlanner({state,change,notice,month,onClose}:FeatureProps & {month:string,onClose:()=>void}) {
  const amountsFor=(source:string)=>Object.fromEntries(CATEGORIES.map(c=>[c.id,((state.budgets.find(b=>b.month===source&&b.category===c.id)?.limitCents??0)/100).toFixed(2)]));
  const [amounts,setAmounts]=useState(()=>amountsFor(month));
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const previous=shiftMonth(month,-1);
  const canCopy=state.budgets.some(b=>b.month===previous);
  function save(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const budgets=CATEGORIES.map(c=>({month,category:c.id,limitCents:/^0(\.0{1,2})?$/.test(amounts[c.id].trim())?0:parseMoney(amounts[c.id])}));
      if(!change({...state,budgets:[...state.budgets.filter(b=>b.month!==month),...budgets]}))return;
      notice('Your spending plan is ready.','cream-thumbs-up');onClose();
    } catch {setError('Use amounts from 0 to 1,000,000 with up to 2 decimal places.');}
  }
  return <Dialog title={`Plan ${monthLabel(month)}`} onClose={onClose}>
    <p className="dialog-description">Choose your category limits. These are your plan, not your bank balance.</p>
    {canCopy&&<div className="copy-budget"><button className="button secondary" onClick={()=>{setAmounts(amountsFor(previous));setCopied(true);setError('');}}><Copy size={17}/>Use last month’s limits</button><p role="status">{copied?'Copied into this preview. Review the amounts, then save.':`Start from ${monthLabel(previous)} and adjust what you need.`}</p></div>}
    <form onSubmit={save}><div className="form-grid">{CATEGORIES.map(c=><Field key={c.id} label={`${c.name} (${state.profile.currency})`}><input name={c.id} inputMode="decimal" required value={amounts[c.id]} onChange={e=>setAmounts({...amounts,[c.id]:e.target.value})}/></Field>)}</div><FormError error={error}/><div className="form-actions"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit">Save monthly plan</button></div></form>
  </Dialog>;
}
