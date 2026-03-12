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
      <div className="section-inner pt-20 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>
          Archive
        </p>
        <h1 className="display-md text-white mb-2">Previous days</h1>
        <p className="text-sm text-[#555] mb-12">Browse all curated inspiration by date</p>
      </div>

      {/* Stacked rows — alternating bg, no cards */}
      <div className="section-inner pb-20">
        {foundation.length > 0 && (
          <a href="/archive/foundation" className="flex items-center justify-between py-5 px-6 transition-colors hover:bg-[#151515]" style={{ background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)" }}>
            <div>
              <span className="text-base font-bold text-white">Foundation</span>
              <span className="ml-3 text-sm text-[#666]">The reference library</span>
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{foundation.length}</span>
          </a>
        )}

        {sortedDates.map((date, i) => {
          const count = grouped.get(date)?.length || 0;
          return (
            <a
              key={date}
              href={`/archive/${date}`}
              className="flex items-center justify-between py-5 px-6 transition-colors hover:bg-[#151515]"
              style={{ background: i % 2 === 0 ? "#0a0a0a" : "#0e0e0e" }}
            >
              <span className="text-base font-bold text-white">{date}</span>
              <span className="text-sm text-[#555]">{count} videos</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
