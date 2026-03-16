import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

let ready = false;

async function ensureTable() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS site_metrics (
      metric_key TEXT PRIMARY KEY,
      metric_value BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  ready = true;
}

async function getVisits(): Promise<number> {
  await ensureTable();
  const r = await sql`SELECT metric_value FROM site_metrics WHERE metric_key = 'pageviews_total'`;
  if (r.rows.length === 0) return 0;
  return Number(r.rows[0].metric_value || 0);
}

export async function GET() {
  try {
    const visits = await getVisits();
    return NextResponse.json({ ok: true, visits }, { headers: NO_CACHE });
  } catch (e) {
    return NextResponse.json({ ok: false, visits: 0, error: String(e) }, { status: 500, headers: NO_CACHE });
  }
}

export async function POST() {
  try {
    await ensureTable();
    await sql`
      INSERT INTO site_metrics (metric_key, metric_value, updated_at)
      VALUES ('pageviews_total', 1, NOW())
      ON CONFLICT (metric_key)
      DO UPDATE SET metric_value = site_metrics.metric_value + 1,
                    updated_at = NOW()
    `;
    const visits = await getVisits();
    return NextResponse.json({ ok: true, visits }, { headers: NO_CACHE });
  } catch (e) {
    return NextResponse.json({ ok: false, visits: 0, error: String(e) }, { status: 500, headers: NO_CACHE });
  }
}
