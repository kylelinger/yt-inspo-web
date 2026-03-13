"use client";

import { useState, useMemo, useEffect } from "react";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";

const videos = videosData as Video[];

/* ── Tag colors ── */
const TAG_COLORS: Record<string, { bg: string; fg: string; label: string }> = {
  B1: { bg: "#f59e0b22", fg: "#f59e0b", label: "B1 🎯 直接竞品" },
  B2: { bg: "#3b82f622", fg: "#3b82f6", label: "B2 💰 金融品牌" },
  A:  { bg: "#a855f722", fg: "#a855f7", label: "A ✨ 审美标杆" },
  C:  { bg: "#9ca3af22", fg: "#9ca3af", label: "C 🎨 文化参考" },
};

/* ── Brand Platform rules ── */
const BRAND_PLATFORM = {
  line: "Smarter your money",
  pov: "没有\u201C差的投资者\u201D，只有\u201C可以变得更好\u201D的投资者",
  value: "intelligence → confidence → trust",
  audience: "intermediate → advanced options traders",
  barrier: "low trust perception",
  forbidden: ["羞辱用户", "居高临下训话", "喊单/跟单", "intelligence 黑箱化"],
};

/* ── Search dimensions ── */
const SEARCH_DIMS = [
  { dim: "People/Companies", desc: "Brand / Agency / Director / Prod Co" },
  { dim: "Theme", desc: "system vs individual, trust/safety, fairness, access" },
  { dim: "Ad type", desc: "storytelling / clever functional / product-form" },
  { dim: "Risk", desc: "clarity loss, over-formalism, too playful, trust erosion" },
];

