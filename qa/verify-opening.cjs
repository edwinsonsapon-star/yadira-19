/* Run with Playwright available in NODE_PATH (or installed locally).
 * Uses the installed Edge browser; no application dependencies or downloads.
 */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');

const output = path.resolve(__dirname);
const baseURL = process.env.YADIRA_QA_URL || 'http://127.0.0.1:5173';
const sizes = [[360, 640], [390, 844], [430, 932], [768, 1024], [1440, 900]];
const cases = [...sizes.map(([width, height]) => ({ width, height, reduced: false })),
  { width: 390, height: 844, reduced: true }];

(async () => {
  const logoPath = path.resolve(__dirname, '../onepiece/Logo one piece.png');
  const hash = createHash('sha256').update(await fs.readFile(logoPath)).digest('hex');
  assert.equal(hash, '206e75f1cd4f177f730dbb13fb7ddf166e40298d579a1f9e8ffe18140364e368');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const { width, height, reduced } of cases) {
      const errors = [];
      const page = await browser.newPage({ viewport: { width, height },
        reducedMotion: reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        window.qaCompletionEvents = [];
        document.addEventListener('yadira:opening-complete', (event) => {
          window.qaCompletionEvents.push({ detail: event.detail,
            empty: document.querySelector('#experience').innerHTML === '',
            state: document.querySelector('.stage').dataset.state });
        });
      });
      // Wait for the staggered entrance, but never for infinite ambient animation.
      await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.opening-action')).opacity) === 1);
      const layout = await page.evaluate(() => {
        const img = document.querySelector('.ambient-logo img');
        const button = document.querySelector('button');
        const content = document.querySelector('.opening-content').getBoundingClientRect();
        const rect = button.getBoundingClientRect();
        return {
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          verticalOverflow: document.documentElement.scrollHeight > innerHeight,
          logoLoaded: img.complete && img.naturalWidth === 820 && img.naturalHeight === 557,
          particles: document.querySelectorAll('.particle').length,
          experienceEmpty: document.querySelector('#experience').innerHTML === '',
          contentFits: content.top >= 0 && content.bottom <= innerHeight,
          buttonFits: rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight,
          visibleText: document.querySelector('.opening').innerText,
          animationNames: [...document.querySelectorAll('.reveal, .particle, .ambient-logo, .ambient-light')]
            .map((el) => getComputedStyle(el).animationName),
        };
      });
      assert.equal(layout.horizontalOverflow, false);
      assert.equal(layout.verticalOverflow, false);
      assert.equal(layout.logoLoaded, true);
      assert.equal(layout.particles, 26);
      assert.equal(layout.experienceEmpty, true);
      assert.equal(layout.contentFits, true);
      assert.equal(layout.buttonFits, true);
      assert.doesNotMatch(layout.visibleText, /bitácora|recuerdos|dedicatoria|capítulo|galería/i);
      if (reduced) assert(layout.animationNames.every((name) => name === 'none'));
      const name = `opening-${width}x${height}${reduced ? '-reduced-motion' : ''}`;
      await page.screenshot({ path: path.join(output, `${name}.png`) });
      if (width === 1440) {
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('button').evaluate((button) => button === document.activeElement), true);
        await page.keyboard.press('Enter');
      } else {
        const box = await page.locator('button').boundingBox();
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { clickCount: 2, delay: 35 });
      }
      assert.equal(await page.locator('button').isDisabled(), true);
      // Programmatic repeated activation must also leave only one transition.
      await page.locator('button').dispatchEvent('click');
      await page.waitForFunction(() => document.querySelector('.stage').dataset.state === 'interlude');
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.interlude')).opacity === '1');
      assert.equal(await page.locator('#opening').isVisible(), false);
      assert.match(await page.locator('.interlude').innerText(), /Toda gran aventura comienza/);
      if (width === 390 && !reduced) await page.screenshot({ path: path.join(output, 'interlude-390x844.png') });
      await page.waitForFunction(() => document.querySelector('.stage').dataset.state === 'complete');
      const final = await page.evaluate(() => ({
        events: window.qaCompletionEvents,
        empty: document.querySelector('#experience').innerHTML === '',
        experienceVisible: !document.querySelector('#experience').hidden,
        focus: document.activeElement.id,
        openingHidden: document.querySelector('#opening').hidden,
        atmosphereHidden: document.querySelector('.atmosphere').hidden,
        interludeHidden: document.querySelector('.interlude').hidden,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      assert.equal(final.events.length, 1);
      assert.deepEqual(final.events[0], { detail: { package: 'YADIRA-001' }, empty: true, state: 'complete' });
      assert.equal(final.empty, true);
      assert.equal(final.experienceVisible, true);
      assert.equal(final.focus, 'experience');
      assert.equal(final.openingHidden && final.atmosphereHidden && final.interludeHidden, true);
      assert.equal(final.overflow, false);
      assert.deepEqual(errors, []);
      if (width === 390 && !reduced) await page.screenshot({ path: path.join(output, 'complete-390x844.png') });
      results.push({ viewport: `${width}x${height}`, reducedMotion: reduced, status: 'PASS',
        horizontalOverflow: false, verticalOverflow: false, logoLoaded: true, particles: 26,
        buttonFunctional: true, duplicateActivationBlocked: true, completionEvents: final.events.length,
        experienceEmpty: true, consoleErrors: errors, screenshot: `${name}.png` });
      console.log(`PASS ${name}`);
      await page.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ package: 'YADIRA-001',
      browser: await browser.version(), checkedAt: new Date().toISOString(), logoSHA256: hash, results }, null, 2) + '\n');
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
