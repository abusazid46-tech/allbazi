const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function inspectAssets() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('72023409856345709345934890987', 'true');
  });

  const imageUrls = [];
  page.on('response', res => {
    if (res.request().resourceType() === 'image') {
      imageUrls.push(res.url());
    }
  });

  await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const domData = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
      src: i.src,
      alt: i.alt,
      className: i.className,
      parentClass: i.parentElement ? i.parentElement.className : ''
    }));
    return imgs;
  });

  console.log('All Image URLs count:', imageUrls.length);
  fs.writeFileSync('gopanel_images.json', JSON.stringify({ imageUrls, domData }, null, 2));
  console.log('Written to gopanel_images.json');
  await browser.close();
}

inspectAssets().catch(console.error);
