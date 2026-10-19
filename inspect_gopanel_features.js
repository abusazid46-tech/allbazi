const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });

  // Listen to network requests to discover GoPanel's API structure
  const apis = [];
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('/api/') || url.includes('/v1/') || url.includes('/match') || url.includes('/sport') || url.includes('/bet') || url.includes('json')) {
      try {
        const text = await res.text();
        apis.push({
          url,
          status: res.status(),
          sample: text.slice(0, 300)
        });
      } catch (e) {}
    }
  });

  console.log('Navigating to GoPanel...');
  await page.goto('https://gopanel.com/app/home', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await new Promise(r => setTimeout(r, 6000));

  console.log('Captured APIs on Home:', apis.length);
  for (const a of apis.slice(0, 15)) {
    console.log(`API: ${a.url} [${a.status}]`);
  }

  // Click on a live match to see match detail functional features
  const matchRow = await page.$('.event-row, .match-card, table tr[class*="match"], table tbody tr, a[href*="detail"], a[href*="match"]');
  if (matchRow) {
    console.log('Clicking on match row...');
    await matchRow.click();
    await new Promise(r => setTimeout(r, 4000));
    console.log('Current URL after match click:', page.url());
  }

  // Evaluate interactive functions and state on GoPanel
  const features = await page.evaluate(() => {
    return {
      buttons: Array.from(document.querySelectorAll('button, a')).map(b => (b.innerText || b.getAttribute('title') || '').trim()).filter(Boolean).slice(0, 40),
      markets: Array.from(document.querySelectorAll('[class*="market"], [class*="tab"]')).map(m => m.innerText.trim()).filter(Boolean).slice(0, 20)
    };
  });

  console.log('Page interactive features:', JSON.stringify(features, null, 2));

  await browser.close();
}

main().catch(console.error);
