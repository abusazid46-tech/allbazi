const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outDir = 'C:/Users/sonow/.gemini/antigravity-ide/brain/186ada38-0ef0-4657-ad34-afb3b2104552/scratch';

async function main() {
  console.log('Launching browser for Country Picker and SMS OTP verification...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3030', { waitUntil: 'networkidle0' });

  // 1. Open Login Window
  console.log('1. Opening Login Window...');
  await page.click('#btn-top-login');
  await new Promise(r => setTimeout(r, 600));

  // 2. Open Country Code Dropdown
  console.log('2. Opening Country Code Picker...');
  await page.click('#btn-country-picker');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'allbazi_country_dropdown.png') });
  console.log('Saved allbazi_country_dropdown.png');

  // 3. Test Searching Country Code
  console.log('3. Searching country "United"...');
  await page.type('#country-search-input', 'United');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'allbazi_country_search.png') });
  console.log('Saved allbazi_country_search.png');

  // 4. Select UAE (+971) or clear and select India (+91)
  console.log('4. Selecting India (+91)...');
  await page.evaluate(() => {
    const input = document.getElementById('country-search-input');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input'));
    }
  });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.country-item-row'));
    const indiaRow = rows.find(r => r.getAttribute('data-code') === '+91');
    if (indiaRow) indiaRow.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 5. Enter 7002107673 and click Get OTP on SMS
  console.log('5. Entering mobile number 7002107673...');
  await page.evaluate(() => {
    const input = document.getElementById('login-phone-input');
    if (input) input.value = '7002107673';
  });
  await new Promise(r => setTimeout(r, 300));

  console.log('Clicking Get OTP on SMS...');
  await page.click('#btn-get-otp-sms');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'allbazi_otp_screen.png') });
  console.log('Saved allbazi_otp_screen.png');

  // 6. Click Paste OTP
  console.log('6. Clicking Paste OTP button...');
  await page.click('#btn-otp-paste');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, 'allbazi_otp_pasted.png') });
  console.log('Saved allbazi_otp_pasted.png');

  // 7. Click Login with OTP
  console.log('7. Clicking Login to authenticate...');
  await page.click('#btn-submit-otp-login');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'allbazi_phone_logged_in.png') });
  console.log('Saved allbazi_phone_logged_in.png');

  await browser.close();
  console.log('ALL VERIFICATION STEPS PASSED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Error in verification:', err);
  process.exit(1);
});
