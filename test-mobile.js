/**
 * Mobile Experience Test Script
 * Tests the portfolio at multiple viewport sizes and captures screenshots
 */

const { chromium } = require('playwright');
const path = require('path');

const viewports = [
  { width: 375, height: 667, name: 'iPhone-SE', device: 'iPhone SE (375x667)' },
  { width: 390, height: 844, name: 'iPhone-12-14', device: 'iPhone 12/13/14 (390x844)' },
  { width: 428, height: 926, name: 'iPhone-14-Pro-Max', device: 'iPhone 14 Pro Max (428x926)' },
  { width: 768, height: 1024, name: 'iPad-Portrait', device: 'iPad Portrait (768x1024)' },
  { width: 1024, height: 768, name: 'iPad-Landscape', device: 'iPad Landscape (1024x768)' },
];

const pages = [
  { url: '/', name: 'homepage' },
  { url: '/projects', name: 'projects' },
  { url: '/agents', name: 'agents' },
  { url: '/contact', name: 'contact' },
  { url: '/about', name: 'about' },
];

const screenshotDir = path.join(__dirname, '.playwright-mcp', 'mobile');

async function runTests() {
  console.log('🚀 Starting Mobile Experience Tests...\n');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    deviceScaleFactor: 2, // Retina display
  });

  const page = await context.newPage();
  const results = [];

  for (const viewport of viewports) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📱 Testing: ${viewport.device}`);
    console.log(`${'='.repeat(60)}`);

    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of pages) {
      console.log(`\n  📄 Testing page: ${route.name}`);

      try {
        const testResult = {
          viewport: viewport.device,
          width: viewport.width,
          page: route.name,
          tests: {},
          issues: [],
        };

        // Navigate to page
        await page.goto(`http://localhost:3002${route.url}`, {
          waitUntil: 'networkidle',
          timeout: 10000,
        });

        await page.waitForTimeout(1000); // Wait for animations

        // Take full page screenshot
        const screenshotPath = path.join(screenshotDir, `${viewport.name}-${route.name}.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        testResult.screenshot = screenshotPath;
        console.log(`    ✅ Screenshot saved: ${viewport.name}-${route.name}.png`);

        // Test 1: Check for hamburger menu on mobile
        if (viewport.width < 768) {
          const hamburgerButton = await page.$('button:has-text("Toggle menu")');
          const hamburgerVisible = hamburgerButton !== null;

          if (hamburgerVisible) {
            // Test hamburger functionality
            await hamburgerButton.click();
            await page.waitForTimeout(500);

            const menuScreenshotPath = path.join(
              screenshotDir,
              `${viewport.name}-${route.name}-menu-open.png`
            );
            await page.screenshot({ path: menuScreenshotPath, fullPage: false });

            // Close menu
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);

            testResult.tests.hamburgerMenu = 'PASS';
            console.log('    ✅ Hamburger menu: Working');
          } else {
            testResult.tests.hamburgerMenu = 'FAIL';
            testResult.issues.push('Hamburger menu not visible on mobile');
            console.log('    ❌ Hamburger menu: Not visible');
          }
        } else {
          testResult.tests.hamburgerMenu = 'N/A';
          console.log('    ⏭️  Hamburger menu: Not needed (desktop)');
        }

        // Test 2: Check Iris chat button
        const irisButton = await page.$('button:has-text("Chat with Iris")');
        const irisVisible = irisButton !== null;

        if (irisVisible) {
          // Check if button is in viewport
          const isVisible = await irisButton.isVisible();
          if (isVisible) {
            testResult.tests.irisButton = 'PASS';
            console.log('    ✅ Iris button: Visible and accessible');
          } else {
            testResult.tests.irisButton = 'FAIL';
            testResult.issues.push('Iris button not visible in viewport');
            console.log('    ⚠️  Iris button: Present but not visible');
          }
        } else {
          testResult.tests.irisButton = 'FAIL';
          testResult.issues.push('Iris button not found');
          console.log('    ❌ Iris button: Not found');
        }

        // Test 3: Check for horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const hasHorizontalScroll = bodyWidth > viewport.width;

        if (hasHorizontalScroll) {
          testResult.tests.horizontalScroll = 'FAIL';
          testResult.issues.push(`Horizontal scroll detected (body width: ${bodyWidth}px)`);
          console.log(`    ⚠️  Horizontal scroll: ${bodyWidth}px (exceeds ${viewport.width}px)`);
        } else {
          testResult.tests.horizontalScroll = 'PASS';
          console.log(`    ✅ Horizontal scroll: None (${bodyWidth}px)`);
        }

        // Test 4: Check touch target sizes
        const smallButtons = await page.evaluate((minSize) => {
          const buttons = document.querySelectorAll('button, a[href], input[type="submit"]');
          const small = [];

          buttons.forEach((btn) => {
            const rect = btn.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(btn);

            // Skip hidden elements
            if (rect.width === 0 || rect.height === 0) return;
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') return;

            if (rect.width < minSize || rect.height < minSize) {
              small.push({
                tag: btn.tagName,
                text: btn.textContent?.slice(0, 30).trim() || btn.getAttribute('aria-label') || 'N/A',
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              });
            }
          });

          return small;
        }, 44); // 44px minimum for iOS

        if (smallButtons.length > 0) {
          testResult.tests.touchTargets = 'WARNING';
          testResult.issues.push(`${smallButtons.length} touch targets below 44px`);
          testResult.smallTouchTargets = smallButtons.slice(0, 5); // Limit to 5 examples
          console.log(`    ⚠️  Touch targets: ${smallButtons.length} below 44px`);
          smallButtons.slice(0, 3).forEach((btn) => {
            console.log(`       - ${btn.tag} "${btn.text}": ${btn.width}x${btn.height}px`);
          });
        } else {
          testResult.tests.touchTargets = 'PASS';
          console.log('    ✅ Touch targets: All ≥44px');
        }

        // Test 5: Check text readability
        const textReadability = await page.evaluate(() => {
          const body = document.body;
          const style = window.getComputedStyle(body);
          return {
            fontSize: parseInt(style.fontSize),
            lineHeight: parseFloat(style.lineHeight),
          };
        });

        testResult.tests.textReadability = textReadability.fontSize >= 14 ? 'PASS' : 'WARNING';
        console.log(`    ${textReadability.fontSize >= 14 ? '✅' : '⚠️'} Text size: ${textReadability.fontSize}px`);

        // Test 6: Check navigation accessibility
        const navLinks = await page.$$eval('nav a, nav button', (elements) =>
          elements.map((el) => ({
            text: el.textContent?.slice(0, 30),
            visible: el.offsetParent !== null,
          }))
        );

        const visibleNavLinks = navLinks.filter((link) => link.visible);
        testResult.tests.navigation = visibleNavLinks.length > 0 ? 'PASS' : 'FAIL';
        console.log(`    ${visibleNavLinks.length > 0 ? '✅' : '❌'} Navigation: ${visibleNavLinks.length} visible links`);

        results.push(testResult);

      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        results.push({
          viewport: viewport.device,
          page: route.name,
          error: error.message,
        });
      }
    }
  }

  await browser.close();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter((r) => !r.error).length;
  const failed = results.filter((r) => r.error).length;
  const issues = results.filter((r) => r.issues && r.issues.length > 0).length;

  console.log(`\nTotal tests: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`With issues: ${issues}`);

  if (issues > 0) {
    console.log('\n⚠️  ISSUES FOUND:');
    results
      .filter((r) => r.issues && r.issues.length > 0)
      .forEach((r) => {
        console.log(`\n  ${r.viewport} - ${r.page}:`);
        r.issues.forEach((issue) => console.log(`    - ${issue}`));
      });
  }

  // Save results
  const fs = require('fs');
  const resultsPath = path.join(__dirname, '.playwright-mcp', 'mobile', 'test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 Results saved to: ${resultsPath}`);

  return results;
}

// Run tests
runTests().catch(console.error);
