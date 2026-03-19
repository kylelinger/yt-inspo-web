import { cookies } from "next/headers";
import Link from "next/link";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import { normalizeLang, tr } from "@/lib/language";

interface VideoWithCollection extends Video {
  collection?: string;
}

export default async function Home() {
  const lang = normalizeLang((await cookies()).get("bp_lang")?.value);
  const allVideos = videosData as VideoWithCollection[];
  const videos = allVideos.filter((v) => v.collection !== "foundation");

  const grouped = new Map<string, Video[]>();
  for (const v of videos) {
    const date = v.date_added || "unknown";
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(v);
  }
  const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));
  const latestDate = sortedDates[0];
  const latestVideos = grouped.get(latestDate) || [];
  const totalVideos = allVideos.length;

  return (
    <div>
      {/* Hero Section */}
      <div id="home-hero">
        <div id="home-hero-content" className="section-inner w-full">
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
            {tr(lang, "Brand Intelligence", "品牌追踪")}
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            {totalVideos} {tr(lang, "videos analyzed daily", "条视频每日分析")}
          </p>
        </div>
      </div>

      {/* Today's Videos */}
      <div className="section-full section-dark pt-16 pb-24">
        <div className="section-inner">
          <div className="mb-12 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              {tr(lang, "Latest", "最新")}
            </p>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "var(--text)" }}>
              {latestDate}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              {latestVideos.length} {tr(lang, "videos", "条视频")}
            </p>
          </div>

          {latestVideos.length > 0 ? (
            <SortedVideoGrid videos={latestVideos} showFilter={false} lang={lang} />
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>{tr(lang, "Today's drop is still cooking", "今日更新还在制作中")}</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>{tr(lang, "Check back at 10:00", "10:00 回来刷新")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Archive Link */}
      <div className="section-full section-alt py-12 px-4 sm:px-8">
        <div className="section-inner">
          <Link href="/archive" className="archive-link">
            {tr(lang, "View Archive", "查看往期")} →
          </Link>
        </div>
      </div>
    </div>
  );
}
