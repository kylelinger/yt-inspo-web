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
      <h1 className="mb-6 text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        📁 Archive
      </h1>

      <div className="space-y-3">
        {/* Foundation — pinned at top */}
        {foundation.length > 0 && (
          <a
            href="/archive/foundation"
            className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-md"
            style={{
              borderColor: 'var(--accent)',
              background: 'color-mix(in srgb, var(--accent) 5%, var(--card))',
            }}
          >
            <div>
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                📐 Aesthetic Foundation
              </span>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                审美地基 — 最初定义品味的坐标系
              </p>
            </div>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
            >
              {foundation.length} videos
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
              className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <span className="font-medium" style={{ color: 'var(--text)' }}>{date}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{count} videos</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
