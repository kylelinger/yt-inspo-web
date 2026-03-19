"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";
import { getClientLang, tr, type Lang } from "@/lib/language";

export default function VideoDetailPage() {
  const params = useParams();
  const { isAdmin } = useAuth();
  const id = params.id as string;
  const video = (videosData as Video[]).find((v) => v.id === id);
  const [lang, setLang] = useState<Lang>("us");

  useEffect(() => {
    setLang(getClientLang());
  }, []);

  if (!video) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
        {tr(lang, "Video not found", "视频不存在")}: {id}
      </div>
    );
  }

  const displayTitle = video.title || video.brand || video.id;

  /* ─── ADMIN: AKQA STYLE ─── */
  if (isAdmin) {
    return (
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* Hero: Full-width video thumbnail */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000", overflow: "hidden" }}>
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
          />
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.9) 100%)" }} />

          {/* Title overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3rem 4rem", zIndex: 2, color: "white" }}>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, margin: "1rem 0 0 0", lineHeight: "1.2" }}>
              {displayTitle}
            </h1>
            <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              {video.date_added}
              {video.brand && ` • ${video.brand}`}
            </div>
          </div>

          {/* Back button */}
          <a
            href="/"
            style={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              color: "white",
              zIndex: 3,
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "opacity 200ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            ← {tr(lang, "Back", "返回")}
          </a>
        </div>

        {/* Content */}
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "4rem" }}>
          {/* Watch button */}
          <div style={{ marginBottom: "4rem" }}>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                border: "1px solid #000",
                color: "#fff",
                background: "#000",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FF5A00";
                e.currentTarget.style.borderColor = "#FF5A00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#000";
                e.currentTarget.style.borderColor = "#000";
              }}
            >
              {tr(lang, "Watch on YouTube", "YouTube 观看")} ↗
            </a>
          </div>

          {/* Breakdown */}
          {video.breakdown && (
            <div>
              <div style={{ marginBottom: "4rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "1.5rem" }}>
                  {tr(lang, "Summary", "概述")}
                </p>
                <p style={{ fontSize: "1.25rem", lineHeight: "1.6", color: "#111", fontWeight: 400 }}>
                  {video.breakdown.summary}
                </p>
              </div>

              {/* Structure */}
              {video.breakdown.structure && video.breakdown.structure.length > 0 && (
                <div style={{ marginBottom: "4rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "2rem" }}>
                    {tr(lang, "Structure", "结构")}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "2rem" }}>
                    <div />
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      {video.breakdown.structure.map((s, i) => (
                        <div key={i}>
                          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#FF5A00", marginBottom: "0.5rem" }}>
                            {s.time}
                          </div>
                          <p style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#333", margin: 0 }}>
                            {s.desc || s.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VO Quotes */}
              {video.breakdown.vo_quotes && video.breakdown.vo_quotes.length > 0 && (
                <div style={{ marginBottom: "4rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "2rem" }}>
                    {tr(lang, "Key Lines", "金句")}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {video.breakdown.vo_quotes.map((q, i) => (
                      <p key={i} style={{ fontSize: "1.125rem", lineHeight: "1.6", color: "#111", fontStyle: "italic", margin: 0 }}>
                        "{String(q)}"
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Risks */}
              {(video.breakdown.strengths || video.breakdown.risks) && (
                <div style={{ marginBottom: "4rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
                  {video.breakdown.strengths && video.breakdown.strengths.length > 0 && (
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "1.5rem" }}>
                        {tr(lang, "What Works", "好点")}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {video.breakdown.strengths.map((s, i) => (
                          <li key={i} style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#333" }}>
                            <strong style={{ color: "#FF5A00" }}>0{i + 1}</strong> — {String(s)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {video.breakdown.risks && video.breakdown.risks.length > 0 && (
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "1.5rem" }}>
                        {tr(lang, "Watch For", "风险")}
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {video.breakdown.risks.map((r, i) => (
                          <li key={i} style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#333" }}>
                            <strong style={{ color: "#888" }}>0{i + 1}</strong> — {String(r)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Transferable */}
              {video.breakdown.transferable && video.breakdown.transferable.length > 0 && (
                <div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "2rem" }}>
                    {tr(lang, "Takeaway", "方法论")}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {video.breakdown.transferable.map((t, i) => (
                      <li key={i} style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#333" }}>
                        <span style={{ color: "#FF5A00", marginRight: "0.75rem" }}>→</span>
                        {String(t)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── VISITOR: Dark theme (minimal) ─── */
  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
        <a href="/" style={{ color: "#666", fontSize: "0.875rem", marginBottom: "1rem", display: "block" }}>
          ← {tr(lang, "Back", "返回")}
        </a>

        <div style={{ position: "relative", paddingBottom: "56.25%", width: "100%", background: "#111", marginBottom: "2rem" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "1.5rem 0 0.5rem 0" }}>
          {displayTitle}
        </h1>

        <p style={{ fontSize: "0.875rem", color: "#666", margin: "1rem 0" }}>
          {video.date_added}
          {video.brand && ` • ${video.brand}`}
        </p>

        <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: "#FF5A00", fontSize: "0.875rem", textDecoration: "none" }}>
          {tr(lang, "Watch on YouTube", "YouTube 观看")} ↗
        </a>

        {video.breakdown?.summary && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#111", color: "#aaa", fontSize: "0.875rem", lineHeight: "1.6" }}>
            {video.breakdown.summary}
          </div>
        )}
      </div>
    </div>
  );
}
