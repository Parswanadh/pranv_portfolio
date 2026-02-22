import { chromium } from 'playwright';

async function checkConsoleErrors() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  const urls = [
    'http://localhost:3000/projects/auto-git-publisher',
    'http://localhost:3000/projects/pro-code'
  ];

  for (const url of urls) {
    console.log(`\n🔍 Checking: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
  }

  await browser.close();

  if (errors.length === 0) {
    console.log('\n✅ No console errors found!');
  } else {
    console.log(`\n⚠️ Found ${errors.length} console errors:`);
    errors.forEach(err => {
      console.log(`  - ${err.text}`);
    });
  }

  return errors;
}

checkConsoleErrors().then(errors => {
  process.exit(errors.length > 0 ? 1 : 0);
});
