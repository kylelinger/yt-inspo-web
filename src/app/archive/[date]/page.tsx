import { redirect } from "next/navigation";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";

function getLatestDate(): string {
  const allVideos = videosData as Array<{ date_added?: string; collection?: string }>;
  const dates = allVideos
    .filter((v) => v.collection !== "foundation" && v.date_added)
    .map((v) => v.date_added!)
    .sort((a, b) => b.localeCompare(a));
  return dates[0] || "";
}

export default async function ArchiveDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  // Today's date → redirect to home
  const latestDate = getLatestDate();
  if (date === latestDate) {
    redirect("/");
  }

  // Handle foundation redirect (it has its own page, but just in case)
  if (date === "foundation") {
    const videos = (videosData as Video[]).filter((v) => v.collection === "foundation");
    return (
      <div>
        <a href="/archive" className="mb-4 inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          ← Archive
        </a>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            📐 Aesthetic Foundation
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            审美地基 — 最初定义品味的坐标系
          </p>
        </div>
        <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>{videos.length} videos</p>
        <SortedVideoGrid videos={videos} />
      </div>
    );
  }

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
        <SortedVideoGrid videos={videos} />
      ) : (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          这天没有内容
        </div>
      )}
    </div>
  );
}
