"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/lib/types";
import VideoCard from "./VideoCard";
import { getFeedback } from "@/lib/feedback";
import { tr, type Lang } from "@/lib/language";

function getTagFilters(lang: Lang) {
  return [
    { value: "all", label: tr(lang, "All", "全部") },
    { value: "B1", label: tr(lang, "Direct rivals", "直接竞品") },
    { value: "B2", label: tr(lang, "Finance brands", "金融品牌") },
    { value: "A", label: tr(lang, "Aesthetic benchmark", "审美标杆") },
    { value: "C", label: tr(lang, "Culture reference", "文化参考") },
  ] as const;
}

export default function SortedVideoGrid({ videos, showFilter = false, lang = "us" }: { videos: Video[]; showFilter?: boolean; lang?: Lang }) {
  const [fb, setFb] = useState<Record<string, "thumbsup" | "thumbsdown">>({});
  const [mounted, setMounted] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>("all");
  const TAG_FILTERS = getTagFilters(lang);

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
        <div className="mb-8 flex flex-wrap gap-[2px]" style={{ background: "#000000" }}>
          {TAG_FILTERS.map((tf) => {
            const count = tagCounts[tf.value] || 0;
            if (tf.value !== "all" && count === 0) return null;
            const active = tagFilter === tf.value;
            return (
              <button
                key={tf.value}
                onClick={() => setTagFilter(tf.value)}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                style={{
                  background: active ? "var(--accent)" : "var(--bg)",
                  color: active ? "#fff" : "#555",
                }}
              >
                {tf.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-[2px] sm:grid-cols-2" style={{ background: "#000000" }}>
        <AnimatePresence mode="popLayout">
          {sorted.map((v) => (
            <motion.div
              key={v.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VideoCard video={v} onFeedbackChange={() => setFb(getFeedback())} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
          {tr(lang, "No videos in this lane", "该分类下暂无视频")}
        </div>
      )}
    </div>
  );
}
