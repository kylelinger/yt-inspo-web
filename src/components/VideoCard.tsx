"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Video } from "@/lib/types";
import { getFeedback, setFeedback, getShortlist, toggleShortlist } from "@/lib/feedback";
import { useAuth } from "./AuthProvider";

const TAG_COLORS: Record<string, string> = {
  B1: "#f59e0b",
  B2: "#3b82f6",
  A: "#a855f7",
  C: "#555",
};

function formatDuration(s: number | undefined): string | null {
  if (!s) return null;
  if (s >= 60) return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return `0:${String(s).padStart(2, "0")}`;
}

export default function VideoCard({
  video,
  compact = false,
  onFeedbackChange,
}: {
  video: Video;
  compact?: boolean;
  onFeedbackChange?: () => void;
}) {
  const { isAdmin } = useAuth();
  const [fb, setFb] = useState<Record<string, "thumbsup" | "thumbsdown">>({});
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFb(getFeedback());
    setSl(getShortlist());
    setMounted(true);
  }, []);

  const handleFeedback = async (action: "thumbsup" | "thumbsdown") => {
    const newFb = await setFeedback(video.id, action);
    setFb({ ...newFb });
    onFeedbackChange?.();
  };

  const handleShortlist = async () => {
    const newSl = await toggleShortlist(video.id);
    setSl(new Set(newSl));
    onFeedbackChange?.();
  };

  const currentFb = fb[video.id];
  const isShortlisted = sl.has(video.id);
  const displayTitle = video.title || video.brand || video.id;
  const duration = formatDuration(video.duration_s);
  const tagColor = TAG_COLORS[video.tag || ""] || "#555";

  return (
    <div className="group overflow-hidden" style={{ background: "var(--card)" }}>
      {/* Thumbnail — edge to edge, no radius */}
      <a href={`/video/${video.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden" style={{ background: "#080808" }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

          {/* Play */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center bg-[var(--accent)] text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Duration */}
          {duration && (
            <div className="absolute bottom-0 right-0 bg-black/85 px-2 py-1 text-[11px] font-bold text-white/90">
              {duration}
            </div>
          )}


        </div>
      </a>

      {/* Content block */}
      <div className="p-6 sm:p-8">
        {/* Brand + Tag inline */}
        <div className="flex items-center gap-3 mb-2">
          {video.brand && (
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              {video.brand}
            </span>
          )}
          {video.tag && (
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tagColor }}>
              {video.tag}
            </span>
          )}
        </div>

        <a href={`/video/${video.id}`} className="block">
          <h3 className="text-[15px] font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-[var(--accent)]">
            {video.status === "playback_risky" && (
              <span className="mr-1 text-xs opacity-50">⚠️</span>
            )}
            {displayTitle}
          </h3>
        </a>

        {!compact && video.breakdown?.summary && (
          <p className="mt-2 text-[13px] leading-relaxed text-[#666] line-clamp-2">
            {video.breakdown.summary}
          </p>
        )}

        {/* Bottom row */}
        <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "#1a1a1a" }}>
          <span className="text-[11px] font-medium text-[#444]">{video.date_added}</span>
          {mounted && isAdmin && (
            <div className="flex gap-1">
              {([
                { action: "thumbsup" as const, emoji: "👍", active: currentFb === "thumbsup", activeColor: "var(--green)" },
                { action: "thumbsdown" as const, emoji: "👎", active: currentFb === "thumbsdown", activeColor: "var(--red)" },
              ]).map((btn) => (
                <motion.button
                  key={btn.action}
                  onClick={(e) => { e.preventDefault(); handleFeedback(btn.action); }}
                  className="px-2 py-1 text-sm cursor-pointer"
                  style={{ color: btn.active ? btn.activeColor : "#333" }}
                  whileTap={{ scale: 1.3 }}
                >
                  {btn.emoji}
                </motion.button>
              ))}
              <motion.button
                onClick={(e) => { e.preventDefault(); handleShortlist(); }}
                className="px-2 py-1 text-sm cursor-pointer"
                style={{ color: isShortlisted ? "var(--yellow)" : "#333" }}
                whileTap={{ scale: 1.4 }}
              >
                {isShortlisted ? "★" : "☆"}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
