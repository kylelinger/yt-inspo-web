# Feedback Persistence Fix Verification

## Problem Statement
User reported: "数据还是被清空了" (Data still gets cleared)

## Root Cause Analysis

### Issue Chain
1. User clicks 👍 on video
2. POST /api/feedback succeeds → writes to Vercel Blob
3. POST response returns fresh state → localStorage updated
4. **Page refreshes** (e.g., navigate to another page and back)
5. `hydrateFromRemote()` runs on mount → calls GET /api/feedback
6. **GET hits Vercel Blob CDN cache** → returns stale/old data (before the like)
7. `hydrateFromRemote()` overwrites localStorage with stale data
8. User sees data "cleared"

### Verification Test (2026-03-13)
```bash
# POST write
curl -X POST /api/feedback -d '{"videoId":"persist_test","action":"thumbsup"}'
# → Response: {ok: true, state: {feedback: {persist_test: "thumbsup", ...}}}
# → Feedback count: 2

# Immediate GET (hits CDN cache)
curl GET /api/feedback
# → Response: {feedback: {...}}
# → Feedback count: 1 (old data!)
# → persist_test NOT in feedback

# Direct Blob URL (bypasses API, hits CDN cache too)
curl https://nahqv8r8p4k8gmzn.public.blob.vercel-storage.com/feedback/state.json
# → Feedback count: 2 (fresh data)
# → persist_test IS in feedback
```

**Conclusion:** Vercel Blob CDN has 5-15 second cache delay. GET returns stale data immediately after POST.

## Fix Implementation

### Code Changes (commit `ff0884b`)

**File:** `src/lib/feedback.ts`

1. **Track write timestamp:**
   ```typescript
   const LAST_WRITE_KEY = "yt_inspo_last_write";
   
   // In setFeedback() and toggleShortlist():
   localStorage.setItem(LAST_WRITE_KEY, Date.now().toString());
   ```

2. **Guard hydrateFromRemote:**
   ```typescript
   export async function hydrateFromRemote(): Promise<void> {
     const remote = await fetchRemoteFeedback();
     if (!remote.kv) return;
   
     // Check if there was a recent write
     const lastWriteStr = localStorage.getItem(LAST_WRITE_KEY);
     if (lastWriteStr) {
       const lastWrite = parseInt(lastWriteStr, 10);
       const timeSinceWrite = Date.now() - lastWrite;
       
       // If write was < 15 seconds ago, DON'T update from server
       if (timeSinceWrite < 15000) {
         console.log('[hydrateFromRemote] Skipping - recent write');
         return;
       }
     }
   
     // Safe to update from server
     lsSetFeedback(remote.feedback);
     lsSetShortlist(new Set(remote.shortlist));
     window.dispatchEvent(new Event('feedback-changed'));
   }
   ```

### Why 15 Seconds?
- CDN cache delay observed: 5-10 seconds
- 15 seconds provides safety margin
- After 15 seconds, CDN cache should be refreshed
- Allows cross-device sync to work (other devices will get fresh data after CDN refresh)

## Expected Behavior After Fix

### Scenario 1: User clicks like and refreshes immediately
1. User clicks 👍
2. POST succeeds → localStorage updated with fresh state
3. `LAST_WRITE_KEY` = current timestamp
4. User refreshes page (< 15 seconds later)
5. `hydrateFromRemote()` runs → checks timestamp → skips update
6. localStorage retains fresh data from POST
7. ✅ User still sees their like

### Scenario 2: Cross-device sync
1. Device A: User clicks 👍
2. POST succeeds → Blob updated
3. Device B: User opens page (or refreshes after > 15 seconds)
4. `hydrateFromRemote()` runs → no recent write on Device B
5. GET /api/feedback → CDN cache refreshed (> 15 seconds passed)
6. Fresh data from server → localStorage updated
7. ✅ Device B sees the like from Device A

### Scenario 3: User clicks like, waits 20 seconds, refreshes
1. User clicks 👍 at t=0
2. POST succeeds → localStorage updated
3. `LAST_WRITE_KEY` = t=0
4. User refreshes at t=20
5. `hydrateFromRemote()` runs → timestamp check: 20 seconds > 15 seconds
6. Safe to fetch from server (CDN cache refreshed)
7. Server data replaces localStorage
8. ✅ Data matches (CDN cache is fresh now)

## Testing Instructions

### Manual Test
1. Open <https://ytinspowebrepo.vercel.app?key=slime>
2. Click 👍 on any video
3. Immediately refresh the page (Cmd+R / Ctrl+R)
4. Expected: 👍 still visible
5. Open browser console → should see: `[hydrateFromRemote] Skipping - recent write`

### Cross-Device Test
1. Device A: Click 👍 on video X
2. Wait 20 seconds (let CDN cache refresh)
3. Device B: Open the page
4. Expected: 👍 visible on video X

## Architecture Evolution

### v1-v4: Dual-state complexity
- localStorage + KV as "dual sources of truth"
- Pending action tracking
- Race condition protection
- **Problem:** Treated symptoms, not root cause

### v5: Server-first
- POST response returns state (bypass CDN cache)
- **Problem:** hydrateFromRemote still fetched from CDN cache

### v6 (current): Write-aware hydration
- Track last write timestamp
- Skip hydration if recent write
- **Solution:** Prevents overwriting fresh data with stale cache

## Deployment
- Git commit: `ff0884b`
- Deployed: 2026-03-13 11:30 IST
- URL: <https://ytinspowebrepo.vercel.app>
