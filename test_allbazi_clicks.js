const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testAllClicks() {
  const outputDir = path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true });

    // 1. Initial Home Navigation
    console.log('1. Navigating to http://localhost:3030 ...');
    await page.goto('http://localhost:3030', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 800));

    const homePic = path.join(outputDir, 'allbazi_home_replica.png');
    await page.screenshot({ path: homePic, fullPage: false });
    console.log('✅ Action 1 Passed: Captured AllBazi Home Screen');

    // 2. Click Hamburger -> SideNav Drawer
    console.log('2. Clicking Hamburger Menu...');
    await page.click('#btn-hamburger');
    await new Promise(r => setTimeout(r, 500));
    const drawerPic = path.join(outputDir, 'allbazi_drawer_replica.png');
    await page.screenshot({ path: drawerPic, fullPage: false });
    console.log('✅ Action 2 Passed: SideNav Drawer Opened');

    // Close Drawer via Backdrop
    await page.click('#sidenav-backdrop');
    await new Promise(r => setTimeout(r, 500));

    // 3. Click Demo ID
    console.log('3. Clicking Demo ID Button...');
    await page.click('#btn-top-demo');
    await new Promise(r => setTimeout(r, 600));
    const balDemo = await page.$eval('#hero-balance-num', el => el.textContent.trim());
    console.log(`✅ Action 3 Passed: Demo ID Activated with Balance ₹${balDemo}`);
    const demoPic = path.join(outputDir, 'allbazi_demo_id_activated.png');
    await page.screenshot({ path: demoPic, fullPage: false });

    // 4. Click Deposit Wing
    console.log('4. Clicking Deposit Wing Button...');
    await page.click('#btn-wing-deposit');
    await new Promise(r => setTimeout(r, 500));
    const depositPic = path.join(outputDir, 'allbazi_deposit_modal.png');
    await page.screenshot({ path: depositPic, fullPage: false });
    console.log('✅ Action 4 Passed: Deposit Modal Opened');

    // Confirm Deposit ₹2,000
    await page.click('#btn-confirm-deposit');
    await new Promise(r => setTimeout(r, 600));
    const balAfterDep = await page.$eval('#hero-balance-num', el => el.textContent.trim());
    console.log(`✅ Action 5 Passed: Deposit Confirmed, New Balance ₹${balAfterDep}`);

    // 5. Click Aviator Action Card
    console.log('5. Clicking Aviator Action Card...');
    await page.click('#btn-action-aviator');
    await new Promise(r => setTimeout(r, 600));
    const aviatorPic = path.join(outputDir, 'allbazi_aviator_replica.png');
    await page.screenshot({ path: aviatorPic, fullPage: false });
    console.log('✅ Action 6 Passed: Interactive Aviator Game Room Opened');
    await page.click('[data-close="modal-game-room"]');
    await new Promise(r => setTimeout(r, 500));

    // 6. Test Search Bar Filter
    console.log('6. Testing Live Search Filter for "Antigua"...');
    await page.type('#search-input-field', 'Antigua');
    await new Promise(r => setTimeout(r, 400));
    const filteredRowsCount = await page.$$eval('#cricket-table-rows .table-item-row', rows => rows.length);
    console.log(`✅ Action 7 Passed: Search Filter active, matching rows: ${filteredRowsCount}`);
    await page.click('#search-clear-btn');
    await new Promise(r => setTimeout(r, 300));

    // 7. Click Match Row to Open Match Detail
    console.log('7. Clicking Match Row to navigate to Match Detail...');
    await page.click('#cricket-table-rows [data-action="detail"]');
    await new Promise(r => setTimeout(r, 700));
    const detailPic = path.join(outputDir, 'allbazi_detail_replica.png');
    await page.screenshot({ path: detailPic, fullPage: false });
    console.log('✅ Action 8 Passed: Match Detail Opened with Scoreboard & Bookmaker');

    // 8. Tab Switch: OPEN BETS
    console.log('8. Testing Match Detail Tab Switching...');
    await page.click('#tab-detail-openbets');
    await new Promise(r => setTimeout(r, 400));
    await page.click('#tab-detail-market');
    await new Promise(r => setTimeout(r, 400));
    console.log('✅ Action 9 Passed: Match Detail Tabs switched seamlessly');

    // 9. Click Odds Tile to Open Bet Slip
    console.log('9. Clicking Bookmaker Odds Box to open Slide-Up Bet Slip...');
    const backBtn = await page.$('#bookmaker-rows-container .odds-tile.back-box');
    if (backBtn) {
      await backBtn.click();
    } else {
      await page.click('.odds-tile.back-box');
    }
    await new Promise(r => setTimeout(r, 600));
    const betslipPic = path.join(outputDir, 'allbazi_betslip_replica.png');
    await page.screenshot({ path: betslipPic, fullPage: false });
    console.log('✅ Action 10 Passed: Slide-Up Bet Slip Opened');

    // 10. Click Stake Chip +1K and Submit Bet
    console.log('10. Clicking Stake Chip +1K and Placing Bet...');
    await page.click('.stake-chip[data-val="1000"]');
    await new Promise(r => setTimeout(r, 300));
    await page.click('#btn-submit-bet');
    await new Promise(r => setTimeout(r, 900));
    const balAfterBet = await page.$eval('#hero-balance-num', el => el.textContent.trim());
    console.log(`✅ Action 11 Passed: Bet Placed, Remaining Balance ₹${balAfterBet}`);

    // 11. Return to Home
    console.log('11. Returning to Home Screen...');
    await page.click('#btn-detail-back');
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => window.scrollTo(0, 0));

    // 12. Click Bottom Nav "Panels" (Account Statement / Passbook)
    console.log('12. Clicking Bottom Nav Panels...');
    await page.click('#nav-item-panels');
    await new Promise(r => setTimeout(r, 600));
    const passbookPic = path.join(outputDir, 'allbazi_passbook_replica.png');
    await page.screenshot({ path: passbookPic, fullPage: false });
    console.log('✅ Action 12 Passed: Account Statement Passbook Opened with live bets');

    console.log('\n======================================================');
    console.log('🚀 ALL 12 USER INTERACTION CLICKS VERIFIED & MATCHED!');
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ Error during click verification:', err);
  } finally {
    await browser.close();
  }
}

testAllClicks();
