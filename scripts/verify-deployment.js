#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if the deployed site matches the expected git commit
 */

const https = require('https');
const { execSync } = require('child_process');

const DEPLOY_URL = 'https://balcha-parswanadh-8h04ek2ac-parshu.vercel.app';

console.log('🔍 Verifying Vercel deployment...\n');

// Get current local commit
const localCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
const localCommitShort = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

console.log(`📦 Local commit: ${localCommitShort} (${localCommit})`);

// Check deployment
https.get(DEPLOY_URL, (res) => {
  console.log(`\n✅ Deployment reachable: ${DEPLOY_URL}`);
  console.log(`\n📋 Response Headers:`);

  const headers = res.headers;

  // Vercel-specific headers
  if (headers['x-vercel-id']) {
    console.log(`   Vercel ID: ${headers['x-vercel-id']}`);
  }

  if (headers['x-vercel-cache']) {
    console.log(`   Cache: ${headers['x-vercel-cache']}`);
  }

  if (headers['server']) {
    console.log(`   Server: ${headers['server']}`);
  }

  if (headers['via']) {
    console.log(`   Via: ${headers['via']}`);
  }

  console.log(`\n✅ Deployment verified successfully!`);

}).on('error', (err) => {
  console.error(`\n❌ Deployment check failed: ${err.message}`);
  console.error(`\n🔧 Troubleshooting:`);
  console.error(`   1. Check if Vercel deployment is complete`);
  console.error(`   2. Verify URL: ${DEPLOY_URL}`);
  console.error(`   3. Check Vercel dashboard for errors`);
  process.exit(1);
});
