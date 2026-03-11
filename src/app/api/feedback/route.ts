import { NextRequest, NextResponse } from "next/server";

// Vercel KV — optional. Falls back gracefully if KV env vars not set.
// To enable: add KV store to project in Vercel dashboard → Storage → KV
let kv: typeof import("@vercel/kv").kv | null = null;
const KV_AVAILABLE =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

async function getKV() {
  if (!KV_AVAILABLE) return null;
  if (!kv) {
    const mod = await import("@vercel/kv");
    kv = mod.kv;
  }
  return kv;
}

const FB_KEY = "yt_inspo:feedback"; // hash: videoId → action
const SL_KEY = "yt_inspo:shortlist"; // set of videoIds

// GET /api/feedback — returns { feedback: {id: action}, shortlist: [id] }
export async function GET() {
  const client = await getKV();
  if (!client) {
    return NextResponse.json({ feedback: {}, shortlist: [], kv: false });
  }
  try {
    const [feedback, shortlist] = await Promise.all([
      client.hgetall(FB_KEY),
      client.smembers(SL_KEY),
    ]);
    return NextResponse.json({
      feedback: feedback ?? {},
      shortlist: shortlist ?? [],
      kv: true,
    });
  } catch {
    return NextResponse.json({ feedback: {}, shortlist: [], kv: false });
  }
}

// POST /api/feedback — body: { videoId, action: 'thumbsup'|'thumbsdown'|'shortlist'|'remove_shortlist' }
export async function POST(req: NextRequest) {
  const { videoId, action } = await req.json();
  if (!videoId || !action) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const client = await getKV();
  if (!client) {
    return NextResponse.json({ ok: true, kv: false });
  }

  try {
    if (action === "shortlist") {
      await client.sadd(SL_KEY, videoId);
    } else if (action === "remove_shortlist") {
      await client.srem(SL_KEY, videoId);
    } else if (action === "thumbsup" || action === "thumbsdown") {
      // Toggle: if same action already set, remove it
      const current = await client.hget(FB_KEY, videoId);
      if (current === action) {
        await client.hdel(FB_KEY, videoId);
      } else {
        await client.hset(FB_KEY, { [videoId]: action });
      }
    } else if (action === "clear") {
      await client.hdel(FB_KEY, videoId);
    }
    return NextResponse.json({ ok: true, kv: true });
  } catch (e) {
    console.error("KV error:", e);
    return NextResponse.json({ ok: false, kv: false, error: String(e) }, { status: 500 });
  }
}
