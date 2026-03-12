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

  const latestDate = getLatestDate();
  if (date === latestDate) {
    redirect("/");
  }

  if (date === "foundation") {
    const videos = (videosData as Video[]).filter((v) => v.collection === "foundation");
    return (
      <div className="section-full section-dark">
        <div className="section-inner py-20">
          <a href="/archive" className="mb-6 inline-flex items-center gap-1 text-sm text-[#666] transition-colors hover:text-white">
            &larr; Archive
          </a>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent)" }}>
            Foundation
          </p>
          <h1 className="display-md text-white mb-2">Aesthetic Foundation</h1>
          <p className="text-sm text-[#666] mb-12">
            {videos.length} reference videos &middot; The taste compass
          </p>
          <SortedVideoGrid videos={videos} />
        </div>
      </div>
    );
  }

  const videos = (videosData as Video[]).filter((v) => v.date_added === date);

  return (
    <div className="section-full section-dark">
      <div className="section-inner py-20">
        <a href="/archive" className="mb-6 inline-flex items-center gap-1 text-sm text-[#666] transition-colors hover:text-white">
          &larr; Archive
        </a>
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent)" }}>
          Archive
        </p>
        <h1 className="display-md text-white mb-2">{date}</h1>
        <p className="text-sm text-[#666] mb-12">
          {videos.length} videos curated
        </p>
        {videos.length > 0 ? (
          <SortedVideoGrid videos={videos} />
        ) : (
          <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-section)", color: "#555" }}>
            No content for this day
          </div>
        )}
      </div>
    </div>
  );
}
