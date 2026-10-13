const characterPath = (name: 'mochi' | 'chonk') => `characters/${name}.png`;
import { HamsterArt } from './HamsterArt.tsx';
import type { HamsterPose } from './hamsterArtwork.ts';
export type MascotMotion = 'idle' | 'cheer' | 'nuzzle';

export function Mochi({bow=false,className='',width,height,motion='idle',pose}:{bow?:boolean,className?:string,width?:number,height?:number,motion?:MascotMotion,pose?:HamsterPose}) {
  return <span className={`mascot-shell motion-${motion} ${className}`} style={{width,height}}>
    {pose?<HamsterArt pose={pose} className="mascot-idle mascot-mochi"/>:<img className="mascot-idle mascot-mochi" src={characterPath('mochi')} alt="Mochi, the small gray hamster from LycheeGelly’s animation"/>}
    {bow&&<span className="mascot-bow" role="img" aria-label="pink bow"/>}
  </span>;
}

export function Chonk({className='',motion='idle',pose}:{className?:string,motion?:MascotMotion,pose?:HamsterPose}) {
  return <span className={`mascot-shell motion-${motion} ${className}`}>
    {pose?<HamsterArt pose={pose} className="mascot-idle mascot-chonk"/>:<img className="mascot-idle mascot-chonk" src={characterPath('chonk')} alt="Chonk, the larger brown hamster from LycheeGelly’s animation"/>}
  </span>;
}
