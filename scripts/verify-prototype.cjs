async (page) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.reload();
  const explore=page.getByRole('button',{name:'Explore the demo instead'});
  if(await explore.isVisible())await explore.click();
  await page.setViewportSize({width:1536,height:1024});
  const nav=page.getByRole('navigation',{name:'Main navigation'});
  const checks=[];
  for(const [name,title] of [['Dashboard','Your wellness, together'],['Habitat','Your Wellness Habitat'],['Journey','Your Identity Journey'],['Future self','Your Future Self'],['Streak power','Your Wellness Streak Power'],['Plan together','Adjust Your Plan Together'],['Weekly review','Your Weekly Wellness Summary'],['My budget','Your money, with a plan'],['My fitness','Your movement, at your pace'],['Connection','Make room for connection'],['Settings','Your private corner']]){
    await nav.getByRole('button',{name,exact:true}).click();
    await page.getByRole('heading',{name:title,exact:true}).waitFor();
    if(name==='Habitat'){
      await page.getByRole('button',{name:'Zoom in',exact:true}).click();
      const scale=await page.locator('.habitat-image').evaluate(el=>el.style.transform);
      if(scale!=='scale(1.15)')throw Error('Habitat zoom did not change');
      await page.getByRole('button',{name:'Reset habitat zoom'}).click();
    }
    await page.evaluate(()=>window.scrollTo(0,0));
    if(['Dashboard','Habitat','Journey','Future self','Plan together','Weekly review'].includes(name))await page.screenshot({path:`output/playwright/rework-${name.replaceAll(' ','-').toLowerCase()}.png`,fullPage:true});
    checks.push(name);
  }
  await nav.getByRole('button',{name:'Dashboard',exact:true}).click();
  const waterBefore=await page.locator('.quick-log-grid article').first().innerText();
  await page.getByRole('button',{name:'Add a glass of water'}).click();
  const waterAfter=await page.locator('.quick-log-grid article').first().innerText();
  if(waterBefore===waterAfter)throw Error('Water entry did not update');
  await page.reload();
  if(await page.locator('.quick-log-grid article').first().innerText()!==waterAfter)throw Error('Water entry did not persist');
  await page.getByRole('button',{name:'Try a 90-second check-in'}).click();
  if(!await page.getByRole('dialog').isVisible())throw Error('Reset dialog missing');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Add entry',exact:true}).click();
  if(!await page.getByRole('button',{name:'Money entry'}).isVisible())throw Error('Entry picker missing');
  await page.keyboard.press('Escape');
  for(const width of [390,768,1280]){
    await page.setViewportSize({width,height:width===390?844:1024});
    for(const name of ['Dashboard','Habitat','Journey','Future self','Plan together','Weekly review','My fitness','Settings']){
      await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true}).click();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
      if(overflow)throw Error(`${name} overflows at ${width}px`);
      await page.evaluate(()=>window.scrollTo(0,0));
      if(width===390&&['Dashboard','Habitat','Plan together','Future self'].includes(name))await page.screenshot({path:`output/playwright/rework-mobile-${name.replaceAll(' ','-').toLowerCase()}.png`,fullPage:true});
    }
  }
  await page.setViewportSize({width:1536,height:1024});
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Dashboard',exact:true}).click();
  if(errors.length)throw Error(errors.join('\n'));
  console.log(JSON.stringify({screens:checks,viewportWidths:[390,768,1280,1536],waterPersists:true,dialogs:true,habitatZoom:true,pageErrors:errors.length}));
}
