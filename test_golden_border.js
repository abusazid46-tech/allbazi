const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outDir = 'C:/Users/sonow/.gemini/antigravity-ide/brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch';

async function main() {
  console.log('Testing Golden Animated Border...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3030', { waitUntil: 'networkidle0' });

  // Wait a bit for images to load
  await new Promise(r => setTimeout(r, 600));

  // 1. Capture full home view showing the action cards
  await page.screenshot({ path: path.join(outDir, 'allbazi_home_golden_cards.png') });
  console.log('Saved allbazi_home_golden_cards.png');

  // 2. Capture a cropped close-up of the quick actions row (Aviator & Chicken Road 2.0)
  const quickActionsEl = await page.$('.quick-actions-row');
  if (quickActionsEl) {
    await quickActionsEl.screenshot({ path: path.join(outDir, 'allbazi_golden_border_frame1.png') });
    console.log('Saved allbazi_golden_border_frame1.png');

    // Wait 800ms for rotation to progress and capture frame 2
    await new Promise(r => setTimeout(r, 800));
    await quickActionsEl.screenshot({ path: path.join(outDir, 'allbazi_golden_border_frame2.png') });
    console.log('Saved allbazi_golden_border_frame2.png');

    // Wait another 800ms to capture frame 3
    await new Promise(r => setTimeout(r, 800));
    await quickActionsEl.screenshot({ path: path.join(outDir, 'allbazi_golden_border_frame3.png') });
    console.log('Saved allbazi_golden_border_frame3.png');
  }

  await browser.close();
  console.log('Done testing golden border!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
