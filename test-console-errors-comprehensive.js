const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '.playwright-results', 'console-errors-report.md');
const PORT = 3001;

async function checkConsoleErrors() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    homepage: { errors: [], warnings: [], network404s: [] },
    projects: { errors: [], warnings: [], network404s: [] },
    projectDetail: { errors: [], warnings: [], network404s: [] },
    contact: { errors: [], warnings: [], network404s: [] },
    agents: { errors: [], warnings: [], network404s: [] },
    about: { errors: [], warnings: [], network404s: [] },
    resume: { errors: [], warnings: [], network404s: [] }
  };

  // Listen to console events
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    const errorInfo = {
      text,
      type,
      url: location?.url,
      line: location?.lineNumber,
      column: location?.columnNumber
    };

    // Determine which page context this is from
    const url = page.url();
    let pageKey = 'homepage';
    if (url.includes('/projects') && !url.includes('/projects/')) pageKey = 'projects';
    else if (url.includes('/projects/')) pageKey = 'projectDetail';
    else if (url.includes('/contact')) pageKey = 'contact';
    else if (url.includes('/agents')) pageKey = 'agents';
    else if (url.includes('/about')) pageKey = 'about';
    else if (url.includes('/resume')) pageKey = 'resume';

    if (type === 'error') {
      results[pageKey].errors.push(errorInfo);
    } else if (type === 'warning') {
      results[pageKey].warnings.push(errorInfo);
    }
  });

  // Listen for network responses
  page.on('response', response => {
    const status = response.status();
    const url = response.url();

    if (status === 404) {
      const pageUrl = page.url();
      let pageKey = 'homepage';
      if (pageUrl.includes('/projects') && !pageUrl.includes('/projects/')) pageKey = 'projects';
      else if (pageUrl.includes('/projects/')) pageKey = 'projectDetail';
      else if (pageUrl.includes('/contact')) pageKey = 'contact';
      else if (pageUrl.includes('/agents')) pageKey = 'agents';
      else if (pageUrl.includes('/about')) pageKey = 'about';
      else if (pageUrl.includes('/resume')) pageKey = 'resume';

      results[pageKey].network404s.push({
        url,
        status,
        resourceType: response.request().resourceType()
      });
    }
  });

  // Navigate to pages and wait for them to load
  const pages = [
    { name: 'homepage', url: `http://localhost:${PORT}/` },
    { name: 'projects', url: `http://localhost:${PORT}/projects` },
    { name: 'contact', url: `http://localhost:${PORT}/contact` },
    { name: 'agents', url: `http://localhost:${PORT}/agents` },
    { name: 'about', url: `http://localhost:${PORT}/about` },
    { name: 'resume', url: `http://localhost:${PORT}/resume` }
  ];

  // Get first project slug for detail page
  try {
    await page.goto(`http://localhost:${PORT}/projects`);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const projectSlug = await page.locator('a[href^="/projects/"]').first().getAttribute('href');
    if (projectSlug) {
      pages.push({ name: 'projectDetail', url: `http://localhost:${PORT}${projectSlug}` });
    }
  } catch (e) {
    console.log('Could not get project slug:', e.message);
  }

  for (const pageInfo of pages) {
    console.log(`\nChecking ${pageInfo.name}...`);
    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(2000); // Wait for any delayed console errors
    } catch (e) {
      console.log(`Error loading ${pageInfo.name}:`, e.message);
      results[pageInfo.name].errors.push({
        text: `Failed to load page: ${e.message}`,
        type: 'error'
      });
    }
  }

  await browser.close();

  // Generate report
  let report = `# Console Error Report for Portfolio
Generated: ${new Date().toISOString()}
Server: http://localhost:${PORT}

## Summary

`;

  let totalErrors = 0;
  let totalWarnings = 0;
  let total404s = 0;

  for (const [page, data] of Object.entries(results)) {
    totalErrors += data.errors.length;
    totalWarnings += data.warnings.length;
    total404s += data.network404s.length;

    report += `### ${page.charAt(0).toUpperCase() + page.slice(1)}
`;
    if (data.errors.length === 0 && data.warnings.length === 0 && data.network404s.length === 0) {
      report += `- No errors, warnings, or 404s found\n\n`;
    } else {
      if (data.errors.length > 0) {
        report += `- **Errors:** ${data.errors.length}\n`;
      }
      if (data.warnings.length > 0) {
        report += `- **Warnings:** ${data.warnings.length}\n`;
      }
      if (data.network404s.length > 0) {
        report += `- **404s:** ${data.network404s.length}\n`;
      }
      report += `\n`;
    }
  }

  report += `**Total:** ${totalErrors} errors, ${totalWarnings} warnings, ${total404s} 404s

---

## Detailed Results

`;

  for (const [page, data] of Object.entries(results)) {
    report += `## ${page.charAt(0).toUpperCase() + page.slice(1)} Page\n\n`;

    if (data.errors.length > 0) {
      report += `### Errors (${data.errors.length})\n\n`;
      data.errors.forEach((error, i) => {
        report += `${i + 1}. **${error.text}**\n`;
        if (error.url) report += `   - URL: ${error.url}\n`;
        if (error.line) report += `   - Line: ${error.line}:${error.column}\n`;
        report += `\n`;
      });
    } else {
      report += `### No errors found\n\n`;
    }

    if (data.warnings.length > 0) {
      report += `### Warnings (${data.warnings.length})\n\n`;
      data.warnings.forEach((warning, i) => {
        report += `${i + 1}. **${warning.text}**\n`;
        if (warning.url) report += `   - URL: ${warning.url}\n`;
        if (warning.line) report += `   - Line: ${warning.line}:${warning.column}\n`;
        report += `\n`;
      });
    } else {
      report += `### No warnings found\n\n`;
    }

    if (data.network404s.length > 0) {
      report += `### Network 404s (${data.network404s.length})\n\n`;
      data.network404s.forEach((notFound, i) => {
        report += `${i + 1}. **${notFound.url}**\n`;
        report += `   - Resource Type: ${notFound.resourceType}\n`;
        report += `   - Status: ${notFound.status}\n\n`;
      });
    } else {
      report += `### No 404s found\n\n`;
    }

    report += `---\n\n`;
  }

  // Ensure directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`\n\nReport saved to: ${OUTPUT_FILE}`);

  return { totalErrors, totalWarnings, total404s };
}

checkConsoleErrors().then(results => {
  console.log('\n=== FINAL SUMMARY ===');
  console.log(`Total Errors: ${results.totalErrors}`);
  console.log(`Total Warnings: ${results.totalWarnings}`);
  console.log(`Total 404s: ${results.total404s}`);
  process.exit(0);
}).catch(err => {
  console.error('Error running console checks:', err);
  process.exit(1);
});
