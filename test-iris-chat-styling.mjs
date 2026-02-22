/**
 * Comprehensive Iris Chat Panel Styling Test
 * Tests the chat panel across different browsers and analyzes computed styles
 */

const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '.playwright-mcp', 'iris-chat-styling-test');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * Test the Iris chat panel on a specific browser
 */
async function testIrisChat(browserType, browserName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing Iris Chat Panel on ${browserName}`);
  console.log(`${'='.repeat(60)}`);

  const browser = await browserType.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Listen for console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log(`1. Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for animations

    console.log('2. Taking initial screenshot (chat closed)...');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${browserName}-chat-closed.png`),
      fullPage: false
    });

    console.log('3. Opening Iris chat panel...');
    // Click the floating chat button
    const chatButton = page.locator('button[aria-label="Chat with Iris"]').first();
    await chatButton.click();
    await page.waitForTimeout(1000); // Wait for panel animation

    console.log('4. Taking screenshot (chat open)...');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${browserName}-chat-open.png`),
      fullPage: false
    });

    console.log('5. Analyzing chat panel computed styles...');

    // Get the chat panel element
    const chatPanel = page.locator('.fixed.bottom-4.right-4').first();

    // Extract computed styles
    const panelStyles = await chatPanel.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor,
        borderWidth: computed.borderWidth,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
        opacity: computed.opacity,
        display: computed.display,
        position: computed.position,
        zIndex: computed.zIndex,
        width: computed.width,
        height: computed.height,
      };
    });

    console.log('\n   Chat Panel Computed Styles:');
    console.log('   ' + '-'.repeat(50));
    Object.entries(panelStyles).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Check header styles
    console.log('\n6. Analyzing header styles...');
    const headerElement = page.locator('.fixed.bottom-4.right-4 .flex.items-center.justify-between').first();
    const headerStyles = await headerElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        borderBottomColor: computed.borderBottomColor,
        borderBottomWidth: computed.borderBottomWidth,
        borderBottomStyle: computed.borderBottomStyle,
      };
    });

    console.log('\n   Header Computed Styles:');
    console.log('   ' + '-'.repeat(50));
    Object.entries(headerStyles).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Check message area styles
    console.log('\n7. Analyzing message area styles...');
    const messagesElement = page.locator('.fixed.bottom-4.right-4 .overflow-y-auto').first();
    const messagesStyles = await messagesElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    console.log('\n   Messages Area Computed Styles:');
    console.log('   ' + '-'.repeat(50));
    Object.entries(messagesStyles).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Check input area styles
    console.log('\n8. Analyzing input area styles...');
    const inputElement = page.locator('.fixed.bottom-4.right-4 input[type="text"]').first();
    const inputStyles = await inputElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        placeholderColor: computed.placeholderColor,
        borderColor: computed.borderColor,
      };
    });

    console.log('\n   Input Field Computed Styles:');
    console.log('   ' + '-'.repeat(50));
    Object.entries(inputStyles).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Check user message styles
    console.log('\n9. Analyzing user message styles...');
    const userMessageElement = page.locator('.fixed.bottom-4.right-4 .justify-end').first();
    if (await userMessageElement.count() > 0) {
      const userMessageStyles = await userMessageElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
        };
      });

      console.log('\n   User Message Computed Styles:');
      console.log('   ' + '-'.repeat(50));
      Object.entries(userMessageStyles).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }

    // Check assistant message styles
    console.log('\n10. Analyzing assistant message styles...');
    const assistantMessageElement = page.locator('.fixed.bottom-4.right-4 .justify-start').first();
    if (await assistantMessageElement.count() > 0) {
      const assistantMessageStyles = await assistantMessageElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
        };
      });

      console.log('\n   Assistant Message Computed Styles:');
      console.log('   ' + '-'.repeat(50));
      Object.entries(assistantMessageStyles).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }

    // Check onboarding section styles
    console.log('\n11. Analyzing onboarding section styles...');
    const onboardingElement = page.locator('.fixed.bottom-4.right-4 .bg-bg-elevated').first();
    if (await onboardingElement.count() > 0) {
      const onboardingStyles = await onboardingElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          borderColor: computed.borderColor,
        };
      });

      console.log('\n   Onboarding Card Computed Styles:');
      console.log('   ' + '-'.repeat(50));
      Object.entries(onboardingStyles).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }

    // Take a close-up screenshot of just the chat panel
    console.log('\n12. Taking close-up screenshot of chat panel...');
    const chatPanelBox = await chatPanel.boundingBox();
    if (chatPanelBox) {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${browserName}-chat-closeup.png`),
        clip: {
          x: chatPanelBox.x,
          y: chatPanelBox.y,
          width: chatPanelBox.width,
          height: chatPanelBox.height
        }
      });
    }

    // Check for CSS classes
    console.log('\n13. Analyzing CSS classes on chat panel...');
    const classNames = await chatPanel.getAttribute('class');
    console.log(`   Classes: ${classNames}`);

    // Check root CSS variables
    console.log('\n14. Checking CSS variables...');
    const rootVariables = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        bgPrimary: getComputedStyle(root).getPropertyValue('--color-bg-primary').trim(),
        bgSecondary: getComputedStyle(root).getPropertyValue('--color-bg-secondary').trim(),
        bgElevated: getComputedStyle(root).getPropertyValue('--color-bg-elevated').trim(),
        textPrimary: getComputedStyle(root).getPropertyValue('--color-text-primary').trim(),
        textSecondary: getComputedStyle(root).getPropertyValue('--color-text-secondary').trim(),
      };
    });

    console.log('\n   Root CSS Variables:');
    console.log('   ' + '-'.repeat(50));
    Object.entries(rootVariables).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Console errors
    if (consoleErrors.length > 0) {
      console.log('\n⚠️  Console Errors Found:');
      consoleErrors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('\n✓ No console errors');
    }

    return {
      success: true,
      panelStyles,
      headerStyles,
      messagesStyles,
      inputStyles,
      onboardingStyles,
      rootVariables,
      consoleErrors
    };

  } catch (error) {
    console.error(`\n❌ Error testing on ${browserName}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}

