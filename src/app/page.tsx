import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import Sidebar from "@/components/Sidebar";

interface VideoWithCollection extends Video {
  collection?: string;
}

export default function Home() {
  const allVideos = videosData as VideoWithCollection[];
  // Exclude foundation from date grouping
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

  return (
    <div className="flex gap-8">
      {/* Main feed */}
      <div className="min-w-0 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            📺 Today&apos;s Inspiration
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {latestDate} · {latestVideos.length} videos · 点 👍/👎 反馈，⭐ 收藏
          </p>
        </div>

        {latestVideos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {latestVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            今天还没有内容
          </div>
        )}

        {olderDates.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text)' }}>
              📁 Archive
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Foundation pinned */}
              <a
                href="/archive/foundation"
                className="rounded-lg border p-4 transition-colors hover:shadow-sm"
                style={{
                  borderColor: 'var(--accent)',
                  background: 'color-mix(in srgb, var(--accent) 5%, var(--card))',
                }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>📐 Foundation</span>
                <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {allVideos.filter(v => v.collection === 'foundation').length} videos
                </span>
              </a>
              {olderDates.map((date) => {
                const count = grouped.get(date)?.length || 0;
                return (
                  <a
                    key={date}
                    href={`/archive/${date}`}
                    className="rounded-lg border p-4 transition-colors hover:shadow-sm"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{date}</span>
                    <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>{count} videos</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
