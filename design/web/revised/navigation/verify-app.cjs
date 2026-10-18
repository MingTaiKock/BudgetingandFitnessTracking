async(page)=>{
 const check=(ok,message)=>{if(!ok)throw Error(message)};const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5202/');
 await page.evaluate(async()=>{const {freshState}=await import('/src/demo.ts');localStorage.setItem('little-wins:journey:v2',JSON.stringify(freshState()));});await page.reload();
 await page.getByRole('button',{name:'Continue on this device only'}).click();
 await page.setViewportSize({width:1440,height:1000});const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});
 await page.getByRole('button',{name:'Account and settings',exact:true}).click();
 check(await nav.getByRole('button').count()===4,'Old record defaults');
 await page.getByRole('switch',{name:'Show Connection in navigation'}).check();check(await nav.getByRole('button').count()===4,'Draft changed navigation');
 await nav.getByRole('button',{name:'Home',exact:true}).click();await page.getByRole('button',{name:'Account and settings',exact:true}).click();check(await page.getByRole('switch',{name:'Show Connection in navigation'}).isChecked(),'Draft lost on navigation');
 await page.getByRole('button',{name:'Save navigation',exact:true}).click();await nav.getByRole('button',{name:'Connection',exact:true}).waitFor();
 check(!(await page.getByLabel('Enable connection diary',{exact:true}).isChecked()),'Visibility enabled diary');
 await page.screenshot({path:'output/navigation-app-desktop.png',fullPage:true});
 await page.reload();await page.getByRole('button',{name:'Continue on this device only'}).click();check(await nav.getByRole('button').count()===5,'Persistence on reload');
 await nav.getByRole('button',{name:'Connection',exact:true}).click();check(await nav.getByRole('button',{name:'Connection',exact:true}).getAttribute('aria-current')==='page','Connection active state');await page.getByRole('navigation',{name:'Breadcrumb'}).getByRole('button',{name:'Home'}).click();
 await page.getByRole('button',{name:'Account and settings',exact:true}).click();
 for(const width of [390,320]){await page.setViewportSize({width,height:844});const mobile=page.getByRole('navigation',{name:'Mobile navigation'});check(await mobile.getByRole('button').count()===5,'Mobile choices mismatch');check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow at '+width);for(const button of await mobile.getByRole('button').all()){const b=await button.boundingBox();check(b.width>=44&&b.height>=44,'Small target');}await page.screenshot({path:`output/navigation-app-${width}.png`,fullPage:true});}
 await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>{window.qaOriginalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('QA quota failure');};});
 for(const label of ['Money','Movement','Insights','Connection'])await page.getByRole('switch',{name:`Show ${label} in navigation`}).uncheck();await page.getByRole('button',{name:'Save navigation',exact:true}).click();
 check(await nav.getByRole('button').count()===5,'Failed save changed tabs');check((await page.locator('.navigation-status').innerText()).includes('could not be saved'),'Failure feedback missing');
 await page.evaluate(()=>{Storage.prototype.setItem=window.qaOriginalSetItem;});await page.getByRole('button',{name:'Save navigation',exact:true}).click();
 await page.waitForFunction(()=>document.querySelectorAll('nav[aria-label="Main navigation"] button').length===1);
 await nav.getByRole('button',{name:'Home',exact:true}).click();await page.locator('.home-zone.money').click();check(await nav.getByRole('button').count()===1,'Hidden tab reinserted');check(await nav.locator('[aria-current=page]').count()===0,'Home incorrectly active on hidden section');
 await page.getByRole('button',{name:'Account and settings',exact:true}).click();await page.getByRole('button',{name:'Restore defaults',exact:true}).click();check(await nav.getByRole('button').count()===1,'Defaults saved prematurely');await page.getByRole('button',{name:'Save navigation',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('nav[aria-label="Main navigation"] button').length===4);
 check(errors.length===0,errors.join('\n'));return {passed:['old defaults','draft survives screen changes','local save/reload','Connection independent and active','breadcrumb','five mobile tabs at 320/390','44px targets','failed save retains active tabs','retry succeeds','Home-only access','hidden destination not highlighted','restore defaults'],errors};
}
