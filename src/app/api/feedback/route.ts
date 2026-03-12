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
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      return (await res.json()) as FeedbackState;
    }
  } catch (e) {
    console.error("Blob read error:", e);
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
      allowOverwrite: true,
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

  // Check admin token
  const adminKey = process.env.ADMIN_KEY?.trim();
  const authHeader = req.headers.get('x-admin-key');
  if (adminKey && authHeader !== adminKey) {
    return NextResponse.json({
      ok: false,
      error: "Unauthorized",
      debug: {
        hasAdminKey: !!adminKey,
        hasAuthHeader: !!authHeader,
        adminKeyLen: adminKey?.length,
        authHeaderLen: authHeader?.length,
      }
    }, { status: 403 });
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
