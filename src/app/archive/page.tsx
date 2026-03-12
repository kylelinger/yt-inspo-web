import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";

interface VideoWithCollection extends Video {
  collection?: string;
}

export default function ArchivePage() {
  const videos = videosData as VideoWithCollection[];

  const foundation = videos.filter((v) => v.collection === "foundation");
  const rest = videos.filter((v) => v.collection !== "foundation");

  const grouped = new Map<string, VideoWithCollection[]>();
  for (const v of rest) {
    const date = v.date_added || "unknown";
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(v);
  }
  const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black tracking-tight" style={{ color: "var(--text)" }}>
        Archive
      </h1>
      <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
        Browse all curated inspiration by date
      </p>

      <div className="space-y-2">
        {/* Foundation — pinned */}
        {foundation.length > 0 && (
          <a
            href="/archive/foundation"
            className="group flex items-center justify-between rounded-xl border-2 p-5 transition-all hover:shadow-md"
            style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
          >
            <div>
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                Foundation
              </span>
              <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                The reference library that defines our taste
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: "var(--accent)" }}
            >
              {foundation.length}
            </span>
          </a>
        )}

        {/* Date groups */}
        {sortedDates.map((date) => {
          const count = grouped.get(date)?.length || 0;
          return (
            <a
              key={date}
              href={`/archive/${date}`}
              className="group flex items-center justify-between rounded-xl border p-5 transition-all hover:shadow-md hover:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                {date}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {count} videos
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
