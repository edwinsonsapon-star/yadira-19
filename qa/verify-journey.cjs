const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const output = __dirname;
const baseURL = process.env.YADIRA_QA_URL || 'http://127.0.0.1:5173';
const phrases = [
  'Hoy celebramos sus 19.',
  'Y no podría estar más feliz de vivir este día a su lado.',
  'Este regalo está hecho con mi tiempo y todo mi cariño.',
  'Para celebrar los momentos que compartimos.',
  'Y la ilusión de seguir creando recuerdos juntos.',
  'Bienvenida a nuestra Grand Line.',
];
const holds = [2500, 4200, 4200, 3500, 3700, 4300];
const cases = [
  { width: 360, height: 640 }, { width: 390, height: 844, automatic: true },
  { width: 430, height: 932 }, { width: 768, height: 1024 },
  { width: 1440, height: 900 }, { width: 390, height: 844, reduced: true, automatic: true },
];

async function checkLayout(page, selector) {
  const result = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    const rect = element.getBoundingClientRect();
    return { horizontal: document.documentElement.scrollWidth > innerWidth,
      vertical: document.documentElement.scrollHeight > innerHeight,
      fits: rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight };
  }, selector);
  assert.deepEqual(result, { horizontal: false, vertical: false, fits: true });
}

