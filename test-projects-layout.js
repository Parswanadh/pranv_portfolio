const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to projects page
  await page.goto('http://localhost:3000/projects');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Wait for animations

  // Test different viewport sizes
  const viewports = [
    { name: 'mobile-portrait', width: 375, height: 667 },
    { name: 'mobile-landscape', width: 667, height: 375 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'tablet-landscape', width: 1024, height: 768 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'large-desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `.playwright-mcp/projects-${viewport.name}.png`,
      fullPage: true
    });
    console.log(`Screenshot taken: projects-${viewport.name}.png`);
  }

  await browser.close();
  console.log('All screenshots completed!');
})();
