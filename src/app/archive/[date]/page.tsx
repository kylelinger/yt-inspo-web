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

  if (date === getLatestDate()) redirect("/");

  if (date === "foundation") {
    const videos = (videosData as Video[]).filter((v) => v.collection === "foundation");
    return (
      <div className="section-full section-dark">
        <div className="section-inner pt-20 pb-4">
          <a href="/archive" className="mb-6 inline-block text-sm text-[#555] transition-colors hover:text-white">&larr; Archive</a>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>Foundation</p>
          <h1 className="display-md text-white mb-2">Aesthetic Foundation</h1>
          <p className="text-sm text-[#555] mb-12">{videos.length} reference videos</p>
        </div>
        <div className="section-inner pb-20">
          <SortedVideoGrid videos={videos} />
        </div>
      </div>
    );
  }

  const videos = (videosData as Video[]).filter((v) => v.date_added === date);

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-4">
        <a href="/archive" className="mb-6 inline-block text-sm text-[#555] transition-colors hover:text-white">&larr; Archive</a>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>Archive</p>
        <h1 className="display-md text-white mb-2">{date}</h1>
        <p className="text-sm text-[#555] mb-12">{videos.length} videos curated</p>
      </div>
      <div className="section-inner pb-20">
        {videos.length > 0 ? (
          <SortedVideoGrid videos={videos} />
        ) : (
          <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
            No content for this day
          </div>
        )}
      </div>
    </div>
  );
}
