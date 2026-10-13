import mochiPoses from '../output/characters/pose-studies/mochi-poses-v1.png';
import chonkPoses from '../output/characters/pose-studies/chonk-poses-v1.png';
import mochiCozy from '../output/characters/diverse-activities/mochi-cozy-v1.png';
import chonkCozy from '../output/characters/diverse-activities/chonk-cozy-v1.png';
import mochiAdventure from '../output/characters/diverse-activities/mochi-little-adventures-v1.png';
import chonkAdventure from '../output/characters/diverse-activities/chonk-little-adventures-v1.png';
import mochiMove from '../output/characters/diverse-activities/mochi-move-v1.png';
import chonkMove from '../output/characters/diverse-activities/chonk-move-v1.png';
import mochiWeights from '../output/characters/gym-equipment/mochi-weights-v1.png';
import mochiMachines from '../output/characters/gym-equipment/mochi-machines-v1.png';
import chonkWeights from '../output/characters/gym-equipment/chonk-weights-v1.png';
import chonkMachines from '../output/characters/gym-equipment/chonk-machines-v1.png';
import chonkFunctional from '../output/characters/gym-equipment/chonk-functional-v1.png';

// Viewports select the existing drawings without redrawing or altering their pixels.
export const HAMSTER_ART={
  'mochi-cheer':{src:mochiPoses,box:'815 100 700 410',label:'Mochi smiling and cheering'},
  'chonk-wave':{src:chonkPoses,box:'785 135 710 395',label:'Chonk giving a friendly wave'},
  'chonk-water':{src:chonkPoses,box:'825 530 670 475',label:'Chonk holding his water bottle'},
  'mochi-save':{src:mochiAdventure,box:'90 20 680 520',label:'Mochi saving a coin in her little jar'},
  'mochi-dance':{src:mochiAdventure,box:'805 15 710 530',label:'Mochi dancing in headphones'},
  'mochi-snack':{src:mochiAdventure,box:'95 545 650 465',label:'Mochi enjoying a strawberry'},
  'mochi-explore':{src:mochiAdventure,box:'790 545 735 475',label:'Mochi looking through a telescope'},
  'chonk-plan':{src:chonkAdventure,box:'85 0 690 495',label:'Chonk planning with his calculator and notebook'},
  'chonk-hero':{src:chonkAdventure,box:'20 495 825 515',label:'Chonk celebrating in a cape with a star flag'},
  'mochi-sleep':{src:mochiCozy,box:'60 570 710 440',label:'Mochi sleeping in lavender pajamas'},
  'mochi-draw':{src:mochiCozy,box:'815 595 710 425',label:'Mochi drawing a little heart'},
  'chonk-read':{src:chonkCozy,box:'775 15 710 495',label:'Chonk reading with his glasses and cozy scarf'},
  'chonk-garden':{src:chonkCozy,box:'75 520 680 495',label:'Chonk watering a tiny sprout'},
  'mochi-stretch':{src:mochiMove,box:'25 95 835 445',label:'Mochi stretching on her lavender mat'},
  'mochi-rest':{src:mochiMove,box:'820 610 705 385',label:'Mochi taking a break with a towel'},
  'chonk-coach':{src:chonkMove,box:'90 530 720 480',label:'Chonk cheering with his coach stopwatch'},
  'chonk-medal':{src:chonkMove,box:'830 500 620 510',label:'Chonk celebrating with his medal'},
  'mochi-kettlebell':{src:mochiWeights,box:'150 20 540 470',label:'Mochi with a peach kettlebell'},
  'mochi-floor-press':{src:mochiWeights,box:'790 155 735 370',label:'Mochi with dumbbells on her exercise mat'},
  'mochi-band':{src:mochiWeights,box:'820 525 650 480',label:'Mochi exercising with a resistance band'},
  'mochi-leg-press':{src:mochiMachines,box:'40 50 765 455',label:'Mochi on a leg press machine'},
  'mochi-cable-row':{src:mochiMachines,box:'825 0 685 515',label:'Mochi on a seated cable row machine'},
  'mochi-chest-press':{src:mochiMachines,box:'155 515 500 490',label:'Mochi on a chest press machine'},
  'chonk-barbell':{src:chonkWeights,box:'35 0 760 530',label:'Chonk with his barbell'},
  'chonk-curl':{src:chonkWeights,box:'815 10 675 490',label:'Chonk with a curl bar'},
  'chonk-trap-bar':{src:chonkWeights,box:'30 520 775 485',label:'Chonk with a trap bar'},
  'chonk-pressdown':{src:chonkWeights,box:'850 495 600 510',label:'Chonk at a cable rope station'},
  'chonk-pulldown':{src:chonkMachines,box:'150 0 525 545',label:'Chonk on a lat pulldown machine'},
  'chonk-leg-extension':{src:chonkMachines,box:'825 70 640 480',label:'Chonk on a leg extension machine'},
  'chonk-smith':{src:chonkMachines,box:'805 555 720 465',label:'Chonk at a Smith machine'},
  'chonk-suspension':{src:chonkFunctional,box:'820 515 700 490',label:'Chonk with suspension training straps'},
} as const;
export type HamsterPose=keyof typeof HAMSTER_ART;

export const EXERCISE_ART:Record<string,HamsterPose>={
  'kettlebell-deadlift':'mochi-kettlebell','kettlebell-goblet-squat':'mochi-kettlebell',
  'dumbbell-floor-press':'mochi-floor-press','band-side-step':'mochi-band',
  'machine-leg-press':'mochi-leg-press','cable-seated-row':'mochi-cable-row',
  'machine-chest-press':'mochi-chest-press','barbell-deadlift':'chonk-barbell',
  'barbell-curl':'chonk-curl','trap-bar-deadlift':'chonk-trap-bar',
  'cable-rope-pressdown':'chonk-pressdown','machine-lat-pulldown':'chonk-pulldown',
  'machine-leg-extension':'chonk-leg-extension','smith-squat':'chonk-smith','suspension-row':'chonk-suspension',
};
