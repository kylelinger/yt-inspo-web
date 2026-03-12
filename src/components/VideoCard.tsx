"use client";

import { useState, useEffect } from "react";
import type { Video } from "@/lib/types";
import { getFeedback, setFeedback, getShortlist, toggleShortlist } from "@/lib/feedback";

const TAG_STYLES: Record<string, { bg: string; fg: string }> = {
  B1: { bg: "rgba(245,158,11,0.12)", fg: "#f59e0b" },
  B2: { bg: "rgba(59,130,246,0.12)", fg: "#3b82f6" },
  A:  { bg: "rgba(168,85,247,0.12)", fg: "#a855f7" },
  C:  { bg: "rgba(156,163,175,0.12)", fg: "#9ca3af" },
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
  const ts = TAG_STYLES[video.tag || ""];

  return (
    <div
      className="group overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg hover:border-[var(--accent)]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Thumbnail */}
      <a href={`/video/${video.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden" style={{ background: "var(--bg-alt)" }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-black opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 scale-90">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {duration && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
              {duration}
            </div>
          )}
        </div>
      </a>

      {/* Content */}
      <div className="p-4">
        {/* Brand + Tag row */}
        <div className="mb-2 flex items-center gap-2">
          {video.brand && (
            <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
              {video.brand}
            </span>
          )}
          {video.tag && ts && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: ts.bg, color: ts.fg }}
            >
              {video.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <a href={`/video/${video.id}`} className="block">
          <h3
            className="text-[15px] font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            {video.status === "playback_risky" && (
              <span title="Playback may be restricted" className="mr-1 text-xs opacity-60">
                ⚠️
              </span>
            )}
            {displayTitle}
          </h3>
        </a>

        {/* Summary */}
        {!compact && video.breakdown?.summary && (
          <p
            className="mt-2 text-[13px] leading-relaxed line-clamp-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {video.breakdown.summary}
          </p>
        )}

        {/* Actions row */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
            {video.date_added}
          </span>
          {mounted && (
            <div className="flex gap-0.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleFeedback("thumbsup");
                }}
                className="rounded-lg px-2 py-1 text-sm transition-all hover:scale-110 cursor-pointer"
                style={{
                  background: currentFb === "thumbsup" ? "rgba(0,200,5,0.15)" : "transparent",
                  color: currentFb === "thumbsup" ? "var(--green)" : "var(--text-muted)",
                }}
              >
                👍
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleFeedback("thumbsdown");
                }}
                className="rounded-lg px-2 py-1 text-sm transition-all hover:scale-110 cursor-pointer"
                style={{
                  background: currentFb === "thumbsdown" ? "rgba(255,80,0,0.15)" : "transparent",
                  color: currentFb === "thumbsdown" ? "var(--red)" : "var(--text-muted)",
                }}
              >
                👎
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleShortlist();
                }}
                className="rounded-lg px-2 py-1 text-sm transition-all hover:scale-110 cursor-pointer"
                style={{
                  background: isShortlisted ? "rgba(251,191,36,0.15)" : "transparent",
                  color: isShortlisted ? "var(--yellow)" : "var(--text-muted)",
                }}
              >
                {isShortlisted ? "★" : "☆"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
