import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";

interface VideoWithCollection extends Video {
  collection?: string;
}

export default function FoundationPage() {
  const videos = (videosData as VideoWithCollection[]).filter(
    (v) => v.collection === "foundation"
  );

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
          审美地基 — 最初定义品味的坐标系。这些是一切选片标准的原点。
        </p>
      </div>
      <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        {videos.length} videos
      </p>
      <SortedVideoGrid videos={videos} />
    </div>
  );
}
