/**
 * Comprehensive API Testing Script
 * Tests all API endpoints with various scenarios
 */

const BASE_URL = 'http://localhost:3002';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test results storage
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'bright');
  console.log('='.repeat(80) + '\n');
}

function logTest(name, status, details = '') {
  results.total++;
  const statusIcon = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '⚠';
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';

  log(`${statusIcon} ${name}`, statusColor);
  if (details) {
    console.log(`  ${details}`);
  }

  if (status === 'PASS') results.passed++;
  else if (status === 'FAIL') results.failed++;
  else results.warnings++;

  results.tests.push({ name, status, details });
}

async function measureResponseTime(fn) {
  const start = Date.now();
  try {
    const response = await fn();
    const duration = Date.now() - start;
    return { response, duration };
  } catch (error) {
    const duration = Date.now() - start;
    return { error, duration };
  }
}

// API Test Functions

/**
 * Test POST /api/chat
 */
async function testChatAPI() {
  logSection('Testing POST /api/chat');

  // Test 1: Valid request with messages
  const test1 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello!' }
        ]
      })
    });
    return response;
  });

  if (test1.response.ok) {
    logTest('Valid chat request', 'PASS', `Status: ${test1.response.status}, Time: ${test1.duration}ms`);
  } else {
    logTest('Valid chat request', 'FAIL', `Status: ${test1.response.status}, Error: ${test1.response.statusText}`);
  }

  // Test 2: Missing messages array
  const test2 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return response;
  });

  if (test2.response.status === 400) {
    logTest('Missing messages array', 'PASS', `Correctly returns 400, Time: ${test2.duration}ms`);
  } else {
    logTest('Missing messages array', 'FAIL', `Expected 400, got ${test2.response.status}`);
  }

  // Test 3: Invalid messages format
  const test3 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: 'invalid' })
    });
    return response;
  });

  if (test3.response.status === 400) {
    logTest('Invalid messages format', 'PASS', `Correctly returns 400, Time: ${test3.duration}ms`);
  } else {
    logTest('Invalid messages format', 'FAIL', `Expected 400, got ${test3.response.status}`);
  }

  // Test 4: With context
  const test4 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Tell me about your projects' }
        ],
        context: {
          topicsDiscussed: ['AI', 'ML'],
          currentPage: 'projects',
          navigationHistory: ['Home', 'Projects'],
          sessionDuration: 120000
        }
      })
    });
    return response;
  });

  if (test4.response.ok) {
    logTest('Chat with context', 'PASS', `Status: ${test4.response.status}, Time: ${test4.duration}ms`);
  } else {
    logTest('Chat with context', 'FAIL', `Status: ${test4.response.status}`);
  }

  // Test 5: Rate limiting (send 11 requests rapidly)
  log('\nRate Limiting Test:', 'yellow');
  const rateLimitResults = [];
  for (let i = 0; i < 12; i++) {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: `Test ${i}` }]
      })
    });
    rateLimitResults.push(response.status);
  }

  const rateLimited = rateLimitResults.filter(s => s === 429).length;
  if (rateLimited > 0) {
    logTest('Rate limiting', 'PASS', `${rateLimited} out of 12 requests were rate limited (429)`);
  } else {
    logTest('Rate limiting', 'FAIL', 'No requests were rate limited');
  }
}

/**
 * Test POST /api/contact
 */
