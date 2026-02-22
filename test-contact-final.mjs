import { chromium } from 'playwright';

const results = [];

async function runTests() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to contact page
    console.log('Navigating to http://localhost:3000/contact');
    await page.goto('http://localhost:3000/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({ path: '.playwright-mcp/final-test-01-initial.png' });
    console.log('Screenshot saved: final-test-01-initial.png');

    // TEST 1: Submit empty form
    console.log('\n=== TEST 1: Empty form submission ===');
    await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });

    await page.waitForTimeout(1500);

    // Check for error messages
    const pageContent = await page.content();
    const hasNameError = pageContent.includes('Name is required');
    const hasEmailError = pageContent.includes('Email is required');
    const hasSubjectError = pageContent.includes('Subject is required');
    const hasMessageError = pageContent.includes('Message is required');

    const test1Result = {
      test: 'TEST 1: Empty form validation',
      nameError: hasNameError ? 'PASS' : 'FAIL',
      emailError: hasEmailError ? 'PASS' : 'FAIL',
      subjectError: hasSubjectError ? 'PASS' : 'FAIL',
      messageError: hasMessageError ? 'PASS' : 'FAIL',
      overall: (hasNameError && hasEmailError && hasSubjectError && hasMessageError) ? 'PASS' : 'PARTIAL'
    };
    results.push(test1Result);
    console.log('Empty form errors:', JSON.stringify(test1Result, null, 2));
    await page.screenshot({ path: '.playwright-mcp/final-test-01-errors.png' });

    // TEST 2: Invalid email
    console.log('\n=== TEST 2: Invalid email ===');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'This is a long enough test message');
    await page.selectOption('select[name="subject"]', 'job-opportunity');

    await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });

    await page.waitForTimeout(1500);

    const pageContent2 = await page.content();
    const hasInvalidEmailError = pageContent2.includes('valid email') || pageContent2.includes('valid email address');
    const test2Result = {
      test: 'TEST 2: Invalid email validation',
      result: hasInvalidEmailError ? 'PASS' : 'FAIL'
    };
    results.push(test2Result);
    console.log('Invalid email error shown:', hasInvalidEmailError);
    await page.screenshot({ path: '.playwright-mcp/final-test-02-invalid-email.png' });

    // TEST 3: Short message
    console.log('\n=== TEST 3: Short message (< 10 chars) ===');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Short');

    await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });

    await page.waitForTimeout(1500);

    const pageContent3 = await page.content();
    const hasShortMessageError = pageContent3.includes('at least 10 characters');
    const test3Result = {
      test: 'TEST 3: Short message validation',
      result: hasShortMessageError ? 'PASS' : 'FAIL'
    };
    results.push(test3Result);
    console.log('Short message error shown:', hasShortMessageError);
    await page.screenshot({ path: '.playwright-mcp/final-test-03-short-message.png' });

    // TEST 4: Character counter
    console.log('\n=== TEST 4: Character counter ===');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.waitForTimeout(500);

    const charCounterText = await page.locator('text=/\\d+ \\/ 500/').textContent();
    const counterWorks = charCounterText && charCounterText.includes('12');
    const test4Result = {
      test: 'TEST 4: Character counter',
      result: counterWorks ? 'PASS' : 'FAIL',
      text: charCounterText
    };
    results.push(test4Result);
    console.log('Character counter:', counterWorks, charCounterText);
    await page.screenshot({ path: '.playwright-mcp/final-test-04-char-counter.png' });

    // TEST 5: Subject dropdown options
    console.log('\n=== TEST 5: Subject dropdown options ===');
    const subjects = ['job-opportunity', 'collaboration', 'internship', 'project-feedback', 'other'];
    let allSubjectsWork = true;
    for (const subject of subjects) {
      await page.selectOption('select[name="subject"]', subject);
      await page.waitForTimeout(200);
      const selected = await page.locator('select[name="subject"]').inputValue();
      const works = selected === subject;
      if (!works) allSubjectsWork = false;
      console.log(`  Subject ${subject}:`, works ? 'PASS' : 'FAIL');
    }
    const test5Result = {
      test: 'TEST 5: Subject dropdown options',
      result: allSubjectsWork ? 'PASS' : 'FAIL'
    };
    results.push(test5Result);
    await page.screenshot({ path: '.playwright-mcp/final-test-05-subjects.png' });

    // TEST 6: Honeypot field
    console.log('\n=== TEST 6: Honeypot field ===');
    const honeypotExists = await page.locator('input[name="honeypot"]').count() > 0;
    let honeypotHidden = false;
    if (honeypotExists) {
      honeypotHidden = !(await page.locator('input[name="honeypot"]').isVisible());
    }
    const test6Result = {
      test: 'TEST 6: Honeypot field hidden',
      result: honeypotHidden ? 'PASS' : 'FAIL'
    };
    results.push(test6Result);
    console.log('Honeypot field hidden:', honeypotHidden);

    // TEST 7: Copy buttons
    console.log('\n=== TEST 7: Copy buttons ===');
    await page.goto('http://localhost:3000/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Test email copy
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find(b => b.textContent.includes('Copy'));
      if (copyBtn) copyBtn.click();
    });
    await page.waitForTimeout(1000);

    const pageContent7 = await page.content();
    const hasCopySuccess = pageContent7.includes('Copied!');
    const test7Result = {
      test: 'TEST 7: Email copy button',
      result: hasCopySuccess ? 'PASS' : 'FAIL'
    };
    results.push(test7Result);
    console.log('Email copy button works:', hasCopySuccess);
    await page.screenshot({ path: '.playwright-mcp/final-test-07-copy.png' });

    // TEST 8: Valid form submission
    console.log('\n=== TEST 8: Valid form submission ===');
    await page.goto('http://localhost:3000/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    await page.fill('input[name="name"]', 'Playwright Test');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="subject"]', 'other');
    await page.fill('textarea[name="message"]', 'This is a valid test message that meets the minimum length requirement.');

    await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });

    await page.waitForTimeout(3000);

    const pageContent8 = await page.content();
    const hasSuccessMessage = pageContent8.includes('Message Sent');
    const hasUserName = pageContent8.includes('Playwright Test');
    const test8Result = {
      test: 'TEST 8: Valid form submission',
      successMessage: hasSuccessMessage ? 'PASS' : 'FAIL',
      showsName: hasUserName ? 'PASS' : 'N/A'
    };
    results.push(test8Result);
    console.log('Success message shown:', hasSuccessMessage);
    console.log('Shows user name:', hasUserName);
    await page.screenshot({ path: '.playwright-mcp/final-test-08-success.png' });

    // TEST 9: Accessibility check
    console.log('\n=== TEST 9: Accessibility ===');
    const labelsWithFor = await page.locator('label[for]').count();
    const inputsWithIds = await page.locator('input[id], textarea[id], select[id]').count();
    const requiredIndicators = await page.locator('text=*').count();

    const test9Result = {
      test: 'TEST 9: Accessibility',
      labelsWithForAttribute: labelsWithFor,
      inputsWithIdAttributes: inputsWithIds,
      requiredFieldIndicators: requiredIndicators,
      overall: (labelsWithFor > 0 && inputsWithIds > 0) ? 'GOOD' : 'NEEDS IMPROVEMENT'
    };
    results.push(test9Result);
    console.log('Accessibility check:', JSON.stringify(test9Result, null, 2));

    // Final screenshot
    await page.screenshot({ path: '.playwright-mcp/final-test-complete.png', fullPage: true });

  } catch (error) {
    console.error('Test error:', error);
    results.push({
      test: 'ERROR',
      error: error.message,
      stack: error.stack
    });
  } finally {
    await browser.close();

    // Print summary
    console.log('\n========================================');
    console.log('TEST RESULTS SUMMARY');
    console.log('========================================');
    let passCount = 0;
    let failCount = 0;
    results.forEach(r => {
      if (r.result === 'PASS' || r.overall === 'PASS') passCount++;
      else if (r.result === 'FAIL' || r.overall === 'FAIL') failCount++;
      console.log(JSON.stringify(r, null, 2));
    });
    console.log('========================================');
    console.log(`TOTAL: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('========================================');

    // Write results
    const fs = await import('fs');
    fs.writeFileSync('.playwright-mcp/contact-form-final-results.json', JSON.stringify(results, null, 2));
  }
}

runTests().catch(console.error);
