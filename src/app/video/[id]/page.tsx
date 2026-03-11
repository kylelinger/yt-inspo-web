"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { getFeedback, setFeedback, getShortlist, toggleShortlist } from "@/lib/feedback";

export default function VideoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const video = (videosData as Video[]).find((v) => v.id === id);

  const [fb, setFb] = useState<Record<string, "thumbsup" | "thumbsdown">>({});
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFb(getFeedback());
    setSl(getShortlist());
    setMounted(true);
  }, []);

  if (!video) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--text-muted)" }}>
        Video not found: {id}
      </div>
    );
  }

  const currentFb = fb[video.id];
  const isShortlisted = sl.has(video.id);
  const displayTitle = video.title || video.brand || video.id;

  const handleFeedback = async (action: "thumbsup" | "thumbsdown") => {
    const newFb = await setFeedback(video.id, action);
    setFb({ ...newFb });
  };

  const handleShortlist = async () => {
    const newSl = await toggleShortlist(video.id);
    setSl(new Set(newSl));
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back */}
      <a href="/" className="mb-4 inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>
        ← 返回列表
      </a>

      {/* Video embed */}
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

      {/* Title + brand */}
      <div className="mb-4">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          {displayTitle}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          {video.brand && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}
            >
              {video.brand}
            </span>
          )}
          {video.duration_s && (
            <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: "var(--border)", color: "var(--text-muted)" }}>
              {video.duration_s >= 60 ? `${Math.floor(video.duration_s / 60)}:${String(video.duration_s % 60).padStart(2, '0')}` : `${video.duration_s}s`}
            </span>
          )}
          {video.collection === 'foundation' && (
            <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}>
              Foundation
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {video.date_added}
          </span>
          {video.status === 'playback_risky' && (
            <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: "color-mix(in srgb, var(--red) 12%, transparent)", color: "var(--red, #ef4444)" }}>
              ⚠️ 可能不可播放
            </span>
          )}
        </div>
      </div>

      {/* Why */}
      {video.why && (
        <div className="mb-4 rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            为什么选这条
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            {video.why}
          </p>
        </div>
      )}

      {/* VO excerpt */}
      {video.vo_excerpt && (
        <div className="mb-4 rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            VO / 台词摘录
          </h3>
          <p className="text-sm italic leading-relaxed" style={{ color: "var(--text)" }}>
            {video.vo_excerpt}
          </p>
        </div>
      )}

      {/* Feedback from team */}
      {video.feedback && (
        <div className="mb-4 rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            团队反馈
          </h3>
          <p className="text-sm" style={{ color: "var(--text)" }}>
            {video.feedback.vote === -1 ? "👎" : "👍"} by {video.feedback.by}
            {video.feedback.reason && ` — ${video.feedback.reason}`}
          </p>
        </div>
      )}

      {/* Action buttons */}
      {mounted && (
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => handleFeedback("thumbsup")}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              borderColor: currentFb === "thumbsup" ? "var(--green)" : "var(--border)",
              background: currentFb === "thumbsup" ? "color-mix(in srgb, var(--green) 15%, transparent)" : "var(--card)",
              color: currentFb === "thumbsup" ? "var(--green)" : "var(--text)",
            }}
          >
            👍 {currentFb === "thumbsup" ? "已点赞" : "点赞"}
          </button>
          <button
            onClick={() => handleFeedback("thumbsdown")}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              borderColor: currentFb === "thumbsdown" ? "var(--red)" : "var(--border)",
              background: currentFb === "thumbsdown" ? "color-mix(in srgb, var(--red) 15%, transparent)" : "var(--card)",
              color: currentFb === "thumbsdown" ? "var(--red)" : "var(--text)",
            }}
          >
            👎 {currentFb === "thumbsdown" ? "已踩" : "不喜欢"}
          </button>
          <button
            onClick={handleShortlist}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              borderColor: isShortlisted ? "var(--yellow)" : "var(--border)",
              background: isShortlisted ? "color-mix(in srgb, var(--yellow) 15%, transparent)" : "var(--card)",
              color: isShortlisted ? "var(--yellow)" : "var(--text)",
            }}
          >
            ⭐ {isShortlisted ? "已收藏" : "收藏"}
          </button>
        </div>
      )}

      {/* FULL Breakdown */}
      {video.breakdown && (
        <div className="mb-8 space-y-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            📐 结构拆解
          </h2>

          {/* Summary */}
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text)" }}>
              {video.breakdown.summary}
            </p>
          </div>

          {/* Structure timeline */}
          {video.breakdown.structure.length > 0 && (
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                叙事结构
              </h3>
              <div className="space-y-2">
                {video.breakdown.structure.map((s, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span
                      className="shrink-0 rounded px-2 py-0.5 text-xs font-semibold"
                      style={{
                        background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                        color: "var(--accent)",
                      }}
                    >
                      {s.time}
                    </span>
                    <span style={{ color: "var(--text)" }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VO quotes */}
          {video.breakdown.vo_quotes.length > 0 && (
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                VO / 台词金句
              </h3>
              <div className="space-y-2">
                {video.breakdown.vo_quotes.map((q, i) => (
                  <p key={i} className="border-l-2 pl-3 text-sm italic" style={{ borderColor: "var(--accent)", color: "var(--text)" }}>
                    &ldquo;{q}&rdquo;
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Risks side by side */}
          <div className="grid gap-4 sm:grid-cols-2">
            {video.breakdown.strengths.length > 0 && (
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--green, #22c55e)" }}>
                  ✓ 好点
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: "var(--text)" }}>
                  {video.breakdown.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 text-xs" style={{ color: "var(--green, #22c55e)" }}>●</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {video.breakdown.risks.length > 0 && (
              <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--red, #ef4444)" }}>
                  ✗ 风险 / 不适配
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: "var(--text)" }}>
                  {video.breakdown.risks.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 text-xs" style={{ color: "var(--red, #ef4444)" }}>●</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Transferable */}
          {video.breakdown.transferable.length > 0 && (
            <div className="rounded-lg border p-4" style={{ borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 5%, var(--card))" }}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                🔄 可迁移方法论
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text)" }}>
                {video.breakdown.transferable.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 shrink-0">→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* External link */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--accent)" }}
      >
        在 YouTube 打开 ↗
      </a>
    </div>
  );
}
