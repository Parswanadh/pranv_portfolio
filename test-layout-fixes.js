const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const screenshotDir = `.playwright-mcp/layout-fix-${timestamp}`;

  // Create directory for this test run
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`\n📸 Capturing layout screenshots to: ${screenshotDir}\n`);

  // Test scenarios
  const scenarios = [
    {
      name: '01-projects-desktop',
      url: 'http://localhost:3000/projects',
      viewport: { width: 1920, height: 1080 },
      fullPage: true,
      description: 'Desktop view (1920x1080)'
    },
    {
      name: '02-projects-laptop',
      url: 'http://localhost:3000/projects',
      viewport: { width: 1280, height: 720 },
      fullPage: true,
      description: 'Laptop view (1280x720)'
    },
    {
      name: '03-projects-tablet-portrait',
      url: 'http://localhost:3000/projects',
      viewport: { width: 768, height: 1024 },
      fullPage: true,
      description: 'Tablet portrait (768x1024)'
    },
    {
      name: '04-projects-tablet-landscape',
      url: 'http://localhost:3000/projects',
      viewport: { width: 1024, height: 768 },
      fullPage: true,
      description: 'Tablet landscape (1024x768)'
    },
    {
      name: '05-projects-mobile-portrait',
      url: 'http://localhost:3000/projects',
      viewport: { width: 375, height: 667 },
      fullPage: true,
      description: 'Mobile portrait (375x667)'
    },
    {
      name: '06-projects-mobile-landscape',
      url: 'http://localhost:3000/projects',
      viewport: { width: 667, height: 375 },
      fullPage: true,
      description: 'Mobile landscape (667x375)'
    },
    {
      name: '07-projects-small-mobile',
      url: 'http://localhost:3000/projects',
      viewport: { width: 320, height: 568 },
      fullPage: true,
      description: 'Small mobile (320x568)'
    }
  ];

  const results = [];

  for (const scenario of scenarios) {
    try {
      console.log(`  Testing: ${scenario.description}`);

      await page.setViewportSize(scenario.viewport);
      await page.goto(scenario.url, { waitUntil: 'networkidle' });

      // Wait for animations to complete
      await page.waitForTimeout(1000);

      const filePath = path.join(screenshotDir, `${scenario.name}.png`);
      await page.screenshot({
        path: filePath,
        fullPage: scenario.fullPage
      });

      results.push({
        scenario: scenario.name,
        status: '✓ success',
        path: filePath
      });

      console.log(`    ✓ Saved: ${scenario.name}.png`);
    } catch (error) {
      results.push({
        scenario: scenario.name,
        status: '✗ failed',
        error: error.message
      });
      console.log(`    ✗ Failed: ${error.message}`);
    }
  }

  await browser.close();

  // Generate summary
  console.log('\n📊 Layout Test Summary:');
  console.log('━'.repeat(60));
  results.forEach(result => {
    console.log(`  ${result.status}: ${result.scenario}`);
    if (result.path) {
      console.log(`    → ${result.path}`);
    }
  });

  const successCount = results.filter(r => r.status === '✓ success').length;
  console.log('\n' + '━'.repeat(60));
  console.log(`Total: ${successCount}/${results.length} tests passed`);
  console.log(`Screenshots saved to: ${screenshotDir}\n`);
}

captureScreenshots().catch(console.error);
