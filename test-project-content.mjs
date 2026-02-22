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

    // Navigate to page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`   ✓ Page loaded`);

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Take initial screenshot
    const initialScreenshot = path.join(screenshotDir, `${projectName}-01-initial.png`);
    await page.screenshot({ path: initialScreenshot, fullPage: true });
    testResult.screenshots.push(initialScreenshot);
    console.log(`   ✓ Initial screenshot taken`);

    // Check for Overview section
    try {
      const overviewExists = await page.locator('h2:has-text("Overview")').count() > 0;
      const overviewVisible = overviewExists && await page.locator('h2:has-text("Overview")').isVisible();

      testResult.sections.overview = {
        exists: overviewExists,
        visible: overviewVisible
      };

      if (overviewVisible) {
        console.log(`   ✓ Overview section found and visible`);

        // Screenshot overview section
        const overviewElement = await page.locator('h2:has-text("Overview")').first();
        if (overviewElement) {
          const overviewScreenshot = path.join(screenshotDir, `${projectName}-02-overview.png`);
          await overviewElement.screenshot({ path: overviewScreenshot });
          testResult.screenshots.push(overviewScreenshot);
        }
      } else {
        console.log(`   ⚠ Overview section not found or not visible`);
        testResult.status = 'failed';
      }
    } catch (e) {
      console.log(`   ⚠ Error checking Overview: ${e.message}`);
      testResult.sections.overview = { error: e.message, exists: false, visible: false };
    }

    // Check for "How It Works" section
    try {
      const howItWorksExists = await page.locator('h2:has-text("How It Works")').count() > 0;
      const howItWorksVisible = howItWorksExists && await page.locator('h2:has-text("How It Works")').isVisible();

      testResult.sections.howItWorks = {
        exists: howItWorksExists,
        visible: howItWorksVisible
      };

      if (howItWorksVisible) {
        console.log(`   ✓ How It Works section found and visible`);

        // Check for step-by-step content
        const steps = await page.locator('.prose ol li, .prose ul li').count();
        testResult.sections.howItWorks.steps = steps;
        console.log(`   ✓ Found ${steps} steps/items`);

        // Screenshot How It Works section
        const howItWorksScreenshot = path.join(screenshotDir, `${projectName}-03-how-it-works.png`);
        await page.locator('h2:has-text("How It Works")').screenshot({ path: howItWorksScreenshot });
        testResult.screenshots.push(howItWorksScreenshot);
      } else {
        console.log(`   ⚠ How It Works section not found or not visible`);
        testResult.status = 'failed';
      }
    } catch (e) {
      console.log(`   ⚠ Error checking How It Works: ${e.message}`);
      testResult.sections.howItWorks = { error: e.message, exists: false, visible: false };
    }

    // Check for Key Features section
    try {
      const keyFeaturesExists = await page.locator('h2:has-text("Key Features")').count() > 0;
      const keyFeaturesVisible = keyFeaturesExists && await page.locator('h2:has-text("Key Features")').isVisible();

      testResult.sections.keyFeatures = {
        exists: keyFeaturesExists,
        visible: keyFeaturesVisible
      };

      if (keyFeaturesVisible) {
        console.log(`   ✓ Key Features section found and visible`);

        // Count feature items
        const features = await page.locator('.prose ul li, .grid li').count();
        testResult.sections.keyFeatures.count = features;
        console.log(`   ✓ Found ${features} feature items`);

        // Screenshot Key Features section
        const keyFeaturesScreenshot = path.join(screenshotDir, `${projectName}-04-key-features.png`);
        await page.locator('h2:has-text("Key Features")').screenshot({ path: keyFeaturesScreenshot });
        testResult.screenshots.push(keyFeaturesScreenshot);
      } else {
        console.log(`   ⚠ Key Features section not found or not visible`);
        testResult.status = 'failed';
      }
    } catch (e) {
      console.log(`   ⚠ Error checking Key Features: ${e.message}`);
      testResult.sections.keyFeatures = { error: e.message, exists: false, visible: false };
    }

    // Check for Tech Stack section
    try {
      const techStackExists = await page.locator('h3:has-text("Tech Stack")').count() > 0 ||
                             await page.locator('h2:has-text("Tech Stack")').count() > 0;
      const techStackVisible = techStackExists;

      testResult.sections.techStack = {
        exists: techStackExists,
        visible: techStackVisible
      };

      if (techStackVisible) {
        console.log(`   ✓ Tech Stack section found`);

        // Screenshot Tech Stack section
        const techStackScreenshot = path.join(screenshotDir, `${projectName}-05-tech-stack.png`);
        try {
          await page.locator('h3:has-text("Tech Stack"), h2:has-text("Tech Stack")').first().screenshot({ path: techStackScreenshot });
          testResult.screenshots.push(techStackScreenshot);
        } catch (e) {
          console.log(`   ⚠ Could not screenshot Tech Stack: ${e.message}`);
        }
      } else {
        console.log(`   ⚠ Tech Stack section not found`);
      }
    } catch (e) {
      console.log(`   ⚠ Error checking Tech Stack: ${e.message}`);
      testResult.sections.techStack = { error: e.message, exists: false, visible: false };
    }

    // Take full page scroll screenshot
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const fullScreenshot = path.join(screenshotDir, `${projectName}-06-full-scrolled.png`);
    await page.screenshot({ path: fullScreenshot, fullPage: true });
    testResult.screenshots.push(fullScreenshot);
    console.log(`   ✓ Full scrolled screenshot taken`);

    // Determine overall status
    if (testResult.status !== 'failed') {
      const allSectionsVisible = testResult.sections.overview?.visible &&
                                  testResult.sections.howItWorks?.visible &&
                                  testResult.sections.keyFeatures?.visible;

      if (allSectionsVisible) {
        testResult.status = 'passed';
        results.summary.passed++;
        console.log(`   ✅ PASSED: All sections visible`);
      } else {
        testResult.status = 'partial';
        results.summary.warnings++;
        console.log(`   ⚠ PARTIAL: Some sections missing`);
      }
    } else {
      results.summary.failed++;
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    testResult.status = 'error';
    testResult.error = error.message;
    results.summary.failed++;
  }

  await page.close();
  results.tests.push(testResult);
  return testResult;
}

