import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Navigate to homepage
  console.log('Navigating to http://localhost:3001');
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');

  // Wait for React to hydrate and CommandPalette to mount
  console.log('Waiting for CommandPalette component to mount...');
  await page.waitForTimeout(3000);

  // Check if CommandPalette is in the DOM
  const commandPaletteMounted = await page.evaluate(() => {
    // Check for cmdk dialog container or data-radix attributes
    const cmdkElements = document.querySelectorAll('[data-radix-dialog-content], [cmdk-root], [data-state]');
    return {
      cmdkElements: cmdkElements.length,
      cmdkElementTags: Array.from(cmdkElements).map(el => ({
        tag: el.tagName,
        dataState: el.getAttribute('data-state'),
        dataRadix: el.getAttribute('data-radix-dialog-content')
      }))
    };
  });

  console.log('CommandPalette mount check:', JSON.stringify(commandPaletteMounted, null, 2));

  // Take initial screenshot
  await page.screenshot({ path: '.playwright-results/screenshots/command-palette-01-initial.png' });
  console.log('Screenshot saved: command-palette-01-initial.png');

  // Test 1: Try Ctrl+K
  console.log('\n=== Test 1: Ctrl+K Keyboard Shortcut ===');
  await page.keyboard.press('Control+K');
  await page.waitForTimeout(1500);

  const dialogVisibleAfterCtrlK = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog && dialog.offsetParent !== null;
  });

  console.log('Dialog visible after Ctrl+K:', dialogVisibleAfterCtrlK);
  await page.screenshot({ path: '.playwright-results/screenshots/command-palette-02-after-ctrlk.png' });
  console.log('Screenshot saved: command-palette-02-after-ctrlk.png');

  // Test 2: Try clicking the button and also check component mount
  console.log('\n=== Test 2: Button Click & Custom Event ===');

  // First check if command palette button exists
  const buttonInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const searchButton = buttons.find(b => b.textContent.includes('Search') || b.getAttribute('aria-label')?.includes('command'));
    return {
      totalButtons: buttons.length,
      searchButtonFound: !!searchButton,
      searchButtonText: searchButton?.textContent,
      searchButtonAriaLabel: searchButton?.getAttribute('aria-label')
    };
  });

  console.log('Button info:', JSON.stringify(buttonInfo, null, 2));

  // Test 2a: Click the button
  const buttonClicked = await page.evaluate(() => {
    const button = document.querySelector('button[aria-label*="command"], button[aria-label*="Command"]') ||
                   Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Search'));
    if (button) {
      button.click();
      return true;
    }
    return false;
  });

  await page.waitForTimeout(2000);

  // Check if dialog appeared after click
  const dialogAfterButton = await page.evaluate(() => {
    const cmdkElements = document.querySelectorAll('[data-radix-dialog-content], [cmdk-root], [data-state]');
    return {
      cmdkElements: cmdkElements.length,
      dialogVisible: Array.from(cmdkElements).some(el => el.offsetParent !== null)
    };
  });

  console.log('Dialog after button click:', JSON.stringify(dialogAfterButton, null, 2));

  // Test 2b: Try manually dispatching the custom event
  console.log('\nManually dispatching toggle-command-palette event...');
  const eventResult = await page.evaluate(() => {
    const event = new CustomEvent('toggle-command-palette', { bubbles: true, cancelable: true });
    window.dispatchEvent(event);
    return { dispatched: true };
  });

  await page.waitForTimeout(2000);

  const dialogAfterEvent = await page.evaluate(() => {
    const cmdkElements = document.querySelectorAll('[data-radix-dialog-content], [cmdk-root], [data-state]');
    return {
      cmdkElements: cmdkElements.length,
      elements: Array.from(cmdkElements).map(el => ({
        tag: el.tagName,
        dataState: el.getAttribute('data-state'),
        visible: el.offsetParent !== null
      }))
    };
  });

  console.log('Dialog after manual event:', JSON.stringify(dialogAfterEvent, null, 2));

  // Reopen dialog for tests 3-5
  console.log('\nReopening dialog for accessibility tests...');
  await page.keyboard.press('Control+K');
  await page.waitForTimeout(1000);

  // Test 3: Check DOM for DialogTitle
  console.log('\n=== Test 3: DialogTitle Element ===');
  const dialogTitleInfo = await page.evaluate(() => {
    // Check for DialogPrimitive.Title (sr-only class) within dialog
    const dialog = document.querySelector('[data-radix-dialog-content], [cmdk-root], [role="dialog"], dialog');
    if (!dialog) return { found: false, reason: 'No dialog found' };

    const title = dialog.querySelector('.sr-only, [data-radix-dialog-title], h1, h2') ||
                  document.querySelector('[data-radix-dialog-title]');
    if (title) {
      return {
        found: true,
        text: title.textContent.trim().substring(0, 50),
        tagName: title.tagName,
        className: title.className,
        id: title.id,
        inDialog: dialog.contains(title)
      };
    }
    return { found: false, reason: 'Title element not found in dialog' };
  });

  console.log('DialogTitle:', JSON.stringify(dialogTitleInfo, null, 2));

  // Test 4: Check DOM for DialogDescription
  console.log('\n=== Test 4: DialogDescription Element ===');
  const dialogDescInfo = await page.evaluate(() => {
    const dialog = document.querySelector('[data-radix-dialog-content], [cmdk-root], [role="dialog"], dialog');
    if (!dialog) return { found: false, reason: 'No dialog found' };

    // Look for description with keywords
    const allDescs = Array.from(dialog.querySelectorAll('.sr-only, p, span, [data-radix-dialog-description]'));
    const desc = allDescs.find(el => {
      const text = el.textContent.toLowerCase();
      return text.includes('search') || text.includes('command') || text.includes('type a command');
    });

    if (desc) {
      return {
        found: true,
        text: desc.textContent.trim().substring(0, 100),
        tagName: desc.tagName,
        className: desc.className,
        id: desc.id,
        inDialog: dialog.contains(desc)
      };
    }
    return { found: false, reason: 'Description not found', checked: allDescs.length };
  });

  console.log('DialogDescription:', JSON.stringify(dialogDescInfo, null, 2));

  // Test 5: Check dialog properties
  console.log('\n=== Test 5: Dialog Properties ===');
  const dialogProps = await page.evaluate(() => {
    const dialog = document.querySelector('[data-radix-dialog-content], [cmdk-root], [role="dialog"], dialog');
    if (!dialog) return { exists: false };
    const computedStyle = window.getComputedStyle(dialog);
    return {
      exists: true,
      visible: dialog.offsetParent !== null,
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity,
      zIndex: computedStyle.zIndex,
      ariaLabel: dialog.getAttribute('aria-label'),
      ariaLabelledBy: dialog.getAttribute('aria-labelledby'),
      ariaDescribedBy: dialog.getAttribute('aria-describedby'),
      role: dialog.getAttribute('role'),
      tagName: dialog.tagName,
      dataState: dialog.getAttribute('data-state')
    };
  });

  console.log('Dialog Properties:', JSON.stringify(dialogProps, null, 2));

  await page.screenshot({ path: '.playwright-results/screenshots/command-palette-03-after-click.png' });
  console.log('Screenshot saved: command-palette-03-after-click.png');

  // Test 6: Test keyboard navigation - Escape key
  console.log('\n=== Test 6: Escape Key Close ===');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  const dialogAfterEscape = await page.evaluate(() => {
    const dialog = document.querySelector('[data-radix-dialog-content], [cmdk-root], [role="dialog"], dialog');
    return dialog && dialog.offsetParent !== null;
  });

  console.log('Dialog visible after Escape:', dialogAfterEscape);

  await page.screenshot({ path: '.playwright-results/screenshots/command-palette-04-after-escape.png' });
  console.log('Screenshot saved: command-palette-04-after-escape.png');

  // Test 7: Test keyboard navigation - Arrow keys
  console.log('\n=== Test 7: Keyboard Navigation ===');
  // Reopen dialog
  await page.keyboard.press('Control+K');
  await page.waitForTimeout(1000);

  const keyboardNavTest = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], dialog');
    if (!dialog) return { dialogOpen: false };

    // Check for focusable elements
    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    return {
      dialogOpen: true,
      focusableElements: focusable.length,
      firstElementTag: focusable[0]?.tagName,
      hasSearchInput: !!dialog.querySelector('input[type="text"], input[placeholder*="search" i], input[placeholder*="Search" i]')
    };
  });

  console.log('Keyboard Navigation:', JSON.stringify(keyboardNavTest, null, 2));

  // Close dialog
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Generate report
  const report = `# Command Palette Test Report

## Test Summary
- **Date**: ${new Date().toISOString()}
- **URL**: http://localhost:3001
- **Test**: Command Palette Functionality and Keyboard Shortcuts

## Test Results

### 1. Ctrl+K Keyboard Shortcut
- **Status**: ${dialogVisibleAfterCtrlK ? 'PASS ✅' : 'FAIL ❌'}
- **Details**: ${dialogVisibleAfterCtrlK ? 'Dialog opened successfully with Ctrl+K' : 'Dialog did not open with Ctrl+K - browser search may have interfered'}

### 2. Button Click Trigger
- **Status**: ${buttonClicked ? 'PASS ✅' : 'FAIL ❌'}
- **Details**: ${buttonClicked ? 'Button found and clicked' : 'Button not found'}

### 3. DialogTitle Element (Accessibility)
- **Status**: ${dialogTitleInfo.found ? 'PASS ✅' : 'FAIL ❌'}
- **Details**: ${dialogTitleInfo.found ? `Found: ${dialogTitleInfo.tagName}#${dialogTitleInfo.id} - "${dialogTitleInfo.text}"` : 'DialogTitle element not found in DOM'}
- **Impact**: ${dialogTitleInfo.found ? 'Meets accessibility requirements' : 'Missing required accessibility element'}

