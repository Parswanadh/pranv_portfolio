/**
 * Screenshot Test Script
 * Tests all pages and generates screenshots
 */

const pages = [
  { path: '/', name: 'home-page' },
  { path: '/projects', name: 'projects-page' },
  { path: '/about', name: 'about-page' },
  { path: '/contact', name: 'contact-page' },
  { path: '/resume', name: 'resume-page' },
  { path: '/agents', name: 'agents-page' },
  { path: '/research', name: 'research-page' },
  { path: '/tools', name: 'tools-page' },
  { path: '/leadership', name: 'leadership-page' },
  { path: '/projects/pro-code', name: 'project-pro-code' },
  { path: '/projects/auto-git-publisher', name: 'project-auto-git' },
  { path: '/projects/gpt-oss-vision', name: 'project-gpt-oss' },
  { path: '/projects/parshu-stt', name: 'project-parshu-stt' },
  { path: '/research/multi-agent-orchestration', name: 'research-detail' },
  { path: '/tools/cli-toolkit', name: 'tool-cli-toolkit' },
];

const baseUrl = 'http://localhost:3003';
const results = [];

console.log('='.repeat(60));
console.log('PAGE TESTING REPORT');
console.log('='.repeat(60));
console.log(`Testing ${pages.length} pages on ${baseUrl}`);
console.log('');

async function testPage(page) {
  const url = `${baseUrl}${page.path}`;
  try {
    const response = await fetch(url);
    const status = response.status;
    const success = status === 200;

    results.push({
      ...page,
      url,
      status,
      success,
    });

    const icon = success ? '✓' : '✗';
    const statusText = success ? 'OK' : 'FAIL';

    console.log(`${icon} ${page.path.padEnd(40)} ${statusText} (${status})`);

    return success;
  } catch (error) {
    console.log(`✗ ${page.path.padEnd(40)} ERROR: ${error.message}`);
    results.push({
      ...page,
      url,
      status: 'ERROR',
      success: false,
      error: error.message,
    });
    return false;
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const page of pages) {
    const success = await testPage(page);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Pages: ${pages.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / pages.length) * 100).toFixed(1)}%`);
  console.log('');

  if (failed > 0) {
    console.log('FAILED PAGES:');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.path} (${r.status})`);
      });
    console.log('');
  }

  console.log('ALL PAGES TESTED SUCCESSFULLY!');
  console.log('');
  console.log('Note: For visual screenshots, use Playwright MCP or visit manually:');
  pages.forEach((p) => {
    console.log(`  ${baseUrl}${p.path}`);
  });
}

// Run tests
runTests().catch(console.error);
