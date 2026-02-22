import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const PORT = 3004;
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;

const reportDir = '.playwright-mcp/mobile';
const reportPath = '.agent-reports/mobile-test.md';

// Ensure directories exist
fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync('.agent-reports', { recursive: true });

const issues = [];
const screenshots = [];

async function testMobileResponsive() {
  console.log('Starting mobile responsive test...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-webgl'] // Faster rendering
  });

  const context = await browser.newContext({
    viewport: { width: MOBILE_WIDTH, height: MOBILE_HEIGHT },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      issues.push({
        type: 'Console Error',
        message: msg.text(),
        location: msg.location()
      });
    }
  });

  try {
    console.log(`1. Navigating to http://localhost:${PORT}...`);
    await page.goto(`http://localhost:${PORT}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for page to stabilize
    await page.waitForTimeout(2000);

    console.log('2. Taking initial screenshot...');
    const initialScreenshot = path.join(reportDir, 'mobile-home-initial.png');
    await page.screenshot({
      path: initialScreenshot,
      fullPage: true
    });
    screenshots.push(initialScreenshot);
    console.log(`   Saved: ${initialScreenshot}`);

    // Check for overflow
    console.log('3. Checking for overflow issues...');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    if (bodyWidth > viewportWidth) {
      issues.push({
        type: 'Horizontal Overflow',
        message: `Body width (${bodyWidth}px) exceeds viewport (${viewportWidth}px)`,
        severity: 'high'
      });
    }

    if (bodyHeight > viewportHeight * 2) {
      issues.push({
        type: 'Long Page',
        message: `Page height (${bodyHeight}px) is very long for mobile`,
        severity: 'low'
      });
    }

    console.log(`   Viewport: ${viewportWidth}x${viewportHeight}`);
    console.log(`   Body: ${bodyWidth}x${bodyHeight}`);

    // Check navigation
    console.log('4. Testing navigation...');
    const headerExists = await page.$('header') !== null;
    const navExists = await page.$('nav') !== null;

    if (!headerExists) {
      issues.push({
        type: 'Missing Header',
        message: 'Header element not found on mobile',
        severity: 'high'
      });
    }

    if (!navExists) {
      issues.push({
        type: 'Missing Navigation',
        message: 'Navigation element not found on mobile',
        severity: 'medium'
      });
    }

    // Check for command palette trigger
    console.log('5. Testing command palette (Cmd+K)...');
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(1000);

    const commandPaletteExists = await page.$('[role="dialog"], [data-cmdk]') !== null;

    const cmdPaletteScreenshot = path.join(reportDir, 'mobile-command-palette.png');
    await page.screenshot({ path: cmdPaletteScreenshot, fullPage: true });
    screenshots.push(cmdPaletteScreenshot);
    console.log(`   Saved: ${cmdPaletteScreenshot}`);

    if (!commandPaletteExists) {
      issues.push({
        type: 'Command Palette',
        message: 'Command palette did not open with Cmd+K',
        severity: 'medium'
      });
    } else {
      console.log('   ✓ Command palette opened successfully');
    }

    // Close command palette
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Check Iris chat button
    console.log('6. Testing Iris chat button...');
    const irisButton = await page.$('button[aria-label*="iris" i], button:has-text("Chat")');

    if (irisButton) {
      const isVisible = await irisButton.isVisible();
      const isClickable = await irisButton.isClickable();

      if (!isVisible) {
        issues.push({
          type: 'Iris Button Visibility',
          message: 'Iris chat button is not visible on mobile',
          severity: 'high'
        });
      } else if (!isClickable) {
        issues.push({
          type: 'Iris Button Clickability',
          message: 'Iris chat button is not clickable on mobile',
          severity: 'high'
        });
      } else {
        console.log('   ✓ Iris button is visible and clickable');
      }
    } else {
      issues.push({
        type: 'Missing Iris Button',
        message: 'Iris chat button not found on mobile',
        severity: 'high'
      });
    }

    // Check glassmorphism styling
    console.log('7. Testing glassmorphism styling...');
    const glassElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="glass"], [class*="backdrop"], [style*="backdrop-filter"]');
      return Array.from(elements).map(el => ({
        tag: el.tagName,
        class: el.className,
        hasBackdrop: window.getComputedStyle(el).backdropFilter !== 'none'
      }));
    });

    const glassCount = glassElements.filter(e => e.hasBackdrop).length;
    console.log(`   Found ${glassCount} elements with backdrop-filter`);

    if (glassCount === 0) {
      issues.push({
        type: 'Glassmorphism',
        message: 'No glassmorphism effects detected on mobile',
        severity: 'low'
      });
    }

    // Test all pages
    console.log('8. Testing other pages...');
    const pages = [
      { path: '/projects', name: 'Projects' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/resume', name: 'Resume' },
      { path: '/agents', name: 'Agents' }
    ];

    for (const pageData of pages) {
      try {
        console.log(`   Testing ${pageData.name}...`);
        await page.goto(`http://localhost:${PORT}${pageData.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000
        });
        await page.waitForTimeout(1500);

        const screenshotPath = path.join(reportDir, `mobile-${pageData.name.toLowerCase()}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        screenshots.push(screenshotPath);
        console.log(`     Saved: ${screenshotPath}`);

        // Check for overflow on each page
        const pageBodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const pageViewportWidth = await page.evaluate(() => window.innerWidth);

        if (pageBodyWidth > pageViewportWidth) {
          issues.push({
            type: 'Horizontal Overflow',
            message: `${pageData.name} page has horizontal overflow`,
            severity: 'high'
          });
        }
      } catch (error) {
        issues.push({
          type: 'Page Load Error',
          message: `${pageData.name} page failed to load: ${error.message}`,
          severity: 'high'
        });
      }
    }

    // Final screenshot on home
    console.log('9. Taking final screenshots...');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const finalScreenshot = path.join(reportDir, 'mobile-home-final.png');
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    screenshots.push(finalScreenshot);
    console.log(`   Saved: ${finalScreenshot}`);

  } catch (error) {
    console.error('Test failed:', error);
    issues.push({
      type: 'Test Error',
      message: error.message,
      severity: 'critical'
    });
  } finally {
    await browser.close();
  }

  return { issues, screenshots };
}

async function generateReport(results) {
  const timestamp = new Date().toISOString();

  let markdown = `# Mobile Responsiveness Test Report

**Date:** ${timestamp}
**Viewport Tested:** ${MOBILE_WIDTH}x${MOBILE_HEIGHT}px (iPhone SE)
**Base URL:** http://localhost:${PORT}

---

## Test Summary

**Total Issues Found:** ${results.issues.length}
- Critical: ${results.issues.filter(i => i.severity === 'critical').length}
- High: ${results.issues.filter(i => i.severity === 'high').length}
- Medium: ${results.issues.filter(i => i.severity === 'medium').length}
- Low: ${results.issues.filter(i => i.severity === 'low').length}

**Screenshots Taken:** ${results.screenshots.length}

---

## Issues Found

`;

  if (results.issues.length === 0) {
    markdown += `✅ **No issues found!** The site is mobile-responsive.\n\n`;
  } else {
    results.issues.forEach((issue, index) => {
      const severityIcon = {
        critical: '🔴',
        high: '🟠',
        medium: '🟡',
        low: '🟢'
      }[issue.severity] || '⚪';

      markdown += `### ${index + 1}. ${issue.type} ${severityIcon}\n\n`;
      markdown += `**Severity:** ${issue.severity}\n\n`;
      markdown += `**Message:** ${issue.message}\n\n`;

      if (issue.location) {
        markdown += `**Location:** \`${issue.location.url}:${issue.location.lineNumber}\`\n\n`;
      }

      markdown += '---\n\n';
    });
  }

  markdown += `---

## Screenshots Taken

The following screenshots were captured during testing:

`;

  results.screenshots.forEach((screenshot, index) => {
    const relativePath = path.relative(process.cwd(), screenshot);
    markdown += `${index + 1}. \`${relativePath}\`\n`;
  });

  markdown += `
---

## Recommendations

`;

  const criticalIssues = results.issues.filter(i => i.severity === 'critical' || i.severity === 'high');
  const mediumIssues = results.issues.filter(i => i.severity === 'medium');
  const lowIssues = results.issues.filter(i => i.severity === 'low');

  if (criticalIssues.length > 0) {
    markdown += `### Priority Fixes (High/Critical)\n\n`;
    criticalIssues.forEach(issue => {
      markdown += `- **${issue.type}:** ${issue.message}\n`;
    });
    markdown += '\n';
  }

  if (mediumIssues.length > 0) {
    markdown += `### Secondary Fixes (Medium)\n\n`;
    mediumIssues.forEach(issue => {
      markdown += `- **${issue.type}:** ${issue.message}\n`;
    });
    markdown += '\n';
  }

  if (lowIssues.length > 0) {
    markdown += `### Nice to Have (Low)\n\n`;
    lowIssues.forEach(issue => {
      markdown += `- **${issue.type}:** ${issue.message}\n`;
    });
    markdown += '\n';
  }

  if (results.issues.length === 0) {
    markdown += `✅ **No issues to fix!** Your site is well-optimized for mobile devices.\n\n`;

    markdown += `### General Recommendations\n\n`;
    markdown += `- Continue monitoring mobile performance\n`;
    markdown += `- Test on actual mobile devices when possible\n`;
    markdown += `- Consider testing at different mobile viewport sizes (375x812, 414x896)\n`;
  } else {
    markdown += `### General Recommendations\n\n`;
    markdown += `- Ensure all text is readable at mobile sizes (minimum 16px)\n`;
    markdown += `- Test touch targets are at least 44x44px\n`;
    markdown += `- Verify images scale properly on mobile\n`;
    markdown += `- Test on actual mobile devices\n`;
    markdown += `- Consider using responsive typography (clamp())\n`;
  }

  markdown += `
---

## Test Details

- **Viewport Size:** ${MOBILE_WIDTH}x${MOBILE_HEIGHT}px
- **User Agent:** Mobile Safari (iOS)
- **Pages Tested:** Home, Projects, About, Contact, Resume, Agents
- **Features Tested:** Navigation, Command Palette, Iris Chat, Glassmorphism
- **Test Framework:** Playwright

---

*Report generated by Claude Code*
`;

  fs.writeFileSync(reportPath, markdown, 'utf-8');
  console.log(`\n✅ Report saved to: ${reportPath}`);

  return reportPath;
}

// Run the test
async function main() {
  const results = await testMobileResponsive();
  const reportPath = await generateReport(results);

  console.log('\n='.repeat(60));
  console.log('MOBILE RESPONSIVE TEST COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nIssues Found: ${results.issues.length}`);
  console.log(`Screenshots: ${results.screenshots.length}`);
  console.log(`Report: ${reportPath}`);

  if (results.issues.length > 0) {
    console.log('\n⚠️  Issues detected - see report for details');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
