async (page) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const note='Supporting design check '+Date.now();
  await page.reload();
  const navigate=async name=>page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name,exact:true}).click();
  const frames=[];
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:1000});
    for(const name of ['My budget','My fitness','Settings']){
      await navigate(name);await page.evaluate(()=>window.scrollTo(0,0));
      await page.locator('.supporting-art image').first().waitFor();
      await page.waitForTimeout(350);
      for(const art of await page.locator('.supporting-art').all())await art.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);await page.evaluate(()=>window.scrollTo(0,0));
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      if(overflow)throw Error(`${name} overflow at ${width}`);
      if(name==='My fitness'){
        const constraints=await page.evaluate(()=>{
          const title=document.querySelector('.routine-card-header>div:nth-child(2)').getBoundingClientRect();
          const art=document.querySelector('.routine-pals').getBoundingClientRect();
          return {separate:title.left>=art.right,dayWidth:document.querySelector('.schedule-days strong').getBoundingClientRect().width};
        });
        if(!constraints.separate||constraints.dayWidth<45)throw Error('Routine art overlaps text or schedule labels are squeezed');
      }
      if(await page.locator('.budget-view .hamster-art,.fitness-view .hamster-art,.supporting-settings .hamster-art').count())throw Error('Old pose-sheet art remains in scoped screens');
      const path=`output/playwright/supporting-${name.toLowerCase().replaceAll(' ','-')}-${width}.png`;
      await page.screenshot({path,fullPage:true});frames.push({name,width,path});
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await navigate('My budget');
  await page.getByRole('button',{name:'Money entry',exact:true}).first().click();
  await page.getByLabel('Amount (SGD)',{exact:true}).fill('2.35');
  await page.getByLabel('A note (optional)').fill(note);
  await page.getByRole('button',{name:'Save entry',exact:true}).click();
  await page.getByText(note,{exact:true}).waitFor();
  await page.getByRole('button',{name:'Edit '+note,exact:true}).click();
  await page.getByLabel('Amount (SGD)',{exact:true}).fill('3.45');
  await page.getByRole('button',{name:'Save entry',exact:true}).click();
  await page.reload();
  await navigate('My budget');
  await page.getByText(note,{exact:true}).waitFor();
  await page.getByRole('button',{name:'Delete '+note,exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
  if(await page.getByText(note,{exact:true}).count())throw Error('Money delete failed');
  await page.getByRole('button',{name:'New goal',exact:true}).click();
  await page.getByLabel('Goal name',{exact:true}).fill('Design check goal');
  await page.getByLabel('Target (SGD)',{exact:true}).fill('50.00');
  await page.getByRole('button',{name:'Create goal',exact:true}).click();
  const goal=page.locator('.goal-card').filter({hasText:'Design check goal'});
  await goal.getByRole('button',{name:'Record savings'}).click();
  await page.getByLabel('Amount (SGD)',{exact:true}).fill('5.00');
  await page.getByRole('button',{name:'Save contribution'}).click();
  if(!await goal.getByText('Savings history (1)').isVisible())throw Error('Savings not recorded');
  await goal.getByRole('button',{name:'Delete goal Design check goal',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Confirm',exact:true}).click();
  await navigate('My fitness');
  await page.getByRole('button',{name:'Start this routine',exact:true}).first().click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Close & keep workout',exact:true}).click();
  await page.reload();await navigate('My fitness');
  await page.getByRole('button',{name:'Resume workout',exact:true}).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Discard this workout',exact:true}).click();
  await page.getByRole('button',{name:'Discard workout',exact:true}).click();
  await navigate('Settings');
  const target=page.getByLabel('Weekly workout target',{exact:true});
  const original=await target.inputValue();await target.fill('4');
  await page.getByRole('button',{name:'Save my preferences'}).click();
  await page.reload();
  await navigate('Settings');
  if(await target.inputValue()!=='4')throw Error('Settings did not persist');
  await target.fill(original);await page.getByRole('button',{name:'Save my preferences'}).click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download backup',exact:true}).click();
  const download=await downloadPromise;await download.saveAs('output/playwright/supporting-check-backup.json');
  await page.getByLabel('Restore a backup',{exact:true}).setInputFiles('output/playwright/supporting-check-backup.json');
  await page.getByRole('heading',{name:'Restore this journey?',exact:true}).waitFor();
  await page.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
  if(errors.length)throw Error(errors.join('\n'));
  return {frames,moneyCrud:true,savings:true,startAndResume:true,preferencesPersist:true,backupDownloadAndPreview:true,pageErrors:errors.length};
}
