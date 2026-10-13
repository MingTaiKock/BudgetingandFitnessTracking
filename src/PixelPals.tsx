import { HamsterArt } from './HamsterArt.tsx';
import type { HamsterPose } from './hamsterArtwork.ts';
export function PixelPal({animal,celebrate=false,pose}:{animal:'mochi'|'chonk',celebrate?:boolean,pose?:HamsterPose}) {
  return <HamsterArt pose={pose??(animal==='mochi'?(celebrate?'mochi-cheer':'mochi-stretch'):(celebrate?'chonk-medal':'chonk-coach'))} className={`pixel-pal ${celebrate?'pixel-cheer':''}`}/>;
}
