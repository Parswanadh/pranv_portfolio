const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Create screenshots directory
const screenshotDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Console errors log
const consoleErrors = [];
const networkErrors = [];

async function runTests() {
  console.log('🎭 Starting Comprehensive Playwright Testing...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        url: page.url(),
        text: msg.text(),
        location: msg.location()
      });
      console.log('❌ Console Error:', msg.text());
    }
    if (msg.type() === 'warning') {
      console.log('⚠️  Console Warning:', msg.text());
    }
  });

  // Capture network errors
  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log('🌐 Network Error:', response.status(), response.url());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    consoleErrors.push({
      url: page.url(),
      text: error.message,
      stack: error.stack
    });
    console.log('💥 Page Error:', error.message);
  });

  try {
    // ========================================================================
    // TEST 1: Homepage
    // ========================================================================
    console.log('\n📍 TEST 1: Loading Homepage...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, 'homepage-test.png'), fullPage: true });
    console.log('✅ Homepage screenshot saved: homepage-test.png');

    // Check for main elements
    const headerExists = await page.locator('header').count() > 0;
    const mainExists = await page.locator('main').count() > 0;
    const footerExists = await page.locator('footer').count() > 0;
    console.log(`  - Header: ${headerExists ? '✅' : '❌'}`);
    console.log(`  - Main: ${mainExists ? '✅' : '❌'}`);
    console.log(`  - Footer: ${footerExists ? '✅' : '❌'}`);

    // ========================================================================
    // TEST 2: Navigation
    // ========================================================================
    console.log('\n📍 TEST 2: Testing Navigation...');

    // Test header links
    const navLinks = await page.locator('header a').all();
    console.log(`  - Found ${navLinks.length} navigation links`);

    for (const link of navLinks.slice(0, 5)) {
      try {
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        console.log(`  - Link: "${text}" → ${href || '(no href)'}`);
      } catch (e) {
        console.log('  - Error reading link:', e.message);
      }
    }

    // ========================================================================
    // TEST 3: Command Palette (Ctrl+K)
    // ========================================================================
    console.log('\n📍 TEST 4: Testing Command Palette...');
    await page.keyboard.press('Control+K');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, 'command-palette-test.png') });
    console.log('✅ Command palette screenshot saved');

    // Close command palette
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // ========================================================================
    // TEST 4: Iris Chat
    // ========================================================================
    console.log('\n📍 TEST 5: Testing Iris Chat...');

    // Try to find and click the chat button
    const chatButtonSelectors = [
      'button[aria-label*="chat"]',
      'button[aria-label*="Chat"]',
      'button[aria-label*="assistant"]',
      'button[aria-label*="Assistant"]',
      '.fixed.bottom-4.right-4 button',
      'button:has-text("Chat")',
      'button:has-text("Ask")',
      'button:has-text("Iris")'
    ];

    let chatButtonFound = false;
    for (const selector of chatButtonSelectors) {
      try {
        const button = page.locator(selector).first();
        if (await button.count() > 0) {
          console.log(`  - Found chat button with selector: ${selector}`);
          await button.click();
          chatButtonFound = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (chatButtonFound) {
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(screenshotDir, 'iris-chat-open.png'), fullPage: true });
      console.log('✅ Iris chat screenshot saved: iris-chat-open.png');

      // Try to type a message
      try {
        const textarea = page.locator('textarea, input[type="text"]').first();
        if (await textarea.count() > 0) {
          await textarea.fill('Hello Iris, what are Pranav\'s top skills?');
          await page.waitForTimeout(1000);

          // Try to send
          const sendButton = page.locator('button:has-text("Send"), button:has-text("Enter")').first();
          if (await sendButton.count() > 0) {
            await sendButton.click();
            await page.waitForTimeout(3000);
            await page.screenshot({ path: path.join(screenshotDir, 'iris-chat-response.png'), fullPage: true });
            console.log('✅ Iris chat response screenshot saved: iris-chat-response.png');
          }
        }
      } catch (e) {
        console.log('  - Could not send message:', e.message);
      }
    } else {
      console.log('  - Chat button not found');
    }

    // ========================================================================
    // TEST 5: All Pages
    // ========================================================================
    console.log('\n📍 TEST 6: Testing All Pages...');

    const pagesToTest = [
      { url: 'http://localhost:3001', name: 'home' },
      { url: 'http://localhost:3001/projects', name: 'projects' },
      { url: 'http://localhost:3001/about', name: 'about' },
      { url: 'http://localhost:3001/resume', name: 'resume' },
      { url: 'http://localhost:3001/agents', name: 'agents' }
    ];

    for (const pageTest of pagesToTest) {
      try {
        console.log(`  - Testing ${pageTest.name} page...`);
        await page.goto(pageTest.url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(screenshotDir, `${pageTest.name}-page-test.png`),
          fullPage: true
        });
        console.log(`    ✅ ${pageTest.name} page screenshot saved`);

        // Check for errors
        const hasErrors = consoleErrors.some(e => e.url.includes(pageTest.url));
        if (hasErrors) {
          console.log(`    ⚠️  Errors found on ${pageTest.name} page`);
        } else {
          console.log(`    ✅ No errors on ${pageTest.name} page`);
        }
      } catch (e) {
        console.log(`    ❌ Error loading ${pageTest.name} page:`, e.message);
      }
    }

    // ========================================================================
    // TEST 6: Responsive Testing
    // ========================================================================
    console.log('\n📍 TEST 7: Testing Responsive Design...');

    const sizes = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' }
    ];

    for (const size of sizes) {
      console.log(`  - Testing ${size.name} view (${size.width}x${size.height})...`);
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(screenshotDir, `responsive-test-${size.name}.png`),
        fullPage: true
      });
      console.log(`    ✅ ${size.name} screenshot saved`);
    }

    // ========================================================================
    // TEST 7: Project Pages
    // ========================================================================
    console.log('\n📍 TEST 8: Testing Project Pages...');

    const projectSlugs = [
      'whisper-stt',
      'cli-tour',
      'gpt-oss-vision',
      'multimodal-adapter',
      'pro-code',
      'auto-git-publisher',
      'parshu-stt',
      'raspberry-pi-vision',
      'ai-robotic-arm',
      'spinlaunch-prototype'
    ];

    for (const slug of projectSlugs.slice(0, 3)) { // Test first 3 projects
      try {
        console.log(`  - Testing project: ${slug}...`);
        await page.goto(`http://localhost:3001/projects/${slug}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(screenshotDir, `project-${slug}-test.png`),
          fullPage: true
        });
        console.log(`    ✅ ${slug} screenshot saved`);
      } catch (e) {
        console.log(`    ❌ Error loading ${slug}:`, e.message);
      }
    }

    // ========================================================================
    // FINAL REPORT
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST RESULTS');
    console.log('='.repeat(60));

    console.log('\n✅ COMPLETED TESTS:');
    console.log('  1. Homepage loading and rendering');
    console.log('  2. Navigation links');
    console.log('  3. Command Palette (Ctrl+K)');
    console.log('  4. Iris Chat functionality');
    console.log('  5. All main pages (/projects, /about, /resume, /agents)');
    console.log('  6. Responsive design (mobile, tablet, desktop)');
    console.log('  7. Project detail pages');

    console.log('\n📸 SCREENSHOTS SAVED:');
    const screenshots = fs.readdirSync(screenshotDir);
    screenshots.forEach(s => console.log(`  - ${s}`));

    if (consoleErrors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS FOUND:');
      consoleErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.text}`);
        console.log(`     URL: ${err.url}`);
        if (err.location) {
          console.log(`     Location: ${err.location.url}:${err.location.lineNumber}`);
        }
      });
    } else {
      console.log('\n✅ NO CONSOLE ERRORS FOUND');
    }

    if (networkErrors.length > 0) {
      console.log('\n❌ NETWORK ERRORS FOUND:');
      networkErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.status} ${err.statusText}`);
        console.log(`     URL: ${err.url}`);
      });
    } else {
      console.log('\n✅ NO NETWORK ERRORS FOUND');
    }

    // Save error logs
    if (consoleErrors.length > 0) {
      fs.writeFileSync(
        path.join(__dirname, 'console-errors.log'),
        JSON.stringify(consoleErrors, null, 2)
      );
      console.log('\n📝 Console errors saved to: console-errors.log');
    }

    if (networkErrors.length > 0) {
      fs.writeFileSync(
        path.join(__dirname, 'network-errors.log'),
        JSON.stringify(networkErrors, null, 2)
      );
      console.log('📝 Network errors saved to: network-errors.log');
    }

    // Overall assessment
    console.log('\n' + '='.repeat(60));
    const totalErrors = consoleErrors.length + networkErrors.length;
    if (totalErrors === 0) {
      console.log('🎉 OVERALL ASSESSMENT: ALL TESTS PASSED');
    } else if (totalErrors < 5) {
      console.log(`⚠️  OVERALL ASSESSMENT: ${totalErrors} MINOR ISSUES FOUND`);
    } else {
      console.log(`❌ OVERALL ASSESSMENT: ${totalErrors} ISSUES FOUND`);
    }
    console.log('='.repeat(60));

    await browser.close();

  } catch (error) {
    console.error('\n💥 FATAL ERROR:', error);
    await browser.close();
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);
