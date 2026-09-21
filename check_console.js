const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:3030', { waitUntil: 'networkidle2' });
  
  console.log('Clicking Demo ID button...');
  await page.click('#btn-top-demo');
  await new Promise(r => setTimeout(r, 500));
  
  const bal = await page.$eval('#hero-balance-num', el => el.textContent);
  console.log('HERO BALANCE AFTER CLICK:', bal);

  const btnText = await page.$eval('#btn-top-demo', el => el.textContent);
  console.log('DEMO BTN TEXT:', btnText);

  await browser.close();
}

test();
