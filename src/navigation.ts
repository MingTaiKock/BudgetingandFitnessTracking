export type NavigationVisibility={budget:boolean,fitness:boolean,insights:boolean,connection:boolean};
export const DEFAULT_NAVIGATION:Readonly<NavigationVisibility>={budget:true,fitness:true,insights:true,connection:false};
export const NAVIGATION_DESTINATIONS=[
 {id:'habitat',label:'Home',description:'Your habitat'},
 {id:'budget',label:'Money',description:'Budget & savings'},
 {id:'fitness',label:'Movement',description:'Workouts & progress'},
 {id:'insights',label:'Insights',description:'Your weekly overview'},
 {id:'connection',label:'Connection',description:'Your private corner'},
] as const;
export const resolveNavigation=(value?:NavigationVisibility):NavigationVisibility=>({...DEFAULT_NAVIGATION,...value});
export const sameNavigation=(a:NavigationVisibility,b:NavigationVisibility)=>Object.keys(DEFAULT_NAVIGATION).every(key=>a[key as keyof NavigationVisibility]===b[key as keyof NavigationVisibility]);
export const visibleDestinations=(value?:NavigationVisibility)=>NAVIGATION_DESTINATIONS.filter(({id})=>id==='habitat'||resolveNavigation(value)[id]);
