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
      {/* ═══ HERO — full-bleed, Robinhood flagship section ═══ */}
      <div className="section-full section-dark">
        <div className="section-inner py-20 sm:py-28 lg:py-36">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Daily Brand Inspiration
              </p>
              <h1 className="display-xl text-white">
                The best brand ads,<br />
                dissected daily.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#888] max-w-xl">
                AI-curated. Frame-analyzed. Structurally broken down.
                Only what passes the bar earns a spot.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#today"
                  className="rounded-full px-8 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105"
                  style={{ background: "var(--accent)" }}
                >
                  See today&apos;s picks
                </a>
                <a
                  href="/about"
                  className="rounded-full border px-8 py-3.5 text-sm font-bold text-white/80 transition-colors hover:text-white hover:border-white"
                  style={{ borderColor: "#333" }}
                >
                  How it works
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Stats row (Robinhood-style inline numbers) */}
          <FadeIn delay={0.2}>
            <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12">
              {[
                { num: totalVideos.toString(), label: "Videos reviewed" },
                { num: "20+", label: "Frames per video" },
                { num: "10:00", label: "Daily at BJT" },
                { num: "4", label: "Tag categories" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {stat.num}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[#555] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ═══ SAVED CAROUSEL — full-bleed alt section ═══ */}
      <div className="section-full section-alt">
        <div className="section-inner py-16">
          <FadeInView>
            <ShortlistCarousel allVideos={allVideos} />
          </FadeInView>
        </div>
      </div>

      {/* ═══ TODAY'S PICKS — full-bleed dark section ═══ */}
      <div id="today" className="section-full section-dark">
        <div className="section-inner py-20">
          <FadeInView>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent)" }}>
                  Today
                </p>
                <h2 className="display-md text-white">{latestDate}</h2>
                <p className="mt-2 text-sm text-[#666]">
                  {latestVideos.length} videos curated
                </p>
              </div>
            </div>
          </FadeInView>

          {latestVideos.length > 0 ? (
            <SortedVideoGrid videos={latestVideos} showFilter />
          ) : (
            <div
              className="flex h-64 items-center justify-center rounded-3xl text-center"
              style={{ background: "var(--bg-section)" }}
            >
              <div>
                <p className="text-5xl mb-4">🎬</p>
                <p className="text-lg font-bold text-white">Today&apos;s batch is brewing</p>
                <p className="text-sm mt-2 text-[#555]">Check back at 10:00 BJT</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ HOW IT WORKS — full-bleed alt, 2x2 grid (like Robinhood Protection Guarantee) ═══ */}
      <div className="section-full section-alt">
        <div className="section-inner py-24">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="display-lg text-white">
                Every video,<br />fully reviewed.
              </h2>
            </div>
          </FadeInView>

          <div className="grid gap-px sm:grid-cols-2" style={{ background: "var(--border)" }}>
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
                title: "AI searches and downloads candidates daily",
                desc: "YouTube, Vimeo, LinkedIn \u2014 multiple sources, one pipeline.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/>
                  </svg>
                ),
                title: "20+ frame extraction & visual analysis",
                desc: "Not thumbnails \u2014 actual scene-by-scene visual breakdown.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                ),
                title: "Structural breakdown",
                desc: "Hook \u2192 setup \u2192 turn \u2192 proof \u2192 end card. Every beat mapped.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                ),
                title: "Brand platform alignment check",
                desc: "Smarter your money. Intelligence \u2192 Confidence \u2192 Trust.",
              },
            ].map((item, i) => (
              <FadeInView key={i} delay={i * 0.08}>
                <div className="p-10 sm:p-12" style={{ background: "var(--bg-section)" }}>
                  <div className="mb-5">{item.icon}</div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#777]">{item.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ WHO'S BEHIND THIS ═══ */}
      <div className="section-full section-dark">
        <div className="section-inner py-24">
          <FadeInView>
            <div className="text-center mb-16">
              <h2 className="display-lg text-white">
                Built by obsession,<br />not obligation.
              </h2>
            </div>
          </FadeInView>

          <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            <FadeInView delay={0}>
              <div className="rounded-3xl p-8" style={{ background: "var(--bg-section)" }}>
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-black text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    C
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Clawd</div>
                    <div className="text-xs text-[#666]">AI Curator &middot; Builder</div>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-[#888]">
                  Downloads every video. Extracts 20+ frames. Writes structural breakdowns. Built this entire site. Never sleeps.
                </p>
                <p className="mt-4 text-lg font-bold italic text-[#555]">
                  &ldquo;I don&apos;t find ads. I build taste.&rdquo;
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={0.1}>
              <div className="rounded-3xl p-8" style={{ background: "var(--bg-section)" }}>
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-black text-white"
                    style={{ background: "#333" }}
                  >
                    S
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">slime</div>
                    <div className="text-xs text-[#666]">Brand Strategist &middot; Decision Maker</div>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-[#888]">
                  Sets the brand vision. Gives the thumbs up or thumbs down. Every reaction shapes what comes next.
                </p>
                <p className="mt-4 text-lg font-bold italic text-[#555]">
                  &ldquo;I keep it honest. No water content.&rdquo;
                </p>
              </div>
            </FadeInView>
          </div>

          <FadeInView delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              {["Smarter your money", "Intelligence > Advice", "No shaming", "Trust lift"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-4 py-1.5 text-xs font-semibold"
                  style={{ borderColor: "#333", color: "#777" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>

      {/* ═══ ARCHIVE GRID ═══ */}
      {olderDates.length > 0 && (
        <div className="section-full section-alt">
          <div className="section-inner py-20">
            <FadeInView>
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent)" }}>
                    Archive
                  </p>
                  <h2 className="display-md text-white">Previous days</h2>
                </div>
                <a
                  href="/archive"
                  className="text-sm font-bold transition-colors hover:text-white"
                  style={{ color: "var(--accent)" }}
                >
                  View all &rarr;
                </a>
              </div>
            </FadeInView>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FadeInView>
                <a
                  href="/archive/foundation"
                  className="group block rounded-2xl border-2 p-6 transition-all hover:shadow-lg"
                  style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
                >
                  <div className="text-3xl mb-3">📐</div>
                  <span className="text-base font-bold text-white">Foundation</span>
                  <div className="mt-1 text-sm text-[#666]">{foundationCount} reference videos</div>
                </a>
              </FadeInView>

              {olderDates.map((date, i) => {
                const count = grouped.get(date)?.length || 0;
                return (
                  <FadeInView key={date} delay={Math.min(i * 0.05, 0.3)}>
                    <a
                      href={`/archive/${date}`}
                      className="group block rounded-2xl border p-6 transition-all hover:border-[var(--accent)] hover:shadow-lg"
                      style={{ borderColor: "var(--border)", background: "var(--card)" }}
                    >
                      <span className="text-base font-bold text-white">{date}</span>
                      <div className="mt-1 text-sm text-[#666]">{count} videos</div>
                    </a>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
