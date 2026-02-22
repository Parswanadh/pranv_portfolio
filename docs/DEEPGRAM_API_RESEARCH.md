# Deepgram API Integration Research & Troubleshooting Guide

**Date:** 2026-02-19
**API Version:** v1
**Focus:** Text-to-Speech (TTS) - Aura API

---

## Executive Summary

Based on code analysis and Deepgram API documentation, the current implementation has **correct authentication format** (`Token ${API_KEY}`) and **correct endpoint**. A 401 Unauthorized error typically indicates:

1. Invalid or expired API key
2. API key format issues (extra whitespace, quotes)
3. Account not activated or suspended
4. Using wrong key type (e.g., using a project key instead of an API key)

---

## 1. Deepgram API Authentication

### Correct Format (Currently Implemented)

The current implementation in `lib/deepgram.ts` is **correct**:

```typescript
headers: {
  'Authorization': `Token ${DEEPGRAM_API_KEY}`,
  'Content-Type': 'application/json',
}
```

### Authentication Options

Deepgram supports multiple authentication formats:

1. **Token Header** (Recommended for server-side):
   ```
   Authorization: Token YOUR_API_KEY
   ```

2. **Bearer Token** (Alternative):
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

3. **Basic Auth** (Not recommended for production):
   ```
   Authorization: Basic base64(your_api_key:)
   ```

**Key Point:** Use `Token` prefix, NOT `Deepgram` or `Bearer` for standard API keys.

---

## 2. Deepgram TTS API Endpoint

### Current Implementation (Correct)

```
https://api.deepgram.com/v1/speak
```

### Endpoint Details

- **Base URL:** `https://api.deepgram.com`
- **TTS Endpoint:** `/v1/speak`
- **Method:** POST
- **Content-Type:** application/json

### Required Parameters

**Query Parameters:**
- `model` (required): Voice model (e.g., `aura-asteria-en`, `aura-luna-en`)

**Request Body:**
```json
{
  "text": "Your text here"
}
```

### Optional Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `encoding` | Audio format | `mp3`, `wav`, `opus` |
| `container` | Audio container | `wav`, `mp3` |
| `sample_rate` | Audio sample rate | `8000`, `16000`, `22050`, `44100`, `48000` |
| `bitrate` | Audio bitrate (MP3) | `32`, `64`, `128`, `192`, `256` |

---

## 3. Common Issues & Solutions

### Issue 1: 401 Unauthorized Error

**Possible Causes:**

1. **Invalid API Key**
   - Key is incorrect or mistyped
   - Key has been revoked or expired
   - Using wrong environment variable

2. **Key Format Issues**
   ```typescript
   // WRONG - Extra whitespace
   const key = '  abc123  '

   // WRONG - Including "Token" or "Bearer" prefix in env var
   DEEPGRAM_API_KEY=Token abc123

   // WRONG - Including quotes
   DEEPGRAM_API_KEY="abc123"

   // CORRECT
   DEEPGRAM_API_KEY=abc123def456...
   ```

3. **Account Issues**
   - Account not activated
   - Account suspended due to ToS violation
   - Free tier limits exceeded
   - Payment method required

4. **Wrong Key Type**
   - Deepgram has different key types
   - Ensure you're using an **API Key**, not a Project ID or other identifier

### Issue 2: Environment Variable Not Loading

**Check if .env.local exists:**
```bash
# Windows
type .env.local | findstr DEEPGRAM

# Unix
grep DEEPGRAM .env.local
```

**Verify Next.js is loading it:**
```typescript
// In route.ts or lib/deepgram.ts
console.log('DEEPGRAM_API_KEY:', process.env.DEEPGRAM_API_KEY?.substring(0, 10) + '...')
```

### Issue 3: Network/Firewall Issues

Deepgram API requires:
- HTTPS outbound traffic on port 443
- Access to `api.deepgram.com` and related domains

**Test connectivity:**
```bash
curl -I https://api.deepgram.com
```

---

## 4. Testing Deepgram API

### Method 1: cURL Command

