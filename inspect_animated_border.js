const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });
  await page.goto('https://gopanel.com/app/home', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await new Promise(r => setTimeout(r, 4000));

  const data = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).filter(img => 
      img.src.includes('aviator') || img.src.includes('chicken')
    );
    
    return imgs.map(img => {
      let node = img.parentElement;
      const chain = [];
      while (node && node !== document.body) {
        const cs = window.getComputedStyle(node);
        const before = window.getComputedStyle(node, '::before');
        const after = window.getComputedStyle(node, '::after');
        chain.push({
          tag: node.tagName,
          className: node.className,
          border: cs.border,
          borderRadius: cs.borderRadius,
          background: cs.background,
          boxShadow: cs.boxShadow,
          animation: cs.animation,
          before: {
            content: before.content,
            background: before.background,
            border: before.border,
            animation: before.animation,
            position: before.position
          },
          after: {
            content: after.content,
            background: after.background,
            border: after.border,
            animation: after.animation,
            position: after.position
          }
        });
        node = node.parentElement;
      }
      return {
        imgSrc: img.src,
        chain: chain.slice(0, 4)
      };
    });
  });

  console.log(JSON.stringify(data, null, 2));

  // Also extract all CSS stylesheets text that mention keyframes or gold or border
  const animations = await page.evaluate(() => {
    const keyframes = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.type === CSSRule.KEYFRAMES_RULE) {
            keyframes.push(rule.cssText);
          } else if (rule.cssText && (rule.cssText.includes('linear-gradient') || rule.cssText.includes('conic-gradient')) && (rule.cssText.includes('gold') || rule.cssText.includes('#ff') || rule.cssText.includes('255,'))) {
            keyframes.push(rule.cssText);
          }
        }
      } catch (e) {}
    }
    return keyframes;
  });

  console.log('Keyframes and gradients:', JSON.stringify(animations.slice(0, 15), null, 2));

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
