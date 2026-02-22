const { chromium } = require('playwright');
const fs = require('fs');

async function verifyFixes() {
  console.log('🔍 Verifying Fixes...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport to trigger hydration
  });

  const page = await context.newPage();

  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('❌ Error:', msg.text().substring(0, 100));
    }
  });

  try {
    console.log('📱 Loading homepage on mobile viewport...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Check for hydration errors
    const hydrationErrors = errors.filter(e =>
      e.includes('hydration') ||
      e.includes('Text content did not match') ||
      e.includes('server-rendered HTML')
    );

    console.log('\n📊 Results:');
    console.log(`  Total Console Errors: ${errors.length}`);
    console.log(`  Hydration Errors: ${hydrationErrors.length}`);

    if (hydrationErrors.length === 0) {
      console.log('\n✅ SUCCESS: No hydration errors found!');
      console.log('✅ Footer fix is working correctly.');
    } else {
      console.log('\n⚠️  Hydration errors still present:');
      hydrationErrors.forEach((e, i) => {
        console.log(`  ${i + 1}. ${e.substring(0, 100)}...`);
      });
    }

    // Take screenshot
    await page.screenshot({ path: 'verification-screenshot.png', fullPage: true });
    console.log('\n📸 Screenshot saved: verification-screenshot.png');

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

verifyFixes().catch(console.error);
