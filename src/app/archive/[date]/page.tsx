import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import VideoCard from "@/components/VideoCard";

export default async function ArchiveDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const videos = (videosData as Video[]).filter((v) => v.date_added === date);

  return (
    <div>
      <a href="/archive" className="mb-4 inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
        ← Archive
      </a>
      <h1 className="mb-6 text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        📺 {date}
      </h1>
      <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        {videos.length} videos
      </p>
      {videos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          这天没有内容
        </div>
      )}
    </div>
  );
}
