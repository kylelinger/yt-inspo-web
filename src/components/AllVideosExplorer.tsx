"use client";

import { useEffect, useMemo, useState } from "react";
import type { Video } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import { getFeedbackCounts, hydrateFromRemote, type FeedbackCounts } from "@/lib/feedback";
import { tr, type Lang } from "@/lib/language";
import { useAuth } from "@/components/AuthProvider";

type SortKey = "latest" | "most_up" | "most_down";

const TAGS = [
  { value: "B1", labelUs: "Direct rivals", labelCn: "直接竞品", color: "#f59e0b" },
  { value: "B2", labelUs: "Finance brands", labelCn: "金融品牌", color: "#3b82f6" },
  { value: "A", labelUs: "Aesthetic benchmark", labelCn: "审美标杆", color: "#a855f7" },
  { value: "C", labelUs: "Culture reference", labelCn: "文化参考", color: "#555" },
  { value: "S", labelUs: "Sponsorship / collab", labelCn: "赞助 / 联名", color: "#10b981" },
] as const;

function dateValue(v: Video): number {
  const t = Date.parse(v.date_added || "");
  return Number.isFinite(t) ? t : 0;
}

function upCount(v: Video, counts: FeedbackCounts): number {
  return counts[v.id]?.thumbsup || 0;
}

function downCount(v: Video, counts: FeedbackCounts): number {
  return counts[v.id]?.thumbsdown || 0;
}

function includesQuery(video: Video, q: string) {
  if (!q) return true;
  const query = q.toLowerCase();
  const hay = [video.title, video.brand, video.id, video.tag, video.date_added, video.url]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(query);
}

export default function AllVideosExplorer({ videos, lang = "us" }: { videos: Video[]; lang?: Lang }) {
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("latest");
  const [counts, setCounts] = useState<FeedbackCounts>({});

  useEffect(() => {
    setCounts(getFeedbackCounts());
    hydrateFromRemote().then(() => setCounts(getFeedbackCounts())).catch(() => undefined);

    const refresh = () => setCounts(getFeedbackCounts());
    window.addEventListener("feedback-changed", refresh);
    return () => window.removeEventListener("feedback-changed", refresh);
  }, []);

  const tagCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const v of videos) if (v.tag) out[v.tag] = (out[v.tag] || 0) + 1;
    return out;
  }, [videos]);

  const filtered = useMemo(() => {
    const hasTagFilter = activeTags.size > 0;
    const rows = videos.filter((v) => {
      if (!includesQuery(v, query)) return false;
      if (!hasTagFilter) return true;
      return !!v.tag && activeTags.has(v.tag);
    });

    rows.sort((a, b) => {
      if (sortKey === "most_up") return upCount(b, counts) - upCount(a, counts);
      if (sortKey === "most_down") return downCount(b, counts) - downCount(a, counts);
      return dateValue(b) - dateValue(a);
    });
    return rows;
  }, [videos, query, activeTags, sortKey, counts]);

  const toggleTag = (tag: string) => {
    const next = new Set(activeTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setActiveTags(next);
  };

  return (
    <div>
      <div className={`mb-10 border ${isAdmin ? "p-5 sm:p-6" : "p-0 border-transparent"}`} style={{ borderColor: isAdmin ? "var(--border)" : "transparent", background: isAdmin ? "#fff" : "transparent" }}>
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr(lang, "Search title / brand / channel / video ID", "搜索 标题 / 品牌 / 频道 / 视频ID")}
            className="w-full border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", background: isAdmin ? "#fff" : "#0f0f0f", color: isAdmin ? "#111" : "#fff" }}
          />

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="border px-4 py-3 text-sm outline-none"
            style={{ borderColor: "var(--border)", background: isAdmin ? "#fff" : "#0f0f0f", color: isAdmin ? "#111" : "#fff" }}
          >
            <option value="latest">{tr(lang, "Latest first", "最新优先")}</option>
            <option value="most_up">{tr(lang, "Most liked", "高赞优先")}</option>
            <option value="most_down">{tr(lang, "Most disputed", "高反对优先")}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          {TAGS.map((t) => (
            <button key={t.value} onClick={() => toggleTag(t.value)} className="flex items-center gap-2 border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors" style={{ borderColor: activeTags.has(t.value) ? "var(--accent)" : "var(--border)", color: activeTags.has(t.value) ? "var(--accent)" : isAdmin ? "#666" : "#aaa", background: activeTags.has(t.value) ? "var(--accent-soft)" : "transparent" }}>
              <span className="inline-block h-2 w-2" style={{ background: t.color }} />
              {t.value}
              <span className="font-medium normal-case tracking-normal opacity-80">{tagCounts[t.value] || 0}</span>
            </button>
          ))}
          {activeTags.size > 0 && (
            <button onClick={() => setActiveTags(new Set())} className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
              {tr(lang, "Clear filters", "清空筛选")}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#666", border: "1px solid var(--border)" }}>
          {tr(lang, "No videos matched your filters", "没有匹配的视频")}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4" style={{ background: "transparent" }}>
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
