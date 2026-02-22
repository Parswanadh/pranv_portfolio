import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const results = [];

  try {
    // Navigate to contact page
    console.log('Navigating to contact page...');
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Test 1: Submit empty form
    console.log('\n=== TEST 1: Submit empty form ===');
    await page.screenshot({ path: '.playwright-mcp/test1-before-submit.png' });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const nameError = await page.locator('text=Name is required').count();
    const emailError = await page.locator('text=Email is required').count();
    const subjectError = await page.locator('text=Subject is required').count();
    const messageError = await page.locator('text=Message is required').count();

    results.push({
      test: 'TEST 1: Empty form validation',
      nameError: nameError > 0 ? 'PASS' : 'FAIL',
      emailError: emailError > 0 ? 'PASS' : 'FAIL',
      subjectError: subjectError > 0 ? 'PASS' : 'FAIL',
      messageError: messageError > 0 ? 'PASS' : 'FAIL'
    });

    console.log('Name error:', nameError > 0 ? 'PASS' : 'FAIL');
    console.log('Email error:', emailError > 0 ? 'PASS' : 'FAIL');
    console.log('Subject error:', subjectError > 0 ? 'PASS' : 'FAIL');
    console.log('Message error:', messageError > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test1-empty-form-errors.png' });

    // Test 2: Invalid email
    console.log('\n=== TEST 2: Invalid email ===');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'This is a test message that is long enough');
    await page.selectOption('select[name="subject"]', 'job-opportunity');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const invalidEmailError = await page.locator('text=Please enter a valid email address').count();
    results.push({
      test: 'TEST 2: Invalid email validation',
      result: invalidEmailError > 0 ? 'PASS' : 'FAIL'
    });
    console.log('Invalid email error:', invalidEmailError > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test2-invalid-email.png' });

    // Test 3: Short message
    console.log('\n=== TEST 3: Short message (< 10 chars) ===');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Short');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const shortMessageError = await page.locator('text=Please enter at least 10 characters').count();
    results.push({
      test: 'TEST 3: Short message validation',
      result: shortMessageError > 0 ? 'PASS' : 'FAIL'
    });
    console.log('Short message error:', shortMessageError > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test3-short-message.png' });

    // Test 4: Character counter
    console.log('\n=== TEST 4: Character counter ===');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.waitForTimeout(500);

    const charCountText = await page.locator('.font-mono.text-xs').filter({ hasText: '/' }).textContent();
    const charCounterWorks = charCountText && charCountText.includes('Test message'.length.toString());
    results.push({
      test: 'TEST 4: Character counter',
      result: charCounterWorks ? 'PASS' : 'FAIL',
      text: charCountText
    });
    console.log('Character counter:', charCounterWorks ? 'PASS' : 'FAIL', charCountText);

    await page.screenshot({ path: '.playwright-mcp/test4-character-counter.png' });

    // Test 5: Subject dropdown
    console.log('\n=== TEST 5: Subject dropdown options ===');
    const subjects = [
      { value: 'job-opportunity', label: 'Job Opportunity' },
      { value: 'collaboration', label: 'Collaboration' },
      { value: 'internship', label: 'Internship Inquiry' },
      { value: 'project-feedback', label: 'Project Feedback' },
      { value: 'other', label: 'Other' }
    ];

    let subjectTestPass = true;
    for (const subject of subjects) {
      await page.selectOption('select[name="subject"]', subject.value);
      const selected = await page.locator('select[name="subject"]').inputValue();
      const pass = selected === subject.value;
      if (!pass) subjectTestPass = false;
      console.log(`  ${subject.label}:`, pass ? 'PASS' : 'FAIL');
    }

    results.push({
      test: 'TEST 5: Subject dropdown options',
      result: subjectTestPass ? 'PASS' : 'FAIL'
    });

    await page.screenshot({ path: '.playwright-mcp/test5-subject-dropdown.png' });

    // Test 6: Honeypot field
    console.log('\n=== TEST 6: Honeypot field ===');
    const honeypotExists = await page.locator('input[name="honeypot"]').count();
    const honeypotHidden = honeypotExists > 0 && !(await page.locator('input[name="honeypot"]').isVisible());
    results.push({
      test: 'TEST 6: Honeypot field hidden',
      result: honeypotHidden ? 'PASS' : 'FAIL'
    });
    console.log('Honeypot field hidden:', honeypotHidden ? 'PASS' : 'FAIL');

    // Test 7: Copy buttons
    console.log('\n=== TEST 7: Copy buttons ===');
    await page.click('button:has-text("Copy"):first');
    await page.waitForTimeout(500);

    const copyText = await page.locator('button:has-text("Copied!")').count();
    results.push({
      test: 'TEST 7: Email copy button',
      result: copyText > 0 ? 'PASS' : 'FAIL'
    });
    console.log('Email copy button:', copyText > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test7-copy-button.png' });

    // Wait for copy to reset
    await page.waitForTimeout(2500);

    // Test phone copy
    await page.click('button:has-text("Copy"):nth-of-type(2)');
    await page.waitForTimeout(500);

    const phoneCopyText = await page.locator('button:has-text("Copied!")').count();
    results.push({
      test: 'TEST 7b: Phone copy button',
      result: phoneCopyText > 0 ? 'PASS' : 'FAIL'
    });
    console.log('Phone copy button:', phoneCopyText > 0 ? 'PASS' : 'FAIL');

    // Test 8: Valid form submission
    console.log('\n=== TEST 8: Valid form submission ===');
    await page.fill('input[name="name"]', 'Playwright Test User');
    await page.fill('input[name="email"]', 'playwright@test.com');
    await page.selectOption('select[name="subject"]', 'other');
    await page.fill('textarea[name="message"]', 'This is a valid test message that meets the minimum length requirement for the contact form validation.');

    // Check no errors before submit
    const hasErrors = await page.locator('text=Name is required, Email is required').count();
    results.push({
      test: 'TEST 8: No errors with valid data',
      result: hasErrors === 0 ? 'PASS' : 'FAIL'
    });
    console.log('No errors with valid data:', hasErrors === 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test8-valid-form.png' });

    // Submit the valid form
    console.log('Submitting valid form...');
    await page.click('button[type="submit"]');

    // Wait for response
    await page.waitForTimeout(3000);

    // Check for success message or error
    const successMessage = await page.locator('text=Message Sent').count();
    const errorMessage = await page.locator('text=Failed to send message').count();

    results.push({
      test: 'TEST 8b: Valid form submission',
      success: successMessage > 0 ? 'PASS' : 'FAIL',
      error: errorMessage > 0 ? 'SHOWED ERROR' : 'NO ERROR'
    });
    console.log('Success message shown:', successMessage > 0 ? 'PASS' : 'FAIL');
    console.log('Error message shown:', errorMessage > 0 ? 'YES' : 'NO');

    await page.screenshot({ path: '.playwright-mcp/test8-after-submit.png' });

    // Test 9: Form reset after success
    console.log('\n=== TEST 9: Form reset after success ===');
    if (successMessage > 0) {
      await page.waitForTimeout(3500); // Wait for 3 second reset

      const nameValue = await page.locator('input[name="name"]').inputValue();
      const emailValue = await page.locator('input[name="email"]').inputValue();
      const messageValue = await page.locator('textarea[name="message"]').inputValue();

      const formReset = nameValue === '' && emailValue === '' && messageValue === '';
      results.push({
        test: 'TEST 9: Form reset after success',
        result: formReset ? 'PASS' : 'FAIL'
      });
      console.log('Form reset:', formReset ? 'PASS' : 'FAIL');

      await page.screenshot({ path: '.playwright-mcp/test9-form-reset.png' });
    }

    // Test 10: Accessibility check
    console.log('\n=== TEST 10: Accessibility ===');
    const ariaErrors = await page.locator('[aria-invalid="true"]').count();
    const ariaLabels = await page.locator('label[for]').count();
    const inputsWithLabels = await page.locator('input[id], textarea[id], select[id]').count();

    results.push({
      test: 'TEST 10: Accessibility',
      ariaErrors: ariaErrors,
      labelsWithFor: ariaLabels,
      inputsWithIds: inputsWithLabels
    });
    console.log('ARIA invalid attributes:', ariaErrors);
    console.log('Labels with for attribute:', ariaLabels);
    console.log('Inputs with id attributes:', inputsWithLabels);

    // Final screenshot
    await page.screenshot({ path: '.playwright-mcp/test-final.png', fullPage: true });

  } catch (error) {
    console.error('Test error:', error);
    results.push({
      test: 'ERROR',
      error: error.message
    });
  } finally {
    await browser.close();

    // Print results summary
    console.log('\n========================================');
    console.log('TEST RESULTS SUMMARY');
    console.log('========================================');
    results.forEach(r => {
      console.log(JSON.stringify(r, null, 2));
    });
    console.log('========================================');

    // Write results to file
    const fs = await import('fs');
    fs.writeFileSync('.playwright-mcp/contact-form-test-results.json', JSON.stringify(results, null, 2));
  }
})();
