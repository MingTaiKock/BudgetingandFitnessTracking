import { HamsterArt } from './HamsterArt.tsx';
import type { Cosmetic } from './model.ts';

export function Garden({owned,growing=false}:{owned:Cosmetic[],growing?:boolean}) {
  return <svg className="garden-scene" viewBox="0 0 520 340" role="img" aria-label="Mochi’s little garden with a sunflower, soft hills, and a cozy home">
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#e8dcf5"/><stop offset="1" stopColor="#f0e6f6"/></linearGradient></defs>
    <path d="M0 0h520v340H0Z" fill="url(#sky)"/>
    <circle cx="401" cy="59" r="32" fill="#fff0bc"/>
    <path d="M12 97q25-30 52-8 25-31 54 4 9 16-22 16H32q-29 0-20-12m231-48q17-22 34-8 23-19 37 8 5 12-20 12h-35q-22 0-16-12" fill="#fff" opacity=".55"/>
    <path d="M0 217Q113 125 243 221T520 208V340H0Z" fill="#c9c4e0"/>
    <path d="M0 250Q125 173 295 254T520 244V340H0Z" fill="#b5c4b5"/>
    <path d="M0 294q132-91 286-23t234 4v65H0Z" fill="#d5d9c3"/>
    <path d="M520 281q-122-23-210 59h100q53-36 110-27" fill="#ede3cd"/>
    <g transform="translate(340 124)"><path d="M0 59h104v103H0Z" fill="#eee5fa" stroke="#9083ad" strokeWidth="2"/><path d="m-14 62 66-60 66 60Z" fill="#9b8abc" stroke="#80709e" strokeWidth="2"/><path d="M34 161v-55q17-26 35 0v55" fill="#d1b1cd" stroke="#a280a1" strokeWidth="2"/><circle cx="59" cy="133" r="3" fill="#96745c"/><rect x="8" y="90" width="20" height="23" rx="8" fill="#fff1c8" stroke="#a495b9"/><path d="M18 91v21m-9-10h18" stroke="#a495b9"/><path d="M7 72h27m-27 7h27m38-7h27m-27 7h27" stroke="#e4d5ee" strokeWidth="3"/></g>
    <g transform="translate(68 158)"><path d="M26 106V31" stroke="#6e906e" strokeWidth="5"/><path d="M26 81q-39-35-29-2 9 17 29 20m0-48q35-21 24 0-7 11-24 14" fill="#86a481"/>
      {Array.from({length:8},(_,i)=><ellipse key={i} cx="26" cy="12" rx="9" ry="20" fill="#f2ca70" transform={`rotate(${i*45} 26 31)`}/>)}<circle cx="26" cy="31" r="15" fill="#b38955"/><circle cx="21" cy="27" r="1.5" fill="#6c513b"/><circle cx="30" cy="27" r="1.5" fill="#6c513b"/><path d="M20 35q6 7 12 0" stroke="#6c513b" fill="none"/></g>
    {owned.includes('rug')&&<ellipse cx="249" cy="302" rx="89" ry="20" fill="#d9a4b7" stroke="#edc9d3" strokeWidth="5"/>}
    {growing&&<HamsterArt pose="chonk-garden" x={302} y={180} width={165} height={140}/>}
    <g className="garden-mochi"><HamsterArt pose={growing?'mochi-explore':'mochi-snack'} x={growing?120:145} y={159} width={210} height={145}/>
      {owned.includes('bow')&&<g transform="translate(230 188) rotate(-18)" role="img" aria-label="pink bow"><path d="M0 0q-24-17-23 0 0 13 23 4 23 9 23-4 1-17-23 0Z" fill="#df9fbe" stroke="#a76a8d" strokeWidth="2"/><circle cx="0" cy="2" r="5" fill="#c681a8"/></g>}
    </g>
    {owned.includes('plant')&&<g transform="translate(422 275)"><path d="m0 0 6 33h28l6-33Z" fill="#c99382"/><path d="M20 0v-38" stroke="#6c916d" strokeWidth="4"/><ellipse cx="10" cy="-25" rx="13" ry="7" fill="#7fa181" transform="rotate(35 10 -25)"/><ellipse cx="31" cy="-35" rx="13" ry="7" fill="#8dad84" transform="rotate(-30 31 -35)"/></g>}
    <g fill="#8ea88a"><path d="m40 296-4-13 9 7 2-14 5 21Zm419 29-4-13 9 7 2-14 5 21Z"/><path d="m370 309-4-12 9 7 2-14 5 21Z"/></g>
    <g fill="#f4e6ad"><circle cx="121" cy="295" r="4"/><circle cx="328" cy="304" r="4"/><circle cx="58" cy="326" r="4"/></g>
  </svg>;
}
