const fs = require('fs')
const path = require('path')

const updateImageReferences = () => {
  const directories = ['app', 'components']

  directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir)

    // Read all .tsx and .jsx files
    const files = fs.readdirSync(dirPath).filter(file =>
      file.endsWith('.tsx') || file.endsWith('.jsx')
    )

    files.forEach(file => {
      const filePath = path.join(dirPath, file)
      let content = fs.readFileSync(filePath, 'utf8')

      // Update image references to use WebP
      content = content.replace(
        /src="\/([^"]+\.(jpe?g|png))"/g,
        (match, imageName) => {
          // Convert image name to WebP
          const webpName = imageName.replace(/\.(jpe?g|png)$/, '.webp')

          // Generate responsive sizes
          const sizes = `sizes="(max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, 2048px"`

          return `src="/${webpName}"\n                              ${sizes}`
        }
      )

      // Update next/image src to use WebP
      content = content.replace(
        /src=\{["']([^"']+\.(jpe?g|png))["']\}/g,
        (match, imageName) => {
          const webpName = imageName.replace(/\.(jpe?g|png)$/, '.webp')

          return `src={"/${webpName}"}`
        }
      )

      // Update alt text if needed
      content = content.replace(
        /alt="([^"]*)"/g,
        (match, altText) => `alt="${altText}"`
      )

      // Write back to file if changed
      if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content)
        console.log(`✅ Updated ${filePath}`)
      }
    })
  })

  console.log('🎨 Image reference updates complete!')
}

updateImageReferences()