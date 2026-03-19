"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/lib/types";
import VideoCard from "./VideoCard";
import { tr, type Lang } from "@/lib/language";

function getTagFilters(lang: Lang) {
  return [
    { value: "all", label: tr(lang, "All", "全部") },
    { value: "B1", label: tr(lang, "Direct rivals", "直接竞品") },
    { value: "B2", label: tr(lang, "Finance brands", "金融品牌") },
    { value: "A", label: tr(lang, "Aesthetic benchmark", "审美标杆") },
    { value: "C", label: tr(lang, "Culture reference", "文化参考") },
    { value: "S", label: tr(lang, "Sponsorship / collab", "赞助 / 联名") },
  ] as const;
}

export default function SortedVideoGrid({ videos, showFilter = false, lang = "us" }: { videos: Video[]; showFilter?: boolean; lang?: Lang }) {
  const [tagFilter, setTagFilter] = useState<string>("all");
  const TAG_FILTERS = getTagFilters(lang);

  const TAG_ORDER: Record<string, number> = { B1: 0, B2: 1, A: 2, C: 3, S: 4 };

  const filtered = useMemo(() => (tagFilter === "all" ? videos : videos.filter((v) => v.tag === tagFilter)), [videos, tagFilter]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => (TAG_ORDER[a.tag || ""] ?? 4) - (TAG_ORDER[b.tag || ""] ?? 4)), [filtered]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { all: videos.length };
    for (const v of videos) if (v.tag) counts[v.tag] = (counts[v.tag] || 0) + 1;
    return counts;
  }, [videos]);

  return (
    <div>
      {showFilter && (
        <div className="mb-8 flex flex-wrap gap-2" style={{ background: "transparent" }}>
          {TAG_FILTERS.map((tf) => {
            const count = tagCounts[tf.value] || 0;
            if (tf.value !== "all" && count === 0) return null;
            const active = tagFilter === tf.value;
            return (
              <button key={tf.value} onClick={() => setTagFilter(tf.value)} className="cursor-pointer border px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-colors" style={{ background: active ? "var(--accent)" : "#fff", color: active ? "#fff" : "#666", borderColor: active ? "var(--accent)" : "var(--border)" }}>
                {tf.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-4" style={{ background: "transparent" }}>
        <AnimatePresence mode="popLayout">
          {sorted.map((v) => (
            <motion.div key={v.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <VideoCard video={v} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#666", border: "1px solid var(--border)" }}>{tr(lang, "No videos in this lane", "该分类下暂无视频")}</div>}
    </div>
  );
}
