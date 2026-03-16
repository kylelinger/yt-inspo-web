import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import { normalizeLang, tr } from "@/lib/language";

function getLatestDate(): string {
  const allVideos = videosData as Array<{ date_added?: string; collection?: string }>;
  const dates = allVideos
    .filter((v) => v.collection !== "foundation" && v.date_added)
    .map((v) => v.date_added!)
    .sort((a, b) => b.localeCompare(a));
  return dates[0] || "";
}

export default async function ArchiveDatePage({ params }: { params: Promise<{ date: string }> }) {
  const lang = normalizeLang((await cookies()).get("bp_lang")?.value);
  const { date } = await params;

  if (date === getLatestDate()) redirect("/");

  if (date === "foundation") {
    const videos = (videosData as Video[]).filter((v) => v.collection === "foundation");
    return (
      <div className="section-full section-dark">
        <div className="section-inner pt-20 pb-4">
          <a href="/archive" className="mb-6 inline-block text-sm text-[#555] transition-colors hover:text-white">&larr; {tr(lang, "Archive", "归档")}</a>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>Foundation</p>
          <h1 className="display-md text-white mb-2">{tr(lang, "Aesthetic Foundation", "审美地基")}</h1>
          <p className="text-sm text-[#555] mb-12">{videos.length} {tr(lang, "reference videos", "条参考视频")}</p>
        </div>
        <div className="section-inner pb-20">
          <SortedVideoGrid videos={videos} lang={lang} />
        </div>
      </div>
    );
  }

  const videos = (videosData as Video[]).filter((v) => v.date_added === date);

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-4">
        <a href="/archive" className="mb-6 inline-block text-sm text-[#555] transition-colors hover:text-white">&larr; {tr(lang, "Archive", "归档")}</a>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>{tr(lang, "Archive", "归档")}</p>
        <h1 className="display-md text-white mb-2">{date}</h1>
        <p className="text-sm text-[#555] mb-12">{videos.length} {tr(lang, "videos curated", "条已精选")}</p>
      </div>
      <div className="section-inner pb-20">
        {videos.length > 0 ? (
          <SortedVideoGrid videos={videos} lang={lang} />
        ) : (
          <div className="py-16 text-center" style={{ background: "var(--bg-alt)", color: "#444" }}>
            {tr(lang, "No content for this day", "当天暂无内容")}
          </div>
        )}
      </div>
    </div>
  );
}
