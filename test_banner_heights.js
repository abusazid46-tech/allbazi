const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outDir = 'C:/Users/sonow/.gemini/antigravity-ide/brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox']
  });

  // 1. Test Mobile (430x932)
  console.log('Testing Mobile Viewport (430x932)...');
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
  await pageMobile.goto('http://localhost:3030', { waitUntil: 'networkidle0' });

  const mobileDims = await pageMobile.evaluate(() => {
    const wrap = document.querySelector('.promo-carousel-wrap');
    const img = document.querySelector('.promo-banner-img');
    return {
      wrapW: wrap.clientWidth,
      wrapH: wrap.clientHeight,
      imgW: img.clientWidth,
      imgH: img.clientHeight,
      aspectRatio: (img.clientWidth / img.clientHeight).toFixed(3)
    };
  });
  console.log('Mobile Dimensions:', mobileDims);
  await pageMobile.screenshot({ path: path.join(outDir, 'allbazi_hero_height_mobile.png') });

  // 2. Test Desktop (768x1024)
  console.log('Testing Desktop Viewport (768x1024)...');
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await pageDesktop.goto('http://localhost:3030', { waitUntil: 'networkidle0' });

  const desktopDims = await pageDesktop.evaluate(() => {
    const wrap = document.querySelector('.promo-carousel-wrap');
    const img = document.querySelector('.promo-banner-img');
    return {
      wrapW: wrap.clientWidth,
      wrapH: wrap.clientHeight,
      imgW: img.clientWidth,
      imgH: img.clientHeight,
      aspectRatio: (img.clientWidth / img.clientHeight).toFixed(3)
    };
  });
  console.log('Desktop Dimensions:', desktopDims);
  await pageDesktop.screenshot({ path: path.join(outDir, 'allbazi_hero_height_desktop.png') });

  await browser.close();
  console.log('Test completed successfully!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
