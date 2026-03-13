# Setup Upstash Redis for Feedback Storage

## Why Redis Instead of Blob?

**Problem with Vercel Blob:**
- CDN caching causes stale data issues
- Writes succeed but reads return old cached data for 5-15 seconds
- Even with aggressive cache-busting (timestamps, no-cache headers), CDN ignores them
- Result: User clicks like → refreshes → data appears "cleared"

**Upstash Redis Solution:**
- Strong consistency (no CDN cache)
- Read-your-writes guarantee
- Perfect for mutable state like user feedback

## Setup Instructions

### 1. Create Upstash Redis Store

Go to Vercel Dashboard:
https://vercel.com/buxiangshangban/yt-inspo-web-repo/stores

Click **"Create Database"** → **"Upstash Redis"** → **"Continue"**

Store name: `yt-inspo-feedback` (or any name you prefer)

Region: Choose closest to your users (e.g., `us-east-1`)

Click **"Create"**

### 2. Connect to Project

After creation, click **"Connect Store"** to project `yt_inspo_web_repo`

Vercel will automatically inject these environment variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### 3. Verify Connection

In your terminal:
```bash
cd /Users/kylex/clawd/yt_inspo_web_repo
vercel env pull
```

Check `.env.local` should contain:
```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 4. Deploy

Code is already updated to use Redis. Just deploy:
```bash
npm run build   # test build locally
npx vercel --prod
```

### 5. Test

Visit: https://ytinspowebrepo.vercel.app?key=slime

1. Click 👍 on any video
2. Immediately refresh (Cmd+R / Ctrl+R)
3. 👍 should persist (no data clearing)
4. Open on another device → should see the like

## Migration from Blob

**No data migration needed** - Blob and Redis use different storage, so:
- Old data in Blob will be ignored
- Fresh start in Redis
- Users will need to re-click likes (minimal impact)

If you want to preserve existing data:
1. Export from Blob: `curl https://nahqv8r8p4k8gmzn.public.blob.vercel-storage.com/feedback/state.json`
2. Import to Redis: Use the exported JSON in a one-time POST to `/api/feedback` (modify API temporarily)

## Free Tier Limits

Upstash Redis free tier:
- 10,000 commands/day
- 256 MB storage

For this use case (feedback storage):
- ~2 commands per user action (read + write)
- Well within free tier for typical usage

## Troubleshooting

**If data still clears after setup:**
1. Check environment variables are injected: `vercel env ls`
2. Check API logs: `vercel logs` (look for "Redis not configured")
3. Verify connection in Dashboard: Storage → yt-inspo-feedback → should show "Connected"

**If "kv: false" in API responses:**
- Environment variables not loaded
- Run `vercel env pull` and redeploy
