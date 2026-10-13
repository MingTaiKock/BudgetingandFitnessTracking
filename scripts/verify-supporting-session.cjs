async page => {
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'My fitness',exact:true}).click();
 await page.getByRole('button',{name:'Start this routine',exact:true}).first().click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();
 if(await dialog.locator('.session-pals .supporting-art').count()!==2)throw Error('Session pair missing');
 if(await dialog.locator('.session-pals .hamster-art').count())throw Error('Old session art remains');
 await dialog.getByRole('button',{name:'Complete set 1',exact:true}).click();
 await dialog.getByLabel('Session duration',{exact:true}).fill('5');
 await dialog.getByRole('button',{name:'Finish partial workout',exact:true}).click();
 await page.locator('.recap-pals .supporting-art').first().waitFor();
 if(await page.locator('.recap-pals .supporting-art').count()!==2)throw Error('Recap pair missing');
 return {sessionArt:true,completedSet:true,partialWorkout:true,recapArt:true};
}
