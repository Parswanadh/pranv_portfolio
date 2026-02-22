/**
 * IRIS CHAT FEATURE TEST
 * Tests the "Chat with Iris" button, chat interface, message sending, and TTS voice
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('IRIS CHAT FEATURE TEST');
console.log('='.repeat(60));

// Test results tracking
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper function to log test results
function logTest(name, passed, message, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${name}`);

  if (message) {
    console.log(`    ${message}`);
  }
  if (details) {
    console.log(`    ${details}`);
  }

  if (passed) {
    results.passed.push({ name, message, details });
  } else {
    results.failed.push({ name, message, details });
  }
}

function logWarning(name, message) {
  console.log(`⚠ WARN  ${name}`);
  console.log(`    ${message}`);
  results.warnings.push({ name, message });
}

// Test 1: Check if IrisAssistant component exists
console.log('\n[TEST 1] Checking IrisAssistant component...');
try {
  const irisPath = path.join(__dirname, 'components', 'IrisAssistant.tsx');
  const irisExists = fs.existsSync(irisPath);
  logTest('IrisAssistant component exists', irisExists);

  if (irisExists) {
    const irisContent = fs.readFileSync(irisPath, 'utf-8');

    // Check for key features
    const hasChatInterface = irisContent.includes('isOpen') && irisContent.includes('messages');
    const hasSendButton = irisContent.includes('handleSendMessage');
    const hasAudioSupport = irisContent.includes('audioRef') && irisContent.includes('playAudio');
    const hasEventListeners = irisContent.includes('open-iris') && irisContent.includes('iris-question');

    logTest('Chat interface state management', hasChatInterface);
    logTest('Send message functionality', hasSendButton);
    logTest('Audio/TTS support', hasAudioSupport);
    logTest('Event listeners for chat button', hasEventListeners);
  }
} catch (error) {
  logTest('IrisAssistant component check', false, error.message);
}

// Test 2: Check if component is imported in layout
console.log('\n[TEST 2] Checking if IrisAssistant is loaded in app...');
try {
  const layoutPath = path.join(__dirname, 'app', 'layout.tsx');
  const layoutExists = fs.existsSync(layoutPath);

  if (layoutExists) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    const hasIrisImport = layoutContent.includes('IrisAssistant');
    const hasIrisComponent = layoutContent.includes('<IrisAssistant');

    logTest('IrisAssistant imported in layout', hasIrisImport);
    logTest('IrisAssistant component rendered', hasIrisComponent);

    if (!hasIrisImport || !hasIrisComponent) {
      logWarning('Iris not in layout', 'IrisAssistant may not be visible on all pages');
    }
  } else {
    logTest('Layout file exists', false);
  }
} catch (error) {
  logTest('Layout check', false, error.message);
}

// Test 3: Check chat button on home page
console.log('\n[TEST 3] Checking "Chat with Iris" button...');
try {
  const homePath = path.join(__dirname, 'app', 'page.tsx');
  const homeExists = fs.existsSync(homePath);

  if (homeExists) {
    const homeContent = fs.readFileSync(homePath, 'utf-8');
    const hasChatButton = homeContent.includes('Chat with Iris') || homeContent.includes('open-iris');
    const hasClickHandler = homeContent.includes('dispatchEvent') && homeContent.includes('open-iris');

    logTest('Chat with Iris button text', hasChatButton);
    logTest('Button click event handler', hasClickHandler);

    if (!hasChatButton) {
      logWarning('Button text', 'Button may not have visible "Chat with Iris" label');
    }
  }
} catch (error) {
  logTest('Home page check', false, error.message);
}

// Test 4: Check API routes
console.log('\n[TEST 4] Checking API routes...');
try {
  const chatApiPath = path.join(__dirname, 'app', 'api', 'chat', 'route.ts');
  const ttsApiPath = path.join(__dirname, 'app', 'api', 'tts', 'route.ts');

  const chatApiExists = fs.existsSync(chatApiPath);
  const ttsApiExists = fs.existsSync(ttsApiPath);

  logTest('Chat API route exists', chatApiExists);
  logTest('TTS API route exists', ttsApiExists);

  if (chatApiExists) {
    const chatContent = fs.readFileSync(chatApiPath, 'utf-8');
    const hasStreamHandler = chatContent.includes('streamMessages');
    const hasRateLimit = chatContent.includes('rateLimit') || chatContent.includes('RATE_LIMIT');
    const hasValidation = chatContent.includes('validation');

    logTest('Chat API streaming support', hasStreamHandler);
    logTest('Chat API rate limiting', hasRateLimit);
    logTest('Chat API input validation', hasValidation);
  }

  if (ttsApiExists) {
    const ttsContent = fs.readFileSync(ttsApiPath, 'utf-8');
    const hasDeepgram = ttsContent.includes('deepgram') || ttsContent.includes('DEEPGRAM');
    const hasRateLimit = ttsContent.includes('rateLimit') || ttsContent.includes('RATE_LIMIT');

    logTest('TTS API Deepgram integration', hasDeepgram);
    logTest('TTS API rate limiting', hasRateLimit);
  }
} catch (error) {
  logTest('API routes check', false, error.message);
}

// Test 5: Check library dependencies
console.log('\n[TEST 5] Checking library dependencies...');
const requiredLibs = [
  { path: 'lib/groq.ts', name: 'Groq API client' },
  { path: 'lib/deepgram.ts', name: 'Deepgram TTS client' },
  { path: 'lib/iris-session.ts', name: 'Session management' },
  { path: 'lib/voice-optimizer.ts', name: 'Voice optimizer' },
  { path: 'lib/page-context.ts', name: 'Page context' },
  { path: 'lib/navigation-intent.ts', name: 'Navigation intent' },
  { path: 'lib/proactive-suggestions.ts', name: 'Proactive suggestions' },
];

requiredLibs.forEach(lib => {
  try {
    const libPath = path.join(__dirname, lib.path);
    const exists = fs.existsSync(libPath);
    logTest(lib.name, exists, exists ? `Found at ${lib.path}` : `Missing: ${lib.path}`);
  } catch (error) {
    logTest(lib.name, false, error.message);
  }
});

// Test 6: Check environment variables
console.log('\n[TEST 6] Checking environment configuration...');
try {
  const envExamplePath = path.join(__dirname, '.env.example');
  const envLocalPath = path.join(__dirname, '.env.local');

  const envExampleExists = fs.existsSync(envExamplePath);
  const envLocalExists = fs.existsSync(envLocalPath);

  logTest('.env.example exists', envExampleExists);
  logTest('.env.local exists', envLocalExists);

  if (envExampleExists) {
    const envContent = fs.readFileSync(envExamplePath, 'utf-8');
    const hasGroqKey = envContent.includes('GROQ_API_KEY');
    const hasDeepgramKey = envContent.includes('DEEPGRAM_API_KEY');

    logTest('GROQ_API_KEY configured', hasGroqKey);
    logTest('DEEPGRAM_API_KEY configured', hasDeepgramKey);

    if (hasGroqKey && hasDeepgramKey) {
      console.log('\n    Note: Make sure .env.local has actual API key values, not placeholders');
    }
  }

  if (!envLocalExists) {
    logWarning('Environment setup', 'Create .env.local with actual API keys for chat to work');
  }
} catch (error) {
  logTest('Environment check', false, error.message);
}

// Test 7: Check skeleton loading components
console.log('\n[TEST 7] Checking UI components...');
try {
  const skeletonPath = path.join(__dirname, 'components', 'skeletons', 'LoadingSkeleton.tsx');
  const skeletonExists = fs.existsSync(skeletonPath);

  logTest('LoadingSkeleton component exists', skeletonExists);

  if (skeletonExists) {
    const skeletonContent = fs.readFileSync(skeletonPath, 'utf-8');
    const hasTypingIndicator = skeletonContent.includes('TypingIndicator');

    logTest('TypingIndicator for chat', hasTypingIndicator);
  }
} catch (error) {
  logTest('UI components check', false, error.message);
}

// Test 8: Verify component exports and imports
console.log('\n[TEST 8] Verifying component imports in IrisAssistant...');
try {
  const irisPath = path.join(__dirname, 'components', 'IrisAssistant.tsx');
  const irisContent = fs.readFileSync(irisPath, 'utf-8');

  const requiredImports = [
    'useState',
    'useEffect',
    'MessageCircle',
    'X',
    'Send',
    'Volume2',
    'VolumeX',
    'optimizeForVoice',
    'getContextualSystemPrompt',
    'detectNavigationIntent',
    'shouldNavigate',
    'getSession',
    'addMessageToSession',
    'getPreferences',
    'savePreferences',
    'getConversationHistory',
    'TypingIndicator'
  ];

  let allImportsPresent = true;
  requiredImports.forEach(imp => {
    const present = irisContent.includes(imp);
    if (!present && imp !== 'TypingIndicator') { // TypingIndicator is optional fallback
      console.log(`    Missing import: ${imp}`);
      allImportsPresent = false;
    }
  });

  logTest('Required imports present', allImportsPresent);
} catch (error) {
  logTest('Imports verification', false, error.message);
}

// Test 9: Check for potential issues
console.log('\n[TEST 9] Checking for potential issues...');
try {
  const irisPath = path.join(__dirname, 'components', 'IrisAssistant.tsx');
  const irisContent = fs.readFileSync(irisPath, 'utf-8');

  // Check for common issues
  const hasConsoleErrors = irisContent.includes('console.error');
  const hasErrorHandling = irisContent.includes('try {') && irisContent.includes('catch');
  const hasLoadingState = irisContent.includes('isLoading');
  const hasMountedCheck = irisContent.includes('mounted');

  logTest('Error handling implemented', hasErrorHandling);
  logTest('Loading state management', hasLoadingState);
  logTest('Client-side mount check', hasMountedCheck);

  if (hasConsoleErrors) {
    logWarning('Console errors', 'Component has console.error statements - check for runtime issues');
  }

  // Check z-index
  const hasZIndex = irisContent.includes('z-[');
  logTest('Z-index set for chat panel', hasZIndex);

  if (!hasZIndex) {
    logWarning('Z-index', 'Chat panel may not appear above other content');
  }
} catch (error) {
  logTest('Issues check', false, error.message);
}

// Test 10: Summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`Total Passed: ${results.passed.length}`);
console.log(`Total Failed: ${results.failed.length}`);
console.log(`Total Warnings: ${results.warnings.length}`);

if (results.failed.length > 0) {
  console.log('\nFailed Tests:');
  results.failed.forEach(f => {
    console.log(`  - ${f.name}`);
    if (f.message) console.log(`    ${f.message}`);
  });
}

if (results.warnings.length > 0) {
  console.log('\nWarnings:');
  results.warnings.forEach(w => {
    console.log(`  - ${w.name}: ${w.message}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('NEXT STEPS');
console.log('='.repeat(60));
console.log(`
1. Ensure API keys are set in .env.local:
   - GROQ_API_KEY=your_key_here
   - DEEPGRAM_API_KEY=your_key_here

2. Start the development server:
   npm run dev

3. Open browser to http://localhost:3000

4. Test the chat:
   - Click "Chat with Iris" button (bottom right)
   - Send a test message
   - Check if response appears
   - Check if voice/audio works

5. Check browser console for any errors

6. Test API endpoints directly:
   - POST http://localhost:3000/api/chat
   - POST http://localhost:3000/api/tts
`);

const allCriticalPassed = results.failed.filter(f =>
  !f.name.includes('optional') &&
  !f.name.includes('Environment')
).length === 0;

if (allCriticalPassed) {
  console.log('\n✓ Iris chat feature appears to be properly configured!');
  console.log('  Make sure to test with actual API keys in .env.local');
} else {
  console.log('\n✗ Some critical tests failed. Please review the errors above.');
}

console.log('='.repeat(60));
