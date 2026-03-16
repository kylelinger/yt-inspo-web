"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { getFeedbackCounts, setFeedback, getShortlist, toggleShortlist, type FeedbackCounts } from "@/lib/feedback";
import { useAuth } from "@/components/AuthProvider";
import { getClientLang, tr, type Lang } from "@/lib/language";
import { useTranslatedText } from "@/lib/translate-client";

function TrText({ text, lang }: { text: string; lang: Lang }) {
  const value = useTranslatedText(text, lang);
  return <>{value}</>;
}

function BreakdownSection({
  breakdown,
  lang,
  tr: tFn,
}: {
  breakdown: NonNullable<Video["breakdown"]>;
  lang: Lang;
  tr: (l: Lang, en: string, cn: string) => string;
}) {
  return (
    <>
      {/* Summary */}
      <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text)" }}>
          <TrText text={breakdown.summary} lang={lang} />
        </p>
      </div>

      {/* Strengths / Risks / Transferable (original core sections) */}
      {breakdown.strengths && breakdown.strengths.length > 0 && (
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {tFn(lang, "Strengths", "优势")}
          </h3>
          <ul className="space-y-2">
            {breakdown.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text)" }}>
                <span style={{ color: "var(--accent)" }}>•</span>
                <span>
                  <TrText text={String(s)} lang={lang} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {breakdown.risks && breakdown.risks.length > 0 && (
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {tFn(lang, "Risks", "缺点")}
          </h3>
          <ul className="space-y-2">
            {breakdown.risks.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text)" }}>
                <span style={{ color: "var(--accent)" }}>•</span>
                <span>
                  <TrText text={String(r)} lang={lang} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {breakdown.transferable && breakdown.transferable.length > 0 && (
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {tFn(lang, "Transferable", "可迁移方法论")}
          </h3>
          <ul className="space-y-2">
            {breakdown.transferable.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--text)" }}>
                <span style={{ color: "var(--accent)" }}>•</span>
                <span>
                  <TrText text={String(t)} lang={lang} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional: keep structure + VO as secondary */}
      {breakdown.structure && breakdown.structure.length > 0 && (
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {tFn(lang, "Structure", "结构")}
          </h3>
          <div className="space-y-2">
            {breakdown.structure.map((s, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span
                  className="shrink-0 rounded px-2 py-0.5 text-xs font-semibold"
                  style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }}
                >
                  {s.time}
                </span>
                <span style={{ color: "var(--text)" }}>
                  <TrText text={s.desc || s.content || ""} lang={lang} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {breakdown.vo_quotes && breakdown.vo_quotes.length > 0 && (
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {tFn(lang, "VO lines", "VO 金句")}
          </h3>
          <div className="space-y-2">
            {breakdown.vo_quotes.map((q, i) => (
              <p key={i} className="border-l-2 pl-3 text-sm italic" style={{ borderColor: "var(--accent)", color: "var(--text)" }}>
                &ldquo;<TrText text={String(q)} lang={lang} />&rdquo;
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const id = params.id as string;
  const video = (videosData as Video[]).find((v) => v.id === id);

  const [lang, setLang] = useState<Lang>("us");
  const [counts, setCounts] = useState<FeedbackCounts>({});
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState<"up" | "down" | "star" | null>(null);

  useEffect(() => {
    setLang(getClientLang());
    setCounts(getFeedbackCounts());
    setSl(getShortlist());
    setMounted(true);
  }, []);

  if (!video) {
    return <div className="py-20 text-center" style={{ color: "var(--text-muted)" }}>{tr(lang, "Video not found", "视频不存在")}: {id}</div>;
  }

  const c = counts[video.id] || { thumbsup: 0, thumbsdown: 0, score: 0 };
  const isShortlisted = sl.has(video.id);
  const displayTitle = video.title || video.brand || video.id;

  const pop = (kind: "up" | "down" | "star") => {
    setBurst(kind);
    setTimeout(() => setBurst(null), 500);
  };

  const handleFeedback = async (action: "thumbsup" | "thumbsdown") => {
    const newCounts = await setFeedback(video.id, action);
    setCounts({ ...newCounts });
    pop(action === "thumbsup" ? "up" : "down");
  };

  const handleShortlist = async () => {
    const newSl = await toggleShortlist(video.id);
    setSl(new Set(newSl));
    pop("star");
  };

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-20">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-[var(--accent)] cursor-pointer bg-transparent border-none p-0"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {tr(lang, "Back", "返回")}
          </button>

          <div className="mb-6 overflow-hidden rounded-xl">
            <div className="relative aspect-video w-full" style={{ background: "var(--border)" }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>{displayTitle}</h1>
            <div className="mt-2 flex items-center gap-3">
              {video.brand && <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>{video.brand}</span>}
              {video.duration_s && <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: "var(--border)", color: "var(--text-muted)" }}>{video.duration_s >= 60 ? `${Math.floor(video.duration_s / 60)}:${String(video.duration_s % 60).padStart(2, "0")}` : `${video.duration_s}s`}</span>}
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{video.date_added}</span>
            </div>
          </div>

          {mounted && (
            <div className="relative mb-8 flex gap-3">
              <button onClick={() => handleFeedback("thumbsup")} className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]" style={{ borderColor: "#1f3b33", background: "#34d39914", color: "var(--text)" }}>
                👍 {tr(lang, "Like", "喜欢")} <span style={{ color: "var(--green)" }}>{c.thumbsup}</span>
              </button>
              <button onClick={() => handleFeedback("thumbsdown")} className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]" style={{ borderColor: "#4a2a22", background: "#ff6b3512", color: "var(--text)" }}>
                👎 {tr(lang, "Pass", "不喜欢")} <span style={{ color: "var(--red)" }}>{c.thumbsdown}</span>
              </button>
              {isAdmin && (
                <button onClick={handleShortlist} className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]" style={{ borderColor: isShortlisted ? "var(--yellow)" : "var(--border)", background: isShortlisted ? "color-mix(in srgb, var(--yellow) 15%, transparent)" : "var(--card)", color: isShortlisted ? "var(--yellow)" : "var(--text)" }}>
                  ⭐ {isShortlisted ? tr(lang, "Saved", "已收藏") : tr(lang, "Save", "收藏")}
                </button>
              )}

              <AnimatePresence>
                {burst && (
                  <motion.span key={burst} initial={{ opacity: 0, y: 4, scale: 0.8 }} animate={{ opacity: 1, y: -10, scale: 1.1 }} exit={{ opacity: 0, y: -18, scale: 0.9 }} transition={{ duration: 0.35 }} className="pointer-events-none absolute left-2 -top-2 text-xs" style={{ color: "var(--accent)" }}>
                    {burst === "up" ? "+1 👍" : burst === "down" ? "+1 👎" : "★"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}

          {video.breakdown && (
            <div className="mb-8 space-y-4">
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>🧩 {tr(lang, "Breakdown", "拆解")}</h2>
              <BreakdownSection breakdown={video.breakdown} lang={lang} tr={tr} />
            </div>
          )}

          <a href={video.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "var(--accent)" }}>
            {tr(lang, "Open on YouTube", "在 YouTube 打开")} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
