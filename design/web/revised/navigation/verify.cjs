async(page)=>{
 const check=(ok,message)=>{if(!ok)throw Error(message)};const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5202/design/web/revised/navigation/');await page.setViewportSize({width:1440,height:1000});
 const desktop=page.getByRole('navigation',{name:'Main navigation',exact:true});const mobile=page.getByRole('navigation',{name:'Mobile navigation',exact:true});
 check(await desktop.getByRole('button').count()===4,'Default tabs');
 await page.getByRole('switch',{name:'Show Connection in navigation'}).check();
 check(await desktop.getByRole('button').count()===4,'Draft changed actual navigation');check(await page.locator('.preview-item').count()===5,'Preview missing Connection');
 await page.getByRole('button',{name:'Save navigation',exact:true}).click();await page.getByText('Navigation saved in this preview.',{exact:true}).waitFor();
 check(await desktop.getByRole('button').count()===5,'Save did not apply');check(!(await page.getByRole('switch',{name:'Enable connection diary'}).isChecked()),'Shortcut enabled diary');
 await page.screenshot({path:'design/web/revised/navigation/desktop.png',fullPage:true});
 await page.getByText('Preview scenarios',{exact:true}).click();await page.locator('#outcome').selectOption('failure');
 await page.getByRole('switch',{name:'Show Money in navigation'}).uncheck();await page.getByRole('button',{name:'Save navigation',exact:true}).click();await page.getByRole('button',{name:'Retry save',exact:true}).waitFor();
 check(await desktop.getByRole('button',{name:'Money',exact:true}).count()===1,'Failed save changed tabs');await page.locator('#outcome').selectOption('success');await page.getByRole('button',{name:'Retry save',exact:true}).click();await page.getByText('Navigation saved in this preview.',{exact:true}).waitFor();
 check(await desktop.getByRole('button',{name:'Money',exact:true}).count()===0,'Retry did not apply');
 await page.locator('#scenario').selectOption('minimal');check(await desktop.getByRole('button').count()===1,'Home-only scenario');
 await desktop.getByRole('button',{name:'Home',exact:true}).click();await page.getByRole('button',{name:'Money',exact:true}).click();await page.getByRole('heading',{name:'Money is still here'}).waitFor();check(await desktop.getByRole('button').count()===1,'Hidden section inserted a tab');
 await page.getByRole('button',{name:'Back to navigation settings'}).click();await page.locator('#scenario').selectOption('all');
 await page.getByText('Preview scenarios',{exact:true}).click();
 for(const width of [390,320]){await page.setViewportSize({width,height:844});check(await mobile.getByRole('button').count()===5,'Mobile missing tabs');const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);check(fits,'Horizontal overflow '+width);for(const b of await mobile.getByRole('button').all()){const r=await b.boundingBox();check(r.width>=44&&r.height>=44,'Small mobile target');}await page.screenshot({path:`design/web/revised/navigation/mobile-${width}.png`,fullPage:true});}
 await mobile.getByRole('button',{name:'Connection',exact:true}).click();await page.getByRole('heading',{name:'Your moments stay yours'}).waitFor();await page.getByRole('button',{name:'Set up my private diary'}).click();
 await page.getByRole('switch',{name:'Show Connection in navigation'}).focus();await page.keyboard.press('Space');check(!(await page.getByRole('switch',{name:'Show Connection in navigation'}).isChecked()),'Keyboard switch');
 await page.getByRole('button',{name:'Restore defaults',exact:true}).click();check(await page.locator('.preview-item').count()===4,'Restore defaults draft');check(await mobile.getByRole('button').count()===5,'Restore applied before save');
 check(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),'Broken image');check(errors.length===0,errors.join('\n'));
 return {passed:['default tabs','draft preview','successful save','failed save and retry','Home-only','hidden destination access','diary independence','five mobile tabs at 320/390','44px targets','keyboard toggle','restore draft'],errors};
}
