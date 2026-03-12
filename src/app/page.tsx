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

  return (
    <div className="space-y-20">
      {/* ─── Saved Carousel ─── */}
      <FadeIn delay={0}>
        <section>
          <ShortlistCarousel allVideos={allVideos} />
        </section>
      </FadeIn>

      {/* ─── Today's Inspiration ─── */}
      <FadeIn delay={0.15}>
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div
              className="rounded-full px-3.5 py-1 text-xs font-bold tracking-wide text-white"
              style={{ background: "var(--accent)" }}
            >
              TODAY
            </div>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {latestDate} &middot; {latestVideos.length} videos
            </span>
          </div>

          {latestVideos.length > 0 ? (
            <SortedVideoGrid videos={latestVideos} showFilter />
          ) : (
            <div
              className="flex h-52 items-center justify-center rounded-2xl text-center"
              style={{ background: "var(--bg-alt)", color: "var(--text-muted)" }}
            >
              <div>
                <p className="text-5xl mb-3">🎬</p>
                <p className="text-sm font-semibold">Today&apos;s batch is brewing</p>
                <p className="text-xs mt-1 opacity-70">Check back at 10:00 BJT</p>
              </div>
            </div>
          )}
        </section>
      </FadeIn>

      {/* ─── Who's behind this ─── */}
      <FadeInView>
        <section>
          <div className="mb-8 flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
              Who&apos;s behind this
            </h2>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Left: Clawd + slime stacked */}
            <div className="flex flex-col gap-4">
              {[
                {
                  initial: "C",
                  name: "Clawd",
                  role: "AI Curator \u00B7 Builder",
                  quote: "\u201CI don\u2019t find ads. I build taste.\u201D",
                  avatarBg: "var(--accent)",
                  avatarFg: "#fff",
                },
                {
                  initial: "S",
                  name: "slime",
                  role: "Brand Strategist \u00B7 Decision Maker",
                  quote: "\u201CI keep it honest. No water content.\u201D",
                  avatarBg: "var(--bg-alt)",
                  avatarFg: "var(--text)",
                },
              ].map((person, i) => (
                <FadeInView key={person.name} delay={i * 0.1}>
                  <div
                    className="group rounded-2xl border p-5 transition-all hover:shadow-md hover:border-[var(--accent)]"
                    style={{ borderColor: "var(--border)", background: "var(--card)" }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
                        style={{ background: person.avatarBg, color: person.avatarFg }}
                      >
                        {person.initial}
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{person.name}</div>
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{person.role}</div>
                      </div>
                    </div>
                    <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {person.quote}
                    </p>
                  </div>
                </FadeInView>
              ))}

              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {["Smarter your money", "Intelligence > Advice", "No shaming", "Trust lift"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    {tag}
                  </span>
                ))}
                <a
                  href="/about"
                  className="ml-2 text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--accent)" }}
                >
                  Read more &rarr;
                </a>
              </div>
            </div>

            {/* Right: How it works */}
            <FadeInView delay={0.15}>
              <div
                className="rounded-2xl border p-7 flex flex-col justify-center h-full"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <h3
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  How it works
                </h3>
                <div className="space-y-5 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {[
                    "AI searches and downloads candidates daily",
                    "Every video gets 20+ frame extraction & visual analysis",
                    "Structural breakdown: hook \u2192 setup \u2192 turn \u2192 proof \u2192 end card",
                    "Only videos passing brand platform alignment earn a spot",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span
                        className="shrink-0 text-sm font-black tabular-nums"
                        style={{ color: "var(--accent)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      </FadeInView>

      {/* ─── Archive Grid ─── */}
      {olderDates.length > 0 && (
        <FadeInView>
          <section>
            <div className="mb-8 flex items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
                Archive
              </h2>
              <div className="h-px flex-1" style={{ background: "var(--border)" }} />
              <a
                href="/archive"
                className="text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: "var(--accent)" }}
              >
                View all &rarr;
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/archive/foundation"
                className="group rounded-2xl border-2 p-5 transition-all hover:shadow-md"
                style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
              >
                <div className="text-2xl mb-2">📐</div>
                <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  Foundation
                </span>
                <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {foundationCount} reference videos
                </div>
              </a>

              {olderDates.map((date) => {
                const count = grouped.get(date)?.length || 0;
                return (
                  <a
                    key={date}
                    href={`/archive/${date}`}
                    className="group rounded-2xl border p-5 transition-all hover:shadow-md hover:border-[var(--accent)]"
                    style={{ borderColor: "var(--border)", background: "var(--card)" }}
                  >
                    <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                      {date}
                    </span>
                    <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      {count} videos
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </FadeInView>
      )}
    </div>
  );
}
