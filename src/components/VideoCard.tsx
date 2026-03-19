"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Video } from "@/lib/types";
import { getFeedbackCounts, setFeedback, getShortlist, toggleShortlist, type FeedbackCounts } from "@/lib/feedback";
import { useAuth } from "./AuthProvider";
import { getClientLang, type Lang } from "@/lib/language";
import { useTranslatedText } from "@/lib/translate-client";

const TAG_COLORS: Record<string, string> = {
  B1: "#f59e0b",
  B2: "#3b82f6",
  A: "#a855f7",
  C: "#555",
  S: "#10b981",
};

function formatDuration(s: number | undefined): string | null {
  if (!s) return null;
  if (s >= 60) return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return `0:${String(s).padStart(2, "0")}`;
}

function TranslatedText({ text, lang, className }: { text: string; lang: Lang; className?: string }) {
  const value = useTranslatedText(text, lang);
  return <span className={className}>{value}</span>;
}

export default function VideoCard({
  video,
  compact = false,
  onFeedbackChange,
  lang: langProp,
}: {
  video: Video;
  compact?: boolean;
  onFeedbackChange?: () => void;
  lang?: Lang;
}) {
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState<FeedbackCounts>({});
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState<"up" | "down" | "star" | null>(null);
  const [lang, setLang] = useState<Lang>(langProp || "us");

  useEffect(() => {
    if (!langProp) setLang(getClientLang());
    setCounts(getFeedbackCounts());
    setSl(getShortlist());
    setMounted(true);
  }, [langProp]);

  const pop = (kind: "up" | "down" | "star") => {
    setBurst(kind);
    setTimeout(() => setBurst(null), 450);
  };

  const handleFeedback = async (action: "thumbsup" | "thumbsdown") => {
    const newCounts = await setFeedback(video.id, action);
    setCounts({ ...newCounts });
    pop(action === "thumbsup" ? "up" : "down");
    onFeedbackChange?.();
  };

  const handleShortlist = async () => {
    const newSl = await toggleShortlist(video.id);
    setSl(new Set(newSl));
    pop("star");
    onFeedbackChange?.();
  };

  const isShortlisted = sl.has(video.id);
  const displayTitle = video.title || video.brand || video.id;
  const duration = formatDuration(video.duration_s);
  const tagColor = TAG_COLORS[video.tag || ""] || "#555";
  const c = counts[video.id] || { thumbsup: 0, thumbsdown: 0, score: 0 };
  const summary = video.breakdown?.summary || "";

  const feedbackBar = (
    <div className="relative flex items-center gap-1">
      <motion.button onClick={(e) => { e.preventDefault(); handleFeedback("thumbsup"); }} className="px-2 py-1 text-sm cursor-pointer transition-all rounded border" style={{ borderColor: "#d7d7d7", background: "#fff" }} whileTap={{ scale: 1.18 }}>
        👍 <span className="text-[10px] text-[#888]">{c.thumbsup}</span>
      </motion.button>
      <motion.button onClick={(e) => { e.preventDefault(); handleFeedback("thumbsdown"); }} className="px-2 py-1 text-sm cursor-pointer transition-all rounded border" style={{ borderColor: "#d7d7d7", background: "#fff" }} whileTap={{ scale: 1.18 }}>
        👎 <span className="text-[10px] text-[#888]">{c.thumbsdown}</span>
      </motion.button>
      {isAdmin && (
        <motion.button onClick={(e) => { e.preventDefault(); handleShortlist(); }} className="px-2 py-1 text-sm cursor-pointer transition-all rounded border" style={{ background: isShortlisted ? "#fff2e8" : "#fff", borderColor: isShortlisted ? "var(--accent)" : "#d7d7d7", color: isShortlisted ? "var(--accent)" : "#666" }} whileTap={{ scale: 1.25 }}>
          {isShortlisted ? "★" : "☆"}
        </motion.button>
      )}
      <AnimatePresence>
        {burst && (
          <motion.span key={burst} initial={{ opacity: 0, y: 4, scale: 0.8 }} animate={{ opacity: 1, y: -10, scale: 1.1 }} exit={{ opacity: 0, y: -18, scale: 0.9 }} transition={{ duration: 0.35 }} className="pointer-events-none absolute right-0 -top-2 text-xs">
            {burst === "up" ? "+1 👍" : burst === "down" ? "+1 👎" : "★"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  if (isAdmin) {
    return (
      <article className="group overflow-hidden border" style={{ background: "#fff", borderColor: "var(--border)" }}>
        <a href={`/video/${video.id}`} className="block">
          <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ background: "#f5f5f5" }}>
            <img
              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            {duration && <div className="absolute bottom-0 right-0 bg-black/75 px-2 py-1 text-[11px] font-bold text-white">{duration}</div>}
          </div>
        </a>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="mb-4 flex items-center gap-3">
            {video.brand && <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>{video.brand}</span>}
            {video.tag && <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: tagColor }}>{video.tag}</span>}
            <span className="ml-auto text-[11px] font-medium text-[#777]">{video.date_added}</span>
          </div>

          <a href={`/video/${video.id}`} className="block">
            <h3 className="text-[28px] sm:text-[34px] leading-[1.02] font-black text-[#111] tracking-[-0.02em] transition-colors group-hover:text-[var(--accent)]">
              {video.status === "playback_risky" && <span className="mr-1 text-xs opacity-50">⚠️</span>}
              {displayTitle}
            </h3>
          </a>

          {!compact && summary && (
            <p className="mt-4 max-w-4xl text-[15px] leading-relaxed text-[#666] line-clamp-3">
              {mounted ? <TranslatedText text={summary} lang={lang} /> : summary}
            </p>
          )}

          {mounted && <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--border)" }}>{feedbackBar}</div>}
        </div>
      </article>
    );
  }

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          {duration && (
            <div className="absolute bottom-0 right-0 bg-black/85 px-2 py-1 text-[11px] font-bold text-white/90">{duration}</div>
          )}
        </div>
      </a>

      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          {video.brand && (
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>{video.brand}</span>
          )}
          {video.tag && (
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tagColor }}>{video.tag}</span>
          )}
        </div>

        <a href={`/video/${video.id}`} className="block">
          <h3 className="text-[15px] font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-[var(--accent)]">
            {video.status === "playback_risky" && <span className="mr-1 text-xs opacity-50">⚠️</span>}
            {displayTitle}
          </h3>
        </a>

        {!compact && summary && (
          <p className="mt-2 text-[13px] leading-relaxed text-[#666] line-clamp-2">
            {mounted ? <TranslatedText text={summary} lang={lang} /> : summary}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "#1a1a1a" }}>
          <span className="text-[11px] font-medium text-[#444]">{video.date_added}</span>
          {mounted && (
            <div className="relative flex items-center gap-1">
              <motion.button onClick={(e) => { e.preventDefault(); handleFeedback("thumbsup"); }} className="px-2 py-1 text-sm cursor-pointer transition-all rounded border" style={{ borderColor: "#1f3b33", background: "#34d39914" }} whileTap={{ scale: 1.18 }}>
                👍 <span className="text-[10px] text-[#8aa]">{c.thumbsup}</span>
              </motion.button>
              <motion.button onClick={(e) => { e.preventDefault(); handleFeedback("thumbsdown"); }} className="px-2 py-1 text-sm cursor-pointer transition-all rounded border" style={{ borderColor: "#4a2a22", background: "#ff6b3512" }} whileTap={{ scale: 1.18 }}>
                👎 <span className="text-[10px] text-[#b88]">{c.thumbsdown}</span>
              </motion.button>
              {isAdmin && (
                <motion.button onClick={(e) => { e.preventDefault(); handleShortlist(); }} className="px-2 py-1 text-sm cursor-pointer transition-all" style={{ background: isShortlisted ? "#fbbf2415" : "transparent", border: `1px solid ${isShortlisted ? "#fbbf24" : "transparent"}`, borderRadius: "4px" }} whileTap={{ scale: 1.25 }}>
                  {isShortlisted ? "★" : "☆"}
                </motion.button>
              )}
              <AnimatePresence>
                {burst && (
                  <motion.span key={burst} initial={{ opacity: 0, y: 4, scale: 0.8 }} animate={{ opacity: 1, y: -10, scale: 1.1 }} exit={{ opacity: 0, y: -18, scale: 0.9 }} transition={{ duration: 0.35 }} className="pointer-events-none absolute right-0 -top-2 text-xs">
                    {burst === "up" ? "+1 👍" : burst === "down" ? "+1 👎" : "★"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
