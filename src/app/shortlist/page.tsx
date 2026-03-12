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
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>
          Saved
        </p>
        <h1 className="display-md text-white mb-2">⭐ 收藏</h1>
        <p className="text-sm text-[#555] mb-12">{videos.length} videos saved</p>
      </div>
      <div className="section-inner pb-20">
        {!mounted ? (
          <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
            Loading...
          </div>
        ) : videos.length > 0 ? (
          <div className="grid gap-[2px] sm:grid-cols-2" style={{ background: "#000000" }}>
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
            还没有收藏。在视频卡片上点 ⭐ 开始收藏。
          </div>
        )}
      </div>
    </div>
  );
}
