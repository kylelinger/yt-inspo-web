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

  useEffect(() => {
    if (saved.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [saved.length, next]);

  useEffect(() => {
    if (current >= saved.length) setCurrent(0);
  }, [current, saved.length]);

  if (!mounted) {
    return (
      <div className="relative overflow-hidden" style={{ background: "#0a0a0a" }}>
        <div className="aspect-[21/9] w-full animate-pulse" />
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="py-24 text-center" style={{ background: "#080808" }}>
        <p className="text-3xl mb-3">⭐</p>
        <p className="text-sm font-bold text-[#666]">Your saved collection</p>
        <p className="text-xs mt-2 text-[#444]">Star videos to see them here</p>
      </div>
    );
  }

  const video = saved[current];

  return (
    <div className="relative group">
      <a href={`/video/${video.id}`} className="block">
        <div className="relative overflow-hidden" style={{ background: "#000" }}>
          <div className="aspect-[21/9] w-full overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-[var(--accent)] px-3 py-1 text-[11px] font-bold text-white">
                ⭐ SAVED
              </span>
              {video.tag && (
                <span className="text-[11px] font-bold uppercase text-white/50">
                  {video.tag}
                </span>
              )}
              <span className="text-xs text-white/40">
                {video.brand}
                {video.duration_s && ` \u00B7 ${Math.floor(video.duration_s / 60)}:${String(video.duration_s % 60).padStart(2, "0")}`}
              </span>
            </div>
            <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
              {video.title}
            </h2>
            {video.breakdown?.summary && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 line-clamp-2">
                {video.breakdown.summary}
              </p>
            )}
          </div>

          {/* Play */}
          <div className="absolute right-8 bottom-8 flex h-14 w-14 items-center justify-center bg-[var(--accent)] text-white transition-transform group-hover:scale-110">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </a>

      {saved.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-black/60 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-24 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-black/60 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {saved.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className="h-1 transition-all cursor-pointer"
                style={{
                  width: i === current ? "20px" : "6px",
                  background: i === current ? "var(--accent)" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