(async () => {
  const hash = createHash('sha256').update(await fs.readFile(path.resolve(output, '../onepiece/Logo one piece.png'))).digest('hex');
  assert.equal(hash, '206e75f1cd4f177f730dbb13fb7ddf166e40298d579a1f9e8ffe18140364e368');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const runCase = async ({ width, height, reduced = false, automatic = false }) => {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1,
        reducedMotion: reduced ? 'reduce' : 'no-preference' });
      // Isolate YADIRA-002's empty-container handoff; verify-grand-line.cjs covers integration.
      await page.route('**/src/scripts/grand-line.js', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.addInitScript(() => {
        window.qaEvents = { opening: [], journey: [] };
        document.addEventListener('yadira:opening-complete', (event) => {
          window.qaEvents.opening.push({ detail: event.detail, empty: document.querySelector('#experience').innerHTML === '' });
        });
        document.addEventListener('yadira:journey-start', (event) => {
          window.qaEvents.journey.push({ detail: event.detail, empty: document.querySelector('#grand-line').innerHTML === '',
            visible: !document.querySelector('#grand-line').hidden, focus: document.activeElement.id });
        });
      });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#experience').innerHTML(), '');
      assert.equal(await page.locator('.journey-stage').count(), 0);
      await page.waitForFunction(() => { const img = document.querySelector('.ambient-logo img'); return img.complete && img.naturalWidth === 820; }).catch(async (error) => { console.error({ width, height, errors, image: await page.locator('img').evaluate((img) => ({ src: img.src, complete: img.complete, width: img.naturalWidth })) }); throw error; });
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.opening-action')).opacity === '1');
      await page.locator('.gift-button').click();
      await page.waitForSelector('.journey-stage');
      const visited = [];
      const readTimes = [];
      for (let index = 1; index <= 6; index++) {
        await page.waitForFunction((index) => {
          const scene = document.querySelector('.journey-stage');
          return scene.dataset.line === String(index) && scene.dataset.reading === 'true';
        }, index);
        const started = Date.now();
        assert.equal(await page.locator('.journey-line').innerText(), phrases[index - 1]);
        assert.equal(await page.locator('.journey-line:visible').count(), 1);
        await checkLayout(page, '.journey-line');
        await checkLayout(page, '.journey-continue');
        visited.push(phrases[index - 1]);
        if (index === 4 && width === 390 && !reduced) {
          await page.screenshot({ path: path.join(output, 'journey-narrative-390x844.png') });
        }
        if (!automatic) {
          // Keyboard and pointer skipping both advance one phrase, never queue more.
          if (width === 1440) {
            await page.locator('.journey-continue').focus();
            await page.keyboard.press('Enter');
          } else {
            const box = await page.locator('.journey-continue').boundingBox();
            await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { clickCount: 2, delay: 20 });
          }
          await page.locator('.journey-continue').dispatchEvent('click');
        }
        await page.waitForFunction((index) => {
          const scene = document.querySelector('.journey-stage');
          return scene.dataset.reading === 'false' || scene.dataset.line !== String(index);
        }, index);
        const elapsed = Date.now() - started;
        readTimes.push(elapsed);
        if (automatic) assert(elapsed >= holds[index - 1] - 250, `Reading hold shortened: ${index}: ${elapsed}`);
      }
      await page.waitForFunction(() => document.querySelector('.journey-stage').dataset.phase === 'ready');
      await checkLayout(page, '.journey-object');
      await checkLayout(page, '.journey-button');
      await checkLayout(page, '.journey-route');
      const composition = await page.evaluate(() => {
        const object = document.querySelector('.journey-object').getBoundingClientRect();
        const destination = document.querySelector('.journey-destination').getBoundingClientRect();
        const button = document.querySelector('.journey-button').getBoundingClientRect();
        const route = document.querySelector('.journey-route').getBoundingClientRect();
        const needle = getComputedStyle(document.querySelector('.pose-needle')).transform;
        return { separated: object.bottom <= destination.top && destination.bottom <= button.top && button.bottom < route.top,
          needleAngle: Math.atan2(new DOMMatrix(needle).b, new DOMMatrix(needle).a) * 180 / Math.PI,
          reducedAnimation: getComputedStyle(document.querySelector('.journey-sea'), '::before').animationName };
      });
      assert.equal(composition.separated, true);
      assert(Math.abs(composition.needleAngle - 44) < .1);
      if (reduced) assert.equal(composition.reducedAnimation, 'none');
      assert.equal(await page.locator('.journey-status').innerText(), 'DESTINO ENCONTRADO');
      assert.equal(await page.locator('.journey-title').innerText(), 'OUR GRAND LINE');
      assert.equal(await page.locator('#grand-line').innerHTML(), '');
      assert.equal(await page.locator('#grand-line').isVisible(), false);
      // Duplicate opening events must not mount another chapter or reset the sequence.
      await page.evaluate(() => document.dispatchEvent(new CustomEvent('yadira:opening-complete')));
      assert.equal(await page.locator('.journey-stage').count(), 1);
      const name = `journey-${width}x${height}${reduced ? '-reduced-motion' : ''}`;
      await page.screenshot({ path: path.join(output, `${name}.png`) });
      if (width === 1440) {
        await page.locator('.journey-button').focus();
        await page.keyboard.press('Enter');
      } else {
        const box = await page.locator('.journey-button').boundingBox();
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { clickCount: 2, delay: 20 });
      }
      assert.equal(await page.locator('.journey-button').isDisabled(), true);
      await page.locator('.journey-button').dispatchEvent('click');
      await page.waitForFunction(() => window.qaEvents.journey.length === 1);
      assert.equal(await page.locator('#grand-line').innerHTML(), '');
      assert.equal(await page.locator('.journey-stage').isVisible(), false);
      const event = await page.evaluate(() => window.qaEvents.journey);
      assert.deepEqual(event, [{ detail: { package: 'YADIRA-002' }, empty: true, visible: true, focus: 'grand-line' }]);
      const opening = await page.evaluate(() => window.qaEvents.opening[0]);
      assert.deepEqual(opening, { detail: { package: 'YADIRA-001' }, empty: true });
      await checkLayout(page, '#grand-line');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS ${name} (${automatic ? 'automatic' : 'continue'})`);
      return { viewport: `${width}x${height}`, reducedMotion: reduced, automatic, status: 'PASS',
        phrases: visited, readingMs: readTimes, noOverflow: true, controlsFit: true, noOverlap: true,
        needleAngle: composition.needleAngle, duplicateActivationBlocked: true, journeyEvents: 1,
        grandLineEmpty: true, openingHandoffPreserved: true, errors, screenshot: `${name}.png` };
    };
    const results = [];
    // Two contexts at a time avoid exhausting the local development server.
    for (let offset = 0; offset < cases.length; offset += 2) {
      results.push(...await Promise.all(cases.slice(offset, offset + 2).map(runCase)));
    }
    await fs.writeFile(path.join(output, 'journey-results.json'), JSON.stringify({ package: 'YADIRA-002',
      checkedAt: new Date().toISOString(), browser: await browser.version(), logoSHA256: hash, results }, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
