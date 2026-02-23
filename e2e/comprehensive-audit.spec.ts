import { test, expect } from '@playwright/test';

/**
 * Comprehensive Portfolio Audit Test Suite
 * Tests all critical functionality, captures console errors, network failures, and screenshots
 */

test.describe('Portfolio Comprehensive Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Capture all console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        console.log(`[CONSOLE ERROR] ${text}`);
      } else if (type === 'warning') {
        console.log(`[CONSOLE WARNING] ${text}`);
      }
    });

    // Capture all network failures
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`[NETWORK ERROR] ${response.url()} - ${response.status()}`);
      }
    });

    page.on('requestfailed', request => {
      console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test('1. Homepage - Load and Capture', async ({ page }) => {
    console.log('\n=== TEST 1: Homepage Load ===');

    // Navigate to homepage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    // Take screenshot of full page
    await page.screenshot({
      path: 'home-page.png',
      fullPage: true
    });

    console.log('[SCREENSHOT] Saved: home-page.png');

    // Check for profile image
    const profileImage = page.locator('img[alt*="Amara"], img[src*="avatar"], img[src*="profile"], .profile-image, .avatar');
    const profileImageExists = await profileImage.count();

    if (profileImageExists > 0) {
      console.log('[PROFILE IMAGE] Found profile image element');
      const src = await profileImage.first().getAttribute('src');
      console.log(`[PROFILE IMAGE] Source: ${src}`);
    } else {
      console.log('[PROFILE IMAGE] No profile image found');
    }

    // Check for broken images
    const images = await page.locator('img').all();
    console.log(`[IMAGES] Total images on page: ${images.length}`);

    for (const img of images) {
      const src = await img.getAttribute('src');
      const naturalWidth = await img.evaluate(img => img.naturalWidth);

      if (naturalWidth === 0 && src) {
        console.log(`[BROKEN IMAGE] ${src}`);
      }
    }

    // Check page title
    const title = await page.title();
    console.log(`[PAGE TITLE] ${title}`);

    // Check meta description
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    console.log(`[META DESCRIPTION] ${metaDesc || 'Not found'}`);
  });

  test('2. Iris Chat Bot - Open and Test', async ({ page }) => {
    console.log('\n=== TEST 2: Iris Chat Bot ===');

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Look for chat button (common selectors)
    const chatButtonSelectors = [
      'button[aria-label*="chat"]',
      'button[aria-label*="Chat"]',
      'button[aria-label*="assistant"]',
      '[data-testid="chat-button"]',
      '.chat-button',
      '.iris-button',
      'button:has-text("Chat")',
      'button:has-text("IRIS")',
      'button:has-text("Ask")',
    ];

    let chatButtonFound = false;
    let chatButton = null;

    for (const selector of chatButtonSelectors) {
      try {
        chatButton = page.locator(selector).first();
        if (await chatButton.count() > 0) {
          console.log(`[CHAT BUTTON] Found with selector: ${selector}`);
          chatButtonFound = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!chatButtonFound) {
      // Try to find any button in bottom right area
      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const box = await button.boundingBox();
        if (box && box.x > 500 && box.y > 500) {
          chatButton = button;
          console.log('[CHAT BUTTON] Found button in bottom-right corner');
          chatButtonFound = true;
          break;
        }
      }
    }

    if (chatButtonFound && chatButton) {
      await chatButton.click();
      await page.waitForTimeout(1000);

      // Screenshot after opening chat
      await page.screenshot({
        path: 'iris-chat-open.png',
        fullPage: true
      });
      console.log('[SCREENSHOT] Saved: iris-chat-open.png');

      // Look for input field
      const inputSelectors = [
        'input[type="text"]',
        'textarea',
        '[contenteditable="true"]',
        '[role="textbox"]',
      ];

      let inputFound = false;
      for (const selector of inputSelectors) {
        const input = page.locator(selector).last();
        if (await input.count() > 0) {
          try {
            await input.fill('Hello Iris');
            await page.waitForTimeout(500);

            // Look for send button
            const sendButtonSelectors = [
              'button[aria-label*="send"]',
              'button[type="submit"]',
              'button:has-text("Send")',
            ];

            for (const sendSelector of sendButtonSelectors) {
              const sendBtn = page.locator(sendSelector);
              if (await sendBtn.count() > 0) {
                await sendBtn.first().click();
                inputFound = true;
                console.log('[CHAT MESSAGE] Sent: "Hello Iris"');
                break;
              }
            }

            if (inputFound) break;

            // Try pressing Enter
            await input.press('Enter');
            inputFound = true;
            console.log('[CHAT MESSAGE] Sent: "Hello Iris" (via Enter)');
            break;
          } catch (e) {
            // Continue to next selector
          }
        }
      }

      await page.waitForTimeout(2000);

      // Screenshot after sending message
      await page.screenshot({
        path: 'iris-chat-message-sent.png',
        fullPage: true
      });
      console.log('[SCREENSHOT] Saved: iris-chat-message-sent.png');

      if (!inputFound) {
        console.log('[CHAT ERROR] Could not find input field or send message');
      }
    } else {
      console.log('[CHAT ERROR] No chat button found on page');
      await page.screenshot({
        path: 'iris-chat-not-found.png',
        fullPage: true
      });
    }
  });

  test('3. Navigation - Header and Command Palette', async ({ page }) => {
    console.log('\n=== TEST 3: Navigation ===');

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Test header navigation links
    const navLinks = await page.locator('nav a, header a').all();
    console.log(`[NAVIGATION] Found ${navLinks.length} navigation links`);

    for (const link of navLinks) {
      try {
        const text = await link.textContent();
        const href = await link.getAttribute('href');

        if (text && href) {
          console.log(`[NAV LINK] ${text.trim()} -> ${href}`);
        }
      } catch (e) {
        // Skip if error
      }
    }

    // Test Work dropdown menu
    const workDropdownSelectors = [
      'button:has-text("Work")',
      '[aria-label*="Work"]',
      '.work-dropdown',
    ];

    for (const selector of workDropdownSelectors) {
      const dropdown = page.locator(selector).first();
      if (await dropdown.count() > 0) {
        try {
          await dropdown.click();
          await page.waitForTimeout(500);
          console.log('[DROPDOWN] Opened Work dropdown');
          await page.screenshot({ path: 'work-dropdown.png' });
          break;
        } catch (e) {
          // Continue
        }
      }
    }

    // Test Command Palette (Ctrl+K / Cmd+K)
    try {
      // Press Ctrl+K
      await page.keyboard.press('Control+K');
      await page.waitForTimeout(1000);

      const commandPalette = page.locator('[role="dialog"], [role="menu"], .command-palette, [data-cmdk]').first();

      if (await commandPalette.count() > 0) {
        console.log('[COMMAND PALETTE] Opened successfully with Ctrl+K');
        await page.screenshot({ path: 'command-palette-open.png' });

        // Try to type in command palette
        await page.keyboard.type('projects');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'command-palette-search.png' });

        // Close with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } else {
        console.log('[COMMAND PALETTE] Not found after Ctrl+K');
      }
    } catch (e) {
      console.log(`[COMMAND PALETTE] Error: ${e.message}`);
    }
  });

  test('4. Page Load Tests - All Pages', async ({ page }) => {
    console.log('\n=== TEST 4: Page Load Tests ===');

    const pagesToTest = [
      { path: '/projects', name: 'Projects' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/resume', name: 'Resume' },
      { path: '/research', name: 'Research' },
      { path: '/tools', name: 'Tools' },
    ];

    for (const pageInfo of pagesToTest) {
      console.log(`\n[PAGE TEST] Testing: ${pageInfo.name} (${pageInfo.path})`);

      try {
        await page.goto(`http://localhost:3000${pageInfo.path}`, {
          waitUntil: 'networkidle',
          timeout: 10000
        });

        await page.waitForTimeout(2000);

        const fileName = `${pageInfo.name.toLowerCase()}-page.png`;
        await page.screenshot({
          path: fileName,
          fullPage: true
        });

        console.log(`[SCREENSHOT] Saved: ${fileName}`);

        // Check for errors on page
        const title = await page.title();
        console.log(`[PAGE TITLE] ${title}`);

        // Check for any visible error messages
        const errorElements = await page.locator('text=/error|Error|ERROR/').all();
        if (errorElements.length > 0) {
          console.log(`[ERROR] Found ${errorElements.length} error messages on page`);
        }

      } catch (e) {
        console.log(`[ERROR] Failed to load ${pageInfo.path}: ${e.message}`);
      }
    }
  });

  test('5. Console and Network Errors Summary', async ({ page }) => {
    console.log('\n=== TEST 5: Error Summary ===');

    // Collect all console errors
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.url()} - ${response.status()}`);
      }
    });

    // Navigate through main pages
    const pages = ['/', '/projects', '/about', '/contact'];

    for (const path of pages) {
      await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
    }

    // Print summary
    console.log('\n=== ERROR SUMMARY ===');
    console.log(`\n[CRITICAL] Console Errors (${consoleErrors.length}):`);
    consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));

    console.log(`\n[WARNING] Console Warnings (${consoleWarnings.length}):`);
    consoleWarnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));

    console.log(`\n[NETWORK] Network Errors (${networkErrors.length}):`);
    networkErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));

    // Save error report
    const errorReport = `
# Portfolio Test Error Report
Generated: ${new Date().toISOString()}

## CRITICAL - Console Errors (${consoleErrors.length})
${consoleErrors.map((err, i) => `${i + 1}. ${err}`).join('\n')}

## WARNINGS - Console Warnings (${consoleWarnings.length})
${consoleWarnings.map((warn, i) => `${i + 1}. ${warn}`).join('\n')}

## NETWORK FAILURES (${networkErrors.length})
${networkErrors.map((err, i) => `${i + 1}. ${err}`).join('\n')}

## Recommendations
${consoleErrors.length > 0 || networkErrors.length > 0 ?
  'Please review the errors above and fix critical issues first.' :
  'No errors found! Great job.'}
`;

    // Write error report to file
    const fs = require('fs');
    fs.writeFileSync('test-error-report.md', errorReport);
    console.log('\n[REPORT] Saved: test-error-report.md');
  });

  test('6. Accessibility Quick Check', async ({ page }) => {
    console.log('\n=== TEST 6: Accessibility Quick Check ===');

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check for alt text on images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    console.log(`[A11Y] Images without alt text: ${imagesWithoutAlt}`);

    // Check for headings hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`[A11Y] Total headings: ${headings.length}`);

    let prevLevel = 0;
    for (const heading of headings) {
      const tag = await heading.evaluate(el => el.tagName);
      const level = parseInt(tag[1]);
      const text = await heading.textContent();

      if (level > prevLevel + 1) {
        console.log(`[A11Y WARNING] Skipped heading level: ${tag} "${text?.trim()}"`);
      }
      prevLevel = level;
    }

    // Check for ARIA labels on interactive elements
    const buttonsWithoutLabel = await page.locator('button:not([aria-label]):not([aria-labelledby])').count();
    console.log(`[A11Y] Buttons without aria-label: ${buttonsWithoutLabel}`);

    // Check for form labels
    const inputsWithoutLabel = await page.locator('input:not([aria-label]):not([aria-labelledby]):not([id])').count();
    console.log(`[A11Y] Inputs without label association: ${inputsWithoutLabel}`);
  });

  test('7. Mobile Responsiveness Check', async ({ page }) => {
    console.log('\n=== TEST 7: Mobile Responsiveness ===');

    const viewports = [
      { width: 375, height: 667, name: 'mobile-375' },
      { width: 768, height: 1024, name: 'tablet-768' },
      { width: 1280, height: 720, name: 'desktop-1280' },
    ];

    for (const viewport of viewports) {
      console.log(`[RESPONSIVE] Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: `responsive-${viewport.name}.png`,
        fullPage: true
      });

      // Check for horizontal scroll (bad)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const hasHorizontalScroll = bodyWidth > viewport.width;

      if (hasHorizontalScroll) {
        console.log(`[RESPONSIVE WARNING] Horizontal scroll detected at ${viewport.width}px`);
      }
    }
  });
});
