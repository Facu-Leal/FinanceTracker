// Regenerates the PWA icons as a solid brand-blue square with a bold white "$".
// Uses sharp (temporary devDependency — install with `npm install -D sharp` before running,
// it's not needed at runtime) to rasterize an SVG, which renders far cleaner than hand-drawn
// pixel art. Replace public/icons/*.png with real branded artwork whenever design work happens.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BG = '#0d6efd';
const FG = '#ffffff';

function svgIcon(size, glyphScale) {
  const fontSize = Math.round(size * glyphScale);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <text x="50%" y="52%" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700"
        fill="${FG}" text-anchor="middle" dominant-baseline="central">$</text>
</svg>`;
}

const targets = [
  { size: 192, name: 'icon-192.png', glyphScale: 0.56 },
  { size: 512, name: 'icon-512.png', glyphScale: 0.56 },
  { size: 512, name: 'maskable-icon-512.png', glyphScale: 0.4 }, // smaller: stays inside the maskable safe zone
  { size: 180, name: 'apple-touch-icon.png', glyphScale: 0.56 },
];

(async () => {
  for (const { size, name, glyphScale } of targets) {
    const svg = svgIcon(size, glyphScale);
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_DIR, name));
    console.log(`Generated ${name} (${size}x${size})`);
  }
})();
