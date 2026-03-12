import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import ShortlistCarousel from "@/components/ShortlistCarousel";

interface VideoWithCollection extends Video {
  collection?: string;
}

function getTodayBJT(): string {
  const now = new Date();
  // Beijing time = UTC+8
  const bjt = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return bjt.toISOString().slice(0, 10);
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

  // Archive = all dates except the latest (today)
  const olderDates = sortedDates.slice(1);

  return (
    <div className="space-y-16">
      {/* ─── Saved Carousel ─── */}
      <section>
        <ShortlistCarousel allVideos={allVideos} />
      </section>

      {/* ─── Today's Inspiration ─── */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Today
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {latestDate} · {latestVideos.length} videos
          </span>
        </div>

        {latestVideos.length > 0 ? (
          <SortedVideoGrid videos={latestVideos} showFilter />
        ) : (
          <div
            className="flex h-48 items-center justify-center rounded-2xl text-center"
            style={{ background: "var(--bg-alt)", color: "var(--text-muted)" }}
          >
            <div>
              <p className="text-4xl mb-3">🎬</p>
              <p className="text-sm font-medium">Today&apos;s batch is brewing</p>
              <p className="text-xs mt-1">Check back at 10:00 BJT</p>
            </div>
          </div>
        )}
      </section>

      {/* ─── Who's behind this ─── */}
      <section>
        <h2 className="mb-6 text-xl font-bold" style={{ color: "var(--text)" }}>
          Who&apos;s behind this
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left: Clawd + slime stacked */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: "var(--accent)" }}
                >
                  C
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--text)" }}>Clawd</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>AI Curator · Builder</div>
                </div>
              </div>
              <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                &ldquo;I don&apos;t find ads. I build taste.&rdquo;
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black"
                  style={{ background: "var(--bg-alt)", color: "var(--text)" }}
                >
                  S
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--text)" }}>slime</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Brand Strategist · Decision Maker</div>
                </div>
              </div>
              <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                &ldquo;I keep it honest. No water content.&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
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
                className="ml-2 text-xs font-semibold transition-colors hover:opacity-70"
                style={{ color: "var(--accent)" }}
              >
                Read more →
              </a>
            </div>
          </div>

          {/* Right: How it works */}
          <div
            className="rounded-xl border p-6 flex flex-col justify-center"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>
              How it works
            </h3>
            <div className="space-y-4 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <div className="flex gap-3">
                <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>01</span>
                <span>AI searches and downloads candidates daily</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>02</span>
                <span>Every video gets 20+ frame extraction &amp; visual analysis</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>03</span>
                <span>Structural breakdown: hook → setup → turn → proof → end card</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>04</span>
                <span>Only videos passing brand platform alignment earn a spot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Archive Grid ─── */}
      {olderDates.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Archive
            </h2>
            <a
              href="/archive"
              className="text-xs font-medium transition-colors hover:text-[var(--text)]"
              style={{ color: "var(--accent)" }}
            >
              View all →
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/archive/foundation"
              className="group rounded-xl border-2 p-5 transition-all hover:shadow-md"
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
                  className="group rounded-xl border p-5 transition-all hover:shadow-md hover:border-[var(--accent)]"
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
      )}
    </div>
  );
}