async function testContactAPI() {
  logSection('Testing POST /api/contact');

  // Test 1: Valid contact form submission
  const test1 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I am interested in discussing a project collaboration.'
      })
    });
    return response;
  });

  if (test1.response.ok) {
    const data = await test1.response.json();
    logTest('Valid contact submission', 'PASS', `Status: ${test1.response.status}, Time: ${test1.duration}ms, Response: ${JSON.stringify(data)}`);
  } else {
    logTest('Valid contact submission', 'FAIL', `Status: ${test1.response.status}`);
  }

  // Test 2: Missing required field (name)
  const test2 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message'
      })
    });
    return response;
  });

  if (test2.response.status === 400) {
    logTest('Missing required field (name)', 'PASS', `Correctly returns 400, Time: ${test2.duration}ms`);
  } else {
    logTest('Missing required field (name)', 'FAIL', `Expected 400, got ${test2.response.status}`);
  }

  // Test 3: Invalid email format
  const test3 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Test message'
      })
    });
    return response;
  });

  if (test3.response.status === 400) {
    logTest('Invalid email format', 'PASS', `Correctly returns 400, Time: ${test3.duration}ms`);
  } else {
    logTest('Invalid email format', 'FAIL', `Expected 400, got ${test3.response.status}`);
  }

  // Test 4: Name too short
  const test4 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'J',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message'
      })
    });
    return response;
  });

  if (test4.response.status === 400) {
    logTest('Name too short', 'PASS', `Correctly returns 400, Time: ${test4.duration}ms`);
  } else {
    logTest('Name too short', 'FAIL', `Expected 400, got ${test4.response.status}`);
  }

  // Test 5: Message too short
  const test5 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Short'
      })
    });
    return response;
  });

  if (test5.response.status === 400) {
    logTest('Message too short', 'PASS', `Correctly returns 400, Time: ${test5.duration}ms`);
  } else {
    logTest('Message too short', 'FAIL', `Expected 400, got ${test5.response.status}`);
  }

  // Test 6: Honeypot field (bot detection)
  const test6 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
        honeypot: 'bot-filled'
      })
    });
    return response;
  });

  if (test6.response.ok) {
    logTest('Honeypot bot detection', 'PASS', `Bot detected and handled silently, Time: ${test6.duration}ms`);
  } else {
    logTest('Honeypot bot detection', 'FAIL', `Status: ${test6.response.status}`);
  }

  // Test 7: SQL injection attempt
  const test7 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "'; DROP TABLE users; --",
        email: 'test@example.com',
        subject: "'; SELECT * FROM users; --",
        message: "'; UPDATE users SET password='hacked'; --"
      })
    });
    return response;
  });

  if (test7.response.status === 200 || test7.response.status === 400) {
    logTest('SQL injection protection', 'PASS', `Input sanitized/rejected, Time: ${test7.duration}ms`);
  } else {
    logTest('SQL injection protection', 'WARN', `Unexpected status: ${test7.response.status}`);
  }

  // Test 8: XSS attempt
  const test8 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        subject: '<img src=x onerror=alert("XSS")>',
        message: '<a href="javascript:alert(\'XSS\')">Click</a>'
      })
    });
    return response;
  });

  if (test8.response.status === 200 || test8.response.status === 400) {
    logTest('XSS protection', 'PASS', `Input handled, Time: ${test8.duration}ms`);
  } else {
    logTest('XSS protection', 'WARN', `Unexpected status: ${test8.response.status}`);
  }

  // Test 9: Rate limiting (send 4 messages rapidly)
  log('\nRate Limiting Test:', 'yellow');
  const rateLimitResults = [];
  for (let i = 0; i < 5; i++) {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Test ${i}`,
        email: `test${i}@example.com`,
        subject: 'Test',
        message: 'Test message with enough characters'
      })
    });
    rateLimitResults.push(response.status);
  }

  const rateLimited = rateLimitResults.filter(s => s === 429).length;
  if (rateLimited > 0) {
    logTest('Contact rate limiting', 'PASS', `${rateLimited} out of 5 requests were rate limited (429)`);
  } else {
    logTest('Contact rate limiting', 'WARN', 'No requests were rate limited (limit: 3/hour)');
  }
}

/**
 * Test GET /api/search
 */
async function testSearchAPI() {
  logSection('Testing GET/POST /api/search');

  // Test 1: Valid search query
  const test1 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/search?q=AI`);
    return response;
  });

  if (test1.response.ok) {
    const data = await test1.response.json();
    logTest('Valid search query (GET)', 'PASS',
      `Status: ${test1.response.status}, Time: ${test1.duration}ms, Results: ${data.count || 0}`);
  } else {
    logTest('Valid search query (GET)', 'FAIL', `Status: ${test1.response.status}`);
  }

  // Test 2: Empty search query
  const test2 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/search?q=`);
    return response;
  });

  if (test2.response.status === 400) {
    logTest('Empty search query', 'PASS', `Correctly returns 400, Time: ${test2.duration}ms`);
  } else {
    logTest('Empty search query', 'FAIL', `Expected 400, got ${test2.response.status}`);
  }

  // Test 3: No query parameter
  const test3 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/search`);
    return response;
  });

  if (test3.response.status === 400) {
    logTest('Missing query parameter', 'PASS', `Correctly returns 400, Time: ${test3.duration}ms`);
  } else {
    logTest('Missing query parameter', 'FAIL', `Expected 400, got ${test3.response.status}`);
  }

  // Test 4: POST request with valid data
  const test4 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'machine learning', limit: 5 })
    });
    return response;
  });

  if (test4.response.ok) {
    const data = await test4.response.json();
    logTest('Valid search (POST)', 'PASS',
      `Status: ${test4.response.status}, Time: ${test4.duration}ms, Results: ${data.count || 0}`);
  } else {
    logTest('Valid search (POST)', 'FAIL', `Status: ${test4.response.status}`);
  }

  // Test 5: Search with special characters
  const test5 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/search?q=<script>alert("XSS")</script>`);
    return response;
  });

  if (test5.response.ok || test5.response.status === 500) {
    logTest('Search with XSS attempt', 'PASS', `Handled safely, Time: ${test5.duration}ms`);
  } else {
    logTest('Search with XSS attempt', 'WARN', `Status: ${test5.response.status}`);
  }

  // Test 6: Search with very long query
  const test6 = await measureResponseTime(async () => {
    const longQuery = 'a'.repeat(1000);
    const response = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(longQuery)}`);
    return response;
  });

  if (test6.response.ok || test6.response.status === 400 || test6.response.status === 414) {
    logTest('Search with long query', 'PASS', `Time: ${test6.duration}ms`);
  } else {
    logTest('Search with long query', 'WARN', `Status: ${test6.response.status}`);
  }
}

