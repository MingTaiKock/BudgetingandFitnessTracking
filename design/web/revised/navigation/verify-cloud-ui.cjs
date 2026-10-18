async(page)=>{
 const check=(ok,message)=>{if(!ok)throw Error(message)};
 await page.goto('http://127.0.0.1:5202/tests/browser/navigation-cloud-harness.html');await page.setViewportSize({width:1440,height:1000});
 await page.getByRole('button',{name:'Account and settings',exact:true}).click();const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});
 await page.getByRole('switch',{name:'Show Connection in navigation'}).check();await page.getByRole('button',{name:'Save navigation',exact:true}).click();
 check(await nav.getByRole('button').count()===4,'Pending save changed active tabs');check((await page.locator('.navigation-status').innerText()).includes('Saving online'),'Pending status missing');
 await page.evaluate(()=>window.qaUpdate(s=>({...s,status:'Not saved online · retry needed',warning:'Offline — please retry.'})));
 check(await nav.getByRole('button').count()===4,'Failed online save changed tabs');await page.getByRole('button',{name:'Retry navigation saving',exact:true}).click();await nav.getByRole('button',{name:'Connection',exact:true}).waitFor();
 await page.getByRole('switch',{name:'Show Money in navigation'}).uncheck();
 await page.evaluate(()=>window.qaUpdate(s=>({...s,state:{...s.state,preferences:{...s.state.preferences,navigation:{budget:false,fitness:false,insights:false,connection:false}}}})));
 await page.getByText('Saved choices changed while you were editing. Review them before saving.',{exact:true}).waitFor();check(await page.getByRole('switch',{name:'Show Movement in navigation'}).isChecked(),'Remote refresh destroyed dirty draft');check(await page.getByRole('button',{name:'Save navigation',exact:true}).isDisabled(),'Unreviewed draft can save');
 await page.getByRole('button',{name:'Keep my choices',exact:true}).click();check(await page.getByRole('button',{name:'Save navigation',exact:true}).isEnabled(),'Explicit choice cannot save');
 await page.getByRole('button',{name:'Save navigation',exact:true}).click();await page.evaluate(()=>window.qaUpdate(s=>({...s,status:'Newer version on another device',warning:'Another device has newer records.'})));
 check(await page.getByRole('button',{name:'Save navigation',exact:true}).isDisabled(),'Conflict permits write');check(await nav.getByRole('button').count()===1,'Conflict changed last confirmed navigation');
 await page.evaluate(()=>window.qaUpdate(s=>({...s,status:'Saved online',warning:null,state:{...s.state,preferences:{...s.state.preferences,navigation:{budget:true,fitness:false,insights:true,connection:false}}}})));
 await page.getByRole('button',{name:'Load saved choices',exact:true}).click();check(await page.getByRole('switch',{name:'Show Money in navigation'}).isChecked(),'Reload did not apply remote');check(!(await page.getByRole('switch',{name:'Show Movement in navigation'}).isChecked()),'Reload movement mismatch');
 return {passed:['pending keeps prior tabs','online failure and retry','dirty draft survives remote update','explicit reconciliation','conflict blocks saving','load saved choices'],mockedOnline:true};
}
