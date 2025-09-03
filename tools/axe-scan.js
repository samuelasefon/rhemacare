const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

(async () => {
  const pages = ['/index.html', '/about.html', '/services.html', '/contact.html', '/privacy.html', '/404.html'];
  const origin = process.env.AXE_BASE || 'http://localhost:3000';
  const results = [];

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const p of pages) {
      const url = origin + p;
      const page = await browser.newPage();
      console.log('Visiting', url);

      // Wait for the server to accept connections (retry loop)
      const maxWait = 20000; // ms total wait
      const perTryTimeout = 5000; // ms per navigation try
      const start = Date.now();
      let connected = false;
      while (Date.now() - start < maxWait) {
        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: perTryTimeout });
          connected = true;
          break;
        } catch (e) {
          // Treat connection refused and navigation timeout as retryable while server is starting
          const msg = (e && e.message) ? e.message : '';
          const isConnRefused = msg.includes('net::ERR_CONNECTION_REFUSED') || msg.includes('ECONNREFUSED');
          const isTimeout = e && (e.name === 'TimeoutError' || msg.includes('Navigation timeout'));
          if (isConnRefused || isTimeout) {
            await new Promise(r => setTimeout(r, 500));
            continue;
          }
          throw e;
        }
      }
      if (!connected) {
        throw new Error(`Could not connect to ${origin} within ${maxWait}ms. Is the local server running?`);
      }

      // ensure page has loaded main landmark
      await page.waitForTimeout(250);

      // Inject axe-core into the page and run it. Use the packaged minified file to avoid injection issues.
      try {
        const axePath = require.resolve('axe-core/axe.min.js');
        await page.addScriptTag({ path: axePath });
      } catch (err) {
        // fallback: try injecting source
        await page.addScriptTag({ content: axeCore.source });
      }

      const res = await page.evaluate(async () => {
        if (!window.axe || typeof window.axe.run !== 'function') {
          throw new Error('axe not available on the page after injection');
        }
        return await window.axe.run();
      });
      results.push({ url, violations: res.violations, passes: res.passes, incomplete: res.incomplete });
      await page.close();
    }

    const outPath = path.resolve(process.cwd(), 'a11y-report.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    const totalViolations = results.reduce((s, r) => s + (r.violations ? r.violations.length : 0), 0);
    console.log(`A11y scan complete. Pages: ${results.length}, total violations: ${totalViolations}`);
    if (totalViolations > 0) process.exitCode = 2;
  } catch (err) {
    console.error('Axe scan error:', err);
    process.exitCode = 3;
  } finally {
    await browser.close();
  }
})();
