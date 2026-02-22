import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const results = {
  timestamp: new Date().toISOString(),
  tests: [],
  consoleErrors: [],
  summary: {
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

// Ensure results directory exists
const resultsDir = '.playwright-results';
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Ensure screenshots directory exists
const screenshotDir = '.playwright-results/project-content';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function testProjectPage(browser, url, projectName) {
  const page = await browser.newPage();
  const testResult = {
    project: projectName,
    url: url,
    sections: {},
    consoleErrors: [],
    screenshots: [],
    status: 'unknown'
  };

  try {
    console.log(`\n🔍 Testing: ${projectName}`);
    console.log(`   URL: ${url}`);

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        testResult.consoleErrors.push(errorText);
        results.consoleErrors.push({
          page: projectName,
          error: errorText
        });
      }
    });

    // Navigate to page with domcontentloaded instead of networkidle
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`   ✓ Page loaded`);

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Try to find main content
    const mainContent = await page.locator('main').count();
    console.log(`   ✓ Found ${mainContent} main element(s)`);

    // Take initial screenshot
    const initialScreenshot = path.join(screenshotDir, `${projectName}-01-initial.png`);
    await page.screenshot({ path: initialScreenshot, fullPage: false });
    testResult.screenshots.push(initialScreenshot);
    console.log(`   ✓ Initial screenshot taken`);

    // Check for any content headings
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log(`   ✓ Found ${headings.length} headings:`);
    headings.slice(0, 10).forEach(h => console.log(`     - ${h.trim().substring(0, 50)}`));

    // Look for content sections by checking for common section titles
    const sectionChecks = [
      { name: 'Overview', selectors: ['h2:has-text("Overview")', 'h1:has-text("Overview")'] },
      { name: 'How It Works', selectors: ['h2:has-text("How It Works")', 'h2:has-text("How it Works")'] },
      { name: 'Key Features', selectors: ['h2:has-text("Key Features")', 'h2:has-text("Features")'] },
      { name: 'Tech Stack', selectors: ['h3:has-text("Tech Stack")', 'h2:has-text("Tech Stack")'] }
    ];

    for (const section of sectionChecks) {
      let found = false;
      for (const selector of section.selectors) {
        try {
          const count = await page.locator(selector).count();
          if (count > 0) {
            const visible = await page.locator(selector).first().isVisible();
            testResult.sections[section.name.toLowerCase().replace(' ', '')] = {
              exists: true,
              visible: visible,
              selector: selector
            };
            found = true;
            console.log(`   ✓ ${section.name} section: ${visible ? 'visible' : 'exists but not visible'}`);

            // Screenshot the section
            const screenshotPath = path.join(screenshotDir, `${projectName}-${section.name.toLowerCase().replace(' ', '')}.png`);
            try {
              await page.locator(selector).first().screenshot({ path: screenshotPath });
              testResult.screenshots.push(screenshotPath);
            } catch (e) {
              // Screenshot might fail if element is off-screen
            }
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!found) {
        testResult.sections[section.name.toLowerCase().replace(' ', '')] = {
          exists: false,
          visible: false
        };
        console.log(`   ⚠ ${section.name} section: not found`);
      }
    }

    // Scroll through page to load all content
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    // Take full page screenshot
    const fullScreenshot = path.join(screenshotDir, `${projectName}-full.png`);
    await page.screenshot({ path: fullScreenshot, fullPage: true });
    testResult.screenshots.push(fullScreenshot);
    console.log(`   ✓ Full page screenshot taken`);

    // Determine status
    const sectionsFound = Object.values(testResult.sections).filter(s => s.exists).length;
    const sectionsVisible = Object.values(testResult.sections).filter(s => s.visible).length;

    if (sectionsVisible >= 3) {
      testResult.status = 'passed';
      results.summary.passed++;
      console.log(`   ✅ PASSED: ${sectionsVisible}/${sectionsFound} sections visible`);
    } else if (sectionsFound >= 2) {
      testResult.status = 'partial';
      results.summary.warnings++;
      console.log(`   ⚠ PARTIAL: ${sectionsVisible}/${sectionsFound} sections visible`);
    } else {
      testResult.status = 'failed';
      results.summary.failed++;
      console.log(`   ❌ FAILED: Only ${sectionsVisible} sections visible`);
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    testResult.status = 'error';
    testResult.error = error.message;
    testResult.stack = error.stack;
    results.summary.failed++;
  }

  await page.close();
  results.tests.push(testResult);
  return testResult;
}

async function runTests() {
  console.log('🎭 Project Content Test v2\n');
  console.log('='.repeat(60));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Test Auto Git Publisher
    await testProjectPage(browser, 'http://localhost:3000/projects/auto-git-publisher', 'auto-git-publisher');

    // Test Pro Code
    await testProjectPage(browser, 'http://localhost:3000/projects/pro-code', 'pro-code');

  } finally {
    await browser.close();
  }

  // Write results
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary\n');

  const reportPath = path.join(resultsDir, 'project-content-test.md');
  const reportContent = generateMarkdownReport();
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  console.log(`📄 Report: ${reportPath}`);
  console.log(`\n✅ Passed: ${results.summary.passed}`);
  console.log(`⚠️  Partial: ${results.summary.warnings}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`🐛 Console Errors: ${results.consoleErrors.length}`);

  return results;
}

function generateMarkdownReport() {
  let markdown = `# Project Content Test Report

**Generated:** ${results.timestamp}
**Pages Tested:** ${results.tests.length}

## Executive Summary

| Status | Count |
|--------|-------|
| ✅ Passed | ${results.summary.passed} |
| ⚠️ Partial | ${results.summary.warnings} |
| ❌ Failed | ${results.summary.failed} |
| 🐛 Console Errors | ${results.consoleErrors.length} |

---

## Detailed Results

`;

  results.tests.forEach(test => {
    const statusIcon = test.status === 'passed' ? '✅' : test.status === 'partial' ? '⚠️' : '❌';
    markdown += `### ${statusIcon} ${test.project}

**URL:** \`${test.url}\`
**Status:** ${test.status.toUpperCase()}
`;

    if (test.error) {
      markdown += `**Error:** \`${test.error}\`\n\n`;
    }

    markdown += `\n#### Sections Verification\n\n`;
    markdown += `| Section | Exists | Visible |\n`;
    markdown += `|---------|--------|--------|\n`;

    const sectionNames = {
      overview: 'Overview',
      howitworks: 'How It Works',
      keyfeatures: 'Key Features',
      techstack: 'Tech Stack'
    };

    Object.entries(test.sections).forEach(([key, value]) => {
      const name = sectionNames[key] || key;
      const exists = value.exists ? '✅' : '❌';
      const visible = value.visible ? '✅' : '❌';
      markdown += `| ${name} | ${exists} | ${visible} |\n`;
    });

    if (test.screenshots.length > 0) {
      markdown += `\n#### Screenshots\n\n`;
      test.screenshots.forEach((shot, i) => {
        const shotName = path.basename(shot);
        markdown += `${i + 1}. \`.playwright-results/project-content/${shotName}\`\n`;
      });
    }

    if (test.consoleErrors && test.consoleErrors.length > 0) {
      markdown += `\n#### Console Errors\n\n`;
      test.consoleErrors.forEach(err => {
        markdown += `- \`${err}\`\n`;
      });
    }

    markdown += `\n---\n\n`;
  });

  if (results.consoleErrors.length > 0) {
    markdown += `## All Console Errors\n\n`;
    results.consoleErrors.forEach(err => {
      markdown += `**${err.page}**: \`${err.error}\`\n\n`;
    });
  }

  return markdown;
}

runTests().then(results => {
  console.log('\n✨ Tests complete!');
  process.exit(results.summary.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
