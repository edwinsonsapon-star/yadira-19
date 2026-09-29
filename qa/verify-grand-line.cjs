const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = process.env.YADIRA_QA_URL || 'http://127.0.0.1:5173';
const cases = [[390,844,false,true], [360,640], [430,932], [768,1024], [1440,900], [390,844,true]];
const results = [];

async function prepare(browser, width, height, reduced = false, full = false, fixture = false) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
  // Preserve the YADIRA-003 empty-container contract; Treasure has its own integration QA.
  await page.route('**/src/scripts/treasure.js', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.addInitScript(() => {
    window.grandQAEvents = [];
    document.addEventListener('yadira:grand-line-complete', event => window.grandQAEvents.push({
      detail: event.detail, empty: document.querySelector('#treasure').innerHTML === '', focus: document.activeElement.id
    }));
  });
  if (fixture) {
    // Virtual SVG fixtures are served only in the test browser; fotos/ is never touched.
    await page.route('**/qa/fixtures/*.svg', route => {
      const name = route.request().url().split('/').pop();
      const [w,h] = name === 'portrait.svg' ? [480,720] : name === 'landscape.svg' ? [900,600] : [640,640];
      const body = name === 'invalid.svg' ? 'not an image' : `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#172b3e"/><circle cx="${w/2}" cy="${h/2}" r="${w/4}" fill="#776291"/><path d="M0 ${h*.8}L${w} ${h*.5}V${h}H0Z" fill="#bda477"/></svg>`;
      return route.fulfill({ status: 200, contentType: 'image/svg+xml', body });
    });
  }
  await page.goto(base, { waitUntil: 'networkidle' });
  if (full) {
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.opening-action')).opacity === '1');
    await page.locator('.gift-button').click();
    for (let i = 1; i <= 6; i++) {
      await page.waitForFunction(i => { const scene = document.querySelector('.journey-stage'); return scene?.dataset.line === String(i) && scene.dataset.reading === 'true'; }, i);
      await page.locator('.journey-continue').click();
    }
    await page.waitForFunction(() => document.querySelector('.journey-stage').dataset.phase === 'ready');
    await page.locator('.journey-button').click();
  } else {
    // Other sizes exercise this chapter from its documented event boundary.
    await page.evaluate(fixture => {
      document.querySelector('#opening').hidden = true;
      document.querySelector('.atmosphere').hidden = true;
      const experience = document.querySelector('#experience');
      experience.hidden = false;
      experience.innerHTML = '<div id="grand-line" tabindex="-1"></div>';
      if (fixture) {
        window.YADIRA_CONTENT.timeline[0].date = 'Fecha de prueba';
        window.YADIRA_CONTENT.timeline[0].image = 'qa/fixtures/portrait.svg';
        window.YADIRA_CONTENT.gallery = ['portrait','landscape','square','invalid'].map(name => ({ src: `qa/fixtures/${name}.svg`, caption: `Fixture QA: ${name}`, story: 'Historia de prueba interna.', alt: `Composición ${name}` }));
      }
      document.dispatchEvent(new CustomEvent('yadira:journey-start', { detail: { package: 'YADIRA-002' } }));
    }, fixture);
  }
  await page.waitForFunction(() => document.querySelector('.grand-story')?.dataset.phase === 'ready');
  return { page, errors };
}
async function noOverflow(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}
async function revealAt(page, selector) {
  await page.locator(selector).evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  // Let the short CSS opacity transition finish before capturing a review image.
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.target?.closest?.('.grand-story') && animation.playState === 'running').map(animation => animation.finished.catch(() => {})));
  });
}
async function capture(page, name) { await page.screenshot({ path: path.join(__dirname, `${name}.png`) }); }
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const [width,height,reduced = false,full = false] of cases) {
      const { page, errors } = await prepare(browser,width,height,reduced,full);
      const shots = (width === 390 && !reduced) || width === 1440;
      const suffix = `${width}x${height}`;
      assert.equal(await page.locator('.grand-story').count(), 1);
      assert.equal(await page.locator('.grand-moment-button').count(), 6);
      await noOverflow(page);
      if (shots) await capture(page, `grand-line-start-${suffix}`);
      await revealAt(page, '.grand-map');
      if (shots) await capture(page, `grand-line-map-${suffix}`);
      const first = page.locator('.grand-moment-button').nth(0);
      await first.click();
      assert.equal(await page.locator('.grand-dialog').evaluate(d => d.open), true);
      assert.equal(await page.locator('.grand-dialog img').count(), 0);
      assert.equal(await page.locator('.grand-dialog-date').count(), 0);
      await page.keyboard.press('Escape');
      assert.equal(await first.evaluate(el => document.activeElement === el), true);
      await page.locator('.grand-moment-button').nth(3).click();
      assert.match(await page.locator('.grand-dialog-text').innerText(), /Solo necesitó que usted estuviera conmigo/);
      if (shots) await capture(page, `grand-line-memory-${suffix}`);
      await page.locator('.grand-close').click();
      await first.click();
      await page.mouse.click(3,3);
      assert.equal(await page.locator('.grand-dialog').evaluate(d => d.open), false);
      await revealAt(page, '#la-yadira');
      if (shots) await capture(page, `grand-line-yadira-${suffix}`);
      assert.equal(await page.locator('.grand-phrase').count(), 8);
      assert.equal(await page.locator('.grand-closing p').last().innerText(), 'Sobre todo, espero hacerla muy feliz.');
      await revealAt(page, '#mar-de-recuerdos');
      if (shots) await capture(page, `grand-line-gallery-${suffix}`);
      assert.equal(await page.locator('.grand-album img').count(), 0);
      assert.equal(await page.locator('.grand-empty-sea').isVisible(), true);
      await noOverflow(page);
      assert.equal(await page.locator('#treasure').innerHTML(), '');
      await page.evaluate(() => document.dispatchEvent(new CustomEvent('yadira:journey-start')));
      assert.equal(await page.locator('.grand-story').count(), 1);
      await page.locator('.grand-next').click({ clickCount: 2, delay: 25 });
      await page.locator('.grand-next').dispatchEvent('click');
      await page.waitForFunction(() => window.grandQAEvents.length === 1);
      assert.deepEqual(await page.evaluate(() => window.grandQAEvents), [{ detail: { package: 'YADIRA-003' }, empty: true, focus: 'treasure' }]);
      assert.equal(await page.locator('#treasure').isVisible(), true);
      assert.equal(await page.locator('.grand-story').isVisible(), false);
      await noOverflow(page);
      assert.deepEqual(errors, []);
      results.push({ viewport: suffix, reducedMotion: reduced, fullJourneyIntegration: full, status: 'PASS', timeline: 6, noPhotos: true, modalCloseMethods: ['button','Escape','outside'], focusRestored: true, noHorizontalOverflow: true, completionEvents: 1, treasureEmpty: true, errors });
      console.log(`PASS grand-line-${suffix}${reduced ? '-reduced-motion' : ''}`);
      await page.close();
    }
    const { page, errors } = await prepare(browser,390,844,false,false,true);
    await page.locator('.grand-moment-button').first().click();
    await page.waitForFunction(() => document.querySelector('.grand-dialog-photo')?.naturalWidth === 480);
    assert.equal(await page.locator('.grand-dialog-date').innerText(), 'Fecha de prueba');
    await page.keyboard.press('Escape');
    await revealAt(page, '#mar-de-recuerdos');
    await page.waitForFunction(() => document.querySelectorAll('.grand-photo[data-loaded]').length === 3 && document.querySelectorAll('.grand-photo').length === 3);
    for (let i=0;i<3;i++) {
      const photo = page.locator('.grand-photo button').nth(i);
      await photo.click();
      await page.waitForFunction(() => { const img = document.querySelector('.grand-dialog-photo'); return img?.complete && img.naturalWidth > 0; });
      assert.equal(await page.locator('.grand-dialog').getAttribute('data-mode'), 'viewer');
      assert.match(await page.locator('.grand-dialog-text').innerText(), /Historia de prueba interna/);
      assert.equal(await page.locator('.grand-dialog-photo').evaluate(img => getComputedStyle(img).objectFit), 'contain');
      if (i===0) await capture(page, 'grand-line-viewer-fixture-390x844');
      if (i===0) await page.locator('.grand-close').click();
      else if (i===1) await page.keyboard.press('Escape');
      else await page.mouse.click(2,2);
      assert.equal(await page.locator('.grand-dialog').evaluate(d=>d.open), false);
    }
    await noOverflow(page);
    assert.equal(await page.locator('.grand-empty-sea').isVisible(), false);
    assert.equal(await page.locator('.grand-photo img').evaluateAll(images => images.every(img=>img.naturalWidth>0 && img.loading==='lazy')), true);
    await capture(page, 'grand-line-gallery-fixture-390x844');
    assert.deepEqual(errors, []);
    results.push({ fixture: true, status: 'PASS', portraitLandscapeSquare: true, failedImageRemoved: true, nativeLazyLoading: true, viewerCloseMethods: ['button','Escape','outside'], errors });
    console.log('PASS grand-line-photo-fixtures');
    await page.close();
    await fs.writeFile(path.join(__dirname,'grand-line-results.json'), JSON.stringify({ package:'YADIRA-003', checkedAt:new Date().toISOString(), browser:await browser.version(), results },null,2)+'\n');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
