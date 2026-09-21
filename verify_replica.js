const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outDir = 'C:/Users/sonow/.gemini/antigravity-ide/brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch';

async function main() {
  console.log('Launching Chrome with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:3030 ...');
  await page.goto('http://localhost:3030', { waitUntil: 'networkidle0', timeout: 15000 });

  // 1. Initial State Screenshot (Hero Slide 1)
  await page.waitForTimeout ? page.waitForTimeout(600) : new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'allbazi_hero_slide1.png') });
  console.log('Saved allbazi_hero_slide1.png');

  // 2. Wait for carousel auto-scroll (3.8 seconds)
  console.log('Waiting for carousel auto-scroll...');
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(outDir, 'allbazi_hero_slide2.png') });
  console.log('Saved allbazi_hero_slide2.png');

  // 3. Open Sidenav Drawer
  console.log('Opening Sidenav Drawer...');
  await page.click('#btn-hamburger');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'allbazi_exact_sidebar.png') });
  console.log('Saved allbazi_exact_sidebar.png');

  // 4. Close Sidenav Drawer via white circle close button
  console.log('Closing Sidenav Drawer...');
  await page.click('#btn-close-sidenav');
  await new Promise(r => setTimeout(r, 500));

  // 5. Open Login / Signup Window
  console.log('Opening Login / Signup Window...');
  await page.click('#btn-top-login');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'allbazi_exact_login.png') });
  console.log('Saved allbazi_exact_login.png');

  // 6. Click Login with Demo ID
  console.log('Clicking Login with Demo ID...');
  await page.click('#btn-login-demo-id');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'allbazi_logged_in_state.png') });
  console.log('Saved allbazi_logged_in_state.png');

  // 7. Open Sidenav while logged in
  console.log('Opening Sidenav in logged-in state...');
  await page.click('#btn-hamburger');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'allbazi_sidebar_logged_in.png') });
  console.log('Saved allbazi_sidebar_logged_in.png');

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error('Error in verification:', err);
  process.exit(1);
});
