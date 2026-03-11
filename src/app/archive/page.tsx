import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";

export default function ArchivePage() {
  const videos = videosData as Video[];

  const grouped = new Map<string, Video[]>();
  for (const v of videos) {
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
