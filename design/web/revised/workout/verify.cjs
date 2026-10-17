async (page) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const out='design/web/revised/workout/';
  const checks=[];
  const expect=async(test,message)=>{if(!await test())throw Error(message);checks.push(message)};
  const shot=async(name)=>{for(const [suffix,width,height] of [['desktop',1440,1000],['mobile',390,844]]){await page.setViewportSize({width,height});await page.screenshot({path:out+name+'-'+suffix+'.png',fullPage:true});await expect(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' '+suffix+' fits viewport')}await page.setViewportSize({width:1440,height:1000})};
  await page.reload();await page.getByRole('button',{name:'Reset preview',exact:true}).click();
  await page.getByRole('heading',{name:'A little stronger, together'}).waitFor();
  await page.getByText('Missed a day?',{exact:true}).click();
  await expect(()=>page.getByText(/No catching up or doubling up/).isVisible(),'Missed-day guidance preserves Upper A');
  await shot('01-next-workout');
  await page.getByRole('button',{name:'Review workout',exact:true}).click();
  await page.getByRole('button',{name:'Start workout',exact:true}).waitFor();
  await shot('02-workout-preview');
  await page.getByRole('button',{name:'Home',exact:true}).click();
  await expect(()=>page.getByText('Dumbbell bench press',{exact:true}).isVisible(),'Home preview uses dumbbells and bench');
  await shot('02b-home-preview');
  await page.getByRole('button',{name:'Gym',exact:true}).click();
  await page.getByRole('button',{name:'Start workout',exact:true}).click();
  await page.getByRole('button',{name:'Use suggestion',exact:true}).click();
  await expect(async()=>await page.getByLabel('Set 1 reps',{exact:true}).inputValue()==='','Accepting target does not prefill actual reps');
  await page.getByRole('button',{name:'Log set',exact:true}).first().click();
  await expect(()=>page.getByText('Enter a weight from 0–500 kg and 1–100 whole reps.').isVisible(),'Missing actual values show validation');
  await page.getByLabel('Set 1 weight',{exact:true}).fill('10');await page.getByLabel('Set 1 reps',{exact:true}).fill('10');
  await page.getByRole('button',{name:'Log set',exact:true}).first().click();
  await page.getByRole('button',{name:'Could do more',exact:true}).click();
  await shot('03-active-workout');
  await page.getByRole('button',{name:'Pause & leave',exact:true}).click();
  await page.reload();await page.getByRole('button',{name:'Continue workout',exact:true}).click();
  await expect(async()=>await page.getByLabel('Set 1 reps',{exact:true}).inputValue()==='10','Logged set survives pause and reload');
  await page.getByRole('button',{name:'Discomfort',exact:true}).click();
  await expect(()=>page.getByText('Stop this exercise if it hurts. Progression suggestions are paused.').isVisible(),'Discomfort suppresses progression');
  await page.getByRole('button',{name:'Challenging',exact:true}).click();
  for(let e=0;e<6;e++){
    await page.getByRole('button',{name:new RegExp('^Exercise '+(e+1)+':')}).click();
    for(let s=1;s<=3;s++){
      const input=page.getByLabel('Set '+s+' weight',{exact:true});if(await input.isDisabled())continue;
      await input.fill('10');await page.getByLabel('Set '+s+' reps',{exact:true}).fill('10');
      await page.getByRole('button',{name:'Log set',exact:true}).first().click();
    }
  }
  await expect(()=>page.getByRole('heading',{name:'Dumbbell curl',exact:true}).isVisible(),'Sixth exercise reachable and loggable');
  await page.getByRole('button',{name:'Review & finish',exact:true}).click();
  await page.getByRole('button',{name:'Finish & review',exact:true}).click();
  await page.getByText('Workout complete',{exact:true}).waitFor();await shot('04-workout-complete');
  await page.getByRole('button',{name:'View exercise progress',exact:true}).click();
  await page.getByRole('heading',{name:'See your small wins add up'}).waitFor();
  await expect(()=>page.getByText('Logged in this preview · 3 working sets',{exact:true}).isVisible(),'Completed sets enter comparable history');
  await shot('05-exercise-progress');
  await page.getByLabel('Exercise & equipment').selectOption('Dumbbell bench press');
  await expect(()=>page.getByRole('heading',{name:'A fresh starting point'}).isVisible(),'Machine history does not leak into dumbbell variation');
  await page.getByRole('navigation',{name:'Prototype screens'}).getByRole('button',{name:'Completion',exact:true}).click();
  await page.getByRole('button',{name:'Next: Lower A',exact:true}).click();
  await page.reload();await expect(()=>page.getByRole('heading',{name:'Lower A',exact:true}).isVisible(),'Sequence advances once to Lower A');
  await page.getByRole('navigation',{name:'Prototype screens'}).getByRole('button',{name:'Completion',exact:true}).click();
  await page.getByRole('button',{name:'Back to Movement',exact:true}).click();
  await expect(()=>page.getByRole('heading',{name:'Lower A',exact:true}).isVisible(),'Revisiting completion does not advance twice');
  await page.getByRole('button',{name:'Review workout',exact:true}).click();await page.getByRole('button',{name:'Home',exact:true}).click();await page.getByRole('button',{name:'Start workout',exact:true}).click();
  await page.getByLabel('Set 1 weight',{exact:true}).fill('8');await page.getByLabel('Set 1 reps',{exact:true}).fill('10');await page.getByRole('button',{name:'Log set',exact:true}).first().click();
  await page.getByRole('button',{name:'Finish session',exact:true}).click();await page.getByRole('button',{name:'Finish & review',exact:true}).click();
  await expect(()=>page.getByText('Partial workout recorded',{exact:true}).isVisible(),'Partial workout honestly labelled');
  await page.getByRole('button',{name:'Repeat this session next',exact:true}).click();
  await expect(()=>page.getByRole('heading',{name:'Lower A',exact:true}).isVisible(),'Partial-session repeat preserves sequence');
  await page.getByRole('button',{name:'Reset preview',exact:true}).click();
  if(errors.length)throw Error(errors.join('; '));
  return {checks,scriptErrors:errors};
}
