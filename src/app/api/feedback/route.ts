import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

/**
 * Feedback API with Vercel Postgres (Neon) persistence.
 *
 * Tables:
 *   feedback (video_id TEXT PK, action TEXT, updated_at TIMESTAMPTZ)
 *   shortlist (video_id TEXT PK, created_at TIMESTAMPTZ)
 *
 * Auto-creates tables on first request.
 */

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

let tablesReady = false;

async function ensureTables() {
  if (tablesReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      video_id TEXT PRIMARY KEY,
      action TEXT NOT NULL CHECK (action IN ('thumbsup', 'thumbsdown')),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS shortlist (
      video_id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  tablesReady = true;
}

async function getState(): Promise<{
  feedback: Record<string, "thumbsup" | "thumbsdown">;
  shortlist: string[];
}> {
  await ensureTables();

  const [fbRows, slRows] = await Promise.all([
    sql`SELECT video_id, action FROM feedback`,
    sql`SELECT video_id FROM shortlist ORDER BY created_at`,
  ]);

  const feedback: Record<string, "thumbsup" | "thumbsdown"> = {};
  for (const row of fbRows.rows) {
    feedback[row.video_id] = row.action as "thumbsup" | "thumbsdown";
  }

  const shortlist = slRows.rows.map((r) => r.video_id);

  return { feedback, shortlist };
}

// ─── GET /api/feedback ──────────────────────────────────────────────────────

export async function GET() {
  try {
    const state = await getState();
    return NextResponse.json({ ...state, kv: true }, { headers: NO_CACHE });
  } catch (e) {
    console.error("GET /api/feedback error:", e);
    return NextResponse.json(
      { feedback: {}, shortlist: [], kv: false, error: String(e) },
      { headers: NO_CACHE }
    );
  }
}

// ─── POST /api/feedback ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check
  const adminKey = process.env.ADMIN_KEY?.trim();
  const authHeader = req.headers.get("x-admin-key");
  if (adminKey && authHeader !== adminKey) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    await ensureTables();

    const { videoId, action } = await req.json();
    if (!videoId || !action) {
      return NextResponse.json(
        { ok: false, error: "missing fields" },
        { status: 400 }
      );
    }

    if (action === "shortlist") {
      await sql`
        INSERT INTO shortlist (video_id) VALUES (${videoId})
        ON CONFLICT (video_id) DO NOTHING
      `;
    } else if (action === "remove_shortlist") {
      await sql`DELETE FROM shortlist WHERE video_id = ${videoId}`;
    } else if (action === "thumbsup" || action === "thumbsdown") {
      // Toggle: if same action exists, remove it; otherwise upsert
      const existing =
        await sql`SELECT action FROM feedback WHERE video_id = ${videoId}`;
      if (existing.rows.length > 0 && existing.rows[0].action === action) {
        await sql`DELETE FROM feedback WHERE video_id = ${videoId}`;
      } else {
        await sql`
          INSERT INTO feedback (video_id, action, updated_at)
          VALUES (${videoId}, ${action}, NOW())
          ON CONFLICT (video_id) DO UPDATE SET action = ${action}, updated_at = NOW()
        `;
      }
    } else if (action === "clear") {
      await sql`DELETE FROM feedback WHERE video_id = ${videoId}`;
    }

    // Return fresh state
    const state = await getState();
    return NextResponse.json({ ok: true, kv: true, state });
  } catch (e) {
    console.error("POST /api/feedback error:", e);
    return NextResponse.json(
      { ok: false, kv: false, error: String(e) },
      { status: 500 }
    );
  }
}
