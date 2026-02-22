# Playwright Testing Quick Start Guide

## Running the Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test comprehensive-audit.spec.ts
```

### Run with Headed Browser (See Browser)
```bash
npx playwright test --headed
```

### Run Only Chromium Tests
```bash
npx playwright test --project=chromium
```

### Run Console Error Test (Quick Check)
```bash
npx playwright test console-errors.spec.ts --project=chromium
```

## Test Files

### `e2e/comprehensive-audit.spec.ts`
Full test suite with 7 test scenarios:
1. Homepage - Load and Capture
2. Iris Chat Bot - Open and Test
3. Navigation - Header and Command Palette
4. Page Load Tests - All Pages
5. Console and Network Errors Summary
6. Accessibility Quick Check
7. Mobile Responsiveness Check

### `e2e/console-errors.spec.ts`
Focused test for capturing:
- Console errors
- Console warnings
- Network failures
- API 401 errors

## Test Reports

After running tests, check these files:

### `PLAYWRIGHT_TEST_REPORT.md`
Complete comprehensive report with:
- All test results
- Screenshots captured
- Error analysis
- Recommendations

### `CONSOLE_ERROR_REPORT.md`
Console and network error analysis with:
- Error counts
- Error details
- Fix recommendations

### `error-report.json`
Machine-readable error data for CI/CD integration

## Screenshots

All screenshots saved to project root:

- `home-page.png` - Homepage full page
- `iris-chat-open.png` - Chat interface
- `iris-chat-message-sent.png` - After sending message
- `command-palette-open.png` - Command palette
- `final-*-page.png` - All main pages
- `responsive-*.png` - Mobile, tablet, desktop views

## Key Findings from Latest Test

✅ **All Systems Operational**
- Console Errors: 0
- Network Failures: 0
- API 401 Errors: 0
- Accessibility: All good
- Responsive Design: Working

## Adding New Tests

1. Create new `.spec.ts` file in `e2e/` directory
2. Use Playwright test syntax:
```typescript
import { test, expect } from '@playwright/test';

test('My new test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Your test code here
});
```

3. Run with: `npx playwright test your-test.spec.ts`

## Troubleshooting

### Browsers Not Installed
```bash
npx playwright install
```

### Port Already in Use
Make sure dev server is running:
```bash
npm run dev
```

### Tests Running Too Slow
- Use `--project=chromium` to test only one browser
- Reduce `waitUntil: 'networkidle'` timeouts
- Run tests in parallel (default behavior)

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Playwright tests
  run: |
    npx playwright install --with-deps
    npx playwright test
```

## Resources

- Playwright Docs: https://playwright.dev/
- Test Config: `playwright.config.ts`
- Test Directory: `e2e/`

---

**Last Test Run:** 2026-02-19
**Status:** ALL TESTS PASSED ✅