```bash
# Replace YOUR_API_KEY with your actual key
curl -X POST \
  https://api.deepgram.com/v1/speak?model=aura-asteria-en \
  -H "Authorization: Token YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test."}' \
  --output test.mp3
```

### Method 2: Node.js Test Script

Create `test-deepgram.js`:

```javascript
const https = require('https');

const API_KEY = process.env.DEEPGRAM_API_KEY || 'YOUR_API_KEY';
const TEXT = 'Hello, this is a test of the Deepgram TTS API.';

const data = JSON.stringify({ text: TEXT });

const options = {
  hostname: 'api.deepgram.com',
  port: 443,
  path: '/v1/speak?model=aura-asteria-en',
  method: 'POST',
  headers: {
    'Authorization': `Token ${API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);

  if (res.statusCode === 401) {
    console.error('❌ 401 Unauthorized - Check your API key');
    console.error('Make sure:');
    console.error('  1. The key is correct (no extra spaces or quotes)');
    console.error('  2. The account is active');
    console.error('  3. You\'re using the right key type');
  } else if (res.statusCode === 200) {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      const fs = require('fs');
      fs.writeFileSync('test-output.mp3', Buffer.concat(chunks));
      console.log('✅ Success! Audio saved to test-output.mp3');
    });
  } else {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.error('Error response:', body));
  }
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(data);
req.end();
```

**Run the test:**
```bash
# Set environment variable first
export DEEPGRAM_API_KEY=your_actual_key_here

# Run test
node test-deepgram.js
```

### Method 3: Test Within Next.js Route

Create `app/api/test-deepgram/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.DEEPGRAM_API_KEY

  return NextResponse.json({
    hasKey: !!API_KEY,
    keyLength: API_KEY?.length || 0,
    keyPrefix: API_KEY ? API_KEY.substring(0, 10) + '...' : 'none',
  })
}
```

**Test:** Visit `http://localhost:3000/api/test-deepgram`

---

## 5. Step-by-Step Troubleshooting Guide

### Step 1: Verify API Key Format

```bash
# Check for common issues
echo $DEEPGRAM_API_KEY | od -c | head -n 1
```

Look for:
- No spaces or newlines at start/end
- No quotes (single or double)
- No "Token" or "Bearer" prefix in the value itself

### Step 2: Test API Key Validity

Use Deepgram's official key check:

```bash
curl -X GET \
  https://api.deepgram.com/v1/projects \
  -H "Authorization: Token YOUR_API_KEY"
```

If this returns 401, the key is definitely invalid.

### Step 3: Check Account Status

1. Log in to https://console.deepgram.com
2. Go to **API Keys** section
3. Verify the key exists and is active
4. Check account status (active, suspended, etc.)
5. Check usage limits (free tier: 200 requests/month)

### Step 4: Verify Environment Variables

```bash
# From project root
node -e "console.log(process.env.DEEPGRAM_API_KEY?.substring(0, 20))"
```

If this returns `undefined`, Next.js isn't loading `.env.local`.

**Fix:**
1. Ensure `.env.local` exists in project root
2. Restart Next.js dev server (Ctrl+C, then `npm run dev`)
3. Check `.gitignore` ensures `.env.local` is ignored

### Step 5: Test Direct API Call

```bash
# Test with curl (replace YOUR_KEY)
curl -v -X POST \
  "https://api.deepgram.com/v1/speak?model=aura-asteria-en" \
  -H "Authorization: Token YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
```

Watch for:
- HTTP status code
- Authentication headers
- Any error messages in response

### Step 6: Review Rate Limiting

Deepgram has rate limits:
- Free tier: ~5 requests/second
- Check headers: `X-RateLimit-*`

If you're hitting limits:
```
429 Too Many Requests
```

Wait and retry, or upgrade plan.

---

## 6. Production Best Practices

### Security

