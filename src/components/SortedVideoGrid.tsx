"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/lib/types";
import VideoCard from "./VideoCard";
import { getFeedback } from "@/lib/feedback";

const TAG_FILTERS = [
  { value: "all", label: "\u5168\u90E8", emoji: "\u{1F4FA}" },
  { value: "B1", label: "\u76F4\u63A5\u7ADE\u54C1", emoji: "\u{1F3AF}" },
  { value: "B2", label: "\u91D1\u878D\u54C1\u724C", emoji: "\u{1F4B0}" },
  { value: "A", label: "\u5BA1\u7F8E\u6807\u6746", emoji: "\u2728" },
  { value: "C", label: "\u6587\u5316\u53C2\u8003", emoji: "\u{1F3A8}" },
] as const;

const gridItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

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
        <div className="mb-5 flex flex-wrap gap-2">
          {TAG_FILTERS.map((tf) => {
            const count = tagCounts[tf.value] || 0;
            if (tf.value !== "all" && count === 0) return null;
            const active = tagFilter === tf.value;
            return (
              <motion.button
                key={tf.value}
                onClick={() => setTagFilter(tf.value)}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
                style={{
                  background: active ? "var(--accent)" : "var(--bg-alt)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {tf.emoji} {tf.label} ({count})
              </motion.button>
            );
          })}
        </div>
      )}

      <motion.div
        className="grid gap-5 sm:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        <AnimatePresence mode="popLayout">
          {sorted.map((v) => (
            <motion.div
              key={v.id}
              layout
              variants={gridItemVariants}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <VideoCard video={v} onFeedbackChange={() => setFb(getFeedback())} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {sorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border p-8 text-center"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            该分类下暂无视频
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
