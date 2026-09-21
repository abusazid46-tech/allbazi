const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function getSidebar() {
  const outputDir = path.join(__dirname, '../../brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--window-size=430,932']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('72023409856345709345934890987', 'true');
  });

  await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 6000));

  // Open sidebar by setting attributes directly or triggering click on the mat-icon
  const opened = await page.evaluate(() => {
    const sidenav = document.querySelector('mat-sidenav');
    if (sidenav) {
      sidenav.setAttribute('opened', 'true');
      sidenav.style.visibility = 'visible';
      sidenav.style.transform = 'none';
      sidenav.classList.add('mat-drawer-opened');

      const backdrop = document.querySelector('.mat-drawer-backdrop');
      if (backdrop) {
        backdrop.classList.add('mat-drawer-shown');
        backdrop.style.visibility = 'visible';
      }
      return true;
    }
    return false;
  });

  console.log('Opened sidebar directly:', opened);
  await new Promise(r => setTimeout(r, 1000));

  // Get computed styles of sidebar elements
  const styles = await page.evaluate(() => {
    const wrapper = document.querySelector('.sidemenu-wrapper');
    const header = document.querySelector('.sidemenu-header');
    const item = document.querySelector('.smenu-item');
    const link = document.querySelector('.smenu-link');
    const actionBtn = document.querySelector('.sidemenu-list .action-btn button');

    const getCS = el => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        padding: cs.padding,
        margin: cs.margin,
        border: cs.border,
        borderRadius: cs.borderRadius,
        display: cs.display,
        width: cs.width,
        height: cs.height
      };
    };

    return {
      wrapper: getCS(wrapper),
      header: getCS(header),
      item: getCS(item),
      link: getCS(link),
      actionBtn: getCS(actionBtn)
    };
  });

  fs.writeFileSync(path.join(outputDir, 'gopanel_sidebar_styles.json'), JSON.stringify(styles, null, 2));
  console.log('Styles:', JSON.stringify(styles, null, 2));

  const picPath = path.join(outputDir, 'gopanel_real_sidebar.png');
  await page.screenshot({ path: picPath, fullPage: false });
  console.log('Captured GoPanel Real Sidebar:', picPath);

  await browser.close();
}

getSidebar().catch(console.error);
