import { chromium } from 'playwright';
import fs from 'fs';

async function inspectChatPanelCSS() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to localhost:3005...');
    await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Click the Iris chat button to open the panel
    console.log('Opening Iris chat panel...');
    const chatButton = page.locator('button[aria-label="Chat with Iris"]');
    await chatButton.click();
    await page.waitForTimeout(2000);

    // Get the chat panel element
    const chatPanel = page.locator('.fixed.bottom-4.right-4').first();

    // Inspect computed styles for the main panel
    console.log('\n=== MAIN CHAT PANEL CSS ===');
    const panelStyles = await chatPanel.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        border: computed.border,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
        zIndex: computed.zIndex
      };
    });
    console.log(JSON.stringify(panelStyles, null, 2));

    // Inspect the input container
    console.log('\n=== INPUT CONTAINER CSS ===');
    const inputContainer = page.locator('.p-4.border-t').first();
    const inputContainerStyles = await inputContainer.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderTop: computed.borderTop
      };
    });
    console.log(JSON.stringify(inputContainerStyles, null, 2));

    // Inspect the input field
    console.log('\n=== INPUT FIELD CSS ===');
    const inputField = page.locator('input[type="text"]').first();
    const inputFieldStyles = await inputField.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        border: computed.border,
        placeholderColor: computed.getPropertyValue('--color-text-tertiary')
      };
    });
    console.log(JSON.stringify(inputFieldStyles, null, 2));

    // Inspect the messages container
    console.log('\n=== MESSAGES CONTAINER CSS ===');
    const messagesContainer = page.locator('.overflow-y-auto.p-4').first();
    const messagesStyles = await messagesContainer.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    console.log(JSON.stringify(messagesStyles, null, 2));

    // Check CSS variables in :root
    console.log('\n=== CSS VARIABLES ===');
    const cssVariables = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(root);
      return {
        bgPrimary: styles.getPropertyValue('--color-bg-primary'),
        bgSecondary: styles.getPropertyValue('--color-bg-secondary'),
        bgTertiary: styles.getPropertyValue('--color-bg-tertiary'),
        bgElevated: styles.getPropertyValue('--color-bg-elevated'),
        textPrimary: styles.getPropertyValue('--color-text-primary'),
        textSecondary: styles.getPropertyValue('--color-text-secondary'),
        textTertiary: styles.getPropertyValue('--color-text-tertiary')
      };
    });
    console.log(JSON.stringify(cssVariables, null, 2));

    // Take a screenshot of the chat panel
    console.log('\nTaking screenshots...');
    await chatPanel.screenshot({
      path: 'chat-panel-screenshot.png',
      animations: 'disabled'
    });

    // Take a full page screenshot with the chat open
    await page.screenshot({
      path: 'page-with-chat-open.png',
      fullPage: true,
      animations: 'disabled'
    });

    // Get the HTML structure of the chat panel
    const chatPanelHTML = await chatPanel.evaluate((el) => {
      return el.outerHTML;
    });
    fs.writeFileSync('chat-panel-html.txt', chatPanelHTML);

    console.log('\nScreenshots saved:');
    console.log('- chat-panel-screenshot.png');
    console.log('- page-with-chat-open.png');
    console.log('- chat-panel-html.txt');

    console.log('\nPress Enter to close browser...');
    // Wait for user input before closing
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

inspectChatPanelCSS();
