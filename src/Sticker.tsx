import { STICKERS, type StickerName as AnimatedStickerName } from './stickers.generated.ts';
const REWARD_ASSETS={ 'reward-logging':'logging', 'reward-savings':'savings', 'reward-workout':'workout' } as const;
export type StickerName=AnimatedStickerName|keyof typeof REWARD_ASSETS;

// Animated hamster sticker. The browser itself picks the still PNG when the
// visitor prefers reduced motion; `still` does the same for the in-app
// gentle-motion preference. Decorative by default: nearby text already says what happened.
export function Sticker({name,size=96,className='',label,still=false}:{name:StickerName,size?:number,className?:string,label?:string,still?:boolean}) {
  const reward=REWARD_ASSETS[name as keyof typeof REWARD_ASSETS];
  if(reward)return <span className={`sticker reward-sticker ${className}`}><img src={`/companions/${reward}.webp`} width={size} height={size} style={{objectFit:'contain'}} alt={label??''} aria-hidden={label?undefined:true} decoding="async" draggable={false}/></span>;
  const art=STICKERS[name as AnimatedStickerName],src=`/stickers/${name}`;
  return <picture className={`sticker ${className}`}>
    {!still&&<source srcSet={`${src}.webp`} type="image/webp" media="(prefers-reduced-motion: no-preference)"/>}
    <img src={`${src}.png`} width={size} height={Math.round(size*art.height/art.width)} alt={label??''} aria-hidden={label?undefined:true} loading="lazy" decoding="async" draggable={false}/>
  </picture>;
}
