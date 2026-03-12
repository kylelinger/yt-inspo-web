import { NextRequest, NextResponse } from "next/server";

/**
 * Feedback API with Vercel Blob persistence.
 * 
 * Requires BLOB_READ_WRITE_TOKEN env var (auto-injected when Blob store
 * is connected via Vercel Dashboard → Storage → Connect Store).
 * 
 * Falls back gracefully — if token missing, returns kv:false
 * and client stays on localStorage-only mode.
 */

const BLOB_AVAILABLE = !!process.env.BLOB_READ_WRITE_TOKEN;
const BLOB_PATH = "feedback/state.json";

interface FeedbackState {
  feedback: Record<string, "thumbsup" | "thumbsdown">;
  shortlist: string[];
}

async function readState(): Promise<FeedbackState> {
  if (!BLOB_AVAILABLE) return { feedback: {}, shortlist: [] };
  try {
    const { head } = await import("@vercel/blob");
    const blob = await head(BLOB_PATH);
    if (blob?.url) {
      const res = await fetch(blob.url, { cache: "no-store" });
      return (await res.json()) as FeedbackState;
    }
  } catch {
    // blob doesn't exist yet or read error
  }
  return { feedback: {}, shortlist: [] };
}

async function writeState(state: FeedbackState): Promise<{ ok: boolean; error?: string }> {
  if (!BLOB_AVAILABLE) return { ok: false, error: "BLOB_TOKEN missing" };
  try {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(state), {
      access: "public",
      addRandomSuffix: false,
    });
    return { ok: true };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("Blob write error:", errorMsg);
    return { ok: false, error: errorMsg };
  }
}

// GET /api/feedback
export async function GET() {
  try {
    const state = await readState();
    return NextResponse.json({ ...state, kv: BLOB_AVAILABLE });
  } catch {
    return NextResponse.json({ feedback: {}, shortlist: [], kv: false });
  }
}

// POST /api/feedback
export async function POST(req: NextRequest) {
  if (!BLOB_AVAILABLE) {
    return NextResponse.json({ ok: true, kv: false });
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
  return NextResponse.json({ ...result, kv: true });
}
