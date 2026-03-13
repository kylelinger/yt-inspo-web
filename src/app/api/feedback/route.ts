import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * Feedback API with Upstash Redis persistence.
 * 
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * (auto-injected when Redis store is connected via Vercel Dashboard → Storage).
 * 
 * Falls back gracefully — if not configured, returns kv:false
 * and client stays on localStorage-only mode.
 */

const REDIS_AVAILABLE = !!(
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN
);

const REDIS_KEY = "yt_inspo:feedback_state";

interface FeedbackState {
  feedback: Record<string, "thumbsup" | "thumbsdown">;
  shortlist: string[];
}

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!REDIS_AVAILABLE) return null;
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

async function readState(): Promise<FeedbackState> {
  const client = getRedis();
  if (!client) return { feedback: {}, shortlist: [] };
  
  try {
    const data = await client.get<FeedbackState>(REDIS_KEY);
    if (data) return data;
  } catch (e) {
    console.error("Redis read error:", e);
  }
  return { feedback: {}, shortlist: [] };
}

async function writeState(state: FeedbackState): Promise<{ ok: boolean; error?: string }> {
  const client = getRedis();
  if (!client) return { ok: false, error: "Redis not configured" };
  
  try {
    await client.set(REDIS_KEY, state);
    return { ok: true };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("Redis write error:", errorMsg);
    return { ok: false, error: errorMsg };
  }
}

// GET /api/feedback
export async function GET() {
  try {
    const state = await readState();
    return NextResponse.json(
      { ...state, kv: REDIS_AVAILABLE },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { feedback: {}, shortlist: [], kv: false },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      }
    );
  }
}

// POST /api/feedback
export async function POST(req: NextRequest) {
  if (!REDIS_AVAILABLE) {
    return NextResponse.json({ ok: true, kv: false });
  }

  // Check admin token
  const adminKey = process.env.ADMIN_KEY?.trim();
  const authHeader = req.headers.get('x-admin-key');
  if (adminKey && authHeader !== adminKey) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const { videoId, action } = await req.json();
  if (!videoId || !action) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const state = await readState();

  if (action === "shortlist") {
    if (!state.shortlist.includes(videoId)) state.shortlist.push(videoId);
  } else if (action === "remove_shortlist") {
    state.shortlist = state.shortlist.filter((id) => id !== videoId);
  } else if (action === "thumbsup" || action === "thumbsdown") {
    if (state.feedback[videoId] === action) {
      delete state.feedback[videoId];
    } else {
      state.feedback[videoId] = action;
    }
  } else if (action === "clear") {
    delete state.feedback[videoId];
  }

  const result = await writeState(state);
  return NextResponse.json({ 
    ...result, 
    kv: true,
    state: state
  });
}
