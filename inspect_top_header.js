const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function inspectTopHeader() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--window-size=430,932']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('72023409856345709345934890987', 'true');
  });

  await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));

  const info = await page.evaluate(() => {
    // Print all clickable elements in top header
    const topElems = Array.from(document.querySelectorAll('*')).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= 120 && rect.width > 20 && rect.height > 20;
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      text: el.innerText ? el.innerText.trim().replace(/\n+/g, ' ') : '',
      rect: {
        x: Math.round(el.getBoundingClientRect().x),
        y: Math.round(el.getBoundingClientRect().y),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height)
      }
    }));

    return topElems;
  });

  console.log('Top Header Elements:', JSON.stringify(info.slice(0, 30), null, 2));

  // Let's click by exact coordinates:
  // Hamburger is around x: 30, y: 35
  // Login button is around x: 260, y: 35
  console.log('Clicking Hamburger at (36, 36)...');
  await page.mouse.click(36, 36);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch/gopanel_real_sidebar.png') });
  console.log('Captured gopanel_real_sidebar.png');

  // Let's get sidebar DOM HTML
  const sidebarHtml = await page.evaluate(() => {
    const el = document.querySelector('.sidenav, .side-menu, [class*="sidenav"], [class*="drawer"], [class*="sidebar"]');
    return el ? el.outerHTML : document.body.innerHTML.slice(0, 5000);
  });
  fs.writeFileSync('gopanel_sidebar.html', sidebarHtml);

  // Close sidebar by clicking outside
  await page.mouse.click(380, 200);
  await new Promise(r => setTimeout(r, 1000));

  // Now click Login | Signup
  // Look at info for login button position:
  const loginInfo = info.find(i => i.text.includes('Login') || i.text.includes('Signup'));
  console.log('Login Info:', loginInfo);
  if (loginInfo) {
    console.log(`Clicking Login at (${loginInfo.rect.x + loginInfo.rect.w/2}, ${loginInfo.rect.y + loginInfo.rect.h/2})...`);
    await page.mouse.click(loginInfo.rect.x + loginInfo.rect.w/2, loginInfo.rect.y + loginInfo.rect.h/2);
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch/gopanel_real_login.png') });
    console.log('Captured gopanel_real_login.png');

    const loginHtml = await page.evaluate(() => {
      const el = document.querySelector('.modal, .dialog, [class*="modal"], [class*="dialog"], [class*="login"]');
      return el ? el.outerHTML : '';
    });
    fs.writeFileSync('gopanel_login.html', loginHtml);
  }

  await browser.close();
}

inspectTopHeader().catch(console.error);
