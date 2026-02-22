const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function checkConsoleErrors() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const warnings = [];
  const failedRequests = [];
  const allMessages = [];

  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    allMessages.push({
      type,
      text,
      location: location ? `${location.url}:${location.lineNumber}` : 'unknown'
    });

    if (type === 'error') {
      errors.push({ text, location: location ? `${location.url}:${location.lineNumber}` : 'unknown' });
    } else if (type === 'warning') {
      warnings.push({ text, location: location ? `${location.url}:${location.lineNumber}` : 'unknown' });
    }
  });

  // Listen to failed requests
  page.on('requestfailed', request => {
    const failure = request.failure();
    failedRequests.push({
      url: request.url(),
      error: failure ? failure.errorText : 'Unknown error',
      resourceType: request.resourceType()
    });
  });

  // Listen to response errors (4xx, 5xx)
  page.on('response', response => {
    const status = response.status();
    if (status >= 400) {
      failedRequests.push({
        url: response.url(),
        status,
        statusText: response.statusText(),
        resourceType: 'unknown'
      });
    }
  });

  // Navigate to homepage
  console.log('Testing: http://localhost:3002');
  try {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for any delayed errors
  } catch (error) {
    console.error('Navigation error:', error.message);
  }

  await browser.close();

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    url: 'http://localhost:3002',
    summary: {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      totalFailedRequests: failedRequests.length,
      totalMessages: allMessages.length
    },
    errors,
    warnings,
    failedRequests,
    allMessages
  };

  // Save JSON report
  const jsonPath = path.join(__dirname, '.playwright-mcp', 'console-errors-3002.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Generate markdown report
  const markdownPath = path.join(__dirname, '.playwright-mcp', 'console-errors-3002.md');
  let markdown = `# Console Error Report - Port 3002

Generated: ${report.timestamp}
URL: ${report.url}

## Summary

- **Total Errors:** ${report.summary.totalErrors}
- **Total Warnings:** ${report.summary.totalWarnings}
- **Total Failed Requests:** ${report.summary.totalFailedRequests}
- **Total Console Messages:** ${report.summary.totalMessages}

## Console Errors

${errors.length > 0 ? errors.map(e => `- **Error:** ${e.text}\n  **Location:** ${e.location}`).join('\n\n') : 'No errors found!'}

## Console Warnings

${warnings.length > 0 ? warnings.map(w => `- **Warning:** ${w.text}\n  **Location:** ${w.location}`).join('\n\n') : 'No warnings found!'}

## Failed Requests

${failedRequests.length > 0 ? failedRequests.map(r => `- **URL:** ${r.url}\n  ${r.status ? `**Status:** ${r.status} ${r.statusText}\n  ` : ''}${r.error ? `**Error:** ${r.error}\n  ` : ''}**Type:** ${r.resourceType}`).join('\n\n') : 'No failed requests!'}

## All Console Messages

${allMessages.map(m => `- [${m.type.toUpperCase()}] ${m.text}\n  at ${m.location}`).join('\n\n')}
`;

  fs.writeFileSync(markdownPath, markdown);

  console.log('\n=== REPORT GENERATED ===');
  console.log(`JSON: ${jsonPath}`);
  console.log(`Markdown: ${markdownPath}`);
  console.log('\n=== SUMMARY ===');
  console.log(`Errors: ${report.summary.totalErrors}`);
  console.log(`Warnings: ${report.summary.totalWarnings}`);
  console.log(`Failed Requests: ${report.summary.totalFailedRequests}`);
}

checkConsoleErrors().catch(console.error);
