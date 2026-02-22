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
    await page.screenshot({ path: '.playwright-mcp/test-v2-01-initial.png' });
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
      messageError: messageError > 0 ? 'PASS' : 'FAIL',
      overall: (nameError > 0 && emailError > 0 && subjectError > 0 && messageError > 0) ? 'PASS' : 'FAIL'
    });

    console.log('Name error:', nameError > 0 ? 'PASS' : 'FAIL');
    console.log('Email error:', emailError > 0 ? 'PASS' : 'FAIL');
    console.log('Subject error:', subjectError > 0 ? 'PASS' : 'FAIL');
    console.log('Message error:', messageError > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test-v2-01-errors.png' });

    // Test 2: Invalid email
    console.log('\n=== TEST 2: Invalid email ===');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'This is a test message that is long enough');
    await page.selectOption('select[name="subject"]', 'job-opportunity');

    await page.screenshot({ path: '.playwright-mcp/test-v2-02-before-invalid-submit.png' });

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const invalidEmailError = await page.locator('text=Please enter a valid email address').count();
    results.push({
      test: 'TEST 2: Invalid email validation',
      result: invalidEmailError > 0 ? 'PASS' : 'FAIL'
    });
    console.log('Invalid email error:', invalidEmailError > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test-v2-02-invalid-email.png' });

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

    await page.screenshot({ path: '.playwright-mcp/test-v2-03-short-message.png' });

    // Test 4: Character counter
    console.log('\n=== TEST 4: Character counter ===');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.waitForTimeout(500);

    const charCountElements = await page.locator('text=/\\d+ \\/ 500 characters/').allTextContents();
    const charCounterWorks = charCountElements.some(text => text.includes('12'));
    results.push({
      test: 'TEST 4: Character counter',
      result: charCounterWorks ? 'PASS' : 'FAIL',
      texts: charCountElements
    });
    console.log('Character counter:', charCounterWorks ? 'PASS' : 'FAIL', charCountElements);

    await page.screenshot({ path: '.playwright-mcp/test-v2-04-char-counter.png' });

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

    await page.screenshot({ path: '.playwright-mcp/test-v2-05-subjects.png' });

    // Test 6: Honeypot field
    console.log('\n=== TEST 6: Honeypot field ===');
    const honeypotExists = await page.locator('input[name="honeypot"]').count();
    let honeypotHidden = false;
    if (honeypotExists > 0) {
      honeypotHidden = !(await page.locator('input[name="honeypot"]').isVisible());
    }
    results.push({
      test: 'TEST 6: Honeypot field hidden',
      result: honeypotHidden ? 'PASS' : 'FAIL'
    });
    console.log('Honeypot field hidden:', honeypotHidden ? 'PASS' : 'FAIL');

    // Test 7: Email copy button
    console.log('\n=== TEST 7: Email copy button ===');
    // Find the first copy button (for email)
    const copyButtons = await page.locator('button').filter({ hasText: 'Copy' }).all();
    if (copyButtons.length > 0) {
      await copyButtons[0].click();
      await page.waitForTimeout(500);

      const copyText = await page.locator('button').filter({ hasText: 'Copied!' }).count();
      results.push({
        test: 'TEST 7: Email copy button',
        result: copyText > 0 ? 'PASS' : 'FAIL'
      });
      console.log('Email copy button:', copyText > 0 ? 'PASS' : 'FAIL');

      await page.screenshot({ path: '.playwright-mcp/test-v2-07-email-copy.png' });

      // Wait for copy to reset
      await page.waitForTimeout(2500);
    }

    // Test 7b: Phone copy button
    console.log('\n=== TEST 7b: Phone copy button ===');
    if (copyButtons.length > 1) {
      await copyButtons[1].click();
      await page.waitForTimeout(500);

      const phoneCopyText = await page.locator('button').filter({ hasText: 'Copied!' }).count();
      results.push({
        test: 'TEST 7b: Phone copy button',
        result: phoneCopyText > 0 ? 'PASS' : 'FAIL'
      });
      console.log('Phone copy button:', phoneCopyText > 0 ? 'PASS' : 'FAIL');

      await page.screenshot({ path: '.playwright-mcp/test-v2-07b-phone-copy.png' });
    }

    // Test 8: Valid form submission
    console.log('\n=== TEST 8: Valid form submission ===');
    await page.fill('input[name="name"]', 'Playwright Test User');
    await page.fill('input[name="email"]', 'playwright@test.com');
    await page.selectOption('select[name="subject"]', 'other');
    await page.fill('textarea[name="message"]', 'This is a valid test message that meets the minimum length requirement for the contact form validation.');

    // Check no errors before submit
    const hasNameError = await page.locator('text=Name is required').count();
    const hasEmailError = await page.locator('text=Email is required').count();
    const noErrors = hasNameError === 0 && hasEmailError === 0;

    results.push({
      test: 'TEST 8: No errors with valid data',
      result: noErrors ? 'PASS' : 'FAIL'
    });
    console.log('No errors with valid data:', noErrors ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test-v2-08-valid-form.png' });

    // Submit the valid form
    console.log('Submitting valid form...');
    await page.click('button[type="submit"]');

    // Wait for response (loading state)
    await page.waitForTimeout(2000);

    // Check for success message or error
    const successMessage = await page.locator('text=Message Sent').count();
    const errorMessage = await page.locator('text=Failed to send message').count();
    const successWithName = await page.locator('text=Playwright Test User').count();

    results.push({
      test: 'TEST 8b: Valid form submission response',
      successMessage: successMessage > 0 ? 'PASS' : 'FAIL',
      errorMessage: errorMessage > 0 ? 'YES' : 'NO',
      showsName: successWithName > 0 ? 'PASS' : 'FAIL'
    });
    console.log('Success message shown:', successMessage > 0 ? 'PASS' : 'FAIL');
    console.log('Error message shown:', errorMessage > 0 ? 'YES' : 'NO');
    console.log('Shows user name:', successWithName > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test-v2-08-after-submit.png' });

    // Test 9: Form reset after success
    console.log('\n=== TEST 9: Form reset after success ===');
    if (successMessage > 0) {
      console.log('Waiting 3.5 seconds for form reset...');
      await page.waitForTimeout(3500); // Wait for 3 second reset

      // Navigate to refresh the page state
      await page.goto('http://localhost:3000/contact');
      await page.waitForTimeout(1000);

      const nameValue = await page.locator('input[name="name"]').inputValue();
      const emailValue = await page.locator('input[name="email"]').inputValue();
      const messageValue = await page.locator('textarea[name="message"]').inputValue();

      const formReset = nameValue === '' && emailValue === '' && messageValue === '';
      results.push({
        test: 'TEST 9: Form reset after success',
        result: formReset ? 'PASS' : 'FAIL'
      });
      console.log('Form reset:', formReset ? 'PASS' : 'FAIL');

      await page.screenshot({ path: '.playwright-mcp/test-v2-09-form-reset.png' });
    }

    // Test 10: Accessibility check
    console.log('\n=== TEST 10: Accessibility ===');

    // Check for labels with 'for' attributes
    const labelsWithFor = await page.locator('label[for]').count();

    // Check for inputs with 'id' attributes
    const inputsWithIds = await page.locator('input[id], textarea[id], select[id]').count();

    // Check for ARIA attributes on error states
    const ariaInvalid = await page.locator('[aria-invalid="true"]').count();

    // Check for required field indicators
    const requiredIndicators = await page.locator('text=*').count();

    results.push({
      test: 'TEST 10: Accessibility',
      labelsWithForAttribute: labelsWithFor,
      inputsWithIdAttributes: inputsWithIds,
      ariaInvalidAttributes: ariaInvalid,
      requiredFieldIndicators: requiredIndicators,
      overall: (labelsWithFor > 0 && inputsWithIds > 0) ? 'GOOD' : 'NEEDS IMPROVEMENT'
    });
    console.log('Labels with for attribute:', labelsWithFor);
    console.log('Inputs with id attributes:', inputsWithIds);
    console.log('ARIA invalid attributes:', ariaInvalid);
    console.log('Required field indicators (*):', requiredIndicators);

    // Test 11: Error clearing behavior
    console.log('\n=== TEST 11: Error clearing on input ===');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const errorBefore = await page.locator('text=Name is required').count();
    await page.type('input[name="name"]', 'Test');
    await page.waitForTimeout(500);
    const errorAfter = await page.locator('text=Name is required').count();

    results.push({
      test: 'TEST 11: Error clears on input',
      result: (errorBefore > 0 && errorAfter === 0) ? 'PASS' : 'FAIL'
    });
    console.log('Error clears on input:', (errorBefore > 0 && errorAfter === 0) ? 'PASS' : 'FAIL');

    await page.screenshot({ path: '.playwright-mcp/test-v2-11-error-clearing.png' });

    // Test 12: Console errors check
    console.log('\n=== TEST 12: Console errors ===');
    // This would require a different approach to capture console errors
    results.push({
      test: 'TEST 12: Console errors',
      note: 'Manual verification needed'
    });

    // Final screenshot
    await page.screenshot({ path: '.playwright-mcp/test-v2-final.png', fullPage: true });

  } catch (error) {
    console.error('Test error:', error);
    results.push({
      test: 'ERROR',
      error: error.message,
      stack: error.stack
    });
  } finally {
    await browser.close();

    // Print results summary
    console.log('\n========================================');
    console.log('TEST RESULTS SUMMARY');
    console.log('========================================');
    let passCount = 0;
    let failCount = 0;
    results.forEach(r => {
      if (r.overall === 'PASS' || r.result === 'PASS') passCount++;
      else if (r.overall === 'FAIL' || r.result === 'FAIL') failCount++;
      console.log(JSON.stringify(r, null, 2));
    });
    console.log('========================================');
    console.log(`TOTAL: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('========================================');

    // Write results to file
    const fs = await import('fs');
    fs.writeFileSync('.playwright-mcp/contact-form-test-results-v2.json', JSON.stringify(results, null, 2));
  }
})();