### 4. DialogDescription Element (Accessibility)
- **Status**: ${dialogDescInfo.found ? 'PASS ✅' : 'FAIL ❌'}
- **Details**: ${dialogDescInfo.found ? `Found: ${dialogDescInfo.tagName}#${dialogDescInfo.id}` : 'DialogDescription element not found in DOM'}
- **Impact**: ${dialogDescInfo.found ? 'Meets accessibility requirements' : 'Missing required accessibility element'}

### 5. Dialog Properties
\`\`\`json
${JSON.stringify(dialogProps, null, 2)}
\`\`\`

**Analysis**:
- Dialog exists in DOM: ${dialogProps.exists ? 'Yes' : 'No'}
- Dialog visible: ${dialogProps.visible ? 'Yes' : 'No'}
- ARIA attributes: ${dialogProps.ariaLabel || dialogProps.ariaLabelledBy ? 'Present' : 'Missing'}
- Role attribute: ${dialogProps.role || dialogProps.tagName}

### 6. Escape Key Close
- **Status**: ${!dialogAfterEscape ? 'PASS ✅' : 'FAIL ❌'}
- **Details**: ${!dialogAfterEscape ? 'Dialog closed successfully with Escape key' : 'Dialog did not close with Escape key'}

### 7. Keyboard Navigation
\`\`\`json
${JSON.stringify(keyboardNavTest, null, 2)}
\`\`\`

**Analysis**:
- Dialog open for keyboard test: ${keyboardNavTest.dialogOpen ? 'Yes' : 'No'}
- Focusable elements: ${keyboardNavTest.focusableElements || 0}
- Has search input: ${keyboardNavTest.hasSearchInput ? 'Yes' : 'No'}

### 8. Console Errors
${consoleErrors.length > 0 ? consoleErrors.map(e => `- ${e}`).join('\n') : 'No console errors detected ✅'}

## Screenshots
All screenshots saved to: \`D:\\projects\\portfolio\\.playwright-results\\screenshots\\\`
- \`command-palette-01-initial.png\` - Initial page state
- \`command-palette-02-after-ctrlk.png\` - After Ctrl+K press
- \`command-palette-03-after-click.png\` - After button click (dialog should be visible)
- \`command-palette-04-after-escape.png\` - After Escape key (dialog should be closed)

## Issues Found

${!dialogVisibleAfterCtrlK ? '### ❌ CRITICAL: Ctrl+K Keyboard Shortcut Not Working\n- Pressing Ctrl+K does not open the command palette\n- Browser search may be intercepting the keyboard event\n- Recommendation: Use event.preventDefault() in the keydown handler\n' : ''}

${!dialogTitleInfo.found ? '### ❌ ACCESSIBILITY: Missing DialogTitle Element\n- No DialogTitle element found in the dialog DOM\n- This is required for screen reader accessibility\n- Recommendation: Add <DialogTitle> or proper aria-labelledby attribute\n' : ''}

${!dialogDescInfo.found ? '### ❌ ACCESSIBILITY: Missing DialogDescription Element\n- No DialogDescription element found in the dialog DOM\n- This helps screen readers announce dialog purpose\n- Recommendation: Add <DialogDescription> or proper aria-describedby attribute\n' : ''}

${dialogAfterEscape ? '### ⚠️ Escape Key Not Closing Dialog\n- Pressing Escape does not close the command palette\n- This is expected keyboard behavior for modals\n- Recommendation: Add Escape key handler\n' : ''}

${!dialogProps.visible && dialogProps.exists ? '### ⚠️ Dialog Exists But Not Visible\n- Dialog element exists in DOM but not visible\n- May be hidden with CSS or not properly shown\n- Check display, visibility, and opacity styles\n' : ''}

## Overall Assessment

**Tests Passed**: ${[
  dialogVisibleAfterCtrlK,
  buttonClicked,
  dialogTitleInfo.found,
  dialogDescInfo.found,
  !dialogAfterEscape,
  keyboardNavTest.dialogOpen
  ].filter(Boolean).length} / 6

**Severity Breakdown**:
- Critical Issues: ${[!dialogVisibleAfterCtrlK, !dialogProps.visible && dialogProps.exists].filter(Boolean).length}
- Accessibility Issues: ${[!dialogTitleInfo.found, !dialogDescInfo.found].filter(Boolean).length}
- Minor Issues: ${[dialogAfterEscape, !keyboardNavTest.hasSearchInput].filter(Boolean).length}

## Recommendations

### Immediate Actions Required:
1. ${!dialogVisibleAfterCtrlK ? 'Fix Ctrl+K keyboard shortcut by adding event.preventDefault() to prevent browser search interference' : '✅ Ctrl+K shortcut working'}
2. ${!dialogTitleInfo.found ? 'Add DialogTitle element to dialog for accessibility compliance' : '✅ DialogTitle present'}
3. ${!dialogDescInfo.found ? 'Add DialogDescription element to dialog for better screen reader support' : '✅ DialogDescription present'}

### Best Practices:
4. ${dialogAfterEscape ? 'Implement Escape key handler to close dialog' : '✅ Escape key working'}
5. Ensure all interactive elements in dialog are keyboard accessible
6. Add visible focus indicators for keyboard navigation
7. Test with screen reader to ensure proper ARIA announcements

### Code Example (if DialogTitle/Description missing):
\`\`\`jsx
<Dialog>
  <DialogTitle>Command Palette</DialogTitle>
  <DialogDescription>Search for pages, projects, and agents</DialogDescription>
  {/* Dialog content */}
</Dialog>
\`\`\`

---

**Test Completed**: ${new Date().toLocaleString()}
**Test Tool**: Playwright E2E Testing
**Report Location**: \`D:\\projects\\portfolio\\.playwright-results\\command-palette-report.md\`
`;

  // Write report
  fs.writeFileSync('.playwright-results/command-palette-report.md', report);

  console.log('\n=== Test Complete ===');
  console.log('Full report saved to: .playwright-results/command-palette-report.md');
  console.log(`\nTests Passed: ${[dialogVisibleAfterCtrlK, buttonClicked, dialogTitleInfo.found, dialogDescInfo.found, !dialogAfterEscape, keyboardNavTest.dialogOpen].filter(Boolean).length} / 6`);
  console.log(`Issues Found: ${[!dialogVisibleAfterCtrlK, !dialogTitleInfo.found, !dialogDescInfo.found, dialogAfterEscape].filter(Boolean).length}`);

  await browser.close();
})();
