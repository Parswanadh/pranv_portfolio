/**
 * Comprehensive Security Test Suite
 *
 * Tests all security measures implemented in the portfolio application
 * including rate limiting, input validation, XSS protection, and CORS
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002'

let testsPassed = 0
let testsFailed = 0
let warnings = []

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function assert(condition, testName, errorMessage) {
  if (condition) {
    log(`✓ ${testName}`, colors.green)
    testsPassed++
    return true
  } else {
    log(`✗ ${testName}`, colors.red)
    log(`  ${errorMessage}`, colors.red)
    testsFailed++
    return false
  }
}

async function testRateLimiting(endpoint, options = {}) {
  const { requests = 15, expectedStatus = 429 } = options
  let blockedCount = 0

  log(`\n${colors.cyan}Testing rate limiting for ${endpoint}`, colors.cyan)

  for (let i = 0; i < requests; i++) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Rate limit test', voice: 'default' }),
    })

    if (response.status === expectedStatus) {
      blockedCount++
    }

    // Log rate limit headers if present
    const rateLimitLimit = response.headers.get('X-RateLimit-Limit')
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
    const rateLimitReset = response.headers.get('X-RateLimit-Reset')

    if (rateLimitLimit) {
      log(`  Request ${i + 1}: Status ${response.status}, Remaining: ${rateLimitRemaining}/${rateLimitLimit}`, colors.blue)
    }
  }

  assert(
    blockedCount > 0,
    `Rate limiting blocks requests after limit (blocked ${blockedCount}/${requests} requests)`,
    'Expected some requests to be blocked by rate limiter'
  )

  return blockedCount > 0
}

async function testXSSProtection(endpoint, payload) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  // Check if XSS payload was rejected or sanitized
  const isRejected = response.status === 400
  const isSanitized = !data.error && JSON.stringify(data).indexOf('<script>') === -1

  return isRejected || isSanitized
}

async function testCORS(endpoint) {
  const allowedOrigin = 'http://localhost:3000'
  const blockedOrigin = 'https://malicious-site.com'

  // Test allowed origin
  const allowedResponse = await fetch(`${BASE_URL}${endpoint}`, {
    method: endpoint.includes('stream') ? 'GET' : 'POST',
    headers: {
      'Origin': allowedOrigin,
      'Content-Type': 'application/json',
    },
    body: endpoint.includes('stream') ? undefined : JSON.stringify({ text: 'CORS test' }),
  })

  // Test blocked origin
  const blockedResponse = await fetch(`${BASE_URL}${endpoint}`, {
    method: endpoint.includes('stream') ? 'GET' : 'POST',
    headers: {
      'Origin': blockedOrigin,
      'Content-Type': 'application/json',
    },
    body: endpoint.includes('stream') ? undefined : JSON.stringify({ text: 'CORS test' }),
  })

  const allowedCORS = allowedResponse.headers.get('Access-Control-Allow-Origin')
  const blockedStatus = blockedResponse.status

  log(`\n${colors.cyan}CORS Test for ${endpoint}`, colors.cyan)
  log(`  Allowed origin (${allowedOrigin}): CORS = ${allowedCORS}`, colors.blue)
  log(`  Blocked origin (${blockedOrigin}): Status = ${blockedStatus}`, colors.blue)

  const allowedPass = allowedCORS === allowedOrigin || allowedCORS === null
  const blockedPass = blockedStatus === 403 || blockedStatus === 403

  assert(
    allowedPass && blockedPass,
    'CORS properly allows only whitelisted origins',
    blockedStatus === 200 ? 'Blocked origin was allowed!' : 'Allowed origin was blocked'
  )

  return allowedPass && blockedPass
}

async function testInputValidation(endpoint, payload, expectedStatus = 400) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return response.status === expectedStatus
}

async function testSecurityHeaders(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
  })

  const headers = {
    'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
    'X-Frame-Options': response.headers.get('X-Frame-Options'),
    'X-XSS-Protection': response.headers.get('X-XSS-Protection'),
    'Referrer-Policy': response.headers.get('Referrer-Policy'),
  }

  log(`\n${colors.cyan}Security Headers for ${endpoint}`, colors.cyan)
  Object.entries(headers).forEach(([key, value]) => {
    log(`  ${key}: ${value || 'NOT SET'}`, value ? colors.green : colors.yellow)
    if (!value) {
      warnings.push(`Missing security header: ${key} on ${endpoint}`)
    }
  })

  const hasHeaders = Object.values(headers).filter(Boolean).length >= 3
  assert(hasHeaders, 'Security headers present', 'Missing security headers')
  return hasHeaders
}

// Test Suite
async function runTests() {
  log('\n' + '='.repeat(60), colors.cyan)
  log('COMPREHENSIVE SECURITY TEST SUITE', colors.cyan)
  log('='.repeat(60) + '\n', colors.cyan)

  // 1. TTS Endpoint Security Tests
  log(`${colors.yellow}1. TTS Endpoint Security Tests`, colors.yellow)

  // Rate limiting
  await testRateLimiting('/api/tts', { requests: 12, expectedStatus: 429 })

  // Input validation
  const tooLongText = 'a'.repeat(6000)
  const longInputPass = await testInputValidation('/api/tts', { text: tooLongText })
  assert(longInputPass, 'TTS rejects overly long input', 'Should reject text > 5000 characters')

  const emptyInputPass = await testInputValidation('/api/tts', { text: '   ' })
  assert(emptyInputPass, 'TTS rejects whitespace-only input', 'Should reject whitespace-only text')

  // XSS protection
  const xssPayloads = [
    { text: '<script>alert("xss")</script>', voice: 'default' },
    { text: 'javascript:alert("xss")', voice: 'default' },
    { text: '<img src="x" onerror="alert(1)">', voice: 'default' },
  ]

  for (const payload of xssPayloads) {
    const xssProtected = await testXSSProtection('/api/tts', payload)
    assert(
      xssProtected,
      `TTS blocks XSS payload: ${payload.text.substring(0, 30)}...`,
      'XSS payload was not blocked or sanitized'
    )
  }

  // Invalid JSON
  const invalidJSONResponse = await fetch(`${BASE_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'invalid json',
  })
  assert(
    invalidJSONResponse.status === 400,
    'TTS rejects invalid JSON',
    'Should return 400 for invalid JSON'
  )

  // 2. Contact Form Security Tests
  log(`\n${colors.yellow}2. Contact Form Security Tests`, colors.yellow)

  // Rate limiting (will take time due to 1-hour window)
  // await testRateLimiting('/api/contact', { requests: 5, expectedStatus: 429 })

  // XSS protection
  const contactXSSPayloads = [
    {
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message with enough characters',
    },
    {
      name: 'Test User',
      email: 'test@example.com',
      subject: '<img src="x" onerror="alert(1)">',
      message: 'Test message with enough characters',
    },
  ]

  for (const payload of contactXSSPayloads) {
    const xssProtected = await testXSSProtection('/api/contact', payload)
    assert(
      xssProtected,
      `Contact form blocks XSS: ${payload.name.substring(0, 30)}...`,
      'XSS payload was not blocked or sanitized'
    )
  }

  // Email validation
  const invalidEmailPass = await testInputValidation('/api/contact', {
    name: 'Test User',
    email: 'invalid-email',
    subject: 'Test',
    message: 'Test message with enough characters',
  })
  assert(invalidEmailPass, 'Contact form validates email format', 'Should reject invalid email')

  // Required fields
  const missingFieldsPass = await testInputValidation('/api/contact', {
    name: 'Test User',
    email: 'test@example.com',
  })
  assert(missingFieldsPass, 'Contact form requires all fields', 'Should reject missing fields')

  // Honeypot field
  const honeypotResponse = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message with enough characters',
      honeypot: 'bot detected',
    }),
  })
  assert(
    honeypotResponse.status === 200,
    'Contact form handles honeypot field',
    'Should return success even when honeypot is filled (to confuse bots)'
  )

  // 3. Chat API Security Tests
  log(`\n${colors.yellow}3. Chat API Security Tests`, colors.yellow)

  // Rate limiting
  await testRateLimiting('/api/chat', { requests: 12, expectedStatus: 429 })

  // Input validation
  const emptyMessagesPass = await testInputValidation('/api/chat', { messages: [] })
  assert(emptyMessagesPass, 'Chat API rejects empty messages array', 'Should reject empty array')

  const invalidMessagesPass = await testInputValidation('/api/chat', {
    messages: [{ role: 'user' }], // Missing content
  })
  assert(invalidMessagesPass, 'Chat API validates message structure', 'Should reject invalid messages')

  // XSS in messages
  const chatXSSPass = await testInputValidation('/api/chat', {
    messages: [{ role: 'user', content: '<script>alert("xss")</script>' }],
  })
  assert(chatXSSPass, 'Chat API blocks XSS in messages', 'Should reject XSS in message content')

  // 4. Search API Security Tests
  log(`\n${colors.yellow}4. Search API Security Tests`, colors.yellow)

  // Rate limiting
  const searchResponse = await fetch(`${BASE_URL}/api/search?q=test`)
  const searchRateLimitHeader = searchResponse.headers.get('X-RateLimit-Limit')
  assert(
    searchRateLimitHeader !== null,
    'Search API has rate limiting headers',
    'Missing X-RateLimit headers'
  )

  // Input validation
  const longQueryResponse = await fetch(`${BASE_URL}/api/search?q=${'a'.repeat(300)}`)
  assert(
    longQueryResponse.status === 400,
    'Search API validates query length',
    'Should reject queries > 200 characters'
  )

  const xssQueryResponse = await fetch(`${BASE_URL}/api/search?q=<script>alert(1)</script>`)
  assert(
    xssQueryResponse.status === 400,
    'Search API blocks XSS in query',
    'Should reject XSS patterns in search query'
  )

  // 5. CORS Tests
  log(`\n${colors.yellow}5. CORS Configuration Tests`, colors.yellow)

  await testCORS('/api/tts')
  await testCORS('/api/contact')
  await testCORS('/api/chat')
  await testCORS('/api/search')
  await testCORS('/api/auto-git-stream')

  // 6. Security Headers
  log(`\n${colors.yellow}6. Security Headers Tests`, colors.yellow)

  await testSecurityHeaders('/api/tts')
  await testSecurityHeaders('/api/contact')
  await testSecurityHeaders('/api/search')

  // Summary
  log('\n' + '='.repeat(60), colors.cyan)
  log('TEST SUMMARY', colors.cyan)
  log('='.repeat(60), colors.cyan)
  log(`Total Passed: ${testsPassed}`, colors.green)
  log(`Total Failed: ${testsFailed}`, testsFailed > 0 ? colors.red : colors.green)

  if (warnings.length > 0) {
    log(`\nWarnings: ${warnings.length}`, colors.yellow)
    warnings.forEach(warning => log(`  ⚠ ${warning}`, colors.yellow))
  }

  const grade = testsFailed === 0 ? 'A' : testsFailed <= 3 ? 'B' : testsFailed <= 6 ? 'C' : 'D'
  const gradeColor = grade === 'A' ? colors.green : grade === 'B' ? colors.yellow : colors.red
  log(`\nSecurity Grade: ${grade}`, gradeColor)

  log('\n' + '='.repeat(60) + '\n', colors.cyan)

  process.exit(testsFailed > 0 ? 1 : 0)
}

// Run tests
runTests().catch(error => {
  log(`\nFatal error: ${error.message}`, colors.red)
  console.error(error)
  process.exit(1)
})
