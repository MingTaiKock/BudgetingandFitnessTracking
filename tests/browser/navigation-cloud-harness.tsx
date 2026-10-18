import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from '../../src/App';
import {freshState} from '../../src/demo';
import '../../src/styles.css';
import '../../src/wellness.css';
import '../../src/prototype.css';
import '../../src/supporting.css';
import '../../src/focused.css';
import '../../src/stickers.css';
function Harness(){
 const [snap,setSnap]=useState({state:freshState(),status:'Saved online',warning:null as string|null});
 (window as any).qaUpdate=setSnap;
 return <App external={{...snap,change:state=>{setSnap({state,status:'Saving online…',warning:null});return true;},retry:()=>setSnap(s=>({...s,status:'Saved online',warning:null})),accountPanel:<p>Isolated test account — no network storage</p>}}/>;
}
createRoot(document.getElementById('root')!).render(<Harness/>);
