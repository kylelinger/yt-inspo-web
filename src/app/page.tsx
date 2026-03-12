import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import Sidebar from "@/components/Sidebar";

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
  const olderDates = sortedDates.slice(1);
  const foundationCount = allVideos.filter(v => v.collection === "foundation").length;

  // Pick hero video: first video of the day
  const heroVideo = latestVideos[0];
  const restVideos = latestVideos.slice(1);

  return (
    <div className="space-y-16">
      {/* ─── Hero Section ─── */}
      <section>
        {/* Date badge */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "var(--accent)", color: "#000" }}
          >
            Today
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {latestDate} · {latestVideos.length} videos
          </span>
        </div>

        {heroVideo ? (
          <a href={`/video/${heroVideo.id}`} className="group block">
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ background: "var(--hero-bg)" }}
            >
              {/* Hero thumbnail */}
              <div className="aspect-[21/9] w-full overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${heroVideo.id}/maxresdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>
              {/* Hero text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                <div className="mb-3 flex items-center gap-2">
                  {heroVideo.tag && (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                      style={{
                        background: heroVideo.tag === "B1" ? "rgba(245,158,11,0.25)" :
                                    heroVideo.tag === "B2" ? "rgba(59,130,246,0.25)" :
                                    heroVideo.tag === "A"  ? "rgba(168,85,247,0.25)" :
                                    "rgba(156,163,175,0.25)",
                        color: heroVideo.tag === "B1" ? "#fbbf24" :
                               heroVideo.tag === "B2" ? "#60a5fa" :
                               heroVideo.tag === "A"  ? "#c084fc" : "#d1d5db",
                      }}
                    >
                      {heroVideo.tag}
                    </span>
                  )}
                  <span className="text-xs font-medium text-white/60">
                    {heroVideo.brand}
                    {heroVideo.duration_s && ` · ${Math.floor(heroVideo.duration_s / 60)}:${String(heroVideo.duration_s % 60).padStart(2, "0")}`}
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  {heroVideo.title}
                </h2>
                {heroVideo.breakdown?.summary && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 line-clamp-2">
                    {heroVideo.breakdown.summary}
                  </p>
                )}
              </div>
              {/* Play icon */}
              <div className="absolute right-8 bottom-8 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform group-hover:scale-110">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </a>
        ) : (
          <div
            className="flex h-64 items-center justify-center rounded-2xl text-center"
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

      {/* ─── Rest of Today's Feed ─── */}
      {restVideos.length > 0 && (
        <section>
          <SortedVideoGrid videos={restVideos} showFilter />
        </section>
      )}

      {/* ─── About / Curators ─── */}
      <section>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Sidebar />
          </div>
          <div
            className="flex flex-col justify-center rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              How it works
            </h3>
            <div className="space-y-3 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <div className="flex gap-3">
                <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>01</span>
                <span>AI searches and downloads candidates daily</span>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>02</span>
                <span>Every video gets 20+ frame extraction & visual analysis</span>
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
            {/* Foundation pinned */}
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
