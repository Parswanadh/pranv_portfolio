const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for React to hydrate and Iris component to mount
  await page.waitForTimeout(5000);

  // Take screenshot
  await page.screenshot({ path: '.playwright-mcp/iris-test-01-before.png', fullPage: true });
  
  // Take screenshot
  await page.screenshot({ path: '.playwright-mcp/iris-test-01-before.png', fullPage: true });
  
  // Debug: Check all buttons
  const buttonInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.map(btn => ({
      textContent: btn.textContent?.trim().substring(0, 50),
      ariaLabel: btn.getAttribute('aria-label'),
      className: btn.className.substring(0, 100),
      position: window.getComputedStyle(btn).position,
      bottom: window.getComputedStyle(btn).bottom,
      right: window.getComputedStyle(btn).right
    }));
  });

  console.log('All buttons:', JSON.stringify(buttonInfo, null, 2));

  // Try to find and click the floating Iris button using JavaScript
  const clicked = await page.evaluate(() => {
    // Find the floating button by its styling
    const buttons = Array.from(document.querySelectorAll('button'));
    const irisButton = buttons.find(btn => {
      const style = window.getComputedStyle(btn);
      const text = btn.textContent?.trim() || '';
      return style.position === 'fixed' &&
             (style.bottom.includes('24px') || style.bottom.includes('1.5rem')) &&
             (style.right.includes('24px') || style.right.includes('1.5rem'));
    });

    if (irisButton) {
      console.log('Found floating button:', irisButton.textContent);
      irisButton.click();
      return true;
    }
    return false;
  });

  console.log('Clicked floating button:', clicked);

  // If floating button not found, try the main page button
  if (!clicked) {
    const mainButtonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      const irisButton = buttons.find(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        return text.includes('chat with iris') || text.includes('iris');
      });

      if (irisButton) {
        console.log('Found main Iris button:', irisButton.textContent);
        irisButton.click();
        return true;
      }
      return false;
    });

    console.log('Clicked main button:', mainButtonClicked);
  }
  
  // Wait for chat panel to appear
  await page.waitForTimeout(2000);
  
  // Take screenshot of chat panel
  await page.screenshot({ path: '.playwright-mcp/iris-test-02-chat-open.png', fullPage: true });
  
  // Check if chat panel is open
  const chatOpen = await page.evaluate(() => {
    // Try multiple selectors
    const selectors = [
      '[class*="fixed bottom-4"][class*="backdrop-blur"]',
      '[class*="fixed bottom-6"][class*="backdrop-blur"]',
      '[role="dialog"]',
      '[aria-label*="chat" i]',
      '[class*="z-[10001]"]'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        console.log('Found chat panel with selector:', selector);
        return true;
      }
    }

    // Also check if any element with Iris-related text is visible
    const allElements = Array.from(document.querySelectorAll('*'));
    const irisChat = allElements.find(el => {
      const text = el.textContent?.toLowerCase() || '';
      const className = el.className || '';
      return (text.includes('iris') && text.includes('ready to help')) ||
             (className.includes('fixed') && className.includes('backdrop-blur') && el.textContent?.includes('Iris'));
    });

    return irisChat !== null;
  });

  console.log('Chat panel open:', chatOpen);

  // Take another screenshot to debug
  await page.screenshot({ path: '.playwright-mcp/iris-test-02a-after-click.png', fullPage: true });
  
  if (chatOpen) {
    // Type the question
    await page.fill('input[placeholder*="Ask Iris"]', 'What are Balcha\'s top skills?');
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '.playwright-mcp/iris-test-03-question-typed.png', fullPage: true });
    
    // Click send button
    await page.click('button[aria-label="Send"]');
    
    // Wait for response
    await page.waitForTimeout(8000);
    
    // Take screenshot of response
    await page.screenshot({ path: '.playwright-mcp/iris-test-04-response.png', fullPage: true });
    
    // Get the response text
    const messages = await page.evaluate(() => {
      const messageElements = document.querySelectorAll('[class*="space-y-4"] p');
      return Array.from(messageElements).map(el => el.textContent);
    });
    
    console.log('Messages:', messages);
    
    // Check if response mentions Balcha's skills correctly
    const lastMessage = messages[messages.length - 1] || '';
    const talksAboutBalcha = lastMessage.toLowerCase().includes('balcha') || 
                             lastMessage.toLowerCase().includes('generative ai') ||
                             lastMessage.toLowerCase().includes('embedded systems');
    
    console.log('Response talks about Balcha:', talksAboutBalcha);
    console.log('Response text:', lastMessage);
  }
  
  await browser.close();
})();
