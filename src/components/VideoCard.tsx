"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Video } from "@/lib/types";
import { getFeedback, setFeedback, getShortlist, toggleShortlist } from "@/lib/feedback";

const TAG_STYLES: Record<string, { bg: string; fg: string }> = {
  B1: { bg: "rgba(245,158,11,0.15)", fg: "#f59e0b" },
  B2: { bg: "rgba(59,130,246,0.15)", fg: "#3b82f6" },
  A:  { bg: "rgba(168,85,247,0.15)", fg: "#a855f7" },
  C:  { bg: "rgba(156,163,175,0.15)", fg: "#9ca3af" },
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
  const [fb, setFb] = useState<Record<string, "thumbsup" | "thumbsdown">>({});
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setFb(getFeedback());
    setSl(getShortlist());
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

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
  const ts = TAG_STYLES[video.tag || ""];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl"
      style={{ background: "var(--card)" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,90,0,0.07), transparent 60%)`,
        }}
      />

      {/* Thumbnail */}
      <a href={`/video/${video.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden" style={{ background: "#0a0a0a" }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
              style={{ background: "var(--accent)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>

          {/* Duration */}
          {duration && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-bold text-white/90 backdrop-blur-sm">
              {duration}
            </div>
          )}

          {/* Tag on thumbnail */}
          {video.tag && ts && (
            <div
              className="absolute top-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm"
              style={{ background: ts.bg, color: ts.fg }}
            >
              {video.tag}
            </div>
          )}
        </div>
      </a>

      {/* Content */}
      <div className="relative z-20 p-5">
        {video.brand && (
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {video.brand}
          </div>
        )}

        <a href={`/video/${video.id}`} className="block">
          <h3 className="text-[15px] font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-[var(--accent)]">
            {video.status === "playback_risky" && (
              <span title="Playback may be restricted" className="mr-1 text-xs opacity-60">⚠️</span>
            )}
            {displayTitle}
          </h3>
        </a>

        {!compact && video.breakdown?.summary && (
          <p className="mt-2 text-[13px] leading-relaxed text-[#777] line-clamp-2">
            {video.breakdown.summary}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#555]">
            {video.date_added}
          </span>
          {mounted && (
            <div className="flex gap-1">
              {([
                { action: "thumbsup" as const, emoji: "👍", active: currentFb === "thumbsup", activeBg: "rgba(52,211,153,0.15)", activeColor: "var(--green)" },
                { action: "thumbsdown" as const, emoji: "👎", active: currentFb === "thumbsdown", activeBg: "rgba(255,107,53,0.15)", activeColor: "var(--red)" },
              ]).map((btn) => (
                <motion.button
                  key={btn.action}
                  onClick={(e) => { e.preventDefault(); handleFeedback(btn.action); }}
                  className="rounded-lg px-2 py-1 text-sm cursor-pointer"
                  style={{
                    background: btn.active ? btn.activeBg : "transparent",
                    color: btn.active ? btn.activeColor : "#555",
                  }}
                  whileTap={{ scale: 1.3 }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {btn.emoji}
                </motion.button>
              ))}
              <motion.button
                onClick={(e) => { e.preventDefault(); handleShortlist(); }}
                className="rounded-lg px-2 py-1 text-sm cursor-pointer"
                style={{
                  background: isShortlisted ? "rgba(251,191,36,0.15)" : "transparent",
                  color: isShortlisted ? "var(--yellow)" : "#555",
                }}
                whileTap={{ scale: 1.4, rotate: 15 }}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {isShortlisted ? "★" : "☆"}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
