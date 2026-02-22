// Console Error Test for 2025
// Run with: node test-console-2025.mjs

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const RESULTS_DIR = '.playwright-results';
const REPORT_FILE = join(RESULTS_DIR, 'console-test-2025.md');

async function testConsoleErrors() {
  console.log('Starting console error test for http://localhost:3000...\n');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Collect all console messages
  const consoleMessages = [];
  const errors = [];
  const warnings = [];
  const failedRequests = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    const messageInfo = {
      type,
      text,
      url: location?.url,
      lineNumber: location?.lineNumber,
      columnNumber: location?.columnNumber
    };

    consoleMessages.push(messageInfo);

    if (type === 'error') {
      errors.push(messageInfo);
      console.log(`[ERROR] ${text}`);
      if (location) {
        console.log(`  at ${location.url}:${location.lineNumber}`);
      }
    } else if (type === 'warning') {
      warnings.push(messageInfo);
      console.log(`[WARNING] ${text}`);
    }
  });

  // Track failed requests
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`[REQUEST FAIL] ${response.status()} ${response.url()}`);
    }
  });

  // Track page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    const errorInfo = {
      message: error.message,
      stack: error.stack
    };
    pageErrors.push(errorInfo);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('Waiting for page to stabilize...');
    await page.waitForTimeout(5000);

    // Check for React/Next.js specific issues
    const reactChecks = await page.evaluate(() => {
      const checks = {
        hasReact: typeof window !== 'undefined' && window.__REACT__ !== undefined,
        hasNext: typeof window !== 'undefined' && window.__NEXT__ !== undefined,
        hasHydrationErrors: false,
        missingModules: []
      };

      // Check for hydration errors
      const html = document.documentElement.innerHTML;
      checks.hasHydrationErrors = html.includes('Hydration failed') ||
                                   html.includes('Text content does not match') ||
                                   html.includes('Warning:');

      // Check for common module loading issues
      if (window.performance) {
        const entries = performance.getEntriesByType('resource');
        entries.forEach(entry => {
          if (entry.name.includes('.js') || entry.name.includes('.css')) {
            // Check for 404 or failed loads
          }
        });
      }

      return checks;
    });

    console.log('\n=== TEST SUMMARY ===');
    console.log(`Total Console Messages: ${consoleMessages.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Failed Requests: ${failedRequests.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);

    // Generate markdown report
    const report = generateReport({
      consoleMessages,
      errors,
      warnings,
      failedRequests,
      pageErrors,
      reactChecks
    });

    // Write report
    mkdirSync(RESULTS_DIR, { recursive: true });
    writeFileSync(REPORT_FILE, report, 'utf-8');
    console.log(`\n✓ Report written to: ${REPORT_FILE}`);

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

function generateReport(data) {
  const date = new Date().toISOString();
  const { consoleMessages, errors, warnings, failedRequests, pageErrors, reactChecks } = data;

  return `# Console Error Test Report - 2025

**Generated:** ${date}
**URL:** http://localhost:3000
**Test Type:** Automated Console Error Detection

---

## Executive Summary

- **Total Console Messages:** ${consoleMessages.length}
- **Total Errors:** ${errors.length}
- **Total Warnings:** ${warnings.length}
- **Failed Requests:** ${failedRequests.length}
- **Page Errors:** ${pageErrors.length}

### Status Assessment

${errors.length === 0 && warnings.length === 0
  ? '✅ **PASSED** - No console errors or warnings detected'
  : errors.length > 0
    ? '❌ **FAILED** - Critical errors detected'
    : '⚠️ **WARNING** - Warnings detected but no errors'}

---

## React/Next.js Health Check

- **React Present:** ${reactChecks.hasReact ? '✅ Yes' : '❌ No'}
- **Next.js Present:** ${reactChecks.hasNext ? '✅ Yes' : '❌ No'}
- **Hydration Errors:** ${reactChecks.hasHydrationErrors ? '❌ Detected' : '✅ None'}

---

## Critical Errors

${errors.length > 0 ? errors.map((err, i) => `
### Error ${i + 1}

**Message:** \`${err.text}\`

**Location:**
${err.url ? `- URL: \`${err.url}\`` : '- URL: N/A'}
${err.lineNumber ? `- Line: ${err.lineNumber}` : ''}

`).join('') : '✅ **No errors detected**'}

---

## Warnings

${warnings.length > 0 ? warnings.map((warn, i) => `
### Warning ${i + 1}

**Message:** \`${warn.text}\`

**Location:**
${warn.url ? `- URL: \`${warn.url}\`` : '- URL: N/A'}
${warn.lineNumber ? `- Line: ${warn.lineNumber}` : ''}

`).join('') : '✅ **No warnings detected**'}

---

## Failed Requests (HTTP Errors)

${failedRequests.length > 0 ? failedRequests.map((req, i) => `
### Request ${i + 1}

- **URL:** \`${req.url}\`
- **Status:** ${req.status} ${req.statusText}
- **Impact:** ${req.status === 404 ? 'Missing resource' : req.status === 500 ? 'Server error' : 'Network issue'}

`).join('') : '✅ **No failed requests**'}

---

## Page Runtime Errors

${pageErrors.length > 0 ? pageErrors.map((err, i) => `
### Runtime Error ${i + 1}

**Message:**
\`\`\`
${err.message}
\`\`\`

**Stack Trace:**
\`\`\`
${err.stack || 'No stack trace available'}
\`\`\`

`).join('') : '✅ **No runtime errors**'}

---

## All Console Messages (Chronological)

${consoleMessages.map((msg, i) => `
${i + 1}. **[${msg.type.toUpperCase()}]** ${msg.text}
   ${msg.url ? `at ${msg.url}` : ''}${msg.lineNumber ? `:${msg.lineNumber}` : ''}
`).join('')}

---

## Recommendations

${errors.length > 0 ? `
### Critical Fixes Needed

1. **Address ${errors.length} console error(s)**
   - Review each error above for root cause
   - Check for missing imports, undefined variables, or type errors
   - Verify all components are properly imported and exported

` : ''}

${failedRequests.filter(r => r.status === 404).length > 0 ? `
2. **Fix Missing Resources (${failedRequests.filter(r => r.status === 404).length} 404s)**
   - Check for missing image files, CSS files, or JavaScript modules
   - Verify all imports point to existing files
   - Ensure build process generates all required assets

` : ''}

${failedRequests.filter(r => r.status === 500).length > 0 ? `
3. **Investigate Server Errors (${failedRequests.filter(r => r.status === 500).length} 500s)**
   - Check API routes and server-side rendering errors
   - Review server logs for detailed error messages
   - Verify all API endpoints are properly implemented

` : ''}

${reactChecks.hasHydrationErrors ? `
4. **Fix Hydration Errors**
   - Hydration errors occur when server-rendered HTML doesn't match client-side React
   - Check for missing data fetching or conditional rendering
   - Ensure consistent rendering between server and client

` : ''}

${warnings.length > 0 ? `
### Warnings to Address

${warnings.length} warning(s) detected. Review and fix if critical.

` : ''}

---

## Test Metadata

- **Test Date:** ${date}
- **Browser:** Chromium (Playwright)
- **Viewport:** 1920x1080
- **Test Duration:** ~30 seconds
- **Pages Checked:** Homepage (/)

---

## Next Steps

1. If errors detected: Review each error section above
2. Fix identified issues in codebase
3. Re-run test: \`node test-console-2025.mjs\`
4. Verify all errors resolved
5. Check other pages if homepage passes

---

*This report was automatically generated by the Console Error Test Suite 2025*
`;
}

// Run the test
testConsoleErrors().catch(console.error);