1. **Never commit API keys** to version control
   ```gitignore
   # .gitignore
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

2. **Use environment-specific keys**
   - Development: Test key
   - Production: Production key

3. **Rotate keys regularly**
   - Every 90 days recommended
   - Revoke old keys after rotation

### Error Handling

Current implementation is good. Consider adding:

```typescript
// Enhanced error types
if (response.status === 401) {
  throw new Error('Deepgram API key is invalid or expired')
} else if (response.status === 429) {
  throw new Error('Deepgram rate limit exceeded')
} else if (response.status === 400) {
  throw new Error('Invalid request to Deepgram API')
}
```

### Monitoring

```typescript
// Add logging
console.log('Deepgram TTS request:', {
  textLength: text.length,
  voice,
  timestamp: new Date().toISOString(),
})
```

### Fallback Strategy

```typescript
// If Deepgram fails, have a fallback
try {
  return await textToSpeech(options)
} catch (error) {
  console.error('Deepgram failed, using fallback:', error)
  return await fallbackTTS(options)
}
```

---

## 7. Current Implementation Review

### ✅ What's Correct

1. **Authentication format:** `Token ${API_KEY}` ✓
2. **Endpoint:** `https://api.deepgram.com/v1/speak` ✓
3. **Request method:** POST ✓
4. **Headers:** Content-Type included ✓
5. **Error handling:** Response.ok check ✓
6. **Rate limiting:** Implemented in route.ts ✓

### ⚠️ Potential Issues

1. **API Key Validation:**
   - No check for key format before sending
   - No distinction between 401 and other errors

2. **Retry Logic:**
   - No retry for transient failures
   - No exponential backoff

3. **Caching:**
   - No caching of identical requests
   - Could reduce API usage

### 🔧 Recommended Improvements

```typescript
// lib/deepgram.ts improvements

// 1. Add key validation
if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY.length < 10) {
  throw new Error('DEEPGRAM_API_KEY is invalid or too short')
}

// 2. Add specific error messages
if (!response.ok) {
  if (response.status === 401) {
    throw new Error('Deepgram API key is invalid or expired. Please check your DEEPGRAM_API_KEY.')
  } else if (response.status === 429) {
    throw new Error('Deepgram rate limit exceeded. Please try again later.')
  }
  const error = await response.text()
  throw new Error(`Deepgram TTS error: ${response.status} - ${error}`)
}

// 3. Add request logging
const startTime = Date.now()
const response = await fetch(...)
const duration = Date.now() - startTime
console.log(`Deepgram TTS: ${voice} - ${text.length} chars - ${duration}ms - ${response.status}`)
```

---

## 8. Quick Fix Checklist

If you're getting 401 errors, check these in order:

- [ ] API key exists in `.env.local`
- [ ] API key has no extra whitespace or quotes
- [ ] API key doesn't include "Token" or "Bearer" prefix
- [ ] Restarted Next.js dev server after adding key
- [ ] API key is active in Deepgram console
- [ ] Account is not suspended
- [ ] Using correct key type (API Key, not Project ID)
- [ ] Not exceeding rate limits
- [ ] Network can reach `api.deepgram.com`
- [ ] Testing with correct endpoint format

---

## 9. Getting Help

### Deepgram Resources

- **Documentation:** https://developers.deepgram.com/docs/
- **API Reference:** https://developers.deepgram.com/reference/
- **Status Page:** https://status.deepgram.com/
- **Support:** https://help.deepgram.com/
- **Community:** https://discord.gg/deepgram

### Debug Mode

```typescript
// Add to lib/deepgram.ts for debugging
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('[Deepgram Debug]', {
    url: `${DEEPGRAM_API_URL}?${params.toString()}`,
    hasKey: !!DEEPGRAM_API_KEY,
    keyLength: DEEPGRAM_API_KEY?.length,
    voice,
    textLength: text.length,
  })
}
```

---

## Summary

Your current implementation is **technically correct**. The 401 error is almost certainly due to:

1. **Invalid API key** (most likely)
2. **Key format issues** in `.env.local`
3. **Account/key not active**

**Next Steps:**
1. Run the test script above with your actual key
2. Verify key in Deepgram console
3. Check `.env.local` formatting
4. Test with curl command
5. Enable debug logging to see exact requests

---

**Files Referenced:**
- `lib/deepgram.ts` - API integration
- `app/api/tts/route.ts` - TTS endpoint
- `.env.example` - Environment variable template

**Last Updated:** 2026-02-19
