import { cookies } from "next/headers";
import videosData from "@/../public/data/videos.json";
import type { Video } from "@/lib/types";
import SortedVideoGrid from "@/components/SortedVideoGrid";
import ShortlistCarousel from "@/components/ShortlistCarousel";
import { FadeInView } from "@/components/MotionDiv";
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
  const olderDates = sortedDates.slice(1);
  const totalVideos = allVideos.length;
  const totalBrands = new Set(allVideos.map((v) => (v.brand || "").trim()).filter(Boolean)).size;

  return (
    <div>
      <div className="section-full section-accent">
        <div className="section-inner">
          <div className="flex items-center justify-center h-14 gap-3 sm:gap-8">
            {[
              { num: totalVideos.toString(), label: tr(lang, "Videos", "视频") },
              { num: totalBrands.toString(), label: tr(lang, "Brands", "品牌") },
              { num: "10:00", label: tr(lang, "Daily", "日更") },
              { num: "4", label: tr(lang, "Lanes", "赛道") },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2" style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.2)" : "none", paddingLeft: i > 0 ? "0.75rem" : "0" }}>
                <span className="text-base font-black text-white sm:text-lg">{stat.num}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-white/60 sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-full section-alt">
        <FadeInView>
          <ShortlistCarousel allVideos={allVideos} lang={lang} />
        </FadeInView>
      </div>

      <div id="today" className="section-full section-dark pt-16">
        <div className="section-inner pb-8">
          <FadeInView>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>{tr(lang, "Today", "今日")}</p>
                <h2 className="display-md text-white">{latestDate}</h2>
                <p className="mt-2 text-sm text-[#444]">{latestVideos.length} {tr(lang, "videos curated", "条已精选")}</p>
              </div>
              <div className="hidden sm:flex items-center gap-5">
                {[
                  { tag: "B1", label: tr(lang, "Direct rivals", "直接竞品"), color: "#f59e0b" },
                  { tag: "B2", label: tr(lang, "Finance brands", "金融品牌"), color: "#3b82f6" },
                  { tag: "A",  label: tr(lang, "Aesthetic benchmark", "审美标杆"), color: "#a855f7" },
                  { tag: "C",  label: tr(lang, "Culture reference", "文化参考"), color: "#555" },
                ].map((t) => (
                  <div key={t.tag} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5" style={{ background: t.color }} />
                    <span className="text-[11px] font-bold text-[#555]">{t.tag}</span>
                    <span className="text-[11px] text-[#333]">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile tag legend */}
            <div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-2 mt-6 mb-4">
              {[
                { tag: "B1", label: tr(lang, "Direct rivals", "直接竞品"), color: "#f59e0b" },
                { tag: "B2", label: tr(lang, "Finance brands", "金融品牌"), color: "#3b82f6" },
                { tag: "A",  label: tr(lang, "Aesthetic benchmark", "审美标杆"), color: "#a855f7" },
                { tag: "C",  label: tr(lang, "Culture reference", "文化参考"), color: "#555" },
              ].map((t) => (
                <div key={t.tag} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 shrink-0" style={{ background: t.color }} />
                  <span className="text-[10px] font-bold text-[#555]">{t.tag}</span>
                  <span className="text-[10px] text-[#333]">{t.label}</span>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>

        {latestVideos.length > 0 ? (
          <div className="section-inner pb-24">
            <SortedVideoGrid videos={latestVideos} showFilter lang={lang} />
          </div>
        ) : (
          <div className="section-inner pb-24">
            <div className="py-24 text-center" style={{ background: "var(--bg-alt)" }}>
              <p className="text-5xl mb-4">🎬</p>
              <p className="text-lg font-bold text-white">{tr(lang, "Today’s drop is still cooking", "今日更新还在制作中")}</p>
              <p className="text-sm mt-2 text-[#444]">{tr(lang, "Check back at 10:00", "10:00 回来刷新")}</p>
            </div>
          </div>
        )}
      </div>

      <div className="section-full py-16" style={{ background: "#0e0e0e" }}>
        <div className="section-inner">
          <FadeInView>
            <div className="w-full p-7 sm:p-8 lg:p-10" style={{ background: "#1a1a1a" }}>
              <div className="mb-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                  Pipeline
                </p>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white">{tr(lang, "How this cut gets made", "这条日更如何出片")}</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { icon: "🔍", title: tr(lang, "AI scouts daily", "AI 每日搜片"), desc: tr(lang, "YouTube, Vimeo, LinkedIn — one ruthless pipeline.", "YouTube、Vimeo、LinkedIn 多源并轨，一条流水线。") },
                  { icon: "🧬", title: tr(lang, "Full-video analysis", "全片深读"), desc: tr(lang, "Whole ad fed into Gemini — story, VO, and every beat extracted.", "整片输入 Gemini，剧情/VO/每个节点一次全读。") },
                  { icon: "📝", title: tr(lang, "Structure mapped", "结构化拆解"), desc: tr(lang, "Hook → setup → turn → proof → end card.", "Hook → setup → turn → proof → end card，全链路拆解。") },
                  { icon: "✅", title: tr(lang, "Brand-fit gate", "品牌对齐闸门"), desc: tr(lang, "Smarter money. Clear thinking. Trust uplift.", "更聪明的金钱观，清晰表达，稳定抬升信任。") },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-[#666]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      <div className="section-full py-5" style={{ background: "#080808" }}>
        <div className="section-inner">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "#555" }}>
            Claw Pips
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[tr(lang, "Smarter your money", "你的钱变得更聪明"), tr(lang, "Intelligence > Advice", "认知 > 建议"), tr(lang, "No shaming", "不羞辱用户"), tr(lang, "Trust lift", "提升信任")].map((tag) => (
              <span key={tag} className="text-xs font-bold uppercase tracking-widest text-[#333]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {olderDates.length > 0 && (
        <div className="section-full section-dark pt-16">
          <div className="section-inner pb-24">
            <FadeInView>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--accent)" }}>{tr(lang, "Archive", "归档")}</p>
                  <h2 className="display-md text-white">{tr(lang, "Previous drops", "往期内容")}</h2>
                </div>
                <a href="/archive" className="text-sm font-bold transition-colors hover:text-white" style={{ color: "var(--accent)" }}>
                  {tr(lang, "View all", "查看全部")} &rarr;
                </a>
              </div>
            </FadeInView>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[2px]" style={{ background: "var(--bg)" }}>
              {olderDates.map((date) => {
                const count = grouped.get(date)?.length || 0;
                return (
                  <a
                    key={date}
                    href={`/archive/${date}`}
                    className="group block p-6 transition-colors hover:bg-[#1a1a1a]"
                    style={{ background: "#0e0e0e" }}
                  >
                    <div className="text-base font-bold text-white">{date}</div>
                    <div className="mt-1 text-sm text-[#555]">{count} {tr(lang, "videos", "条视频")}</div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