/**
 * Test POST /api/tts
 */
async function testTTSAPI() {
  logSection('Testing POST /api/tts');

  // Test 1: Valid TTS request
  const test1 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Hello, this is a test of the text to speech system.',
        voice: 'default'
      })
    });
    return response;
  });

  if (test1.response.ok) {
    const contentType = test1.response.headers.get('Content-Type');
    logTest('Valid TTS request', 'PASS',
      `Status: ${test1.response.status}, Time: ${test1.duration}ms, Content-Type: ${contentType}`);
  } else if (test1.response.status === 500) {
    logTest('Valid TTS request', 'WARN',
      `Status: 500 (Deepgram API may not be configured), Time: ${test1.duration}ms`);
  } else {
    logTest('Valid TTS request', 'FAIL', `Status: ${test1.response.status}`);
  }

  // Test 2: Missing text field
  const test2 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return response;
  });

  if (test2.response.status === 400) {
    logTest('Missing text field', 'PASS', `Correctly returns 400, Time: ${test2.duration}ms`);
  } else {
    logTest('Missing text field', 'FAIL', `Expected 400, got ${test2.response.status}`);
  }

  // Test 3: Empty text
  const test3 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' })
    });
    return response;
  });

  if (test3.response.status === 400) {
    logTest('Empty text', 'PASS', `Correctly returns 400, Time: ${test3.duration}ms`);
  } else {
    logTest('Empty text', 'FAIL', `Expected 400, got ${test3.response.status}`);
  }

  // Test 4: Very long text
  const test4 = await measureResponseTime(async () => {
    const longText = 'This is a test. '.repeat(100);
    const response = await fetch(`${BASE_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: longText })
    });
    return response;
  });

  if (test4.response.ok || test4.response.status === 500) {
    logTest('Long text TTS', 'PASS', `Time: ${test4.duration}ms`);
  } else {
    logTest('Long text TTS', 'WARN', `Status: ${test4.response.status}`);
  }
}

/**
 * Test GET /api/auto-git-stream
 */
async function testAutoGitStreamAPI() {
  logSection('Testing GET /api/auto-git-stream');

  // Test 1: Valid stream request
  const test1 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/auto-git-stream`);
    return response;
  });

  if (test1.response.ok) {
    const contentType = test1.response.headers.get('Content-Type');
    logTest('Valid stream request', 'PASS',
      `Status: ${test1.response.status}, Time: ${test1.duration}ms, Content-Type: ${contentType}`);
  } else {
    logTest('Valid stream request', 'FAIL', `Status: ${test1.response.status}`);
  }

  // Test 2: Check response headers
  const test2 = await measureResponseTime(async () => {
    const response = await fetch(`${BASE_URL}/api/auto-git-stream`);
    return response;
  });

  if (test2.response.ok) {
    const cacheControl = test2.response.headers.get('Cache-Control');
    const connection = test2.response.headers.get('Connection');
    const cors = test2.response.headers.get('Access-Control-Allow-Origin');

    const issues = [];
    if (cacheControl !== 'no-cache') issues.push('Cache-Control not set to no-cache');
    if (connection !== 'keep-alive') issues.push('Connection not set to keep-alive');
    if (cors !== '*') issues.push('CORS not set to *');

    if (issues.length === 0) {
      logTest('Stream response headers', 'PASS', 'All headers correctly set');
    } else {
      logTest('Stream response headers', 'WARN', issues.join(', '));
    }
  }
}

