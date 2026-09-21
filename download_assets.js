const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = [
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/coins-icon.png', name: 'coins-icon.png' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/arrow-up.svg', name: 'arrow-up.svg' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/arrow-down.svg', name: 'arrow-down.svg' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/aviator_bg.png', name: 'aviator_bg.png' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/aviator_text.png', name: 'aviator_text.png' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/aviator_icon.png', name: 'aviator_icon.png' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/chickenroad_bg.png', name: 'chickenroad_bg.png' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/chickenroad_text.png', name: 'chickenroad_text.png' },
  { url: 'https://ss.manage90.com/panel-wl/commonAssets/chickenroad_icon.png', name: 'chickenroad_icon.png' },
  { url: 'https://ss.gopunt.com/go-punt/banner/1776447434456_3053_fETaRWVUyWdsRGjmBJQznitbs.jpeg', name: 'sexy_banner.jpeg' },
  { url: 'https://images.casinoexch.com/game/ezugi-dragon-tiger.webp', name: 'dragon_tiger.webp' },
  { url: 'https://ss.manage63.com/south247/fawkcasino/games/aura-gaming-amar-akbar-anthony.webp', name: 'amar_akbar.webp' },
  { url: 'https://images.casinoexch.com/game/aura_teenpatti_t20.webp', name: 'teen_patti.webp' }
];

const destDir = path.join(__dirname, 'public/assets');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        console.warn(`Failed ${url} status ${res.statusCode}`);
        return resolve(false);
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Saved: ${dest}`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.warn(`Error downloading ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const a of assets) {
    const p = path.join(destDir, a.name);
    await downloadFile(a.url, p);
  }
  console.log('All downloads completed.');
}

run();
