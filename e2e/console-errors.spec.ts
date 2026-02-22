import { test, expect } from '@playwright/test';

/**
 * Simple test to capture console errors and network failures
 */

test('Console Errors and Network Failures', async ({ page }) => {
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  const networkErrors: string[] = [];
  const api401Errors: string[] = [];

  // Capture console errors
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.log(`[CONSOLE ERROR] ${text}`);
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(text);
      console.log(`[CONSOLE WARNING] ${text}`);
    }
  });

  // Capture network errors
  page.on('response', response => {
    const url = response.url();
    const status = response.status();

    if (status >= 400) {
      const error = `${url} - ${status}`;
      networkErrors.push(error);
      console.log(`[NETWORK ERROR] ${error}`);

      // Specifically track 401 errors
      if (status === 401) {
        api401Errors.push(url);
        console.log(`[API 401] ${url}`);
      }
    }
  });

  // Navigate to main pages
  const pages = ['/', '/projects', '/about', '/contact'];

  for (const path of pages) {
    console.log(`\n=== Testing: ${path} ===`);
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  }

  // Print comprehensive summary
  console.log('\n\n=== COMPREHENSIVE ERROR REPORT ===');
  console.log(`\n[CRITICAL] Console Errors (${consoleErrors.length}):`);
  if (consoleErrors.length === 0) {
    console.log('  None found - Great!');
  } else {
    consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  }

  console.log(`\n[WARNING] Console Warnings (${consoleWarnings.length}):`);
  if (consoleWarnings.length === 0) {
    console.log('  None found - Great!');
  } else {
    consoleWarnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
  }

  console.log(`\n[NETWORK] Network Errors (${networkErrors.length}):`);
  if (networkErrors.length === 0) {
    console.log('  None found - Great!');
  } else {
    networkErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
  }

  console.log(`\n[API 401] Unauthorized API Errors (${api401Errors.length}):`);
  if (api401Errors.length === 0) {
    console.log('  None found - Great!');
  } else {
    console.log('  The following endpoints are returning 401 Unauthorized:');
    api401Errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    console.log('\n  FIX: Add valid GROQ_API_KEY to .env.local file');
  }

  // Generate report
  const report = `# Portfolio Console & Network Error Report
Generated: ${new Date().toISOString()}

## Test Summary
- Total pages tested: ${pages.length}
- Pages: ${pages.join(', ')}

## CRITICAL - Console Errors (${consoleErrors.length})
${consoleErrors.length === 0 ? '✅ No console errors found!' :
consoleErrors.map((err, i) => `${i + 1}. \`${err}\``).join('\n')}

## WARNINGS - Console Warnings (${consoleWarnings.length})
${consoleWarnings.length === 0 ? '✅ No console warnings found!' :
consoleWarnings.map((warn, i) => `${i + 1}. \`${warn}\``).join('\n')}

## NETWORK FAILURES (${networkErrors.length})
${networkErrors.length === 0 ? '✅ No network errors found!' :
networkErrors.map((err, i) => `${i + 1}. \`${err}\``).join('\n')}

## API 401 UNAUTHORIZED ERRORS (${api401Errors.length})
${api401Errors.length === 0 ? '✅ All API calls successful!' :
`❌ The following endpoints are failing with 401 Unauthorized:\n` +
api401Errors.map((err, i) => `${i + 1}. \`${err}\``).join('\n') +
`\n\n### How to Fix:\n` +
`1. Copy \`.env.example\` to \`.env.local\`\n` +
`2. Add your GROQ_API_KEY from https://console.groq.com/\n` +
`3. Restart the dev server with \`npm run dev\`\n`}

## Recommendations
${api401Errors.length > 0 ?
'### CRITICAL - Fix API Authentication\n' +
'The GROQ API is failing because the API key is missing or invalid.\n\n' +
'**Steps to fix:**\n' +
'1. Get your API key from https://console.groq.com/\n' +
'2. Add it to .env.local: `GROQ_API_KEY=your_key_here`\n' +
'3. Restart the development server\n' :
'### ✅ All Systems Operational\n' +
'No critical errors found. The application is running smoothly!'}

${consoleErrors.length > 0 || networkErrors.length > 0 ?
'### Other Issues to Address\n' +
'- Review console errors for JavaScript bugs\n' +
'- Fix broken images and failed network requests\n' :
''}
`;

  // Write report to file
  const fs = require('fs');
  fs.writeFileSync('CONSOLE_ERROR_REPORT.md', report);
  console.log('\n[REPORT] Saved: CONSOLE_ERROR_REPORT.md');

  // Also save JSON for programmatic access
  const jsonReport = {
    timestamp: new Date().toISOString(),
    summary: {
      pagesTested: pages.length,
      consoleErrors: consoleErrors.length,
      consoleWarnings: consoleWarnings.length,
      networkErrors: networkErrors.length,
      api401Errors: api401Errors.length
    },
    errors: {
      console: consoleErrors,
      warnings: consoleWarnings,
      network: networkErrors,
      api401: api401Errors
    }
  };

  fs.writeFileSync('error-report.json', JSON.stringify(jsonReport, null, 2));
  console.log('[REPORT] Saved: error-report.json');

  // Take final screenshots of all pages
  for (const path of pages) {
    const pageName = path === '/' ? 'home' : path.replace('/', '');
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `final-${pageName}-page.png`,
      fullPage: true
    });
    console.log(`[SCREENSHOT] Saved: final-${pageName}-page.png`);
  }
});
