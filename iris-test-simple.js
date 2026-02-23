/**
 * SIMPLE IRIS CHAT TEST
 * Verifies the chat feature structure without needing API keys
 */

const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('IRIS CHAT FEATURE - STRUCTURE TEST');
console.log('========================================\n');

// 1. Check component exists
console.log('[1] Checking IrisAssistant component...');
const irisPath = path.join(__dirname, 'components', 'IrisAssistant.tsx');
if (fs.existsSync(irisPath)) {
  console.log('✓ IrisAssistant.tsx found');
  const content = fs.readFileSync(irisPath, 'utf-8');

  const checks = {
    'Chat state (isOpen)': content.includes('isOpen'),
    'Messages state': content.includes('messages'),
    'Send function': content.includes('handleSendMessage'),
    'Audio support': content.includes('playAudio'),
    'TTS integration': content.includes('/api/tts'),
    'Chat API': content.includes('/api/chat'),
    'Event listeners': content.includes('open-iris'),
    'Floating button': content.includes('MessageCircle'),
    'Close button': content.includes('X'),
    'Input field': content.includes('input') && content.includes('placeholder'),
  };

  Object.entries(checks).forEach(([name, passed]) => {
    console.log(`  ${passed ? '✓' : '✗'} ${name}`);
  });
} else {
  console.log('✗ IrisAssistant.tsx NOT found');
}

// 2. Check layout integration
console.log('\n[2] Checking layout integration...');
const layoutPath = path.join(__dirname, 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  console.log(`  ${layoutContent.includes('IrisAssistant') ? '✓' : '✗'} IrisAssistant imported`);
  console.log(`  ${layoutContent.includes('<IrisAssistant') ? '✓' : '✗'} IrisAssistant rendered`);
} else {
  console.log('✗ layout.tsx NOT found');
}

// 3. Check home page button
console.log('\n[3] Checking home page button...');
const homePath = path.join(__dirname, 'app', 'page.tsx');
if (fs.existsSync(homePath)) {
  const homeContent = fs.readFileSync(homePath, 'utf-8');
  console.log(`  ${homeContent.includes('Chat with Iris') ? '✓' : '✗'} Button text present`);
  console.log(`  ${homeContent.includes('open-iris') ? '✓' : '✗'} Event handler present`);
}

// 4. Check API routes
console.log('\n[4] Checking API routes...');
const apis = [
  { path: 'app/api/chat/route.ts', name: 'Chat API' },
  { path: 'app/api/tts/route.ts', name: 'TTS API' },
];

apis.forEach(api => {
  const apiPath = path.join(__dirname, api.path);
  if (fs.existsSync(apiPath)) {
    console.log(`  ✓ ${api.name} exists`);
  } else {
    console.log(`  ✗ ${api.name} NOT found`);
  }
});

// 5. Check libraries
console.log('\n[5] Checking library dependencies...');
const libs = [
  'lib/groq.ts',
  'lib/deepgram.ts',
  'lib/iris-session.ts',
  'lib/voice-optimizer.ts',
  'lib/page-context.ts',
  'lib/navigation-intent.ts',
  'lib/proactive-suggestions.ts',
];

libs.forEach(lib => {
  const libPath = path.join(__dirname, lib);
  if (fs.existsSync(libPath)) {
    console.log(`  ✓ ${lib}`);
  } else {
    console.log(`  ✗ ${lib} NOT found`);
  }
});

// 6. Check environment
console.log('\n[6] Checking environment configuration...');
const envExample = path.join(__dirname, '.env.example');
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, 'utf-8');
  console.log(`  ${envContent.includes('GROQ_API_KEY') ? '✓' : '✗'} GROQ_API_KEY in .env.example`);
  console.log(`  ${envContent.includes('DEEPGRAM_API_KEY') ? '✓' : '✗'} DEEPGRAM_API_KEY in .env.example`);
}

const envLocal = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocal)) {
  console.log('  ✓ .env.local exists (API keys should be here)');
} else {
  console.log('  ✗ .env.local NOT found - chat will not work without API keys!');
}

// 7. Summary
console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================');
console.log('\nTo test the chat feature:');
console.log('1. Ensure .env.local has API keys:');
console.log('   GROQ_API_KEY=your_key_here');
console.log('   DEEPGRAM_API_KEY=your_key_here');
console.log('\n2. Run: npm run dev');
console.log('\n3. Open http://localhost:3000');
console.log('\n4. Click "Chat with Iris" button (bottom right)');
console.log('\n5. Send a test message like: "What are Pranav\'s top skills?"');
console.log('\n6. Check if response appears and if voice plays');
console.log('\n========================================\n');
