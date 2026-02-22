// Test contact form using frontend simulation
import { chromium } from 'playwright';

async function testContactForm() {
  console.log('Starting contact form test with Playwright...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage();

  // Navigate to contact page
  console.log('Navigating to /contact...');
  await page.goto('http://localhost:3000/contact');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Check if contact form is visible
  console.log('Checking if contact form is visible...');
  const formVisible = await page.isVisible('form');
  console.log('Form visible:', formVisible);

  if (formVisible) {
    // Test form fields
    console.log('Testing form fields...');

    // Test empty submission
    console.log('\n1. Testing empty form submission...');
    await page.click('button[type="submit"]');

    // Check for error messages
    await page.waitForTimeout(2000);
    const errorMessages = await page.$$eval('p.text-red-400', els => els.map(el => el.textContent));
    console.log('Error messages:', errorMessages);

    // Test valid form
    console.log('\n2. Testing valid form submission...');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="subject"]', 'Job Opportunity');
    await page.fill('textarea[name="message"]', 'This is a test message to see if the contact form works properly.');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for submission
    await page.waitForTimeout(3000);

    // Check if success message appears
    const successMessage = await page.isVisible('h3:has-text("Message Sent!")');
    console.log('Success message visible:', successMessage);

    if (successMessage) {
      console.log('SUCCESS: Form submission worked!');
    } else {
      console.log('FAILURE: Form submission failed');

      // Check for error messages
      const errorText = await page.textContent('.text-red-400').catch(() => 'No error found');
      console.log('Error message:', errorText);
    }
  }

  // Close browser
  await browser.close();
  console.log('Test completed');
}

testContactForm().catch(console.error);