/* ── Quality gates ── */
const QUALITY_GATES = [
  "必须下载原片（不靠标题/描述判断）",
  "全片覆盖抽帧（≤60s=2fps, >60s=120/D fps, 上限120帧）",
  "VO-driven 片必须读懂 VO/字幕",
  "结尾 packshot/end card/offer 必须覆盖",
  "可播放性验证（标记 playback_risky 不占正式名额）",
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "videos" | "rules" | "search">("overview");

  /* ── Stats ── */
  const stats = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    const dateCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    let withBreakdown = 0;
    let risky = 0;
    let foundation = 0;

    for (const v of videos) {
      tagCounts[v.tag || "none"] = (tagCounts[v.tag || "none"] || 0) + 1;
      dateCounts[v.date_added] = (dateCounts[v.date_added] || 0) + 1;
      brandCounts[v.brand] = (brandCounts[v.brand] || 0) + 1;
      if (v.breakdown) withBreakdown++;
      if (v.status === "playback_risky") risky++;
      if (v.collection === "foundation") foundation++;
    }

    return { tagCounts, dateCounts, brandCounts, withBreakdown, risky, foundation, total: videos.length };
  }, []);

  const sortedDates = Object.entries(stats.dateCounts).sort((a, b) => b[0].localeCompare(a[0]));
  const sortedBrands = Object.entries(stats.brandCounts).sort((a, b) => b[1] - a[1]);

  const tabs = [
    { key: "overview" as const, label: "📊 概览" },
    { key: "videos" as const, label: `🎬 视频库 (${stats.total})` },
    { key: "rules" as const, label: "🧠 品牌约束" },
    { key: "search" as const, label: "🔍 搜索框架" },
  ];

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-20">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <header>
            <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>
              Control Center
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              BrandCut admin · AI curation engine parameters & status
            </p>
          </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
            style={{
              background: activeTab === t.key ? "var(--accent)" : "var(--card)",
              color: activeTab === t.key ? "#fff" : "var(--text-muted)",
              border: `1px solid ${activeTab === t.key ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ─── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "总视频", value: stats.total, icon: "🎬" },
              { label: "FULL 拆解", value: `${stats.withBreakdown}/${stats.total}`, icon: "✅" },
              { label: "Foundation", value: stats.foundation, icon: "🏛️" },
              { label: "Playback Risky", value: stats.risky, icon: stats.risky > 0 ? "⚠️" : "✅" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <div className="text-2xl">{kpi.icon}</div>
                <div className="mt-2 text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {kpi.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tag Distribution */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              标签分布
            </h2>
            <div className="space-y-2">
              {Object.entries(stats.tagCounts).map(([tag, count]) => {
                const tc = TAG_COLORS[tag];
                const pct = Math.round((count / stats.total) * 100);
                return (
                  <div key={tag} className="flex items-center gap-3">
                    <span
                      className="w-20 shrink-0 rounded px-2 py-0.5 text-xs font-bold text-center"
                      style={{ background: tc?.bg || "#33333322", color: tc?.fg || "#999" }}
                    >
                      {tag}
                    </span>
                    <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: tc?.fg || "#999" }}
                      />
                    </div>
                    <span className="w-12 text-right text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Distribution */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              日期分布
            </h2>
            <div className="space-y-1.5">
              {sortedDates.map(([date, count]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    {date}
                  </span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((count / Math.max(...sortedDates.map(([,c]) => c))) * 100)}%`,
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs" style={{ color: "var(--text-muted)" }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Brands */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              品牌 Top 15
            </h2>
            <div className="flex flex-wrap gap-2">
              {sortedBrands.slice(0, 15).map(([brand, count]) => (
                <span
                  key={brand}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: "var(--border)", color: "var(--text)" }}
                >
                  {brand} <span style={{ color: "var(--text-muted)" }}>×{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Videos Tab ─── */}
      {activeTab === "videos" && <VideoTable videos={videos} />}

      {/* ─── Rules Tab ─── */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          {/* Brand Platform */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-4 text-sm font-bold" style={{ color: "var(--text)" }}>
              M公司 Brand Platform
            </h2>
            <div className="space-y-3">
              {[
                { k: "品牌主张", v: BRAND_PLATFORM.line },
                { k: "POV", v: BRAND_PLATFORM.pov },
                { k: "价值链", v: BRAND_PLATFORM.value },
                { k: "受众", v: BRAND_PLATFORM.audience },
                { k: "增长壁垒", v: BRAND_PLATFORM.barrier },
              ].map((row) => (
                <div key={row.k} className="flex gap-3">
                  <span className="w-20 shrink-0 text-xs font-bold" style={{ color: "var(--accent)" }}>
                    {row.k}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text)" }}>
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Forbidden */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "color-mix(in srgb, var(--red, #ef4444) 30%, var(--border))", background: "color-mix(in srgb, var(--red, #ef4444) 5%, var(--card))" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--red, #ef4444)" }}>
              🚫 禁忌清单
            </h2>
            <ul className="space-y-1.5">
              {BRAND_PLATFORM.forbidden.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                  <span style={{ color: "var(--red, #ef4444)" }}>✗</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Gates */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              ✅ 质量硬闸门
            </h2>
            <ul className="space-y-1.5">
              {QUALITY_GATES.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span className="mt-0.5 shrink-0" style={{ color: "var(--green, #22c55e)" }}>✓</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tag Classification */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              🏷️ 标签体系
            </h2>
            <div className="space-y-2">
              {Object.entries(TAG_COLORS).map(([tag, tc]) => (
                <div key={tag} className="flex items-center gap-3">
                  <span
                    className="w-8 rounded px-2 py-0.5 text-xs font-bold text-center"
                    style={{ background: tc.bg, color: tc.fg }}
                  >
                    {tag}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text)" }}>
                    {tc.label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    — {stats.tagCounts[tag] || 0} 条
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Search Tab ─── */}
      {activeTab === "search" && (
        <div className="space-y-6">
          {/* Search Dimensions */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              搜索维度（稳定框架）
            </h2>
            <div className="space-y-3">
              {SEARCH_DIMS.map((d) => (
                <div key={d.dim}>
                  <div className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                    {d.dim}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    {d.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Rules */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              动态规则
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: "var(--green, #22c55e)" }}>👍</span>
                <span>被团队明确 👍 的"机制"→ 写成可搜索的母题/语汇，加入 next-day query pool</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0" style={{ color: "var(--red, #ef4444)" }}>👎</span>
                <span>被明确 👎 的原因 → 写成过滤或降权规则</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="shrink-0">🎭</span>
                <span>名人/身份梗出现时 → 次日 query 增加 celebrity/athlete/cameo 等线索</span>
              </li>
            </ul>
          </div>

          {/* LinkedIn */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              LinkedIn 线索入口
            </h2>
            <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
              定位：线索入口，不直接采视频。重点追帖子里的 YouTube/Vimeo 外链。
            </p>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              <div className="font-medium mb-1" style={{ color: "var(--text)" }}>Seed 账号：</div>
              <ul className="space-y-0.5 pl-4 list-disc">
                <li>0utstanding-branding</li>
                <li>The Brand Identity Group</li>
                <li>World Brand Design</li>
                <li>Beyond Branding Global</li>
              </ul>
            </div>
          </div>

          {/* SOP Summary */}
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="mb-3 text-sm font-bold" style={{ color: "var(--text)" }}>
              ⏰ 日程
            </h2>
            <div className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <div className="flex gap-3">
                <span className="font-mono shrink-0" style={{ color: "var(--accent)" }}>02:00</span>
                <span>AI 开始候选收集 + 下载 + 抽帧 + FULL 拆解</span>
              </div>
              <div className="flex gap-3">
                <span className="font-mono shrink-0" style={{ color: "var(--accent)" }}>10:00</span>
                <span>推送到 Discord + 同步到网页</span>
              </div>
              <div className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                所有时间为北京时间 (UTC+8)
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

/* ─── Video Table Sub-component ─── */
function VideoTable({ videos }: { videos: Video[] }) {
  const [sortBy, setSortBy] = useState<"date" | "brand" | "tag">("date");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [feedback, setFeedback] = useState<Record<string, 'thumbsup' | 'thumbsdown'>>({});

  // Fetch feedback from KV on mount (force fresh data)
  useEffect(() => {
    async function loadFeedback() {
      try {
        const res = await fetch('/api/feedback', { cache: 'no-store' });
        const data = await res.json();
        if (data.kv && data.feedback) {
          setFeedback(data.feedback);
        }
      } catch (err) {
        console.error('Failed to load feedback:', err);
      }
    }
    loadFeedback();
  }, []);

  const filtered = useMemo(() => {
    let list = [...videos];
    if (filterTag !== "all") list = list.filter((v) => v.tag === filterTag);

    if (sortBy === "date") {
      list.sort((a, b) => {
        if (a.date_added === "foundation") return 1;
        if (b.date_added === "foundation") return -1;
        return b.date_added.localeCompare(a.date_added);
      });
    } else if (sortBy === "brand") {
      list.sort((a, b) => a.brand.localeCompare(b.brand));
    } else {
      list.sort((a, b) => (a.tag || "Z").localeCompare(b.tag || "Z"));
    }
    return list;
  }, [videos, sortBy, filterTag]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "brand" | "tag")}
          className="rounded-lg border px-3 py-1.5 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
        >
          <option value="date">按日期排序</option>
          <option value="brand">按品牌排序</option>
          <option value="tag">按标签排序</option>
        </select>

        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
        >
          <option value="all">全部标签</option>
          <option value="B1">B1 直接竞品</option>
          <option value="B2">B2 金融品牌</option>
          <option value="A">A 审美标杆</option>
          <option value="C">C 文化参考</option>
        </select>

        <span className="self-center text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} 条
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "var(--card)" }}>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-muted)" }}>标签</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-muted)" }}>品牌</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-muted)" }}>标题</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-muted)" }}>时长</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-muted)" }}>日期</th>
              <th className="px-3 py-2 text-left font-medium" style={{ color: "var(--text-muted)" }}>拆解</th>
              <th className="px-3 py-2 text-center font-medium" style={{ color: "var(--text-muted)" }}>反馈</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const tc = TAG_COLORS[v.tag || ""];
              return (
                <tr
                  key={v.id}
                  className="border-t transition-colors hover:opacity-80"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-2">
                    {v.tag && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ background: tc?.bg, color: tc?.fg }}
                      >
                        {v.tag}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-medium" style={{ color: "var(--text)" }}>
                    {v.brand}
                  </td>
                  <td className="px-3 py-2 max-w-[280px] truncate" style={{ color: "var(--text-muted)" }}>
                    <a
                      href={`/video/${v.id}`}
                      className="hover:underline"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {v.title}
                    </a>
                  </td>
                  <td className="px-3 py-2 font-mono" style={{ color: "var(--text-muted)" }}>
                    {v.duration || "—"}
                  </td>
                  <td className="px-3 py-2 font-mono" style={{ color: "var(--text-muted)" }}>
                    {v.date_added}
                  </td>
                  <td className="px-3 py-2">
                    {v.breakdown ? (
                      <span style={{ color: "var(--green, #22c55e)" }}>✅</span>
                    ) : (
                      <span style={{ color: "var(--red, #ef4444)" }}>❌</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {feedback[v.id] === 'thumbsup' && (
                      <span style={{ color: "var(--green, #22c55e)" }}>👍</span>
                    )}
                    {feedback[v.id] === 'thumbsdown' && (
                      <span style={{ color: "var(--red, #ef4444)" }}>👎</span>
                    )}
                    {!feedback[v.id] && (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
