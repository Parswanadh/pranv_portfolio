const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

const pages = [
  { name: 'Homepage', url: '/' },
  { name: 'Projects', url: '/projects' },
  { name: 'Agents', url: '/agents' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
  { name: 'Leadership', url: '/leadership' },
  { name: 'Tools', url: '/tools' },
  { name: 'Research', url: '/research' },
  { name: 'Resume', url: '/resume' }
];

async function testPage(browser, pageInfo) {
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];
  const failedRequests = [];

  // Listen for console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    if (type === 'error') {
      errors.push({
        text,
        location: location ? `${location.url}:${location.lineNumber}` : 'unknown'
      });
    } else if (type === 'warning') {
      warnings.push({
        text,
        location: location ? `${location.url}:${location.lineNumber}` : 'unknown'
      });
    }
  });

  // Listen for failed requests
  page.on('requestfailed', request => {
    const failure = request.failure();
    failedRequests.push({
      url: request.url(),
      error: failure ? failure.errorText : 'Unknown error',
      resourceType: request.resourceType(),
      status: null
    });
  });

  // Listen for responses with error status
  page.on('response', response => {
    if (response.status() >= 400) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        resourceType: response.request().resourceType(),
        error: null
      });
    }
  });

  // Navigate to page
  try {
    await page.goto(`${BASE_URL}${pageInfo.url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000); // Wait for any delayed console messages
  } catch (error) {
    errors.push({
      text: `Navigation failed: ${error.message}`,
      location: 'navigation'
    });
  }

  await page.close();

  return {
    page: pageInfo.name,
    url: pageInfo.url,
    errors,
    warnings,
    failedRequests
  };
}

async function getProjectSlugs(browser) {
  const page = await browser.newPage();
  const slugs = [];
  try {
    await page.goto(`${BASE_URL}/projects`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    const extractedSlugs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="/projects/"]'));
      return links.map(link => link.getAttribute('href').replace('/projects/', '')).filter(Boolean);
    });
    slugs.push(...extractedSlugs);
  } catch (error) {
    console.error('Failed to get project slugs:', error.message);
  }
  await page.close();
  return [...new Set(slugs)];
}

async function main() {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });

  const results = [];

  // First, get all project slugs
  console.log('Fetching project slugs...');
  const projectSlugs = await getProjectSlugs(browser);
  console.log(`Found ${projectSlugs.length} projects:`, projectSlugs);

  // Add project detail pages
  const allPages = [...pages];
  projectSlugs.forEach(slug => {
    allPages.splice(2, 0, { name: `Project: ${slug}`, url: `/projects/${slug}` });
  });

  // Test each page
  for (const pageInfo of allPages) {
    console.log(`\nTesting: ${pageInfo.name} (${pageInfo.url})`);
    try {
      const result = await testPage(browser, pageInfo);
      results.push(result);

      console.log(`  Errors: ${result.errors.length}`);
      console.log(`  Warnings: ${result.warnings.length}`);
      console.log(`  Failed Requests: ${result.failedRequests.length}`);
    } catch (error) {
      console.error(`Failed to test ${pageInfo.name}:`, error.message);
      results.push({
        page: pageInfo.name,
        url: pageInfo.url,
        errors: [{ text: `Test failed: ${error.message}`, location: 'test' }],
        warnings: [],
        failedRequests: []
      });
    }
  }

  await browser.close();

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      pagesWithErrors: results.filter(r => r.errors.length > 0).length,
      pagesWithWarnings: results.filter(r => r.warnings.length > 0).length,
      pagesWithFailedRequests: results.filter(r => r.failedRequests.length > 0).length,
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
      totalFailedRequests: results.reduce((sum, r) => sum + r.failedRequests.length, 0)
    },
    pages: results
  };

  // Ensure directory exists
  const outputDir = path.join(__dirname, '.playwright-mcp');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save detailed report
  fs.writeFileSync(
    path.join(outputDir, 'console-error-report.json'),
    JSON.stringify(report, null, 2)
  );

  // Save human-readable report
  let markdown = `# Console Error Report\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n`;
  markdown += `Base URL: ${BASE_URL}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Pages Tested:** ${report.summary.totalPages}\n`;
  markdown += `- **Pages with Errors:** ${report.summary.pagesWithErrors}\n`;
  markdown += `- **Pages with Warnings:** ${report.summary.pagesWithWarnings}\n`;
  markdown += `- **Pages with Failed Requests:** ${report.summary.pagesWithFailedRequests}\n`;
  markdown += `- **Total Errors:** ${report.summary.totalErrors}\n`;
  markdown += `- **Total Warnings:** ${report.summary.totalWarnings}\n`;
  markdown += `- **Total Failed Requests:** ${report.summary.totalFailedRequests}\n\n`;

  // Collect all 404 errors
  markdown += `## 404 Errors (Missing Assets)\n\n`;
  let has404s = false;
  for (const result of results) {
    const notFounds = result.failedRequests.filter(r => r.status === 404);
    if (notFounds.length > 0) {
      has404s = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      notFounds.forEach(err => {
        markdown += `- \`${err.url}\`\n`;
      });
      markdown += `\n`;
    }
  }
  if (!has404s) markdown += `No 404 errors found.\n\n`;

  // Collect all chunk load errors
  markdown += `## Chunk Load Errors\n\n`;
  let hasChunkErrors = false;
  for (const result of results) {
    const chunkErrors = result.errors.filter(e => e.text.includes('ChunkLoadError') || e.text.includes('Loading chunk'));
    if (chunkErrors.length > 0) {
      hasChunkErrors = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      chunkErrors.forEach(err => {
        markdown += `- ${err.text}\n`;
        markdown += `  Location: ${err.location}\n`;
      });
      markdown += `\n`;
    }
  }
  if (!hasChunkErrors) markdown += `No chunk load errors found.\n\n`;

  // React hydration errors
  markdown += `## React Hydration Errors\n\n`;
  let hasHydrationErrors = false;
  for (const result of results) {
    const hydrationErrors = result.errors.filter(e =>
      e.text.includes('Hydration') ||
      e.text.includes('hydration') ||
      e.text.includes('Text content did not match')
    );
    if (hydrationErrors.length > 0) {
      hasHydrationErrors = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      hydrationErrors.forEach(err => {
        markdown += `- ${err.text}\n`;
        markdown += `  Location: ${err.location}\n`;
      });
      markdown += `\n`;
    }
  }
  if (!hasHydrationErrors) markdown += `No React hydration errors found.\n\n`;

  // React warnings
  markdown += `## React Warnings\n\n`;
  let hasReactWarnings = false;
  for (const result of results) {
    const reactWarnings = result.warnings.filter(e => e.text.includes('Warning:'));
    if (reactWarnings.length > 0) {
      hasReactWarnings = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      reactWarnings.forEach(err => {
        markdown += `- ${err.text}\n`;
        markdown += `  Location: ${err.location}\n`;
      });
      markdown += `\n`;
    }
  }
  if (!hasReactWarnings) markdown += `No React warnings found.\n\n`;

  // All errors by page
  markdown += `## All Errors by Page\n\n`;
  let hasErrors = false;
  for (const result of results) {
    if (result.errors.length > 0) {
      hasErrors = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      markdown += `**Errors (${result.errors.length}):**\n\n`;
      result.errors.forEach(err => {
        markdown += `- ${err.text}\n`;
        markdown += `  Location: ${err.location}\n\n`;
      });
    }
  }
  if (!hasErrors) markdown += `No errors found.\n\n`;

  // All warnings by page
  markdown += `## All Warnings by Page\n\n`;
  let hasWarnings = false;
  for (const result of results) {
    if (result.warnings.length > 0) {
      hasWarnings = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      markdown += `**Warnings (${result.warnings.length}):**\n\n`;
      result.warnings.forEach(err => {
        markdown += `- ${err.text}\n`;
        markdown += `  Location: ${err.location}\n\n`;
      });
    }
  }
  if (!hasWarnings) markdown += `No warnings found.\n\n`;

  // Failed requests
  markdown += `## Failed Requests by Page\n\n`;
  let hasFailed = false;
  for (const result of results) {
    if (result.failedRequests.length > 0) {
      hasFailed = true;
      markdown += `### ${result.page} (${result.url})\n\n`;
      markdown += `**Failed Requests (${result.failedRequests.length}):**\n\n`;
      result.failedRequests.forEach(err => {
        if (err.status) {
          markdown += `- \`${err.url}\` - Status: ${err.status} (${err.statusText})\n`;
        } else {
          markdown += `- \`${err.url}\` - Error: ${err.error}\n`;
        }
      });
      markdown += `\n`;
    }
  }
  if (!hasFailed) markdown += `No failed requests found.\n\n`;

  // Priority fixes
  markdown += `## Priority List of Fixes Needed\n\n`;

  const criticalIssues = [];
  const highPriorityIssues = [];
  const mediumPriorityIssues = [];
  const lowPriorityIssues = [];

  for (const result of results) {
    // Critical: Navigation failures, chunk load errors
    result.errors.filter(e => e.text.includes('ChunkLoadError') || e.text.includes('Navigation failed'))
      .forEach(err => criticalIssues.push({ page: result.page, error: err, priority: 'CRITICAL' }));

    // High: React hydration errors, 404s for important assets
    result.errors.filter(e => e.text.includes('Hydration'))
      .forEach(err => highPriorityIssues.push({ page: result.page, error: err, priority: 'HIGH' }));
    result.failedRequests.filter(r => r.status === 404 && (r.url.includes('.js') || r.url.includes('.css')))
      .forEach(err => highPriorityIssues.push({ page: result.page, error: err, priority: 'HIGH' }));

    // Medium: React warnings, failed API calls
    result.warnings.filter(e => e.text.includes('Warning:'))
      .forEach(err => mediumPriorityIssues.push({ page: result.page, error: err, priority: 'MEDIUM' }));
    result.failedRequests.filter(r => r.status >= 400 && r.status !== 404)
      .forEach(err => mediumPriorityIssues.push({ page: result.page, error: err, priority: 'MEDIUM' }));

    // Low: 404s for images, minor warnings
    result.failedRequests.filter(r => r.status === 404 && !r.url.includes('.js') && !r.url.includes('.css'))
      .forEach(err => lowPriorityIssues.push({ page: result.page, error: err, priority: 'LOW' }));
  }

  if (criticalIssues.length > 0) {
    markdown += `### CRITICAL\n\n`;
    criticalIssues.forEach(issue => {
      markdown += `- [${issue.page}] ${issue.error.text || issue.error.url || issue.error.error}\n`;
    });
    markdown += `\n`;
  }

  if (highPriorityIssues.length > 0) {
    markdown += `### HIGH\n\n`;
    highPriorityIssues.forEach(issue => {
      markdown += `- [${issue.page}] ${issue.error.text || issue.error.url}\n`;
    });
    markdown += `\n`;
  }

  if (mediumPriorityIssues.length > 0) {
    markdown += `### MEDIUM\n\n`;
    mediumPriorityIssues.slice(0, 20).forEach(issue => {
      markdown += `- [${issue.page}] ${issue.error.text || issue.error.url}\n`;
    });
    markdown += `\n`;
  }

  if (lowPriorityIssues.length > 0) {
    markdown += `### LOW\n\n`;
    lowPriorityIssues.slice(0, 20).forEach(issue => {
      markdown += `- [${issue.page}] ${issue.error.url}\n`;
    });
  }

  fs.writeFileSync(
    path.join(outputDir, 'console-errors.md'),
    markdown
  );

  console.log('\n=== REPORT GENERATED ===');
  console.log(`JSON: .playwright-mcp/console-error-report.json`);
  console.log(`Markdown: .playwright-mcp/console-errors.md`);
  console.log(`\n${JSON.stringify(report.summary, null, 2)}`);
}

main().catch(console.error);
