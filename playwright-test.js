const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 } // Mobile viewport
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    console.log('Waiting for page to load...');
    await page.waitForTimeout(3000);

    // Take screenshot of homepage
    await page.screenshot({ path: '.playwright-mcp/glassmorphism-mobile-01-homepage.png', fullPage: true });
    console.log('Screenshot saved: glassmorphism-mobile-01-homepage.png');

    // Find and click Iris button
    console.log('Looking for Iris button...');
    const irisButton = await page.locator('button').filter({ hasText: 'Chat with Iris' }).first();
    
    if (await irisButton.isVisible()) {
      console.log('Found Iris button, clicking...');
      await irisButton.click();
      
      // Wait for chat panel to open
      await page.waitForTimeout(1500);
      
      // Take screenshot of open chat
      await page.screenshot({ path: '.playwright-mcp/glassmorphism-mobile-02-chat-open.png', fullPage: true });
      console.log('Screenshot saved: glassmorphism-mobile-02-chat-open.png');

      // Check glassmorphism styles
      const chatPanel = page.locator('.fixed.z-\[10001\]').first();
      
      if (await chatPanel.isVisible()) {
        console.log('Chat panel found!');
        
        const backdropBlur = await chatPanel.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backdropFilter: styles.backdropFilter,
            webkitBackdropFilter: styles.webkitBackdropFilter,
            background: styles.background,
            border: styles.border,
            zIndex: styles.zIndex,
            width: styles.width,
            maxWidth: styles.maxWidth
          };
        });

        console.log('Glassmorphism styles:', JSON.stringify(backdropBlur, null, 2));

        // Check viewport
        const viewport = page.viewportSize();
        console.log('Viewport size:', viewport);

        // Check for overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const clientWidth = await page.evaluate(() => document.body.clientWidth);
        console.log('Body scrollWidth:', bodyWidth);
        console.log('Body clientWidth:', clientWidth);
        console.log('Has overflow:', bodyWidth > clientWidth);
      } else {
        console.log('Chat panel not found!');
      }
    } else {
      console.log('Iris button not visible!');
    }

    // Test desktop viewport
    console.log('\nTesting desktop viewport...');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: '.playwright-mcp/glassmorphism-desktop-01-homepage.png', fullPage: true });
    console.log('Screenshot saved: glassmorphism-desktop-01-homepage.png');

    // Click Iris button again if visible
    const irisButtonDesktop = await page.locator('button').filter({ hasText: 'Chat with Iris' }).first();
    if (await irisButtonDesktop.isVisible()) {
      await irisButtonDesktop.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: '.playwright-mcp/glassmorphism-desktop-02-chat-open.png', fullPage: true });
      console.log('Screenshot saved: glassmorphism-desktop-02-chat-open.png');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
