import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import { FadeInView } from "@/components/MotionDiv";

interface VideoWithCollection extends Video {
  collection?: string;
}

export default function FoundationPage() {
  const videos = (videosData as VideoWithCollection[]).filter(
    (v) => v.collection === "foundation"
  );

  return (
    <div className="section-full section-dark pt-16">
      <div className="section-inner pb-8">
        <FadeInView>
          <a href="/archive" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#666] transition-colors hover:text-[var(--accent)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Archive
          </a>

          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>Collection</p>
              <h1 className="display-md text-white">📐 Aesthetic Foundation</h1>
              <p className="mt-3 text-sm text-[#666] max-w-2xl">
                审美地基 — 最初定义品味的坐标系。这些是一切选片标准的原点。
              </p>
              <p className="mt-2 text-xs text-[#444]">{videos.length} videos</p>
            </div>
          </div>
        </FadeInView>

        <SortedVideoGrid videos={videos} showFilter />
      </div>
    </div>
  );
}
