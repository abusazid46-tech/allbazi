const https = require('https');
const fs = require('fs');
const path = require('path');

const banners = [
  { url: 'https://ss.gopunt.com/go-punt/banner/1776447434456_3053_fETaRWVUyWdsRGjmBJQznitbs.jpeg', name: 'hero_banner_1.jpeg' },
  { url: 'https://ss.gopunt.com/go-punt/banner/1775751689263_3295_qppCmEpjUHXHDvmnxsgfYUfQr.jpeg', name: 'hero_banner_2.jpeg' },
  { url: 'https://ss.gopunt.com/go-punt/banner/1776671959350_8225_bkxJEHvpBYAHDJMxDSahbWKGB.jpeg', name: 'hero_banner_3.jpeg' },
  { url: 'https://ss.gopunt.com/go-punt/banner/1783420367285_4035_UTmGCFYUsMwUwxJdFkmtgMpQA.jpeg', name: 'hero_banner_4.jpeg' }
];

const destDir = path.join(__dirname, 'public/assets');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        console.warn(`Failed ${url} status ${res.statusCode}`);
        return resolve(false);
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        console.log('Saved:', dest);
        resolve(true);
      });
    }).on('error', err => {
      console.warn('Error:', err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const b of banners) {
    await downloadFile(b.url, path.join(destDir, b.name));
  }
  console.log('Downloaded all 4 hero banners!');
}

run();