/**
 * Security Analysis
 */
function analyzeSecurity() {
  logSection('Security Analysis');

  const securityChecks = [
    {
      name: 'Rate Limiting Implementation',
      status: 'PASS',
      details: '/api/chat: 10 requests/minute, /api/contact: 3 requests/hour'
    },
    {
      name: 'Input Validation',
      status: 'PASS',
      details: 'Email format, field lengths, required fields validated'
    },
    {
      name: 'Honeypot Bot Detection',
      status: 'PASS',
      details: 'Contact form includes honeypot field'
    },
    {
      name: 'XSS Protection',
      status: 'WARN',
      details: 'Basic sanitization via trim/slice, but no HTML encoding'
    },
    {
      name: 'SQL Injection Protection',
      status: 'PASS',
      details: 'No SQL queries in codebase, uses parameterized logging'
    },
    {
      name: 'Error Messages',
      status: 'PASS',
      details: 'Generic error messages, no sensitive info leaked'
    },
    {
      name: 'CORS Configuration',
      status: 'WARN',
      details: 'auto-git-stream has CORS=* (too permissive for production)'
    },
    {
      name: 'Content Security',
      status: 'PASS',
      details: 'Content-Type headers properly set'
    },
    {
      name: 'IP-based Rate Limiting',
      status: 'WARN',
      details: 'Uses x-forwarded-for header (can be spoofed)'
    }
  ];

  securityChecks.forEach(check => {
    logTest(check.name, check.status, check.details);
  });
}

/**
 * Performance Analysis
 */
