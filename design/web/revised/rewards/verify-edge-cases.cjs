async(page)=>{
 const check=(ok,message)=>{if(!ok)throw Error(message)};
 await page.goto('http://127.0.0.1:5202/');await page.setViewportSize({width:320,height:740});
 await page.getByRole('button',{name:'Explore demo',exact:false}).click();
 const nav=name=>page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name,exact:true});
 await nav('Money').click();await page.getByRole('button',{name:'Money entry',exact:true}).click();
 await page.locator('input[name=amount]').fill('-5');await page.getByRole('button',{name:'Save entry',exact:true}).click();
 check(await page.getByRole('dialog').isVisible(),'Invalid entry closed the editor');check(await page.locator('.toast-with-sticker').count()===0,'Invalid entry rewarded');
 await page.locator('input[name=amount]').fill('1');await page.getByRole('button',{name:'Save entry',exact:true}).click();
 await page.locator('.toast-with-sticker').waitFor();const box=await page.locator('.toast').boundingBox();check(box.x>=0&&box.x+box.width<=320,'320px overflow');
 await page.getByRole('button',{name:'Dismiss notification'}).focus();await page.keyboard.press('Enter');check(await page.locator('.toast').count()===0,'Keyboard dismissal failed');
 await nav('Movement').click();await page.getByRole('button',{name:'Start this routine',exact:true}).first().click();
 await page.getByRole('button',{name:'Complete set 1',exact:true}).click();
 await page.getByRole('spinbutton',{name:'Session duration',exact:true}).fill('10');await page.getByRole('button',{name:'Finish partial workout',exact:true}).click();
 await page.locator('.recap-pals img[src="/companions/workout.webp"]').waitFor();check((await page.locator('.recap-totals').innerText()).includes('Sets recorded\n1'),'Partial recap should contain exactly one set');
 await page.screenshot({path:'output/reward-partial-320.png'});await page.getByRole('button',{name:'Done for now'}).click();
 return {passed:['invalid entry stays open without reward','320px notice fits','keyboard dismissal','one-set partial workout celebrates with accurate recap']};
}
