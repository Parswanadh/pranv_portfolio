/**
 * Deepgram API Connection Test Script
 *
 * This script tests your Deepgram API key and connection.
 *
 * Usage:
 *   1. Set your API key: export DEEPGRAM_API_KEY=your_key_here
 *   2. Run: node test-deepgram-api.js
 *
 * Or modify the API_KEY variable below.
 */

const https = require('https');

// CONFIGURATION
// ============================================================================
const API_KEY = process.env.DEEPGRAM_API_KEY || 'YOUR_API_KEY_HERE';
const TEST_TEXT = 'Hello, this is a test of the Deepgram text to speech API.';
const VOICE_MODEL = 'aura-asteria-en';
const OUTPUT_FILE = 'test-deepgram-output.mp3';

// UTILITY FUNCTIONS
// ============================================================================

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(` ${title}`);
  console.log('='.repeat(60));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

// VALIDATION FUNCTIONS
// ============================================================================

function validateApiKey() {
  logSection('Step 1: Validating API Key Format');

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    logError('No API key provided');
    logInfo('To set your key:');
    logInfo('  export DEEPGRAM_API_KEY=your_actual_key_here');
    return false;
  }

  logSuccess('API key is present');

  // Check for common issues
  const issues = [];

  if (API_KEY.includes(' ')) {
    issues.push('Contains spaces');
  }

  if (API_KEY.startsWith('"') || API_KEY.startsWith("'")) {
    issues.push('Starts with quotes');
  }

  if (API_KEY.endsWith('"') || API_KEY.endsWith("'")) {
    issues.push('Ends with quotes');
  }

  if (API_KEY.startsWith('Token ') || API_KEY.startsWith('Bearer ')) {
    issues.push('Includes "Token" or "Bearer" prefix');
  }

  if (API_KEY.includes('\n') || API_KEY.includes('\r')) {
    issues.push('Contains newline characters');
  }

  if (issues.length > 0) {
    logError('API key format issues detected:');
    issues.forEach(issue => logError(`  - ${issue}`));
    logInfo('Your API key should be a simple string like: abc123def456...');
    logInfo('Do not include quotes, spaces, or "Token" prefix in the key itself');
    return false;
  }

  logSuccess('API key format appears correct');
  logInfo(`Key length: ${API_KEY.length} characters`);
  logInfo(`Key preview: ${API_KEY.substring(0, 10)}...`);

  return true;
}

// API TEST FUNCTIONS
// ============================================================================

function testProjectList() {
  return new Promise((resolve) => {
    logSection('Step 2: Testing Project List Endpoint');

    const options = {
      hostname: 'api.deepgram.com',
      port: 443,
      path: '/v1/projects',
      method: 'GET',
      headers: {
        'Authorization': `Token ${API_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      logInfo(`Status: ${res.status} ${res.statusText}`);

      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.status === 401) {
          logError('Authentication failed (401)');
          logInfo('This means:');
          logInfo('  1. Your API key is invalid');
          logInfo('  2. Your account may be suspended');
          logInfo('  3. The key may have been revoked');
          resolve({ success: false, error: '401 Unauthorized' });
        } else if (res.status === 200) {
          logSuccess('Authentication successful');
          try {
            const data = JSON.parse(body);
            logInfo(`Found ${data.data?.length || 0} project(s)`);
          } catch (e) {
            logWarning('Could not parse response');
          }
          resolve({ success: true });
        } else {
          logWarning(`Unexpected status: ${res.status}`);
          logInfo(`Response: ${body.substring(0, 200)}`);
          resolve({ success: false, error: `Status ${res.status}` });
        }
      });
    });

    req.on('error', (error) => {
      logError(`Request failed: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.end();
  });
}

function testTTS() {
  return new Promise((resolve) => {
    logSection('Step 3: Testing TTS Endpoint');

    const data = JSON.stringify({ text: TEST_TEXT });

    const options = {
      hostname: 'api.deepgram.com',
      port: 443,
      path: `/v1/speak?model=${VOICE_MODEL}`,
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      logInfo(`Status: ${res.status} ${res.statusText}`);

      if (res.status === 401) {
        logError('Authentication failed (401)');
        resolve({ success: false, error: '401 Unauthorized' });
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => { chunks.push(chunk); });

      res.on('end', () => {
        if (res.status === 200) {
          const fs = require('fs');
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(OUTPUT_FILE, buffer);

          logSuccess('TTS request successful');
          logInfo(`Saved audio to: ${OUTPUT_FILE}`);
          logInfo(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
          resolve({ success: true });
        } else {
          const body = Buffer.concat(chunks).toString();
          logError(`Request failed with status ${res.status}`);
          logInfo(`Response: ${body.substring(0, 200)}`);
          resolve({ success: false, error: `Status ${res.status}` });
        }
      });
    });

    req.on('error', (error) => {
      logError(`Request failed: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n' + '█'.repeat(60));
  console.log('█' + ' '.repeat(20) + 'DEEPGRAM API TEST' + ' '.repeat(20) + '█');
  console.log('█'.repeat(60));

  // Step 1: Validate API key format
  if (!validateApiKey()) {
    logSection('Test Aborted');
    logError('Please fix the API key issues above and run again');
    process.exit(1);
  }

  // Step 2: Test project list endpoint
  const projectResult = await testProjectList();
  if (!projectResult.success) {
    logSection('Test Failed');
    logError('Cannot proceed to TTS test - authentication failed');
    logInfo('');
    logInfo('Troubleshooting steps:');
    logInfo('  1. Check your API key at: https://console.deepgram.com');
    logInfo('  2. Make sure the account is active');
    logInfo('  3. Verify you copied the entire key without spaces');
    logInfo('  4. Try generating a new API key');
    process.exit(1);
  }

  // Step 3: Test TTS endpoint
  const ttsResult = await testTTS();

  // Final summary
  logSection('Test Summary');

  if (ttsResult.success) {
    logSuccess('All tests passed!');
    logInfo('');
    logInfo('Your Deepgram API integration is working correctly.');
    logInfo(`You can play the generated audio file: ${OUTPUT_FILE}`);
    logInfo('');
    logInfo('Next steps for your Next.js app:');
    logInfo('  1. Ensure DEEPGRAM_API_KEY is set in .env.local');
    logInfo('  2. Restart your Next.js dev server');
    logInfo('  3. Test the /api/tts endpoint');
    process.exit(0);
  } else {
    logError('TTS test failed');
    logInfo(`Error: ${ttsResult.error}`);
    logInfo('');
    logInfo('This could be due to:');
    logInfo('  - Rate limiting (too many requests)');
    logInfo('  - Invalid voice model');
    logInfo('  - Account issues');
    process.exit(1);
  }
}

// Run the test
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
