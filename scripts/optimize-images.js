const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const fs = require('fs')
const path = require('path')

const sourceDir = path.join(__dirname, '../public')
const optimizedDir = path.join(sourceDir, 'optimized')

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true })
}

const optimizeImages = async () => {
  console.log('🎨 Starting image optimization...')

  // Process JPEG files
  const jpegFiles = await imagemin(['public/*.jpg', 'public/*.jpeg'], {
    destination: 'public/optimized',
    plugins: [
      imageminJpegtran({
        quality: 85,
        progressive: true,
        max: 1000,
      }),
    ],
  })

  // Convert JPEGs to WebP
  const jpegToWebp = await imagemin(['public/*.jpg', 'public/*.jpeg'], {
    destination: 'public/optimized',
    plugins: [
      imageminWebp({
        quality: 85,
        preset: 'photo',
        alphaQuality: 80,
      }),
    ],
  })

  // Process PNG files
  const pngFiles = await imagemin(['public/*.png'], {
    destination: 'public/optimized',
    plugins: [
      imageminPngquant({
        quality: [0.65, 0.8],
        speed: 4,
      }),
    ],
  })

  // Convert PNGs to WebP
  const pngToWebp = await imagemin(['public/*.png'], {
    destination: 'public/optimized',
    plugins: [
      imageminWebp({
        quality: 85,
        preset: 'photo',
        alphaQuality: 85,
      }),
    ],
  })

  // Copy SVG files (no optimization needed)
  const svgFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.svg'))
  svgFiles.forEach(svg => {
    fs.copyFileSync(path.join(sourceDir, svg), path.join(optimizedDir, svg))
  })

  console.log('✅ Image optimization complete!')
  console.log(`📊 Optimized images saved to: ${optimizedDir}`)

  // Print size comparison
  const originalSize = fs.readdirSync(sourceDir)
    .filter(file => /\.(jpg|jpeg|png|svg)$/.test(file))
    .reduce((total, file) => {
      return total + fs.statSync(path.join(sourceDir, file)).size
    }, 0)

  const optimizedSize = fs.readdirSync(optimizedDir)
    .filter(file => /\.(jpg|jpeg|png|svg|webp)$/.test(file))
    .reduce((total, file) => {
      return total + fs.statSync(path.join(optimizedDir, file)).size
    }, 0)

  const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2)

  console.log(`📈 Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`📉 Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`💰 Savings: ${savings}%`)
}

optimizeImages().catch(console.error)