async function runTests() {
  console.log('🎭 Starting Project Content Tests\n');
  console.log('=' .repeat(60));

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

  console.log(`📄 Report written to: ${reportPath}`);
  console.log(`\n✅ Passed: ${results.summary.passed}`);
  console.log(`⚠️  Warnings: ${results.summary.warnings}`);
  console.log(`❌ Failed: ${results.summary.failed}`);

  if (results.consoleErrors.length > 0) {
    console.log(`\n⚠️  Console Errors Found: ${results.consoleErrors.length}`);
  }

  return results;
}

function generateMarkdownReport() {
  let markdown = `# Project Content Test Report

**Generated:** ${results.timestamp}
**Tested Pages:** ${results.tests.length}

## Executive Summary

- **Passed:** ${results.summary.passed}
- **Partial/Warnings:** ${results.summary.warnings}
- **Failed:** ${results.summary.failed}
- **Total Console Errors:** ${results.consoleErrors.length}

---

## Test Results

`;

  results.tests.forEach(test => {
    const statusIcon = test.status === 'passed' ? '✅' : test.status === 'partial' ? '⚠️' : '❌';
    markdown += `### ${statusIcon} ${test.project}

**URL:** ${test.url}
**Status:** ${test.status.toUpperCase()}

#### Sections Found

`;

    if (test.sections.overview) {
      const overviewStatus = test.sections.overview.visible ? '✅ Visible' : '❌ Not Visible';
      markdown += `- **Overview:** ${overviewStatus}\n`;
    }

    if (test.sections.howItWorks) {
      const hiwStatus = test.sections.howItWorks.visible ? '✅ Visible' : '❌ Not Visible';
      markdown += `- **How It Works:** ${hiwStatus}`;
      if (test.sections.howItWorks.steps) {
        markdown += ` (${test.sections.howItWorks.steps} steps found)`;
      }
      markdown += `\n`;
    }

    if (test.sections.keyFeatures) {
      const kfStatus = test.sections.keyFeatures.visible ? '✅ Visible' : '❌ Not Visible';
      markdown += `- **Key Features:** ${kfStatus}`;
      if (test.sections.keyFeatures.count) {
        markdown += ` (${test.sections.keyFeatures.count} features found)`;
      }
      markdown += `\n`;
    }

    if (test.sections.techStack) {
      const tsStatus = test.sections.techStack.exists ? '✅ Found' : '❌ Not Found';
      markdown += `- **Tech Stack:** ${tsStatus}\n`;
    }

    if (test.screenshots.length > 0) {
      markdown += `\n#### Screenshots\n\n`;
      test.screenshots.forEach((shot, i) => {
        const shotName = path.basename(shot);
        markdown += `${i + 1}. \`.playwright-results/project-content/${shotName}\`\n`;
      });
    }

    if (test.consoleErrors.length > 0) {
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
      markdown += `### ${err.page}\n`;
      markdown += `\`\`\`\n${err.error}\n\`\`\`\n\n`;
    });
  }

  markdown += `## Screenshots Directory\n\n`;
  markdown += `All screenshots saved to: \`.playwright-results/project-content/\`\n`;

  return markdown;
}

runTests().then(results => {
  console.log('\n✨ Tests complete!');
  process.exit(results.summary.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