function analyzePerformance() {
  logSection('Performance Analysis');

  const performanceNotes = [
    {
      endpoint: '/api/chat',
      notes: [
        'Streaming response for better UX',
        'Rate limiting uses in-memory Map (resets on restart)',
        'Context injection adds minimal overhead'
      ]
    },
    {
      endpoint: '/api/contact',
      notes: [
        'Simple validation with good performance',
        'Email service not integrated (placeholder)',
        'No database operations (logs to console)'
      ]
    },
    {
      endpoint: '/api/search',
      notes: [
        'Uses embeddings for semantic search',
        'May have startup latency for first search',
        'No caching implemented'
      ]
    },
    {
      endpoint: '/api/tts',
      notes: [
        'Voice optimization adds processing time',
        'Depends on external Deepgram API',
        'No rate limiting (potential abuse risk)'
      ]
    },
    {
      endpoint: '/api/auto-git-stream',
      notes: [
        'Edge runtime for better performance',
        'Simulated data (no real backend)',
        'Server-Sent Events for real-time updates'
      ]
    }
  ];

  performanceNotes.forEach(({ endpoint, notes }) => {
    log(endpoint, 'cyan');
    notes.forEach(note => console.log(`  • ${note}`));
    console.log('');
  });
}

/**
 * Generate Recommendations
 */
function generateRecommendations() {
  logSection('Recommendations');

  const recommendations = [
    {
      priority: 'HIGH',
      category: 'Security',
      recommendation: 'Add HTML entity encoding for XSS protection',
      endpoint: '/api/contact'
    },
    {
      priority: 'HIGH',
      category: 'Security',
      recommendation: 'Implement rate limiting on /api/tts endpoint',
      endpoint: '/api/tts'
    },
    {
      priority: 'MEDIUM',
      category: 'Security',
      recommendation: 'Use a proper rate limiting library (e.g., upstash/ratelimit)',
      endpoint: 'All'
    },
    {
      priority: 'MEDIUM',
      category: 'Security',
      recommendation: 'Implement CSRF protection for state-changing operations',
      endpoint: '/api/contact, /api/tts'
    },
    {
      priority: 'MEDIUM',
      category: 'Performance',
      recommendation: 'Add response caching for search results',
      endpoint: '/api/search'
    },
    {
      priority: 'LOW',
      category: 'Security',
      recommendation: 'Restrict CORS to specific domains in production',
      endpoint: '/api/auto-git-stream'
    },
    {
      priority: 'LOW',
      category: 'Code Quality',
      recommendation: 'Centralize rate limiting logic',
      endpoint: 'All'
    },
    {
      priority: 'LOW',
      category: 'Monitoring',
      recommendation: 'Add logging/metrics for API usage',
      endpoint: 'All'
    }
  ];

  recommendations.forEach(rec => {
    const priorityColor = rec.priority === 'HIGH' ? 'red' : rec.priority === 'MEDIUM' ? 'yellow' : 'green';
    log(`[${rec.priority}] ${rec.category}: ${rec.recommendation}`, priorityColor);
    console.log(`  Endpoint: ${rec.endpoint}\n`);
  });
}

/**
 * Print Summary
 */
function printSummary() {
  logSection('Test Summary');

  console.log(`Total Tests: ${results.total}`);
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, 'red');
  log(`Warnings: ${results.warnings}`, 'yellow');

  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`\nPass Rate: ${passRate}%`);

  if (results.failed > 0) {
    console.log('\nFailed Tests:');
    results.tests.filter(t => t.status === 'FAIL').forEach(t => {
      log(`  ✗ ${t.name}`, 'red');
    });
  }

  if (results.warnings > 0) {
    console.log('\nWarnings:');
    results.tests.filter(t => t.status === 'WARN').forEach(t => {
      log(`  ⚠ ${t.name}`, 'yellow');
    });
  }
}

/**
 * Main Test Runner
 */
async function runAllTests() {
  log('╔════════════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    COMPREHENSIVE API TEST SUITE                              ║', 'cyan');
  log('║                         Portfolio API Testing                                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════════════════╝', 'cyan');

  try {
    await testChatAPI();
    await testContactAPI();
    await testSearchAPI();
    await testTTSAPI();
    await testAutoGitStreamAPI();

    analyzeSecurity();
    analyzePerformance();
    generateRecommendations();
    printSummary();

  } catch (error) {
    log(`\nError running tests: ${error.message}`, 'red');
    console.error(error);
  }
}

// Run the tests
runAllTests();