/**
 * Generate a comprehensive report
 */
function generateReport(results) {
  const reportPath = path.join(SCREENSHOT_DIR, 'STYLING_TEST_REPORT.md');

  let report = '# Iris Chat Panel Styling Test Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += '## Overview\n\n';
  report += 'This report documents the computed styles and visual appearance of the Iris chat panel across multiple browsers.\n\n';

  Object.entries(results).forEach(([browserName, result]) => {
    if (!result.success) {
      report += `## ${browserName} - FAILED\n\n`;
      report += `Error: ${result.error}\n\n`;
      return;
    }

    report += `## ${browserName} Results\n\n`;

    report += '### Chat Panel Styles\n\n';
    report += '```json\n' + JSON.stringify(result.panelStyles, null, 2) + '\n```\n\n';

    report += '### Header Styles\n\n';
    report += '```json\n' + JSON.stringify(result.headerStyles, null, 2) + '\n```\n\n';

    report += '### Input Styles\n\n';
    report += '```json\n' + JSON.stringify(result.inputStyles, null, 2) + '\n```\n\n';

    if (result.consoleErrors.length > 0) {
      report += '### Console Errors\n\n';
      result.consoleErrors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += '\n';
    }
  });

  report += '## Root Cause Analysis\n\n';

  // Compare results across browsers
  const browsers = Object.keys(results).filter(k => results[k].success);

  if (browsers.length > 0) {
    const firstBrowser = browsers[0];
    const referenceBg = results[firstBrowser].panelStyles.backgroundColor;

    report += `### Background Color Analysis\n\n`;
    report += `Reference (${firstBrowser}): ${referenceBg}\n\n`;

    browsers.forEach(browser => {
      const bg = results[browser].panelStyles.backgroundColor;
      const match = bg === referenceBg;
      report += `- ${browser}: ${bg} ${match ? '✓' : '⚠️ MISMATCH'}\n`;
    });

    report += '\n';

    // Check if background is white/light
    const rgbMatch = referenceBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    let isLight = false;

    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      isLight = brightness > 128;

      report += `### Brightness Analysis\n\n`;
      report += `- RGB: ${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}\n`;
      report += `- Brightness: ${brightness.toFixed(2)}\n`;
      report += `- Classification: ${isLight ? '⚠️ LIGHT (White/Light Gray)' : '✓ DARK (Dark Theme)'}\n\n`;
    }

    report += `### Expected vs Actual\n\n`;
    report += `**Expected:** Dark theme with background color #0a0a0a (rgb(10, 10, 10))\n\n`;
    report += `**Actual:** ${referenceBg}\n\n`;

    if (isLight) {
      report += `### ISSUE IDENTIFIED\n\n`;
      report += `⚠️ The chat panel appears to be using a LIGHT background color instead of the expected dark theme.\n\n`;
      report += `### Recommended Fix\n\n`;
      report += `The issue is likely in the CSS classes or Tailwind configuration. The chat panel should use:\n`;
      report += `- \`bg-bg-primary\` class for the main panel\n`;
      report += `- \`bg-bg-secondary\` for secondary areas\n`;
      report += `- \`bg-bg-elevated\` for elevated cards\n\n`;
      report += `Current CSS variables defined:\n`;
      report += `--color-bg-primary: #0a0a0a\n`;
      report += `--color-bg-secondary: #141414\n`;
      report += `--color-bg-elevated: #242424\n\n`;
    } else {
      report += `### Status: ✓ PASSING\n\n`;
      report += `The chat panel is using the correct dark theme colors.\n\n`;
    }
  }

  report += '## Screenshots\n\n';
  report += 'The following screenshots were captured:\n\n';
  Object.keys(results).forEach(browser => {
    report += `- ${browser} - Chat Closed: \`${browser}-chat-closed.png\`\n`;
    report += `- ${browser} - Chat Open: \`${browser}-chat-open.png\`\n`;
    report += `- ${browser} - Close-up: \`${browser}-chat-closeup.png\`\n`;
  });

  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report generated: ${reportPath}`);

  return reportPath;
}

/**
 * Main test execution
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Iris Chat Panel - Comprehensive Styling Test         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const results = {};

  // Test on Chromium (Chrome/Edge)
  results.Chromium = await testIrisChat(chromium, 'Chromium');

  // Test on Firefox
  results.Firefox = await testIrisChat(firefox, 'Firefox');

  // Test on WebKit (Safari)
  results.WebKit = await testIrisChat(webkit, 'WebKit');

  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('Generating comprehensive report...');
  console.log('='.repeat(60));

  const reportPath = generateReport(results);

  console.log('\n' + '='.repeat(60));
  console.log('TEST COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`);
  console.log(`Report saved to: ${reportPath}\n`);

  // Exit with appropriate code
  const allSuccess = Object.values(results).every(r => r.success);
  process.exit(allSuccess ? 0 : 1);
}

// Run the tests
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
