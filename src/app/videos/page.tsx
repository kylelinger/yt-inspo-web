import { cookies } from "next/headers";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { normalizeLang, tr } from "@/lib/language";
import AllVideosExplorer from "@/components/AllVideosExplorer";

export default async function AllVideosPage() {
  const lang = normalizeLang((await cookies()).get("bp_lang")?.value);
  const videos = videosData as Video[];

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>
          {tr(lang, "Collection", "合集")}
        </p>
        <h1 className="display-md text-white mb-2">{tr(lang, "All Videos", "全部视频")}</h1>
        <p className="text-sm text-[#555]">
          {videos.length} {tr(lang, "videos including foundation", "条视频（含 foundation）")}
        </p>
      </div>

      <div className="section-inner pb-20">
        <AllVideosExplorer videos={videos} lang={lang} />
      </div>
    </div>
  );
}
