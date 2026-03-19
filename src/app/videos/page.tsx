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
      <div className="section-inner py-16">
        <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {tr(lang, "All Videos", "全部视频")}
          </p>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, margin: "0 0 1rem 0", color: "var(--text)" }}>
            {tr(lang, "Complete Library", "完整库")}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
            {videos.length} {tr(lang, "videos available", "条视频")}
          </p>
        </div>

        <AllVideosExplorer videos={videos} lang={lang} />
      </div>
    </div>
  );
}
