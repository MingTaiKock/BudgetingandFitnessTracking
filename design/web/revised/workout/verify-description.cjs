async (page) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5199/design/web/revised/workout/index.html#home');
 await page.reload();
 await page.getByRole('button',{name:'Reset preview',exact:true}).click();
 await page.getByText('What do Upper A, Lower A, Upper B and Lower B mean?',{exact:true}).click();
 await page.getByText('A and B are two sessions in the same programme, not difficulty levels. After three visits, continue with the fourth session on your next visit.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Review workout',exact:true}).click();
 await page.getByText('Understand your plan · sets, reps and progression',{exact:true}).click();
 await page.getByRole('heading',{name:'What “3 sets of 8–12 reps” means',exact:true}).waitFor();
 await page.getByText('Why this exercise & how to log it',{exact:true}).first().click();
 await page.getByText('A supported pushing exercise for the chest, with shoulders and triceps assisting.',{exact:true}).waitFor();
 for(const [suffix,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  await page.setViewportSize({width,height});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+suffix);
  await page.screenshot({path:'design/web/revised/workout/02-descriptive-plan-'+suffix+'.png',fullPage:true});
 }
 await page.getByRole('button',{name:'Home',exact:true}).click();
 await page.getByText('Why this exercise & how to log it',{exact:true}).first().click();
 await page.getByText('It has its own history: a machine press load is not a dumbbell starting weight.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Start workout',exact:true}).click();
 await page.getByRole('heading',{name:'Dumbbell bench press',exact:true}).waitFor();
 if(await page.getByText('Understand your plan · sets, reps and progression',{exact:true}).count())throw Error('Plan guide leaked into logging');
 await page.getByRole('button',{name:'Reset preview',exact:true}).click();
 await page.setViewportSize({width:1440,height:1000});
 await page.getByRole('button',{name:'Review workout',exact:true}).click();
 if(errors.length)throw Error(errors.join('; '));
 return {result:'PASS',checks:['All-session explanation','Sets/reps guide','Exercise purpose and logging explanation','Home-specific explanation','Desktop/mobile no overflow','Logging screen stays lightweight'],pageErrors:errors};
}
