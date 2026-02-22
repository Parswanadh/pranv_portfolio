#!/usr/bin/env node
/**
 * QUICK IRIS CHAT FIX VERIFICATION
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n' + '='.repeat(60));
console.log('IRIS CHAT FIX VERIFICATION');
console.log('='.repeat(60) + '\n');

// Check the fix
const irisPath = path.join(__dirname, 'components', 'IrisAssistant.tsx');
const irisContent = fs.readFileSync(irisPath, 'utf-8');

console.log('[✓] Checking CSS fix in input field...');
const hasCorrectClass = irisContent.includes('text-text-primary placeholder:text-text-tertiary');
const hasOldClass = irisContent.includes('text-primary placeholder:text-secondary');

if (hasCorrectClass && !hasOldClass) {
  console.log('✓ CSS fix applied correctly');
  console.log('  Input field now uses proper Tailwind classes');
} else if (hasOldClass) {
  console.log('✗ Old CSS classes still present - fix not applied');
} else {
  console.log('? Unable to verify CSS classes');
}

// Verify component structure
console.log('\n[✓] Verifying component structure...');
const checks = {
  'Floating button': /MessageCircle/.test(irisContent),
  'Chat panel': /Chat Panel/.test(irisContent) || /isOpen/.test(irisContent),
  'Send function': /handleSendMessage/.test(irisContent),
  'Audio support': /playAudio/.test(irisContent),
  'API integration': /\/api\/chat/.test(irisContent),
  'TTS integration': /\/api\/tts/.test(irisContent),
  'Session management': /getSession/.test(irisContent),
  'Typing indicator': /TypingIndicator/.test(irisContent),
};

Object.entries(checks).forEach(([name, passed]) => {
  console.log(`  ${passed ? '✓' : '✗'} ${name}`);
});

// Check environment
console.log('\n[✓] Checking environment setup...');
const envLocalPath = path.join(__dirname, '.env.local');
const envLocalExists = fs.existsSync(envLocalPath);

if (envLocalExists) {
  console.log('✓ .env.local exists');
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  const hasGroqKey = envContent.includes('GROQ_API_KEY=') && !envContent.includes('your_groq_api_key_here');
  const hasDeepgramKey = envContent.includes('DEEPGRAM_API_KEY=') && !envContent.includes('your_deepgram_api_key_here');

  if (hasGroqKey) {
    console.log('  ✓ GROQ_API_KEY configured');
  } else {
    console.log('  ⚠ GROQ_API_KEY not configured (placeholder or missing)');
  }

  if (hasDeepgramKey) {
    console.log('  ✓ DEEPGRAM_API_KEY configured');
  } else {
    console.log('  ⚠ DEEPGRAM_API_KEY not configured (placeholder or missing)');
  }

  if (hasGroqKey && hasDeepgramKey) {
    console.log('\n✓ Ready to test! Run: npm run dev');
  } else {
    console.log('\n⚠ API keys needed. Add them to .env.local:');
    console.log('  GROQ_API_KEY=your_key_here');
    console.log('  DEEPGRAM_API_KEY=your_key_here');
  }
} else {
  console.log('⚠ .env.local not found');
  console.log('  Create it with API keys to enable chat:');
  console.log('  echo "GROQ_API_KEY=your_key_here" > .env.local');
  console.log('  echo "DEEPGRAM_API_KEY=your_key_here" >> .env.local');
}

console.log('\n' + '='.repeat(60));
console.log('VERIFICATION COMPLETE');
console.log('='.repeat(60) + '\n');
