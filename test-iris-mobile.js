const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 } // iPhone X dimensions
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for React to hydrate
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: '.playwright-mcp/iris-mobile-01-homepage.png', fullPage: true });
  
  // Find and click the floating Iris button
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const irisButton = buttons.find(btn => {
      const style = window.getComputedStyle(btn);
      const text = btn.textContent?.trim() || '';
      return style.position === 'fixed' &&
             (style.bottom.includes('24px') || style.bottom.includes('1.5rem')) &&
             (style.right.includes('24px') || style.right.includes('1.5rem'));
    });

    if (irisButton) {
      irisButton.click();
      return true;
    }
    return false;
  });
  
  console.log('Mobile: Clicked floating button:', clicked);
  
  // Wait for chat panel
  await page.waitForTimeout(2000);
  
  // Take screenshot of chat panel
  await page.screenshot({ path: '.playwright-mcp/iris-mobile-02-chat-open.png', fullPage: true });
  
  // Type the question
  await page.fill('input[placeholder*="Ask Iris"]', 'What are Pranav\'s top skills?');
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '.playwright-mcp/iris-mobile-03-question-typed.png', fullPage: true });
  
  // Click send button
  await page.click('button[aria-label="Send"]');
  
  // Wait for response
  await page.waitForTimeout(8000);
  
  // Take screenshot of response
  await page.screenshot({ path: '.playwright-mcp/iris-mobile-04-response.png', fullPage: true });
  
  // Get the response text
  const response = await page.evaluate(() => {
    const messages = document.querySelectorAll('[class*="space-y-4"] p');
    return Array.from(messages).map(el => el.textContent);
  });
  
  console.log('Mobile: Messages:', response);
  
  // Check if response talks about Pranav
  const lastMessage = response[response.length - 1] || '';
  const talksAboutPranav = lastMessage.toLowerCase().includes('pranav') || 
                           lastMessage.toLowerCase().includes('generative ai') ||
                           lastMessage.toLowerCase().includes('embedded systems');
  
  console.log('Mobile: Response talks about Pranav:', talksAboutPranav);
  console.log('Mobile: Response text:', lastMessage);
  
  await browser.close();
})();
