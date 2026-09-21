const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function inspectGoPanelDetails() {
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

    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('72023409856345709345934890987', 'true');
    });

    console.log('Navigating to https://gopanel.com/app/home...');
    await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2', timeout: 35000 });
    await new Promise(r => setTimeout(r, 6000));

    // 1. Inspect Hero Carousel Banners
    console.log('Inspecting Hero Carousel Banners...');
    const carouselData = await page.evaluate(() => {
      // Find carousel container, slides, images
      const carouselEl = document.querySelector('.carousel, [class*="carousel"], [class*="slider"], [class*="banner"], swiper-container, .swiper');
      const bannerImgs = Array.from(document.querySelectorAll('img[src*="banner"], .swiper-slide img, [class*="slide"] img, .carousel-item img')).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        parentClass: img.parentElement ? img.parentElement.className : ''
      }));

      // Also check all images inside the top hero area below wallet
      const allHeroImgs = Array.from(document.querySelectorAll('img')).filter(img => {
        const rect = img.getBoundingClientRect();
        return rect.top > 100 && rect.top < 450 && rect.width > 200;
      }).map(img => ({
        src: img.src,
        top: img.getBoundingClientRect().top,
        width: img.getBoundingClientRect().width,
        height: img.getBoundingClientRect().height
      }));

      return {
        carouselClass: carouselEl ? carouselEl.className : 'not found',
        bannerImgs,
        allHeroImgs
      };
    });
    console.log('Carousel Data:', JSON.stringify(carouselData, null, 2));

    // Capture Home screenshot for reference
    const homePic = path.join(outputDir, 'gopanel_live_home.png');
    await page.screenshot({ path: homePic, fullPage: false });

    // 2. Click Login | Signup to capture exact modal
    console.log('Clicking Login | Signup on GoPanel...');
    const loginBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button, a, div'));
      return btns.find(b => b.innerText && (b.innerText.includes('Login') || b.innerText.includes('Sign')));
    });

    if (loginBtn) {
      await loginBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      const loginPic = path.join(outputDir, 'gopanel_login_modal.png');
      await page.screenshot({ path: loginPic, fullPage: false });
      console.log('Captured GoPanel Login Modal:', loginPic);

      const loginModalData = await page.evaluate(() => {
        const modal = document.querySelector('.modal, [class*="modal"], [class*="dialog"], [role="dialog"], [class*="login"], [class*="auth"]');
        return {
          modalClass: modal ? modal.className : 'none',
          html: modal ? modal.outerHTML.slice(0, 3000) : document.body.innerHTML.slice(0, 3000),
          title: document.title,
          url: window.location.href
        };
      });
      fs.writeFileSync(path.join(outputDir, 'gopanel_login_inspect.json'), JSON.stringify(loginModalData, null, 2));

      // Close login modal if close button exists
      const closeBtn = await page.$('.modal-close, [class*="close"], [aria-label="Close"], button:has-text("×")');
      if (closeBtn) {
        await closeBtn.click();
        await new Promise(r => setTimeout(r, 1000));
      } else {
        // reload or navigate back to home
        await page.goto('https://gopanel.com/app/home', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 4000));
      }
    }

    // 3. Click Hamburger to capture exact Sidebar Menu
    console.log('Clicking Hamburger to capture GoPanel Sidebar Menu...');
    const hamburgerBtn = await page.evaluateHandle(() => {
      return document.querySelector('.menu, [class*="hamburger"], [class*="menu"], header button, .top-header button');
    });

    if (hamburgerBtn) {
      await hamburgerBtn.click();
      await new Promise(r => setTimeout(r, 2000));
      const sidebarPic = path.join(outputDir, 'gopanel_sidebar_menu.png');
      await page.screenshot({ path: sidebarPic, fullPage: false });
      console.log('Captured GoPanel Sidebar Menu:', sidebarPic);

      const sidebarData = await page.evaluate(() => {
        const drawer = document.querySelector('.sidenav, [class*="sidenav"], [class*="drawer"], [class*="sidebar"], [class*="menu-wrap"]');
        return {
          drawerClass: drawer ? drawer.className : 'none',
          html: drawer ? drawer.outerHTML.slice(0, 5000) : ''
        };
      });
      fs.writeFileSync(path.join(outputDir, 'gopanel_sidebar_inspect.json'), JSON.stringify(sidebarData, null, 2));
    }

  } catch (err) {
    console.error('Error inspecting GoPanel details:', err);
  } finally {
    await browser.close();
  }
}

inspectGoPanelDetails();
