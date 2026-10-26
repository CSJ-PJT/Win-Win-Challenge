'use strict';
// Browser contract: labels, rendered root size, persistence and reachable controls.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.ANSIM_CHROME || undefined, args: ['--no-sandbox'] });
  const output = process.env.ANSIM_FONT_OUTPUT || 'build-reports/v043/font-scaling';
  fs.mkdirSync(output, { recursive: true });
  const report = { environment: 'desktop Chromium synthetic standalone fixture', rows: [], success: false };
  try {
    for (const width of [360, 412, 768]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.addInitScript(() => { window.ANSIM_STANDALONE = true; });
      await page.route('**/*', route => {
        const url = new URL(route.request().url());
        const file = url.pathname === '/' ? 'index.html' : path.basename(url.pathname);
        if (url.origin !== 'http://ansim-font.test' || !['index.html', 'style.css', 'config.js', 'core.js', 'ui.js', 'address.js', 'app.js'].includes(file)) return route.abort();
        return route.fulfill({ path: path.resolve('web', file), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
      });
      await page.goto('http://ansim-font.test/');
      await page.locator('[data-action="select-role"][data-role="visitor"]').click();
      for (const value of [100, 125, 150, 200]) {
        await page.locator('[data-action="open-editor"]').click();
        assert.equal(await page.locator('#textSize option:checked').count(), 1);
        assert.equal(await page.locator('#textSize option[value="'+value+'"]').textContent(), value+'%');
        await page.locator('#textSize').selectOption(String(value));
        await page.locator('#visitForm button[type="submit"]').click();
        await page.waitForFunction(v => document.documentElement.className === 'text-'+v && !document.querySelector('.dialog'), value);
        const expected = 16 * value / 100;
        assert.equal(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)), expected);
        await page.reload();
        await page.waitForFunction(v => document.documentElement.className === 'text-'+v, value);
        assert.equal(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)), expected);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'document horizontal overflow');
        report.rows.push({ width, setting: value, root_px: expected, reload_preserved: true, document_horizontal_overflow: false });
      }
      await page.screenshot({ path: path.join(output, 'font200-'+width+'.png'), fullPage: true });
      await page.locator('[data-action="select-role"][data-role="facility"]').click();
      await page.locator('[data-action="select-role"][data-role="visitor"]').click();
      await page.locator('[data-action="open-editor"]').click();
      await page.locator('#textSize').selectOption('100');
      await page.locator('#visitForm button[type="submit"]').click();
      await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '16px' && !document.querySelector('.dialog'));
      await context.close();
    }
    report.success = true;
  } catch (error) { report.failure = error.stack; process.exitCode = 1; }
  finally { fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify(report)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
