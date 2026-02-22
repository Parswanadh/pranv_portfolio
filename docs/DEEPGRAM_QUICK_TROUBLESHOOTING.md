# Deepgram API - Quick Troubleshooting Reference

## 401 Unauthorized? Check These First

### 1. Verify API Key Format

**CORRECT:**
```bash
# .env.local
DEEPGRAM_API_KEY=abc123def456ghi789...
```

**WRONG:**
```bash
# Extra whitespace
DEEPGRAM_API_KEY= abc123def456

# Quotes
DEEPGRAM_API_KEY="abc123def456"

# Token prefix (should be in code, not env var)
DEEPGRAM_API_KEY=Token abc123def456
```

### 2. Quick Test Command

```bash
# Replace YOUR_KEY with your actual key
curl -v -X POST \
  "https://api.deepgram.com/v1/speak?model=aura-asteria-en" \
  -H "Authorization: Token YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
```

**Expected:** 200 OK with audio data
**If 401:** Your key is invalid

### 3. Run Diagnostic Script

```bash
# Set your key
export DEEPGRAM_API_KEY=your_actual_key

# Run test
node test-deepgram-api.js
```

### 4. Check in Deepgram Console

1. Go to: https://console.deepgram.com
2. Navigate to: **API Keys**
3. Verify:
   - [ ] Key exists and is active
   - [ ] Account is active (not suspended)
   - [ ] Not exceeding free tier limits (200 req/month)

### 5. Restart Next.js

After changing `.env.local`:
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

## Current Implementation (Reference)

**File:** `lib/deepgram.ts`

```typescript
// CORRECT - Keep this as-is
headers: {
  'Authorization': `Token ${DEEPGRAM_API_KEY}`,
  'Content-Type': 'application/json',
}
```

## Common Error Messages

| Status | Meaning | Fix |
|--------|---------|-----|
| 401 | Invalid/expired key | Regenerate key in console |
| 429 | Rate limit exceeded | Wait or upgrade plan |
| 400 | Bad request | Check request body format |
| 500 | Deepgram error | Try again later |

## Need More Help?

- Full research guide: `docs/DEEPGRAM_API_RESEARCH.md`
- Deepgram docs: https://developers.deepgram.com/docs/
- Support: https://help.deepgram.com/

---

**One-Page Summary**

Your code is CORRECT. The issue is the API key itself.
1. Regenerate key in Deepgram console
2. Copy key without any extra spaces/quotes
3. Update `.env.local`
4. Restart Next.js dev server
5. Run `node test-deepgram-api.js` to verify
