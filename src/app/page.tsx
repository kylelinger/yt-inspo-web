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
          <div className="flex items-center justify-center h-14 gap-3 sm:gap-8">
            {[
              { num: totalVideos.toString(), label: "Videos" },
              { num: "20+", label: "Frames" },
              { num: "10:00", label: "Daily BJT" },
              { num: "4", label: "Tags" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2" style={{ borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.15)" : "none", paddingLeft: i > 0 ? "0.75rem" : "0" }}>
                <span className="text-base font-black text-black sm:text-lg">{stat.num}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-black/50 sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SAVED CAROUSEL ═══ */}
      <div className="section-full section-alt">
        <FadeInView>
          <ShortlistCarousel allVideos={allVideos} />
        </FadeInView>
      </div>

      {/* ═══ TODAY ═══ */}
      <div id="today" className="section-full section-dark pt-16">
        <div className="section-inner pb-8">
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

      {/* ═══ HOW IT WORKS — single wide card ═══ */}
      <div className="section-full py-16" style={{ background: "#0e0e0e" }}>
        <div className="section-inner">
          <FadeInView>
            <div className="w-full p-7 sm:p-8 lg:p-10" style={{ background: "#1a1a1a" }}>
              <div className="mb-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                  Pipeline
                </p>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white">How this daily cut is made</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { icon: "🔍", title: "AI searches daily", desc: "YouTube, Vimeo, LinkedIn — multiple sources, one pipeline." },
                  { icon: "🧬", title: "Full‑video Gemini analysis", desc: "No frame hacks. We upload the whole ad and let the model read the story, VO, and beats." },
                  { icon: "📝", title: "Structural breakdown", desc: "Hook → setup → turn → proof → end card. Every beat mapped." },
                  { icon: "✅", title: "Brand alignment check", desc: "Smarter your money. Intelligence → Confidence → Trust." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-[#666]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* ═══ BRAND TAGS strip ═══ */}
      <div className="section-full py-4" style={{ background: "#080808" }}>
        <div className="section-inner flex flex-wrap items-center justify-center gap-6">
          {["Smarter your money", "Intelligence > Advice", "No shaming", "Trust lift"].map((tag) => (
            <span key={tag} className="text-xs font-bold uppercase tracking-widest text-[#333]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ARCHIVE ═══ */}
      {olderDates.length > 0 && (
        <div className="section-full section-dark pt-16">
          <div className="section-inner pb-24">
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

            {/* Archive blocks — 2px gap, #0e0e0e cards on #000 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[2px]" style={{ background: "var(--bg)" }}>
              <a 
                href="/archive/foundation" 
                className="group flex items-start justify-between p-6 transition-colors hover:bg-[#1a1a1a]"
                style={{ background: "#0e0e0e" }}
              >
                <div>
                  <div className="text-base font-bold text-white">Foundation</div>
                  <div className="mt-1 text-sm text-[#555]">{foundationCount} videos</div>
                </div>
                <div className="text-2xl">📐</div>
              </a>

              {olderDates.map((date) => {
                const count = grouped.get(date)?.length || 0;
                return (
                  <a 
                    key={date} 
                    href={`/archive/${date}`}
                    className="group block p-6 transition-colors hover:bg-[#1a1a1a]"
                    style={{ background: "#0e0e0e" }}
                  >
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
