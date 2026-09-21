const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function run() {
  const outputDir = path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--window-size=430,932'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true });

    // Set bypass for anti-devtools script
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('72023409856345709345934890987', 'true');
    });

    console.log('Navigating to https://gopanel.com/app/home...');
    await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait extra seconds for Angular hydration and live feeds
    console.log('Waiting for Angular elements to render...');
    await new Promise(r => setTimeout(r, 6000));

    // Save screenshot 1: Home page
    const homeScreenshotPath = path.join(outputDir, 'gopanel_home.png');
    await page.screenshot({ path: homeScreenshotPath, fullPage: false });
    console.log('Captured:', homeScreenshotPath);

    // Capture DOM layout and structure details
    const pageData = await page.evaluate(() => {
      const getStyles = (el) => {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          bg: cs.backgroundColor,
          color: cs.color,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily,
          padding: cs.padding,
          margin: cs.margin,
          border: cs.border,
          borderRadius: cs.borderRadius,
          height: cs.height,
          width: cs.width,
          boxShadow: cs.boxShadow
        };
      };

      const header = document.querySelector('.top-header, .page-header, .header-wrapper, header');
      const tabs = Array.from(document.querySelectorAll('.pagetab-header .pagetab-item, .pageTabs .pagetab-item, [class*="tab"]')).slice(0, 15).map(t => ({
        text: t.innerText.trim().replace(/\n+/g, ' '),
        className: t.className
      }));

      const buttons = Array.from(document.querySelectorAll('button')).slice(0, 20).map(b => ({
        text: b.innerText.trim(),
        className: b.className
      }));

      const matchCards = Array.from(document.querySelectorAll('.match-card, [class*="match"], [class*="event"]')).slice(0, 10).map(m => ({
        text: m.innerText.trim().replace(/\n+/g, ' | '),
        className: m.className
      }));

      return {
        title: document.title,
        url: window.location.href,
        bodyBg: window.getComputedStyle(document.body).backgroundColor,
        headerStyles: getStyles(header),
        tabs,
        buttons,
        matchCardsCount: matchCards.length,
        matchCardsSnippet: matchCards.slice(0, 5)
      };
    });

    fs.writeFileSync(path.join(outputDir, 'gopanel_inspect.json'), JSON.stringify(pageData, null, 2));
    console.log('Saved inspection data to gopanel_inspect.json');

    // Try clicking first match to inspect match detail view
    const matchElem = await page.$('.match-card, [class*="match"]');
    if (matchElem) {
      console.log('Clicking match card to inspect Match Details...');
      await matchElem.click();
      await new Promise(r => setTimeout(r, 4000));
      const matchDetailScreenshot = path.join(outputDir, 'gopanel_match_detail.png');
      await page.screenshot({ path: matchDetailScreenshot, fullPage: false });
      console.log('Captured:', matchDetailScreenshot);
    }

    // Try clicking an odds button to inspect betslip
    const oddsBtn = await page.$('.odds-btn, [class*="back"], [class*="lay"]');
    if (oddsBtn) {
      console.log('Clicking odds button to inspect Bet Slip...');
      await oddsBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      const betslipScreenshot = path.join(outputDir, 'gopanel_betslip.png');
      await page.screenshot({ path: betslipScreenshot, fullPage: false });
      console.log('Captured:', betslipScreenshot);
    }

  } catch (err) {
    console.error('Error during inspection:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

run();
