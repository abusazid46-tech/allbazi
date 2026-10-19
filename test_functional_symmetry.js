const puppeteer = require("puppeteer-core");
const path = require("path");

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ARTIFACT_DIR = "C:/Users/sonow/.gemini/antigravity-ide/brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch";
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log("Launching Chrome to test functional symmetry...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 420, height: 900 });

  // 1. Load Homepage
  console.log("1. Navigating to http://localhost:3030...");
  await page.goto("http://localhost:3030", { waitUntil: "networkidle0" });
  await sleep(600);

  // 2. Click Demo ID to activate ₹10,000 wallet
  console.log("2. Activating Demo ID...");
  await page.click("#btn-top-demo");
  await sleep(400);

  let balanceText = await page.$eval("#hero-balance-num", el => el.textContent.trim());
  console.log(`Balance after Demo ID activation: ₹${balanceText}`);

  // 3. Test Reload & LocalStorage Hydration
  console.log("3. Reloading page to test LocalStorage state hydration...");
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(600);

  balanceText = await page.$eval("#hero-balance-num", el => el.textContent.trim());
  const topDemoText = await page.$eval("#btn-top-demo", el => el.textContent.trim());
  console.log(`Hydrated balance after reload: ₹${balanceText}, top pill: ${topDemoText}`);

  // 4. Click Into Match Detail for Antigua v Jamaica
  console.log("4. Opening Match Detail for Antigua v Jamaica...");
  await page.click('.table-item-row[data-match-id="c1"] [data-action="detail"]');
  await sleep(500);

  // Check Match Odds, Fancy, Bookmaker presence
  const hasMatchOdds = (await page.$("#match-odds-rows-container .market-runner-row")) !== null;
  const hasFancy = (await page.$("#fancy-rows-container .fancy-runner-row")) !== null;
  const hasBookmaker = (await page.$("#bookmaker-rows-container .market-runner-row")) !== null;
  console.log(`Match Detail verification -> Match Odds: ${hasMatchOdds}, Fancy Session: ${hasFancy}, Bookmaker: ${hasBookmaker}`);

  // 5. Place a Back bet from Match Detail
  console.log("5. Placing a Back bet on Antigua Falcons in Match Odds...");
  const backTile = await page.$("#match-odds-rows-container .odds-tile.back-box");
  await backTile.click();
  await sleep(400);

  // Click Submit Bet
  console.log("Submitting Bet Slip...");
  await page.click("#btn-submit-bet");
  await sleep(800);

  balanceText = await page.$eval("#hero-balance-num", el => el.textContent.trim());
  console.log(`Balance after placing bet: ₹${balanceText}`);

  // 6. Verify Cashout button becomes active with hedging value
  const cashoutBtnText = await page.$eval("#btn-cashout-mo", el => el.textContent.trim());
  const isCashoutActive = await page.$eval("#btn-cashout-mo", el => el.classList.contains("active"));
  console.log(`Cashout Button Status: "${cashoutBtnText}", Active Class: ${isCashoutActive}`);

  // Take screenshot of Match Detail with Fancy & Active Cashout
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "allbazi_symmetry_match_detail.png") });
  console.log("Saved allbazi_symmetry_match_detail.png");

  // 7. Click Cashout button to hedge profit
  console.log("7. Executing 1-Click Cashout...");
  await page.click("#btn-cashout-mo");
  await sleep(600);

  balanceText = await page.$eval("#hero-balance-num", el => el.textContent.trim());
  console.log(`Balance after Cashout: ₹${balanceText}`);

  // 8. Open Account Statement / Passbook to verify records
  console.log("8. Checking Account Statement / Passbook...");
  await page.click("#btn-detail-back");
  await sleep(400);

  await page.click("#btn-hamburger");
  await sleep(400);
  await page.click("#nav-item-passbook");
  await sleep(500);

  const passbookRowsCount = await page.$$eval("#statement-rows-body tr", rows => rows.length);
  console.log(`Passbook statement rows count: ${passbookRowsCount}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "allbazi_symmetry_passbook.png") });
  console.log("Saved allbazi_symmetry_passbook.png");

  // Close passbook
  await page.click('[data-close="modal-passbook"]');
  await sleep(400);

  // 9. Test In-Play Filter in Bottom Nav
  console.log("9. Testing In-Play Bottom Nav Filter...");
  await page.click('.bottom-nav-item[data-nav="inplay"]');
  await sleep(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "allbazi_symmetry_inplay_filtered.png") });
  console.log("Saved allbazi_symmetry_inplay_filtered.png");

  await browser.close();
  console.log("Functional symmetry test completed successfully!");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
