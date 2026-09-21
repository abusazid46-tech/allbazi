const fs = require('fs');
const path = require('path');
const https = require('https');

const flagsDir = path.join(__dirname, 'public', 'assets', 'flags');
if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

const isoList = [
  'in', 'ae', 'gb', 'us', 'bd', 'pk', 'np', 'lk', 'ca', 'au',
  'sa', 'qa', 'om', 'kw', 'bh', 'sg', 'my', 'za', 'nz', 'ie',
  'de', 'fr', 'it', 'es', 'ru', 'br', 'ph', 'th', 'id', 'vn',
  'tr', 'ke', 'ng', 'eg'
];

async function download(iso) {
  const url = `https://flagcdn.com/w40/${iso}.png`;
  const dest = path.join(flagsDir, `${iso}.png`);
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        console.error(`Failed ${iso}: ${res.statusCode}`);
        resolve();
      }
    }).on('error', (err) => {
      console.error(`Error ${iso}:`, err.message);
      resolve();
    });
  });
}

async function main() {
  console.log(`Downloading ${isoList.length} country flags...`);
  for (const iso of isoList) {
    await download(iso);
  }
  console.log('All flags downloaded successfully to public/assets/flags/');
}

main();
