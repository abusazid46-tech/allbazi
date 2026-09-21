const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });
  console.log('Opening GoPanel...');
  await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 25000 });

  const data = await page.evaluate(() => {
    // Find all images that have 'banner' or are in carousel/swiper
    const allImgs = Array.from(document.querySelectorAll('img'));
    const bannerImgs = allImgs.filter(img => img.src && (img.src.includes('banner') || (img.parentElement && img.parentElement.innerHTML.includes('banner'))));
    
    // Also look for swiper or carousel containers
    const containers = Array.from(document.querySelectorAll('[class*="banner"], [class*="swiper"], [class*="carousel"], [class*="slide"]'));
    
    return {
      bannerImages: bannerImgs.map(img => {
        const cs = window.getComputedStyle(img);
        return {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          width: cs.width,
          height: cs.height,
          aspectRatio: cs.aspectRatio,
          objectFit: cs.objectFit,
          borderRadius: cs.borderRadius,
          parentClass: img.parentElement ? img.parentElement.className : null,
          parentW: img.parentElement ? window.getComputedStyle(img.parentElement).width : null,
          parentH: img.parentElement ? window.getComputedStyle(img.parentElement).height : null
        };
      }),
      containers: containers.slice(0, 10).map(c => ({
        tag: c.tagName,
        className: c.className,
        width: window.getComputedStyle(c).width,
        height: window.getComputedStyle(c).height,
        aspectRatio: window.getComputedStyle(c).aspectRatio,
        margin: window.getComputedStyle(c).margin,
        padding: window.getComputedStyle(c).padding
      }))
    };
  });

  console.log('RESULT:', JSON.stringify(data, null, 2));
  await browser.close();
})();
