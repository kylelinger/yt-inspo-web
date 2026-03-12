import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import ShortlistCarousel from "@/components/ShortlistCarousel";
import { FadeIn, FadeInView } from "@/components/MotionDiv";

interface VideoWithCollection extends Video {
  collection?: string;
}

export default function Home() {
  const allVideos = videosData as VideoWithCollection[];
  const videos = allVideos.filter((v) => v.collection !== "foundation");

  const grouped = new Map<string, Video[]>();
  for (const v of videos) {
    const date = v.date_added || "unknown";
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(v);
  }
  const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));
  const latestDate = sortedDates[0];
  const latestVideos = grouped.get(latestDate) || [];
  const foundationCount = allVideos.filter((v) => v.collection === "foundation").length;
  const olderDates = sortedDates.slice(1);
  const totalVideos = allVideos.length;

  return (
    <div>
      {/* ═══ STATS BAR — compact, nav-height ═══ */}
      <div className="section-full section-accent">
        <div className="section-inner">
          <div className="flex items-center justify-center h-14 gap-8 sm:gap-12">
            {[
              { num: totalVideos.toString(), label: "Videos" },
              { num: "20+", label: "Frames" },
              { num: "10:00", label: "Daily BJT" },
              { num: "4", label: "Tags" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2" style={{ borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.15)" : "none", paddingLeft: i > 0 ? "2rem" : "0" }}>
                <span className="text-sm font-black text-black sm:text-base">{stat.num}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SAVED CAROUSEL ═══ */}
      <div className="section-full section-alt">
        <div className="section-inner py-20">
          <FadeInView>
            <ShortlistCarousel allVideos={allVideos} />
          </FadeInView>
        </div>
      </div>

      {/* ═══ TODAY ═══ */}
      <div id="today" className="section-full section-dark">
        <div className="section-inner pt-32 pb-8">
          <FadeInView>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>Today</p>
                <h2 className="display-md text-white">{latestDate}</h2>
                <p className="mt-2 text-sm text-[#444]">{latestVideos.length} videos curated</p>
              </div>
              <div className="hidden sm:flex items-center gap-5">
                {[
                  { tag: "B1", label: "\u76F4\u63A5\u7ADE\u54C1", color: "#f59e0b" },
                  { tag: "B2", label: "\u91D1\u878D\u54C1\u724C", color: "#3b82f6" },
                  { tag: "A", label: "\u5BA1\u7F8E\u6807\u6746", color: "#a855f7" },
                  { tag: "C", label: "\u6587\u5316\u53C2\u8003", color: "#555" },
                ].map((t) => (
                  <div key={t.tag} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5" style={{ background: t.color }} />
                    <span className="text-[11px] font-bold text-[#555]">{t.tag}</span>
                    <span className="text-[11px] text-[#333]">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>

        {latestVideos.length > 0 ? (
          <div className="section-inner pb-24">
            <SortedVideoGrid videos={latestVideos} showFilter />
          </div>
        ) : (
          <div className="section-inner pb-24">
            <div className="py-24 text-center" style={{ background: "var(--bg-alt)" }}>
              <p className="text-5xl mb-4">🎬</p>
              <p className="text-lg font-bold text-white">Today&apos;s batch is brewing</p>
              <p className="text-sm mt-2 text-[#444]">Check back at 10:00 BJT</p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ HOW IT WORKS — 2×2 color block grid ═══ */}
      <div className="section-full">
        <FadeInView>
          <div className="grid sm:grid-cols-2">
            {[
              { bg: "#0a0a0a", icon: "🔍", title: "AI searches daily", desc: "YouTube, Vimeo, LinkedIn \u2014 multiple sources, one pipeline." },
              { bg: "#0e0e0e", icon: "🎞", title: "20+ frames extracted", desc: "Not thumbnails \u2014 actual scene-by-scene visual breakdown." },
              { bg: "#0e0e0e", icon: "📝", title: "Structural breakdown", desc: "Hook \u2192 setup \u2192 turn \u2192 proof \u2192 end card. Every beat mapped." },
              { bg: "#0a0a0a", icon: "✅", title: "Brand alignment check", desc: "Smarter your money. Intelligence \u2192 Confidence \u2192 Trust." },
            ].map((item, i) => (
              <div key={i} className="p-14 sm:p-20" style={{ background: item.bg }}>
                <div className="text-3xl mb-6">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#666]">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeInView>
      </div>

      {/* ═══ WHO'S BEHIND THIS — two half-screen blocks side by side ═══ */}
      <div className="section-full">
        <FadeInView>
          <div className="grid sm:grid-cols-2">
            {/* Clawd */}
            <div className="p-14 sm:p-20" style={{ background: "#111" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center text-lg font-black text-white" style={{ background: "var(--accent)" }}>C</div>
                <div>
                  <div className="text-lg font-bold text-white">Clawd</div>
                  <div className="text-xs text-[#555]">AI Curator &middot; Builder</div>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-[#777]">
                Downloads every video. Extracts 20+ frames. Writes structural breakdowns. Built this entire site. Never sleeps.
              </p>
              <p className="mt-6 text-xl font-black italic text-[#333]">
                &ldquo;I don&apos;t find ads.<br />I build taste.&rdquo;
              </p>
            </div>

            {/* slime */}
            <div className="p-14 sm:p-20" style={{ background: "#0c0c0c" }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center text-lg font-black text-white" style={{ background: "#222" }}>S</div>
                <div>
                  <div className="text-lg font-bold text-white">slime</div>
                  <div className="text-xs text-[#555]">Brand Strategist &middot; Decision Maker</div>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-[#777]">
                Sets the brand vision. Gives the thumbs up or thumbs down. Every reaction shapes what comes next.
              </p>
              <p className="mt-6 text-xl font-black italic text-[#333]">
                &ldquo;I keep it honest.<br />No water content.&rdquo;
              </p>
            </div>
          </div>
        </FadeInView>
      </div>

      {/* ═══ BRAND TAGS strip ═══ */}
      <div className="section-full" style={{ background: "#080808" }}>
        <div className="section-inner py-16 flex flex-wrap items-center justify-center gap-6">
          {["Smarter your money", "Intelligence > Advice", "No shaming", "Trust lift"].map((tag) => (
            <span key={tag} className="text-xs font-bold uppercase tracking-widest text-[#333]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ARCHIVE ═══ */}
      {olderDates.length > 0 && (
        <div className="section-full section-alt">
          <div className="section-inner pt-32 pb-8">
            <FadeInView>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>Archive</p>
                  <h2 className="display-md text-white">Previous days</h2>
                </div>
                <a href="/archive" className="text-sm font-bold transition-colors hover:text-white" style={{ color: "var(--accent)" }}>
                  View all &rarr;
                </a>
              </div>
            </FadeInView>
          </div>

          {/* Archive blocks — no gaps, just 1px lines */}
          <div className="section-inner pb-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "#1a1a1a" }}>
              <a href="/archive/foundation" className="group block p-6 transition-colors hover:bg-[#151515]" style={{ background: "var(--bg)" }}>
                <div className="text-2xl mb-2">📐</div>
                <div className="text-base font-bold text-white">Foundation</div>
                <div className="mt-1 text-sm text-[#555]">{foundationCount} videos</div>
              </a>

              {olderDates.map((date) => {
                const count = grouped.get(date)?.length || 0;
                return (
                  <a key={date} href={`/archive/${date}`} className="group block p-6 transition-colors hover:bg-[#151515]" style={{ background: "var(--bg)" }}>
                    <div className="text-base font-bold text-white">{date}</div>
                    <div className="mt-1 text-sm text-[#555]">{count} videos</div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
