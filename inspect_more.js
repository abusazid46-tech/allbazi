const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
  const outputDir = path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true });

    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('72023409856345709345934890987', 'true');
    });

    console.log('Navigating to https://gopanel.com/app/home...');
    await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    // 1. Click Hamburger Menu
    console.log('Clicking hamburger menu button...');
    const menuBtn = await page.$('.btn-menu, button:has(.material-icons), [class*="menu"], [class*="burger"]');
    // or selector by coordinates/first button in header
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      await buttons[0].click();
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: path.join(outputDir, 'gopanel_menu.png') });
      console.log('Captured menu');
      // close menu if open
      await page.mouse.click(400, 200);
      await new Promise(r => setTimeout(r, 1000));
    }

    // 2. Click "Demo ID" button
    console.log('Clicking Demo ID button...');
    const demoBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Demo ID'));
    });
    if (demoBtn && demoBtn.click) {
      await demoBtn.click();
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: path.join(outputDir, 'gopanel_demo_id_click.png') });
      console.log('Captured Demo ID click');
    }

    // 3. Click "Deposit" widget
    console.log('Clicking Deposit...');
    const depositArea = await page.$('[class*="deposit"], .deposit');
    if (depositArea) {
      await depositArea.click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(outputDir, 'gopanel_deposit_click.png') });
    }

    // 4. Click "Casino" in bottom nav
    console.log('Clicking Casino bottom nav...');
    const navItems = await page.$$('.bottom-nav-item, ion-tab-button, [class*="tab-button"], .footer-section div, nav div');
    const casinoItem = await page.evaluateHandle(() => {
      const items = Array.from(document.querySelectorAll('*'));
      return items.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Casino');
    });
    if (casinoItem && casinoItem.click) {
      await casinoItem.click();
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: path.join(outputDir, 'gopanel_casino_view.png') });
      console.log('Captured Casino View');
    }

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

run();
