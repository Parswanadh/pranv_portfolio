/**
 * Performance Check Script
 *
 * This script analyzes the current image setup and provides optimization recommendations.
 */

const fs = require('fs');
const path = require('path');

const analyzeImages = () => {
  const publicDir = path.join(__dirname, '../public');
  const images = [];

  // Scan for image files
  const files = fs.readdirSync(publicDir);
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
      const filePath = path.join(publicDir, file);
      const stats = fs.statSync(filePath);

      images.push({
        name: file,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        format: ext.slice(1),
        path: filePath,
        optimized: file.endsWith('.webp') || file.endsWith('.svg'),
      });
    }
  });

  console.log('📊 Image Asset Analysis');
  console.log('='.repeat(50));

  // Print image details
  images.forEach(img => {
    const status = img.optimized ? '✅ OPTIMIZED' : '⚠️ NEEDS OPTIMIZATION';
    console.log(`${status} ${img.name} - ${img.sizeFormatted}`);
  });

  // Calculate totals
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const optimizedSize = images.filter(img => img.optimized).reduce((sum, img) => sum + img.size, 0);
  const savings = ((totalSize - optimizedSize) / totalSize * 100).toFixed(2);

  console.log('\n📈 Summary');
  console.log('-'.repeat(30));
  console.log(`Total Images: ${images.length}`);
  console.log(`Total Size: ${formatFileSize(totalSize)}`);
  console.log(`Optimized Size: ${formatFileSize(optimizedSize)}`);
  console.log(`Potential Savings: ${savings}%`);

  // Check code usage
  checkCodeUsage();
};

const checkCodeUsage = () => {
  const appDir = path.join(__dirname, '../app');
  const componentsDir = path.join(__dirname, '../components');

  const searchDirs = [appDir, componentsDir];
  let imageImports = [];

  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: true });
      files.filter(file =>
        (file.endsWith('.tsx') || file.endsWith('.jsx')) &&
        !file.includes('node_modules')
      ).forEach(file => {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Find image imports and usage
        const matches = content.match(/Image.*from.*next\/image/g);
        const srcMatches = content.match(/src=.*\.(jpe?g|png)/g);

        if (matches || srcMatches) {
          imageImports.push({
            file: path.basename(file),
            hasImageImport: !!matches,
            hasImageSrc: !!srcMatches,
          });
        }
      });
    }
  });

  console.log('\n🔍 Code Usage Analysis');
  console.log('-'.repeat(30));
  console.log(`Files using next/image: ${imageImports.filter(i => i.hasImageImport).length}`);
  console.log(`Files with image src: ${imageImports.filter(i => i.hasImageSrc).length}`);

  imageImports.forEach(imp => {
    if (imp.hasImageImport || imp.hasImageSrc) {
      console.log(`  - ${imp.file}`);
    }
  });
};

const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Run analysis
analyzeImages();