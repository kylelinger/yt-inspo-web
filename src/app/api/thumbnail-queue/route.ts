import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

/**
 * POST /api/thumbnail-queue
 * 将视频 ID 加入封面提取队列
 * 
 * Body: { "videoId": "abc123" }
 */
export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();
    
    if (!videoId || typeof videoId !== "string") {
      return NextResponse.json(
        { ok: false, error: "INVALID_VIDEO_ID" },
        { status: 400 }
      );
    }
    
    // 插入到队列表（如果不存在则创建）
    await sql`
      CREATE TABLE IF NOT EXISTS thumbnail_queue (
        video_id TEXT PRIMARY KEY,
        queued_at TIMESTAMPTZ DEFAULT NOW(),
        status TEXT DEFAULT 'pending'
      )
    `;
    
    // 加入队列（或更新状态为 pending）
    await sql`
      INSERT INTO thumbnail_queue (video_id, status)
      VALUES (${videoId}, 'pending')
      ON CONFLICT (video_id)
      DO UPDATE SET status = 'pending', queued_at = NOW()
    `;
    
    return NextResponse.json({ ok: true, videoId });
  } catch (error: any) {
    console.error("Thumbnail queue error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/thumbnail-queue
 * 获取待处理的视频 ID 列表
 */
export async function GET() {
  try {
    const result = await sql`
      SELECT video_id, queued_at
      FROM thumbnail_queue
      WHERE status = 'pending'
      ORDER BY queued_at ASC
      LIMIT 50
    `;
    
    return NextResponse.json({
      ok: true,
      queue: result.rows.map((r) => ({
        videoId: r.video_id,
        queuedAt: r.queued_at,
      })),
    });
  } catch (error: any) {
    console.error("Thumbnail queue error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/thumbnail-queue?videoId=xxx
 * 标记视频已处理
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    
    if (!videoId) {
      return NextResponse.json(
        { ok: false, error: "MISSING_VIDEO_ID" },
        { status: 400 }
      );
    }
    
    await sql`
      UPDATE thumbnail_queue
      SET status = 'completed'
      WHERE video_id = ${videoId}
    `;
    
    return NextResponse.json({ ok: true, videoId });
  } catch (error: any) {
    console.error("Thumbnail queue error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
