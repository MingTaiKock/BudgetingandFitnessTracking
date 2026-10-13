// Display illustration regions from the approved references. Interface text and
// metrics outside these regions are never rendered as part of the artwork.
const regions = {
  hero: ['dashboard', 630, 128, 875, 238],
  avatar: ['dashboard', 31, 91, 94, 90],
  finance: ['dashboard', 303, 446, 137, 126],
  fitness: ['dashboard', 718, 445, 136, 130],
  connection: ['dashboard', 1118, 443, 183, 130],
  cuddle: ['dashboard', 1135, 741, 310, 84],
  architect: ['identity', 470, 195, 406, 310],
  grow: ['identity', 1090, 195, 408, 310],
  cooking: ['planner', 296, 476, 381, 190],
  working: ['planner', 718, 493, 370, 171],
  relaxing: ['planner', 1124, 497, 371, 169],
  futureA: ['future', 287, 264, 539, 445],
  futureB: ['future', 948, 264, 555, 445],
} as const;
export type ArtName = keyof typeof regions;
export function PrototypeArt({name,className='',label}: {name:ArtName,className?:string,label?:string}) {
  const [file,x,y,w,h]=regions[name];
  return <div className={`reference-art art-${name} ${className}`} style={{aspectRatio:`${w}/${h}`}} role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true}><svg viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href={`/prototype/${file}.png`} width="1536" height="1024"/></svg></div>;
}
