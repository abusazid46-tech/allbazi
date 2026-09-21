const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function getLoginModal() {
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

  // Click Login | Signup button directly by selector
  console.log('Finding and clicking Login | Signup button...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, .btn'));
    const loginBtn = btns.find(b => b.innerText && b.innerText.trim() === 'Login | Signup');
    if (loginBtn) {
      loginBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked via JS evaluate:', clicked);

  await new Promise(r => setTimeout(r, 3000));

  const picPath = path.join(outputDir, 'gopanel_real_login.png');
  await page.screenshot({ path: picPath, fullPage: false });
  console.log('Saved:', picPath);

  // Extract dialog / modal DOM
  const modalData = await page.evaluate(() => {
    const dialogs = Array.from(document.querySelectorAll('mat-dialog-container, .cdk-overlay-pane, [role="dialog"], .login-modal, app-login'));
    return dialogs.map(d => ({
      tag: d.tagName,
      className: d.className,
      html: d.outerHTML
    }));
  });

  fs.writeFileSync(path.join(outputDir, 'gopanel_real_login_dom.json'), JSON.stringify(modalData, null, 2));
  console.log('Saved dialog data count:', modalData.length);

  // Also let's click the hamburger button via its exact class
  console.log('Closing dialog and clicking hamburger...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 1000));

  const hamClicked = await page.evaluate(() => {
    const ham = document.querySelector('mat-icon[fonticon="menu"], .logo mat-icon, mat-icon[data-mat-icon-name="menu"]');
    if (ham) {
      ham.click();
      // or click parent
      if (ham.parentElement) ham.parentElement.click();
      return true;
    }
    return false;
  });
  console.log('Hamburger clicked:', hamClicked);
  await new Promise(r => setTimeout(r, 2000));

  const sidePic = path.join(outputDir, 'gopanel_real_sidebar.png');
  await page.screenshot({ path: sidePic, fullPage: false });
  console.log('Saved:', sidePic);

  await browser.close();
}

getLoginModal().catch(console.error);
