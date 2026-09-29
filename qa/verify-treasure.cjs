const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const {createHash}=require('node:crypto');
const base = process.env.YADIRA_QA_URL || 'http://127.0.0.1:5173';
const cases = [[390,844,false,true],[360,640],[430,932],[768,1024],[1440,900],[390,844,true]];
const results=[];
const out = name => path.join(__dirname,`treasure-${name}.png`);
async function phase(page,name) { await page.waitForFunction(name=>document.querySelector('.treasure-story')?.dataset.phase===name,name); }
async function shot(page,selector,name) {
  await page.locator(selector).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.screenshot({path:out(name)});
}
async function bounds(page) { assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false); }
async function load(browser,w,h,reduced=false,integration=false,fixture=false) {
  const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:reduced?'reduce':'no-preference'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.addInitScript(()=>{window.treasureEntries=[];document.addEventListener('yadira:grand-line-complete',e=>window.treasureEntries.push({detail:e.detail,empty:document.querySelector('#treasure').innerHTML===''}));});
  if(fixture) await page.route('**/qa/fixtures/treasure.svg',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720"><rect width="480" height="720" fill="#273951"/><circle cx="240" cy="270" r="140" fill="#9480a8"/><path d="M0 600L480 380V720H0Z" fill="#c9b07e"/></svg>'}));
  await page.goto(base,{waitUntil:'networkidle'});
  const narrative=await page.evaluate(()=>JSON.stringify(window.YADIRA_CONTENT));
  assert.doesNotMatch(narrative,/muchas personas|conocer partes|otros conocen|versión favorita|relaciones pasadas/i);
  assert.match(narrative,/Hoy celebramos sus 19/);
  assert.match(narrative,/Sobre todo, espero hacerla muy feliz/);
  await page.evaluate(({integration,fixture})=>{
    document.querySelector('#opening').hidden=true;
    document.querySelector('.atmosphere').hidden=true;
    const experience=document.querySelector('#experience');experience.hidden=false;
    if(fixture){
      const t=window.YADIRA_CONTENT.treasure;
      t.wanted.image='qa/fixtures/treasure.svg';t.ending.image='qa/fixtures/treasure.svg';
      t.letter.body=Array.from({length:20},(_,i)=>`Párrafo de prueba ${i+1}. Este contenido comprueba la lectura y el scroll natural de una carta larga sin modificar el texto personal.`);
    }
    if(integration){experience.innerHTML='<div id="grand-line"></div>';document.dispatchEvent(new CustomEvent('yadira:journey-start',{detail:{package:'YADIRA-002'}}));}
    else{experience.innerHTML='<div id="treasure"></div>';document.dispatchEvent(new CustomEvent('yadira:grand-line-complete',{detail:{package:'YADIRA-003'}}));}
  },{integration,fixture});
  if(integration){await page.waitForFunction(()=>document.querySelector('.grand-story')?.dataset.phase==='ready');await page.locator('.grand-next').click();}
  await phase(page,'zoro');
  assert.deepEqual(await page.evaluate(()=>window.treasureEntries),[{detail:{package:'YADIRA-003'},empty:true}]);
  return {page,errors};
}
async function run(browser,w,h,reduced=false,integration=false,fixture=false){
  const {page,errors}=await load(browser,w,h,reduced,integration,fixture);
  const mobile=w===390&&!reduced&&!fixture;
  const desktop=w===1440&&!fixture;
  const suffix=`${w}x${h}`;
  await bounds(page);
  await page.waitForFunction(()=>document.querySelector('.treasure-zoro-image')?.naturalWidth>0);
  assert.equal(await page.locator('.treasure-swords').isVisible(),false);
  if(mobile||desktop)await shot(page,'.treasure-zoro',`zoro-${suffix}`);
  await page.locator('.treasure-find').click({clickCount:2,delay:20});
  assert.equal(await page.locator('.treasure-find').isDisabled(),true);
  await page.locator('.treasure-find').dispatchEvent('click');
  await phase(page,'lost');
  assert.equal(await page.locator('.treasure-zoro-result h3').innerText(),'ERROR 404');
  assert.match(await page.locator('.treasure-zoro-result').innerText(),/Zoro volvió a perderse/);
  if(mobile)await shot(page,'.treasure-zoro-result',`404-${suffix}`);
  await phase(page,'wanted');
  await page.waitForFunction(()=>document.querySelector('.wanted-paper[data-template] .wanted-template')?.naturalWidth>0);
  if(fixture){await page.waitForFunction(()=>document.querySelector('.wanted-photo')?.naturalWidth===480);assert.equal(await page.locator('.wanted-photo').evaluate(el=>getComputedStyle(el).objectFit),'cover');}
  else{assert.equal(await page.locator('.wanted-photo').count(),0);assert.equal(await page.locator('.wanted-monogram').isVisible(),true);}
  assert.match(await page.locator('.wanted-paper').innerText(),/19,000,000/);
  if(mobile||desktop)await shot(page,'.treasure-wanted',`wanted-${suffix}`);
  if(fixture)await shot(page,'.treasure-wanted',`wanted-fixture-${suffix}`);
  await bounds(page);
  if(mobile)await shot(page,'.treasure-mail',`envelope-${suffix}`);
  await page.locator('.treasure-open-letter').click({clickCount:2,delay:20});
  await page.locator('.treasure-open-letter').dispatchEvent('click');
  await phase(page,'letter');
  assert.equal(await page.locator('.treasure-letter').count(),1);
  assert.equal(await page.locator('.treasure-open-letter').getAttribute('aria-expanded'),'true');
  assert.equal(await page.locator('.treasure-letter').evaluate(el=>document.activeElement===el),true);
  if(mobile||desktop)await shot(page,'.treasure-letter',`letter-${suffix}`);
  if(fixture){assert.equal(await page.locator('.treasure-letter > p').count(),20);assert(await page.locator('.treasure-letter').evaluate(el=>el.getBoundingClientRect().height>innerHeight));}
  await bounds(page);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.treasure-letter').isVisible(),false);
  assert.equal(await page.locator('.treasure-open-letter').evaluate(el=>document.activeElement===el),true);
  await page.locator('.treasure-open-letter').click();await phase(page,'letter');
  await page.locator('.treasure-close-letter').click();
  assert.equal(await page.locator('.treasure-letter').isVisible(),false);
  await page.locator('.treasure-open-letter').click();await phase(page,'letter');
  await page.locator('.treasure-letter-continue').click({clickCount:2,delay:20});
  await page.locator('.treasure-letter-continue').dispatchEvent('click');
  await phase(page,'birthday');
  assert.equal(await page.locator('.treasure-age').innerText(),'19');
  assert.equal(await page.locator('.cake-candle').count(),2);
  await bounds(page);
  assert((await page.locator('.treasure-cake').boundingBox()).width>=300);
  if(mobile||desktop)await shot(page,'.treasure-birthday',`birthday-${suffix}`);
  if(w===1440){await page.locator('.treasure-cake').focus();await page.keyboard.press('Enter');}
  else await page.locator('.treasure-cake').click({clickCount:2,delay:20});
  assert.equal(await page.locator('.treasure-cake').isDisabled(),true);
  await page.locator('.treasure-cake').dispatchEvent('click');
  await phase(page,'wish-saved');
  assert.equal(await page.locator('.treasure-wish').innerText(),'Deseo guardado. ✦');
  assert.equal(await page.locator('.cake-flame').evaluateAll(items=>items.every(el=>getComputedStyle(el).opacity==='0')),true);
  assert.equal(await page.locator('.treasure-fireworks[data-active] i').count(),36);
  const bursts=await page.locator('.treasure-firework i').evaluateAll(items=>items.map(el=>({animation:getComputedStyle(el).animationName,opacity:Number(getComputedStyle(el).opacity)})));
  assert(bursts.some(b=>b.opacity>0),'Fireworks must be visible');
  assert(bursts.every(b=>reduced?b.animation==='none':b.animation==='treasure-firework'));
  if(mobile||desktop||reduced)await shot(page,'.treasure-birthday',`candles-out-${suffix}${reduced?'-reduced':''}`);
  await phase(page,'complete');
  if(fixture)await page.waitForFunction(()=>document.querySelector('.treasure-ending-photo')?.naturalWidth===480);
  else assert.equal(await page.locator('.treasure-ending-photo').count(),0);
  assert.equal(await page.locator('.treasure-continued').innerText(),'TO BE CONTINUED →');
  assert.equal(await page.locator('.treasure-ending .treasure-route[data-complete]').count(),1);
  assert.equal(await page.locator('.treasure-ending').evaluate(el=>document.activeElement===el),true);
  if(mobile||desktop)await shot(page,'.treasure-ending',`ending-${suffix}`);
  if(fixture)await shot(page,'.treasure-ending',`ending-fixture-${suffix}`);
  if(mobile)await shot(page,'.treasure-continued',`continued-${suffix}`);
  await bounds(page);
  await page.evaluate(()=>document.dispatchEvent(new CustomEvent('yadira:grand-line-complete')));
  assert.equal(await page.locator('.treasure-story').count(),1);
  assert.equal(await page.locator('img').evaluateAll(items=>items.every(el=>el.complete&&el.naturalWidth>0)),true);
  await page.locator('.treasure-restart').click();
  await page.waitForFunction(()=>!!document.querySelector('.gift-button')&&!document.querySelector('.treasure-story'));
  assert.equal(await page.locator('#opening').isVisible(),true);
  assert.equal(await page.locator('.gift-button').isEnabled(),true);
  assert.deepEqual(errors,[]);
  results.push({viewport:suffix,reducedMotion:reduced,integrationFromGrandLine:integration,fixture,status:'PASS',zoro:true,zoroAssetLoaded:true,wanted:true,wantedTemplateLoaded:true,fireworks:true,letterCloseMethods:['button','Escape'],longLetter:fixture,birthday:true,wishOnce:true,flamesOut:true,ending:true,restart:true,noHorizontalOverflow:true,errors});
  console.log(`PASS treasure-${suffix}${reduced?'-reduced-motion':''}${fixture?'-fixtures':''}`);
  await page.close();
}
(async()=>{
  for(const [file,hash] of Object.entries({
    'onepiece/Logo one piece.png':'206e75f1cd4f177f730dbb13fb7ddf166e40298d579a1f9e8ffe18140364e368',
    'onepiece/cartel.jpg':'3d2571723590956634575711822ac3b124323b4901ff74063c6ca8c779df42bd',
    'onepiece/logo zoro.jpg':'9ad8b53fc31ab333afc9adc298a5c22883d67617c0401282d1fe9a3e544a427b'
  })) assert.equal(createHash('sha256').update(await fs.readFile(path.join(__dirname,'..',file))).digest('hex'),hash,`Asset changed: ${file}`);
  const browser=await chromium.launch({channel:'msedge',headless:true});try{
  for(let i=0;i<cases.length;i+=2) await Promise.all(cases.slice(i,i+2).map(test=>run(browser,...test)));
  await run(browser,390,844,false,false,true);
  await fs.writeFile(path.join(__dirname,'treasure-results.json'),JSON.stringify({package:'YADIRA-005',checkedAt:new Date().toISOString(),browser:await browser.version(),results},null,2)+'\n');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
