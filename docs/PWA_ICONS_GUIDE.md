# PWA Icons Generation Guide

## Required Icon Sizes

The PWA requires icons in the following sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Option 1: Use Online Tool (Recommended)

1. Go to [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload the `public/icons/icon.svg` file
3. Download the generated icons
4. Place them in the `public/icons/` directory

## Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Navigate to public/icons directory
cd public/icons

# Generate all sizes from SVG
magick icon.svg -resize 72x72 icon-72x72.png
magick icon.svg -resize 96x96 icon-96x96.png
magick icon.svg -resize 128x128 icon-128x128.png
magick icon.svg -resize 144x144 icon-144x144.png
magick icon.svg -resize 152x152 icon-152x152.png
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 384x384 icon-384x384.png
magick icon.svg -resize 512x512 icon-512x512.png
```

## Option 3: Use Node.js Script

Install sharp:
```bash
npm install --save-dev sharp
```

Create a script `scripts/generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error);
```

Run:
```bash
node scripts/generate-icons.js
```

## Favicon

Also create a favicon.ico:
```bash
magick icon.svg -resize 32x32 favicon.ico
```

Place it in the `public/` directory.

## Apple Touch Icon

For iOS devices:
```bash
magick icon.svg -resize 180x180 apple-touch-icon.png
```

Place it in the `public/` directory.

## Verification

After generating icons, verify they exist:
- public/icons/icon-72x72.png
- public/icons/icon-96x96.png
- public/icons/icon-128x128.png
- public/icons/icon-144x144.png
- public/icons/icon-152x152.png
- public/icons/icon-192x192.png
- public/icons/icon-384x384.png
- public/icons/icon-512x512.png
- public/favicon.ico
- public/apple-touch-icon.png

## Testing PWA

1. Build the app: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools > Application > Manifest
4. Verify all icons are loaded correctly
5. Test "Install App" prompt
