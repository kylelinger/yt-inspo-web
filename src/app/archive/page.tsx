import { cookies } from "next/headers";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import { normalizeLang, tr } from "@/lib/language";

export default async function ArchivePage() {
  const lang = normalizeLang((await cookies()).get("bp_lang")?.value);
  const allVideos = videosData as Video[];
  const grouped = new Map<string, Video[]>();
  const foundation = allVideos.filter((v) => v.collection === "foundation");

  for (const v of allVideos) {
    if (v.collection === "foundation") continue;
    const date = v.date_added || "unknown";
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(v);
  }

  const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));

  return (
    <div className="section-full section-dark">
      <div className="section-inner pt-20 pb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>{tr(lang, "Archive", "归档")}</p>
        <h1 className="display-md text-white mb-2">{tr(lang, "All drops", "全部历史")}</h1>
        <p className="text-sm text-[#555]">{sortedDates.length} {tr(lang, "days logged", "天记录")}</p>
      </div>

      <div className="section-inner pb-20 grid gap-[2px]" style={{ background: "#000" }}>
        {sortedDates.map((date, i) => {
          const count = grouped.get(date)?.length || 0;
          return (
            <a
              key={date}
              href={`/archive/${date}`}
              className="flex items-center justify-between py-5 px-6 transition-colors hover:bg-[#151515]"
              style={{ background: i % 2 === 0 ? "#0a0a0a" : "#0e0e0e" }}
            >
              <span className="text-base font-bold text-white">{date}</span>
              <span className="text-sm text-[#555]">{count} {tr(lang, "videos", "条视频")}</span>
            </a>
          );
        })}

        {foundation.length > 0 && (
          <a href="/archive/foundation" className="flex items-center justify-between py-5 px-6 transition-colors hover:bg-[#151515]" style={{ background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)" }}>
            <div>
              <span className="text-base font-bold text-white">Foundation</span>
              <span className="ml-3 text-sm text-[#666]">{tr(lang, "Core taste library", "核心审美样本库")}</span>
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{foundation.length}</span>
          </a>
        )}
      </div>
    </div>
  );
}
