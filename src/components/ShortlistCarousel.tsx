"use client";

import { useState, useEffect, useCallback } from "react";
import type { Video } from "@/lib/types";
import { getShortlist } from "@/lib/feedback";

export default function ShortlistCarousel({ allVideos }: { allVideos: Video[] }) {
  const [shortlistIds, setShortlistIds] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setShortlistIds(getShortlist());
    setMounted(true);

    const handler = () => setShortlistIds(getShortlist());
    window.addEventListener("feedback-changed", handler);
    return () => window.removeEventListener("feedback-changed", handler);
  }, []);

  const saved = allVideos.filter((v) => shortlistIds.has(v.id));

  const next = useCallback(() => {
    if (saved.length > 0) setCurrent((c) => (c + 1) % saved.length);
  }, [saved.length]);

  const prev = useCallback(() => {
    if (saved.length > 0) setCurrent((c) => (c - 1 + saved.length) % saved.length);
  }, [saved.length]);

  // Auto-advance every 6s
  useEffect(() => {
    if (saved.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [saved.length, next]);

  // Clamp current index
  useEffect(() => {
    if (current >= saved.length) setCurrent(0);
  }, [current, saved.length]);

  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-3xl" style={{ background: "#111" }}>
        <div className="aspect-[21/9] w-full animate-pulse" />
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-3xl border border-dashed py-20"
        style={{ borderColor: "#333", color: "#555" }}
      >
        <div className="text-center">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-base font-bold text-[#888]">Your saved collection</p>
          <p className="text-sm mt-2 text-[#555]">Star videos to see them here</p>
        </div>
      </div>
    );
  }

  const video = saved[current];

  return (
    <div className="relative group">
      <a href={`/video/${video.id}`} className="block">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{ background: "#000" }}
        >
          <div className="aspect-[21/9] w-full overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white/90"
                style={{ background: "var(--accent)" }}
              >
                ⭐ Saved
              </span>
              {video.tag && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold uppercase"
                  style={{
                    background: video.tag === "B1" ? "rgba(245,158,11,0.25)" :
                                video.tag === "B2" ? "rgba(59,130,246,0.25)" :
                                video.tag === "A"  ? "rgba(168,85,247,0.25)" :
                                "rgba(156,163,175,0.25)",
                    color: video.tag === "B1" ? "#fbbf24" :
                           video.tag === "B2" ? "#60a5fa" :
                           video.tag === "A"  ? "#c084fc" : "#d1d5db",
                  }}
                >
                  {video.tag}
                </span>
              )}
              <span className="text-xs font-medium text-white/60">
                {video.brand}
                {video.duration_s && ` · ${Math.floor(video.duration_s / 60)}:${String(video.duration_s % 60).padStart(2, "0")}`}
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {video.title}
            </h2>
            {video.breakdown?.summary && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 line-clamp-2">
                {video.breakdown.summary}
              </p>
            )}
          </div>

          {/* Play icon */}
          <div className="absolute right-8 bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </a>

      {/* Navigation arrows */}
      {saved.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-24 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {saved.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className="h-1.5 rounded-full transition-all cursor-pointer"
                style={{
                  width: i === current ? "16px" : "6px",
                  background: i === current ? "var(--accent)" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
