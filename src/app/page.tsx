import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const videos = videosData as Video[];

  // Group by date, most recent first
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            📺 Today&apos;s Inspiration
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {latestDate} · {latestVideos.length} videos · 点 👍/👎 反馈，⭐ 收藏
          </p>
        </div>

        {/* Today's videos */}
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

        {/* Older dates summary */}
        {olderDates.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text)' }}>
              📁 Archive
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
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

      {/* Right sidebar — hidden on mobile, visible on lg+ */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
