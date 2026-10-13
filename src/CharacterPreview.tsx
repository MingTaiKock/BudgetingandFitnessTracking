import { useState } from 'react';
import { Mochi, Chonk, type MascotMotion } from './MascotCharacters.tsx';
import { PixelPal } from './PixelPals.tsx';
import { HamsterArt } from './HamsterArt.tsx';
import { HAMSTER_ART, type HamsterPose } from './hamsterArtwork.ts';

const COLLECTIONS:{name:string,poses:HamsterPose[]}[]=[
  {name:'Everyday little wins',poses:['mochi-save','chonk-plan','mochi-snack','chonk-read','mochi-draw','chonk-garden','mochi-explore','chonk-hero']},
  {name:'Move, rest & celebrate',poses:['mochi-stretch','chonk-coach','mochi-rest','chonk-water','mochi-sleep','mochi-dance','mochi-cheer','chonk-wave','chonk-medal']},
  {name:'Gym buddies',poses:['mochi-kettlebell','mochi-floor-press','mochi-band','mochi-leg-press','mochi-cable-row','mochi-chest-press','chonk-barbell','chonk-curl','chonk-trap-bar','chonk-pressdown','chonk-pulldown','chonk-leg-extension','chonk-smith','chonk-suspension']},
];

export default function CharacterPreview() {
  const [motion,setMotion]=useState<MascotMotion>('idle');
  const [collection,setCollection]=useState(0);
  return <main className="character-sheet">
    <a href="/" className="text-link">← Back to Little Wins</a>
    <h1>Two hamsters.<br/>One little team.</h1>
    <p className="character-subtitle">Mochi is the small gray hamster; Chonk is the bigger brown one. Their look follows <a href="https://www.instagram.com/p/C7nU9AloIn9/" target="_blank" rel="noreferrer">the video you chose</a>, with our generated pose artwork bringing their little world to life.</p>
    <section className="motion-demo" aria-label="Animated character preview">
      <span className="motion-demo-label">See them move</span>
      <div className="motion-duo"><Chonk pose="chonk-wave" motion={motion}/><Mochi pose="mochi-cheer" motion={motion}/></div>
      <div className="motion-controls" role="group" aria-label="Choose a hamster animation">
        {([['idle','Gentle breathe'],['cheer','Happy hop'],['nuzzle','Nuzzle together']] as const).map(([value,label])=><button key={value} type="button" aria-pressed={motion===value} onClick={()=>setMotion(value)}>{label}</button>)}
      </div>
      <p>A gentle motion preview using the existing pose artwork.</p>
    </section>
    <div className="character-duo">
      <section className="character-mochi"><div className="character-sparkle">✧</div><Mochi pose="mochi-save" motion={motion==='nuzzle'?'idle':motion}/><h2>Mochi</h2><span>Your sweet little gray hamster</span><p>Small paws. Soft cheeks.<br/>Brave enough for one more little step.</p><div className="character-message">“One little step? We can do that!”</div></section>
      <span className="duo-heart">♡</span>
      <section className="character-chonk"><div className="character-sparkle">✦</div><Chonk pose="chonk-coach" motion={motion==='nuzzle'?'idle':motion}/><h2>Chonk</h2><span>Your big brown hamster coach</span><p>Round belly. Steady encouragement.<br/>Always cheering for his favorite hamster.</p><div className="character-message">“I’m proud of you, little hamster.”</div></section>
    </div>
    <div className="character-pixel-row"><div><span className="pixel-label">And at workout time…</span><h2>Your pocket-sized cheer squad.</h2><p>The same two hamsters keep you company beside each exercise.</p></div><div className="pixel-preview"><PixelPal animal="mochi"/><span>Mini Mochi</span></div><div className="pixel-preview"><PixelPal animal="chonk"/><span>Mini Chonk</span></div></div>
    <section className="character-pose-gallery" aria-label="Mochi and Chonk artwork collection">
      <h2>A pose for every little moment.</h2>
      <p>Saving, moving, resting, growing. Meet the artwork used around your app.</p>
      <div className="pose-collection-controls" role="group" aria-label="Choose an artwork collection">{COLLECTIONS.map((group,i)=><button key={group.name} aria-pressed={collection===i} onClick={()=>setCollection(i)}>{group.name}</button>)}</div>
      <div className="pose-gallery-grid">{COLLECTIONS[collection].poses.map(pose=><figure key={pose}><HamsterArt pose={pose}/><figcaption>{HAMSTER_ART[pose].label}</figcaption></figure>)}</div>
      {collection===2&&<p>Little gym companions for encouragement. These illustrations aren’t exercise-form demonstrations.</p>}
    </section>
    <footer>Made for Mochi & Chonk, with love. ♡</footer>
  </main>;
}
