const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });
  await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 25000 });

  const banners = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.page-banner img, swiper-slide img, [class*="banner"] img, [class*="slider"] img'))
      .map(i => ({ src: i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight }));
  });

  console.log('ALL GOPANEL BANNERS:', JSON.stringify(banners, null, 2));
  await browser.close();
})();
