/**
 * Script para generar iconos PWA en todos los tamaños necesarios
 * 
 * Uso:
 * 1. npm install --save-dev sharp
 * 2. node scripts/generate-icons.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('🎨 Generando iconos PWA...\n');

  // Verificar que el SVG existe
  if (!fs.existsSync(inputSvg)) {
    console.error('❌ Error: No se encontró icon.svg en public/icons/');
    process.exit(1);
  }

  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generar cada tamaño
  for (const size of sizes) {
    try {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputSvg)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 13, g: 10, b: 29, alpha: 1 } // #0d0a1d
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n🎉 ¡Iconos generados exitosamente!');
  console.log('\nPróximos pasos:');
  console.log('1. npm run build');
  console.log('2. firebase deploy --only hosting');
}

generateIcons().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
