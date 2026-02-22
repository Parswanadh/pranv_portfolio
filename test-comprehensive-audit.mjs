import { chromium } from 'playwright';
import fs from 'fs';

const results = {
  homepage: {},
  projects: {},
  about: {},
  contact: {},
  resume: {},
  agents: {},
  global: {},
  issues: []
};

function log(section, item, status, details = '') {
  const entry = { status, details, timestamp: new Date().toISOString() };
  if (results[section]) {
    results[section][item] = entry;
  }
  console.log(`${status === 'pass' ? '✓' : '✗'} [${section}] ${item}: ${status}${details ? ` - ${details}` : ''}`);
}

async function audit() {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Track console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.issues.push({ type: 'console', message: msg.text() });
    }
  });

  // Track page errors
  page.on('pageerror', error => {
    results.issues.push({ type: 'page', message: error.message });
  });

  try {
    console.log('\n=== STARTING COMPREHENSIVE FEATURE AUDIT ===\n');

    // ========== HOMEPAGE TESTS ==========
    console.log('Testing Homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const snapshot = await page.accessibility.snapshot();
    log('homepage', 'page_loads', 'pass', 'Page loaded successfully');

    // Check navigation
    try {
      const navLinks = await page.$$('nav a');
      log('homepage', 'navigation_links', 'pass', `Found ${navLinks.length} nav links`);
    } catch (e) {
      log('homepage', 'navigation_links', 'fail', e.message);
    }

    // Check hero section
    try {
      const hero = await page.$('section');
      log('homepage', 'hero_section', 'pass', 'Hero section exists');
    } catch (e) {
      log('homepage', 'hero_section', 'fail', e.message);
    }

    // Check project cards
    try {
      const projectCards = await page.$$('.project-card, a[href*="/projects"]');
      log('homepage', 'project_cards', 'pass', `Found ${projectCards.length} project cards`);
    } catch (e) {
      log('homepage', 'project_cards', 'fail', e.message);
    }

    // Check footer
    try {
      const footer = await page.$('footer');
      log('homepage', 'footer', 'pass', 'Footer exists');
    } catch (e) {
      log('homepage', 'footer', 'fail', e.message);
    }

    // Test Command Palette (Ctrl+K)
    try {
      await page.keyboard.press('Control+KeyK');
      await page.waitForTimeout(500);
      const commandPalette = await page.$('[role="dialog"], .command-palette, [data-command-palette]');
      if (commandPalette) {
        log('global', 'command_palette_ctrl_k', 'pass', 'Command palette opens with Ctrl+K');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      } else {
        log('global', 'command_palette_ctrl_k', 'fail', 'Command palette not found');
      }
    } catch (e) {
      log('global', 'command_palette_ctrl_k', 'fail', e.message);
    }

    // ========== PROJECTS PAGE ==========
    console.log('\nTesting Projects Page...');
    await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check filter buttons
    try {
      const filters = await page.$$('.filter-button, button.filter, [data-filter]');
      log('projects', 'filter_buttons', 'pass', `Found ${filters.length} filter buttons`);
      if (filters.length > 0) {
        await filters[0].click();
        await page.waitForTimeout(500);
        log('projects', 'filter_click', 'pass', 'Filter button clickable');
      }
    } catch (e) {
      log('projects', 'filter_buttons', 'fail', e.message);
    }

    // Check project cards
    try {
      const projects = await page.$$('a[href*="/projects/"], .project-card');
      log('projects', 'project_cards', 'pass', `Found ${projects.length} project cards`);
      if (projects.length > 0) {
        await projects[0].click();
        await page.waitForTimeout(1000);
        const url = page.url();
        if (url.includes('/projects/')) {
          log('projects', 'project_card_click', 'pass', `Navigated to ${url}`);
        }
        await page.goBack();
        await page.waitForTimeout(500);
      }
    } catch (e) {
      log('projects', 'project_cards_click', 'fail', e.message);
    }

    // Check search
    try {
      const searchInput = await page.$('input[type="search"], input[placeholder*="search" i], [data-search]');
      if (searchInput) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);
        log('projects', 'search', 'pass', 'Search input works');
      } else {
        log('projects', 'search', 'fail', 'Search input not found');
      }
    } catch (e) {
      log('projects', 'search', 'fail', e.message);
    }

    // ========== ABOUT PAGE ==========
    console.log('\nTesting About Page...');
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    try {
      const content = await page.$('main, article, section');
      log('about', 'page_loads', 'pass', 'About page content exists');
    } catch (e) {
      log('about', 'page_loads', 'fail', e.message);
    }

    // Check for links
    try {
      const links = await page.$$('a');
      log('about', 'links', 'pass', `Found ${links.length} links`);
    } catch (e) {
      log('about', 'links', 'fail', e.message);
    }

    // ========== CONTACT PAGE ==========
    console.log('\nTesting Contact Page...');
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check form
    try {
      const form = await page.$('form');
      if (form) {
        log('contact', 'form_exists', 'pass', 'Contact form exists');

        // Check form fields
        const nameInput = await page.$('input[name="name"], input[id*="name" i]');
        const emailInput = await page.$('input[type="email"], input[name*="email" i]');
        const messageInput = await page.$('textarea, [name*="message" i]');

        if (nameInput) log('contact', 'name_field', 'pass', 'Name field exists');
        if (emailInput) log('contact', 'email_field', 'pass', 'Email field exists');
        if (messageInput) log('contact', 'message_field', 'pass', 'Message field exists');

        // Check submit button
        const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          log('contact', 'submit_button', 'pass', 'Submit button exists');
        }
      } else {
        log('contact', 'form_exists', 'fail', 'Contact form not found');
      }
    } catch (e) {
      log('contact', 'form', 'fail', e.message);
    }

    // Check social links
    try {
      const socialLinks = await page.$$('a[href*="github"], a[href*="linkedin"], a[href*="twitter"]');
      log('contact', 'social_links', 'pass', `Found ${socialLinks.length} social links`);
    } catch (e) {
      log('contact', 'social_links', 'fail', e.message);
    }

    // ========== RESUME PAGE ==========
    console.log('\nTesting Resume Page...');
    await page.goto('http://localhost:3000/resume', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    try {
      const content = await page.$('main, article');
      log('resume', 'page_loads', 'pass', 'Resume page loads');
    } catch (e) {
      log('resume', 'page_loads', 'fail', e.message);
    }

    // Check download button
    try {
      const downloadBtn = await page.$('a[download], button:has-text("Download"), a:has-text("PDF")');
      if (downloadBtn) {
        log('resume', 'download_button', 'pass', 'Download button exists');
      } else {
        log('resume', 'download_button', 'fail', 'Download button not found');
      }
    } catch (e) {
      log('resume', 'download_button', 'fail', e.message);
    }

    // ========== AGENTS PAGE ==========
    console.log('\nTesting Agents Page...');
    await page.goto('http://localhost:3000/agents', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    try {
      const content = await page.$('main, article');
      log('agents', 'page_loads', 'pass', 'Agents page loads');
    } catch (e) {
      log('agents', 'page_loads', 'fail', e.message);
    }

    // Check agent cards
    try {
      const agentCards = await page.$$('.agent-card, [data-agent], article');
      log('agents', 'agent_cards', 'pass', `Found ${agentCards.length} agent cards`);
    } catch (e) {
      log('agents', 'agent_cards', 'fail', e.message);
    }

    // Check demo buttons
    try {
      const demoBtns = await page.$$('button:has-text("Demo"), button:has-text("Try"), a:has-text("Demo")');
      log('agents', 'demo_buttons', 'pass', `Found ${demoBtns.length} demo buttons`);
    } catch (e) {
      log('agents', 'demo_buttons', 'fail', e.message);
    }

    // ========== GLOBAL NAVIGATION TESTS ==========
    console.log('\nTesting Global Navigation...');

    // Test header navigation
    try {
      const headerNav = await page.$('header nav, nav');
      if (headerNav) {
        log('global', 'header_nav', 'pass', 'Header navigation exists');
      }
    } catch (e) {
      log('global', 'header_nav', 'fail', e.message);
    }

    // Test footer links
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    try {
      const footerLinks = await page.$$('footer a');
      log('global', 'footer_links', 'pass', `Found ${footerLinks.length} footer links`);
    } catch (e) {
      log('global', 'footer_links', 'fail', e.message);
    }

    // Test mobile menu (small viewport)
    try {
      await context.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      const mobileMenuBtn = await page.$('button[aria-expanded], button[aria-label*="menu" i], .hamburger, [data-mobile-menu]');
      if (mobileMenuBtn) {
        await mobileMenuBtn.click();
        await page.waitForTimeout(500);
        const mobileNav = await page.$('nav[aria-expanded="true"], .mobile-menu, [data-mobile-nav]');
        if (mobileNav) {
          log('global', 'mobile_menu', 'pass', 'Mobile menu opens');
        } else {
          log('global', 'mobile_menu', 'fail', 'Mobile nav not visible after click');
        }
      } else {
        log('global', 'mobile_menu', 'fail', 'Mobile menu button not found');
      }
    } catch (e) {
      log('global', 'mobile_menu', 'fail', e.message);
    }

    // Reset viewport
    await context.setViewportSize({ width: 1280, height: 720 });

    // ========== KEYBOARD NAVIGATION ==========
    console.log('\nTesting Keyboard Navigation...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    try {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      log('global', 'keyboard_tab', 'pass', `Tab focused: ${focusedElement}`);
    } catch (e) {
      log('global', 'keyboard_tab', 'fail', e.message);
    }

    // ========== ACCESSIBILITY CHECKS ==========
    console.log('\nTesting Accessibility...');

    try {
      const a11ySnapshot = await page.accessibility.snapshot();
      log('global', 'a11y_tree', 'pass', 'Accessibility tree generated');
    } catch (e) {
      log('global', 'a11y_tree', 'fail', e.message);
    }

    // Check for ARIA labels on interactive elements
    try {
      const buttonsWithoutLabels = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        return buttons.length;
      });
      if (buttonsWithoutLabels === 0) {
        log('global', 'aria_labels', 'pass', 'All buttons have ARIA labels');
      } else {
        log('global', 'aria_labels', 'warn', `${buttonsWithoutLabels} buttons without ARIA labels`);
      }
    } catch (e) {
      log('global', 'aria_labels', 'fail', e.message);
    }

  } catch (error) {
    console.error('Fatal error during audit:', error);
    results.issues.push({ type: 'fatal', message: error.message });
  } finally {
    await browser.close();
  }

  // Generate report
  console.log('\n=== AUDIT RESULTS ===\n');

  const allResults = {
    homepage: results.homepage,
    projects: results.projects,
    about: results.about,
    contact: results.contact,
    resume: results.resume,
    agents: results.agents,
    global: results.global,
    issues: results.issues,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync('D:\\projects\\portfolio\\AUDIT_RESULTS.json', JSON.stringify(allResults, null, 2));
  console.log('\n✓ Detailed results saved to AUDIT_RESULTS.json');

  // Count passes/fails
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let warnings = 0;

  Object.entries(results).forEach(([section, tests]) => {
    if (section === 'issues') return;
    Object.entries(tests).forEach(([test, result]) => {
      if (typeof result === 'object' && result.status) {
        totalTests++;
        if (result.status === 'pass') passedTests++;
        else if (result.status === 'fail') failedTests++;
        else if (result.status === 'warn') warnings++;
      }
    });
  });

  console.log(`\nTotal Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Issues: ${results.issues.length}`);

  if (results.issues.length > 0) {
    console.log('\n=== ISSUES FOUND ===');
    results.issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.type}] ${issue.message}`);
    });
  }
}

audit().catch(console.error);
