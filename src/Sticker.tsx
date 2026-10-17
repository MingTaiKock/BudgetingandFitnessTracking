import { STICKERS, type StickerName } from './stickers.generated.ts';
export type { StickerName };

// Animated hamster sticker. The browser itself picks the still PNG when the
// visitor prefers reduced motion; `still` does the same for the in-app
// gentle-motion preference. Decorative by default: nearby text already says what happened.
export function Sticker({name,size=96,className='',label,still=false}:{name:StickerName,size?:number,className?:string,label?:string,still?:boolean}) {
  const art=STICKERS[name],src=`/stickers/${name}`;
  return <picture className={`sticker ${className}`}>
    {!still&&<source srcSet={`${src}.webp`} type="image/webp" media="(prefers-reduced-motion: no-preference)"/>}
    <img src={`${src}.png`} width={size} height={Math.round(size*art.height/art.width)} alt={label??''} aria-hidden={label?undefined:true} loading="lazy" decoding="async" draggable={false}/>
  </picture>;
}
