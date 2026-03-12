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
  const allDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));
  const sortedDates = allDates.slice(1);

  return (
    <div className="section-full section-dark">
      <div className="section-inner py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent)" }}>
          Archive
        </p>
        <h1 className="display-md text-white mb-2">Previous days</h1>
        <p className="text-sm text-[#666] mb-12">
          Browse all curated inspiration by date
        </p>

        <div className="space-y-2">
          {foundation.length > 0 && (
            <a
              href="/archive/foundation"
              className="group flex items-center justify-between rounded-2xl border-2 p-6 transition-all hover:shadow-lg"
              style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
            >
              <div>
                <span className="text-base font-bold text-white">Foundation</span>
                <p className="mt-1 text-sm text-[#777]">
                  The reference library that defines our taste
                </p>
              </div>
              <span className="rounded-full px-4 py-1.5 text-xs font-bold text-white" style={{ background: "var(--accent)" }}>
                {foundation.length}
              </span>
            </a>
          )}

          {sortedDates.map((date) => {
            const count = grouped.get(date)?.length || 0;
            return (
              <a
                key={date}
                href={`/archive/${date}`}
                className="group flex items-center justify-between rounded-2xl border p-6 transition-all hover:border-[var(--accent)] hover:shadow-lg"
                style={{ borderColor: "var(--border)", background: "var(--card)" }}
              >
                <span className="text-base font-bold text-white">{date}</span>
                <span className="text-sm font-medium text-[#666]">{count} videos</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
