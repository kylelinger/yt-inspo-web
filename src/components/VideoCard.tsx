"use client";

import { useState, useEffect } from "react";
import type { Video } from "@/lib/types";
import { useAuth } from "./AuthProvider";
import { getClientLang, type Lang } from "@/lib/language";

function formatDuration(s: number | undefined): string | null {
  if (!s) return null;
  if (s >= 60) return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return `0:${String(s).padStart(2, "0")}`;
}

export default function VideoCard({ video, compact = false, lang: langProp }: { video: Video; compact?: boolean; lang?: Lang }) {
  const { isAdmin } = useAuth();
  const [lang, setLang] = useState<Lang>(langProp || "us");

  useEffect(() => {
    if (!langProp) setLang(getClientLang());
  }, [langProp]);

  const displayTitle = video.title || video.brand || video.id;
  const duration = formatDuration(video.duration_s);

  /* ─── ADMIN ONLY: AKQA STYLE ─── */
  if (isAdmin) {
    return (
      <article className="video-card featured">
        <a href={`/video/${video.id}`}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", overflow: "hidden", background: "#000" }}>
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />

            <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "2rem", color: "white", zIndex: 2 }}>
              <h3 style={{ margin: "1rem 0 0 0", fontSize: "1.75rem", fontWeight: 700, lineHeight: "1.2" }}>
                {displayTitle}
              </h3>
              <div style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.6)" }}>
                {video.date_added}
                {duration && ` • ${duration}`}
              </div>
            </div>
          </div>
        </a>
      </article>
    );
  }

  /* ─── VISITOR: Dark theme (original) ─── */
  return (
    <div className="group overflow-hidden" style={{ background: "var(--card)" }}>
      <a href={`/video/${video.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden" style={{ background: "#080808" }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center bg-[var(--accent)] text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {duration && <div className="absolute bottom-0 right-0 bg-black/85 px-2 py-1 text-[11px] font-bold text-white/90">{duration}</div>}
        </div>
      </a>

      <div className="p-6 sm:p-8">
        <a href={`/video/${video.id}`} className="block">
          <h3 className="text-[15px] font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-[var(--accent)]">
            {displayTitle}
          </h3>
        </a>

        <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "#1a1a1a" }}>
          <span className="text-[11px] font-medium text-[#444]">{video.date_added}</span>
        </div>
      </div>
    </div>
  );
}
