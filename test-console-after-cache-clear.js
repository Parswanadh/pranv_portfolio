const { chromium } = require('playwright');

(async () => {
  console.log('=== Testing Console Errors After Cache Clear ===\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.toString());
  });

  // Capture failed network requests
  page.on('response', response => {
    if (response.status() === 404) {
      errors.push(`404: ${response.url()}`);
    }
  });

  try {
    // Test homepage
    console.log('Testing homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Test multiple pages
    const pages = [
      'http://localhost:3000/about',
      'http://localhost:3000/projects',
      'http://localhost:3000/contact',
      'http://localhost:3000/resume',
      'http://localhost:3000/tools',
      'http://localhost:3000/agents'
    ];

    for (const url of pages) {
      console.log(`Testing ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }

    // Report results
    console.log('\n=== RESULTS ===');
    console.log(`Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errors found:');
      errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more`);
      }
    }

    console.log(`\nConsole Warnings: ${warnings.length}`);
    if (warnings.length > 0) {
      console.log('Warnings found:');
      warnings.slice(0, 10).forEach(warn => console.log(`  - ${warn}`));
    }

    if (errors.length === 0) {
      console.log('\n✓ No console errors found!');
    } else {
      console.log('\n✗ Console errors still present');
    }

    // Save detailed report
    const fs = require('fs');
    const reportPath = 'D:\\projects\\portfolio\\console-test-after-cache-clear.json';
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      errors,
      warnings,
      errorCount: errors.length,
      warningCount: warnings.length
    }, null, 2));
    console.log(`\nDetailed report saved to: ${reportPath}`);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }

  console.log('\n=== Test Complete ===');
})();
