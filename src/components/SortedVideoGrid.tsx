"use client";

import { useState, useEffect, useMemo } from "react";
import type { Video } from "@/lib/types";
import VideoCard from "./VideoCard";
import { getFeedback } from "@/lib/feedback";

const TAG_FILTERS = [
  { value: "all", label: "全部", emoji: "📺" },
  { value: "B1", label: "直接竞品", emoji: "🎯" },
  { value: "B2", label: "金融品牌", emoji: "💰" },
  { value: "A", label: "审美标杆", emoji: "✨" },
  { value: "C", label: "文化参考", emoji: "🎨" },
] as const;

export default function SortedVideoGrid({ videos, showFilter = false }: { videos: Video[]; showFilter?: boolean }) {
  const [fb, setFb] = useState<Record<string, "thumbsup" | "thumbsdown">>({});
  const [mounted, setMounted] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("all");

  useEffect(() => {
    setFb(getFeedback());
    setMounted(true);

    const handler = () => setFb(getFeedback());
    window.addEventListener("feedback-changed", handler);
    return () => window.removeEventListener("feedback-changed", handler);
  }, []);

  const filtered = useMemo(() => {
    if (tagFilter === "all") return videos;
    return videos.filter((v) => v.tag === tagFilter);
  }, [videos, tagFilter]);

  const sorted = useMemo(() => {
    if (!mounted) return filtered;
    return [...filtered].sort((a, b) => {
      const scoreA = fb[a.id] === "thumbsup" ? 1 : fb[a.id] === "thumbsdown" ? -1 : 0;
      const scoreB = fb[b.id] === "thumbsup" ? 1 : fb[b.id] === "thumbsdown" ? -1 : 0;
      return scoreB - scoreA;
    });
  }, [filtered, fb, mounted]);

  // Count videos per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { all: videos.length };
    for (const v of videos) {
      if (v.tag) counts[v.tag] = (counts[v.tag] || 0) + 1;
    }
    return counts;
  }, [videos]);

  return (
    <div>
      {showFilter && (
        <div className="mb-4 flex flex-wrap gap-2">
          {TAG_FILTERS.map((tf) => {
            const count = tagCounts[tf.value] || 0;
            if (tf.value !== "all" && count === 0) return null;
            const active = tagFilter === tf.value;
            return (
              <button
                key={tf.value}
                onClick={() => setTagFilter(tf.value)}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: active ? 'var(--accent)' : 'color-mix(in srgb, var(--text-muted) 10%, transparent)',
                  color: active ? 'white' : 'var(--text-muted)',
                }}
              >
                {tf.emoji} {tf.label} ({count})
              </button>
            );
          })}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((v) => (
          <VideoCard key={v.id} video={v} onFeedbackChange={() => setFb(getFeedback())} />
        ))}
      </div>
      {sorted.length === 0 && (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          该分类下暂无视频
        </div>
      )}
    </div>
  );
}
