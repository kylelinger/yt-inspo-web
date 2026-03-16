import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

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
      action TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS thumbsup_count INTEGER DEFAULT 0`;
  await sql`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS thumbsdown_count INTEGER DEFAULT 0`;

  // Backfill old single-action rows once for compatibility.
  await sql`
    UPDATE feedback
    SET
      thumbsup_count = CASE WHEN action = 'thumbsup' THEN 1 ELSE thumbsup_count END,
      thumbsdown_count = CASE WHEN action = 'thumbsdown' THEN 1 ELSE thumbsdown_count END
    WHERE COALESCE(thumbsup_count, 0) = 0 AND COALESCE(thumbsdown_count, 0) = 0 AND action IS NOT NULL
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS shortlist (
      video_id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  tablesReady = true;
}

type Counts = { thumbsup: number; thumbsdown: number; score: number };

async function getState(): Promise<{
  feedbackCounts: Record<string, Counts>;
  feedback: Record<string, "thumbsup" | "thumbsdown">;
  shortlist: string[];
}> {
  await ensureTables();

  const [fbRows, slRows] = await Promise.all([
    sql`
      SELECT video_id,
             COALESCE(thumbsup_count, 0) AS thumbsup_count,
             COALESCE(thumbsdown_count, 0) AS thumbsdown_count
      FROM feedback
    `,
    sql`SELECT video_id FROM shortlist ORDER BY created_at`,
  ]);

  const feedbackCounts: Record<string, Counts> = {};
  const feedback: Record<string, "thumbsup" | "thumbsdown"> = {};

  for (const row of fbRows.rows) {
    const up = Number(row.thumbsup_count || 0);
    const down = Number(row.thumbsdown_count || 0);
    feedbackCounts[row.video_id] = { thumbsup: up, thumbsdown: down, score: up - down };
    if (up > down) feedback[row.video_id] = "thumbsup";
    if (down > up) feedback[row.video_id] = "thumbsdown";
  }

  const shortlist = slRows.rows.map((r) => r.video_id);

  return { feedbackCounts, feedback, shortlist };
}

function isAdmin(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY?.trim() || "slime";
  const authHeader = req.headers.get("x-admin-key");
  return authHeader === adminKey;
}

export async function GET() {
  try {
    const state = await getState();
    return NextResponse.json({ ...state, kv: true }, { headers: NO_CACHE });
  } catch (e) {
    console.error("GET /api/feedback error:", e);
    return NextResponse.json(
      { feedbackCounts: {}, feedback: {}, shortlist: [], kv: false, error: String(e) },
      { headers: NO_CACHE }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTables();

    const { videoId, action } = await req.json();
    if (!videoId || !action) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const adminOnly = ["shortlist", "remove_shortlist", "clear"];
    if (adminOnly.includes(action) && !isAdmin(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    if (action === "thumbsup") {
      await sql`
        INSERT INTO feedback (video_id, action, thumbsup_count, thumbsdown_count, updated_at)
        VALUES (${videoId}, 'thumbsup', 1, 0, NOW())
        ON CONFLICT (video_id)
        DO UPDATE SET action = 'thumbsup',
                      thumbsup_count = COALESCE(feedback.thumbsup_count, 0) + 1,
                      updated_at = NOW()
      `;
    } else if (action === "thumbsdown") {
      await sql`
        INSERT INTO feedback (video_id, action, thumbsup_count, thumbsdown_count, updated_at)
        VALUES (${videoId}, 'thumbsdown', 0, 1, NOW())
        ON CONFLICT (video_id)
        DO UPDATE SET action = 'thumbsdown',
                      thumbsdown_count = COALESCE(feedback.thumbsdown_count, 0) + 1,
                      updated_at = NOW()
      `;
    } else if (action === "shortlist") {
      await sql`
        INSERT INTO shortlist (video_id) VALUES (${videoId})
        ON CONFLICT (video_id) DO NOTHING
      `;
      
      // 加入封面提取队列
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS thumbnail_queue (
            video_id TEXT PRIMARY KEY,
            queued_at TIMESTAMPTZ DEFAULT NOW(),
            status TEXT DEFAULT 'pending'
          )
        `;
        
        await sql`
          INSERT INTO thumbnail_queue (video_id, status)
          VALUES (${videoId}, 'pending')
          ON CONFLICT (video_id)
          DO UPDATE SET status = 'pending', queued_at = NOW()
        `;
      } catch (queueError) {
        console.error("Failed to queue thumbnail extraction:", queueError);
        // 不阻塞主流程
      }
    } else if (action === "remove_shortlist") {
      await sql`DELETE FROM shortlist WHERE video_id = ${videoId}`;
    } else if (action === "clear") {
      await sql`DELETE FROM feedback WHERE video_id = ${videoId}`;
    }

    const state = await getState();
    return NextResponse.json({ ok: true, kv: true, state });
  } catch (e) {
    console.error("POST /api/feedback error:", e);
    return NextResponse.json({ ok: false, kv: false, error: String(e) }, { status: 500 });
  }
}
