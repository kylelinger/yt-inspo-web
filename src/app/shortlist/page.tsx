"use client";

import { useState, useEffect } from "react";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { getShortlist } from "@/lib/feedback";
import VideoCard from "@/components/VideoCard";

export default function ShortlistPage() {
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSl(getShortlist());
    setMounted(true);
  }, []);

  const videos = (videosData as Video[]).filter((v) => sl.has(v.id));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        ⭐ 收藏
      </h1>
      {!mounted ? (
        <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      ) : videos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          还没有收藏。在视频卡片上点 ⭐ 开始收藏。
        </div>
      )}
    </div>
  );
}
