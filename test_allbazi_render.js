const puppeteer = require('puppeteer-core');
const path = require('path');

async function testRender() {
  const outputDir = path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true });

    console.log('Navigating to http://localhost:3030...');
    await page.goto('http://localhost:3030', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // 1. Capture AllBazi Home Screen
    const homePic = path.join(outputDir, 'allbazi_home_replica.png');
    await page.screenshot({ path: homePic, fullPage: false });
    console.log('Captured AllBazi Home:', homePic);

    // 2. Click "Demo ID" button
    console.log('Clicking Demo ID button...');
    await page.click('#btn-top-demo');
    await new Promise(r => setTimeout(r, 800));

    // 3. Click first match row to open Match Detail
    console.log('Clicking match row to open Match Detail...');
    await page.click('[data-action="detail"]');
    await new Promise(r => setTimeout(r, 1000));
    const detailPic = path.join(outputDir, 'allbazi_detail_replica.png');
    await page.screenshot({ path: detailPic, fullPage: false });
    console.log('Captured AllBazi Match Detail:', detailPic);

    // 4. Click odds button in Match Detail to open Bet Slip
    console.log('Clicking odds button to open Bet Slip...');
    await page.click('.odds-tile.back-box');
    await new Promise(r => setTimeout(r, 800));
    const betslipPic = path.join(outputDir, 'allbazi_betslip_replica.png');
    await page.screenshot({ path: betslipPic, fullPage: false });
    console.log('Captured AllBazi Bet Slip:', betslipPic);

  } catch (err) {
    console.error('Error during test render:', err);
  } finally {
    await browser.close();
  }
}

testRender();
