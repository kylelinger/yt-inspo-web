"use client";

import { useState, useEffect } from "react";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { getShortlist } from "@/lib/feedback";
import VideoCard from "@/components/VideoCard";
import { getClientLang, tr, type Lang } from "@/lib/language";

export default function ShortlistPage() {
  const [lang, setLang] = useState<Lang>("us");
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLang(getClientLang());
    setSl(getShortlist());
    setMounted(true);
  }, []);

  const videos = (videosData as Video[]).filter((v) => sl.has(v.id));

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>
          {tr(lang, "Saved", "收藏")}
        </p>
        <h1 className="display-md text-white mb-2">⭐ {tr(lang, "Picked", "已收藏")}</h1>
        <p className="text-sm text-[#555] mb-12">{videos.length} {tr(lang, "videos saved", "条已收藏")}</p>
      </div>
      <div className="section-inner pb-20">
        {!mounted ? (
          <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
            {tr(lang, "Loading...", "加载中...")}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid gap-[2px] sm:grid-cols-2" style={{ background: "#000000" }}>
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
            {tr(lang, "No saves yet. Hit ⭐ on any card.", "还没有收藏，先给喜欢的视频点 ⭐")}
          </div>
        )}
      </div>
    </div>
  );
}
