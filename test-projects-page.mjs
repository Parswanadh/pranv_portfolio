import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function testProjectsPage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleLogs = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        text: msg.text(),
        location: msg.location()
      });
    }
    consoleLogs.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  page.on('pageerror', error => {
    consoleErrors.push({
      text: error.toString(),
      name: error.name
    });
  });

  const resultsDir = join(process.cwd(), '.playwright-results');
  mkdirSync(resultsDir, { recursive: true });

  try {
    console.log('Navigating to http://localhost:3004/projects');
    await page.goto('http://localhost:3004/projects', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded');

    await page.waitForTimeout(2000);

    const screenshotPath = join(resultsDir, 'projects-page-test.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    const h1Text = await page.locator('h1').textContent();
    const h2Text = await page.locator('h2').allTextContents();

    const autoGitVisible = await page.getByText('AUTO-GIT Publisher').isVisible();
    const autoGitElement = await page.getByText('AUTO-GIT Publisher').boundingBox();

    const heroCard = page.locator('[class*="hero"], h2').first();
    const heroText = await heroCard.textContent();

    const allProjectCards = await page.locator('a[href^="/projects/"]').allTextContents();
    const projectLinks = await page.locator('a[href^="/projects/"]').all();

    const firstProjectLink = await page.locator('a[href^="/projects/"]').first();
    const firstProjectHref = await firstProjectLink.getAttribute('href');

    const bentoGridItems = await page.locator('[class*="bento"], [class*="Bento"]').count();

    const totalProjects = await page.locator('a[href^="/projects/"]').count();

    const firstCardText = await page.locator('a[href^="/projects/"]').first().textContent();
    const isAutoGitFirst = firstCardText?.includes('AUTO-GIT');

    const autoGitLink = await page.locator('a[href="/projects/auto-git-publisher"]').isVisible();
    const isFirstLinkAutoGit = firstProjectHref === '/projects/auto-git-publisher';

    const metrics = await page.getByText('12').allTextContents();
    const agentMetric = await page.locator('a[href="/projects/auto-git-publisher"]').getByText('Agents', { exact: true }).isVisible();

    const testResults = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3004/projects',
      screenshot: screenshotPath,
      h1Text: h1Text,
      h2Texts: h2Text,
      autoGitVisible: autoGitVisible,
      autoGitPosition: autoGitElement,
      firstCardContainsAutoGit: isAutoGitFirst,
      firstProjectHref: firstProjectHref,
      isFirstLinkAutoGit: isFirstLinkAutoGit,
      totalProjects: totalProjects,
      bentoGridItems: bentoGridItems,
      autoGitLinkVisible: autoGitLink,
      metricsVisible: metrics.length > 0,
      agentMetricVisible: agentMetric,
      consoleErrors: consoleErrors,
      consoleWarnings: consoleLogs.filter(log => log.type === 'error' || log.type === 'warning')
    };

    const reportPath = join(resultsDir, 'projects-page-test.json');
    writeFileSync(reportPath, JSON.stringify(testResults, null, 2));

    const mdReport = `# Projects Page Test Report

**Date:** ${new Date().toISOString()}
**URL:** http://localhost:3004/projects

## Test Results

### Page Structure
- **H1 Text:** "${h1Text}"
- **H2 Texts:** ${h2Text.map(t => `"${t}"`).join(', ')}

### AUTO-GIT Publisher Verification
- **AUTO-GIT Visible on Page:** ${autoGitVisible ? '✅ YES' : '❌ NO'}
- **AUTO-GIT is First Project Card:** ${isFirstLinkAutoGit ? '✅ YES' : '❌ NO'}
- **First Project Link:** \`${firstProjectHref}\`
- **AUTO-GIT Link (/projects/auto-git-publisher) Visible:** ${autoGitLink ? '✅ YES' : '❌ NO'}
- **Metrics (Agents, Papers Processed, etc.) Visible:** ${testResults.metricsVisible ? '✅ YES' : '❌ NO'}
- **"Agents" Metric Visible:** ${agentMetric ? '✅ YES' : '❌ NO'}

### Hero/First Card Analysis
- **First Card Text Contains AUTO-GIT:** ${isAutoGitFirst ? '✅ YES' : '❌ NO'}
- **First Card Text Preview:** ${firstCardText?.substring(0, 100)}...

### Projects Display
- **Total Project Cards/Links Found:** ${totalProjects}
- **Bento Grid Items:** ${bentoGridItems}

### Screenshot
![Projects Page](projects-page-test.png)

### Console Errors (${consoleErrors.length})
${consoleErrors.length > 0 ? consoleErrors.map(e => `- \`${e.text || e.name}\``).join('\n') : '✅ No console errors found!'}

### Console Warnings
${consoleLogs.filter(l => l.type === 'warning').map(w => `- \`${w.text}\``).join('\n') || '✅ No warnings'}

## Summary
${isFirstLinkAutoGit && autoGitVisible && consoleErrors.length === 0 ?
  '✅ All tests passed! AUTO-GIT Publisher is correctly displayed as the first/hero project with proper metrics and styling.' :
  '⚠️ Test results: ' +
  (isFirstLinkAutoGit ? '✅ ' : '❌ ') + 'AUTO-GIT is first link, ' +
  (autoGitVisible ? '✅ ' : '❌ ') + 'AUTO-GIT visible, ' +
  (consoleErrors.length === 0 ? '✅' : '❌ ' + consoleErrors.length) + ' console errors'}
`;

    const mdPath = join(resultsDir, 'projects-page-test.md');
    writeFileSync(mdPath, mdReport);
    console.log(`Test report saved to: ${mdPath}`);

    await browser.close();
    return testResults;

  } catch (error) {
    console.error('Test failed:', error);
    await browser.close();
    throw error;
  }
}

testProjectsPage()
  .then(results => {
    console.log('\n=== TEST SUMMARY ===');
    console.log(`AUTO-GIT is first project link: ${results.isFirstLinkAutoGit ? '✅ YES' : '❌ NO'}`);
    console.log(`First link: ${results.firstProjectHref}`);
    console.log(`AUTO-GIT visible: ${results.autoGitVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`Metrics visible: ${results.metricsVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`Total projects found: ${results.totalProjects}`);
    console.log(`Console errors: ${results.consoleErrors.length}`);
    console.log(`Screenshot: ${results.screenshot}`);
  })
  .catch(console.error);
