# Root Cause Analysis: AI Integration Failures

## 1. Issue Description
AI endpoints were failing with `500` (Internal Error) or `503` (Service Unavailable).

## 2. Root Causes & Fixes

### A. Model Rate Limits (The "503" Cause)
- **Cause:** `groq.ts` utilized `llama-3.1-70b-versatile`, which hits rate limits easily on the free tier.
- **Fix:** Switched to **`llama-3.1-8b-instant`** (lower latency, higher limits).
- **Result:** Semantic parsing works reliably.

### B. Runtime Environment Conflicts (The "500" Cause)
- **Cause:** `src/utils/safetyScanner.ts` included a `'use client'` directive. When imported by the Edge Runtime API route (`generate-hint/route.ts`), this caused a `TypeError: scanForSecrets is not a function`.
- **Fix:** Removed `'use client'` from the utility file.
- **Result:** Hint generation now executes correctly.

### C. JSON Parsing Fragility
- **Cause:** Small models (`8b`) sometimes output conversational text alongside JSON (e.g., "Here is the JSON: {...}"). The previous simple replacement failed.
- **Fix:** Implemented robust JSON extraction using regex (`/\{[\s\S]*\}/`) in `parse-timer/route.ts`.

### D. Environment Variables
- **Cause:** Test script looked for `.env.local` (missing) instead of `.env`.
- **Fix:** Updated `test-ai-real.ts` to fallback to `.env`.

### E. Embedding Initialization
- **Cause:** `embedding.ts` initialized the Google provider at module top-level. If keys were missing/delayed, it could crash the app.
- **Fix:** Moved initialization inside the function (Lazy Loading).

## 3. Verification Results
Run: `pnpm run test:ai`

| Feature | Model | Status | Latency |
|---------|-------|--------|---------|
| Smart Timer (Simple) | Llama 3.1 8b | ✅ PASS | ~1.4s |
| Smart Timer (Complex) | Llama 3.1 8b | ✅ PASS | ~0.3s |
| Password Hint | Llama 3.1 8b | ✅ PASS | ~0.7s |
| Anti-Doxxer Safety | Llama 3.1 8b | ✅ PASS | ~0.4s |
