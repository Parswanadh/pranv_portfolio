#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// Run tests with coverage
console.log('Running tests with coverage...')
console.log('=================================')

const testProcess = spawn('npx', ['vitest', 'run', '--coverage'], {
  stdio: 'inherit',
  cwd: __dirname
})

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!')

    // Read coverage report
    const coverageDir = path.join(__dirname, 'coverage')
    const { existsSync, readFileSync } = require('fs')
    const { join } = require('path')

    if (existsSync(coverageDir)) {
      console.log('\n📊 Coverage Report Summary:')
      console.log('============================')

      try {
        // Try to read the coverage summary
        const indexHtml = readFileSync(join(coverageDir, 'index.html'), 'utf8')
        const match = indexHtml.match(/Total\s+[\d.]+\s+([\d.]+)%/)
        if (match) {
          const coverage = parseFloat(match[1])
          console.log(`🎯 Total Coverage: ${coverage.toFixed(2)}%`)

          if (coverage >= 60) {
            console.log('✅ Coverage target (60%) achieved!')
          } else {
            console.log('❌ Coverage target not met. Keep testing!')
          }
        }
      } catch (error) {
        console.log('Could not read coverage summary from HTML file')
      }

      // List test files
      console.log('\n📁 Test Files Created:')
      const { readdirSync, statSync } = require('fs')
      const testDirs = ['src/test/api', 'src/test/lib', 'src/test/components', 'src/test/hooks']

      testDirs.forEach(dir => {
        const fullPath = path.join(__dirname, dir)
        if (existsSync(fullPath)) {
          const files = readdirSync(fullPath).filter(f => f.endsWith('.test.ts') || f.endsWith('.test.tsx'))
          if (files.length > 0) {
            console.log(`  ${dir}/: ${files.join(', ')}`)
          }
        }
      })

    } else {
      console.log('\n❌ Coverage directory not found')
    }
  } else {
    console.log(`\n❌ Tests failed with exit code: ${code}`)
  }
})

testProcess.on('error', (error) => {
  console.error('Error running tests:', error)
  process.exit(1)
})