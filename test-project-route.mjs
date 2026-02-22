#!/usr/bin/env node

/**
 * Test script to verify project routes are working
 */

async function testRoute(url, expectedTitle) {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html',
      },
    });

    const text = await response.text();

    console.log(`\nTesting: ${url}`);
    console.log(`Status: ${response.status}`);

    // Check for actual 404 page indicators
    const isNotFoundPage = text.includes('__next_error__') ||
                           (text.includes('not-found') && text.includes('FileQuestion') && !text.includes(expectedTitle));

    if (isNotFoundPage) {
      console.log('❌ FAILED: 404 Not Found page detected');
      return false;
    }

    if (text.includes(expectedTitle) || text.includes('Project Demo') || text.includes('interactive Demo')) {
      console.log(`✅ SUCCESS: Project page loaded (found: ${expectedTitle})`);
      return true;
    }

    console.log('⚠️  UNKNOWN: Unexpected response');
    return false;
  } catch (error) {
    console.error(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Project Routes Test');
  console.log('='.repeat(60));

  const baseUrl = 'http://localhost:3000';
  const routes = [
    { path: '/projects/pro-code', title: 'PRO_CODE' },
    { path: '/projects/auto-git-publisher', title: 'AUTO-GIT' },
    { path: '/projects/gpt-oss-vision', title: 'GPT-OSS' },
  ];

  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `${baseUrl}${route.path}`;
    const success = await testRoute(url, route.title);

    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
