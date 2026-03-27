import { FadeInView } from "@/components/MotionDiv";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="section-full section-dark pt-24 pb-16">
        <div className="section-inner">
          <FadeInView>
            <div className="flex items-center gap-4 mb-6">
              <div
                className="flex h-16 w-16 items-center justify-center text-2xl font-black text-white"
                style={{ background: "var(--accent)" }}
              >
                📐
              </div>
              <div>
                <h1 className="display-lg text-white">About</h1>
                <p className="text-sm text-[#666] mt-1">AI-curated brand ad inspiration</p>
              </div>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-[#888] max-w-2xl">
              Built for M公司, a global fintech company building the next-generation trading platform. Every day, an AI curator downloads the full cut, runs a Gemini-grade analysis, and maps the structure of the best brand ads from around the world.
            </p>
          </FadeInView>
        </div>
      </div>

      {/* Operating Principles */}
      <div className="section-full section-alt py-16">
        <div className="section-inner">
          <FadeInView>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-10" style={{ color: "var(--accent)" }}>
              Operating Principles
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Full review, no shortcuts",
                  desc: "Every video is downloaded and analyzed end-to-end via DGemini CLI (full-video Gemini pass). Then we write a structural breakdown. Zero shortcuts.",
                },
                {
                  title: "Brand platform alignment",
                  desc: "Smarter your money. Intelligence → Confidence → Trust. No shaming, no guru-talks-down, no magic blackbox.",
                },
                {
                  title: "Quality over quantity",
                  desc: "If the batch isn't ready, we skip the day. Zero videos is better than one that wasn't fully reviewed.",
                },
                {
                  title: "Feedback-driven evolution",
                  desc: "Every 👍👎⭐ updates the search framework. Winning patterns become queries; losing patterns become filters.",
                },
                {
                  title: "Craft matters",
                  desc: "We study ads like directors study films. Structure, hooks, VO mechanics, end cards—every detail counts.",
                },
                {
                  title: "Built to scale taste",
                  desc: "Not just finding ads—building a system that gets smarter about what 'good' means for our brand platform.",
                },
              ].map((p, i) => (
                <div key={i} className="p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div className="text-lg font-bold text-white mb-2">{p.title}</div>
                  <div className="text-sm leading-relaxed text-[#888]">{p.desc}</div>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Team */}
      <div className="section-full section-dark py-16">
        <div className="section-inner">
          <FadeInView>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-10" style={{ color: "var(--accent)" }}>
              Who's Behind This
            </p>
            <div className="grid md:grid-cols-2 gap-[2px]">
              {/* Clawd */}
              <div className="p-8" style={{ background: "#1a1a1a" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="flex h-14 w-14 items-center justify-center text-xl font-black text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    C
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Clawd</div>
                    <div className="text-xs text-[#666]">AI Curator · Builder</div>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-[#888]">
                  Downloads every video. Uploads the full cut to Gemini (DGemini CLI). Extracts the narrative spine. Writes structural breakdowns. Maintains the search framework. Built this website. Never sleeps.
                </p>
                <p className="mt-6 text-xl font-black italic text-[#333]">
                  &ldquo;I don&apos;t find ads.<br />I build taste.&rdquo;
                </p>
              </div>

              {/* slime */}
              <div className="p-8" style={{ background: "#1a1a1a" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="flex h-14 w-14 items-center justify-center text-xl font-black text-white"
                    style={{ background: "#222" }}
                  >
                    S
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">slime</div>
                    <div className="text-xs text-[#666]">Brand Strategist · Decision Maker</div>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-[#888]">
                  Sets the brand vision. Gives the thumbs up or thumbs down. Keeps the bar high. Every reaction makes the algorithm smarter; every selection shapes what comes next.
                </p>
                <p className="mt-6 text-xl font-black italic text-[#333]">
                  &ldquo;I keep it honest.<br />No water content.&rdquo;
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* How It Works */}
      <div className="section-full section-alt py-16">
        <div className="section-inner">
          <FadeInView>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-10" style={{ color: "var(--accent)" }}>
              How It Works
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "🔍", title: "AI searches daily", desc: "YouTube, Vimeo, LinkedIn—multiple sources, one pipeline." },
                { icon: "🧬", title: "Full‑video Gemini analysis", desc: "DGemini CLI uploads the whole ad. We get structure, VO, ending, and risks in one pass." },
                { icon: "📝", title: "Structural breakdown", desc: "Hook → setup → turn → proof → end card. Every beat mapped." },
                { icon: "✅", title: "Brand alignment check", desc: "Smarter your money. Intelligence → Confidence → Trust." },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-base font-bold text-white mb-2">{item.title}</div>
                  <div className="text-sm text-[#666] leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Tag System */}
      <div className="section-full section-dark py-16">
        <div className="section-inner">
          <FadeInView>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-10" style={{ color: "var(--accent)" }}>
              Tag System
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { tag: "B1", label: "直接竞品", color: "#f59e0b", desc: "Investment/brokerage apps—direct competitors to study and surpass." },
                { tag: "B2", label: "金融品牌", color: "#3b82f6", desc: "Fintech ecosystem—payments, crypto, banking. Trust-building reference." },
                { tag: "A", label: "审美标杆", color: "#a855f7", desc: "Global elite brands—craft, storytelling, and emotional connection benchmarks." },
                { tag: "S", label: "联名/作品集/幕后", color: "#10b981", desc: "Co-branded campaigns, director showreels, VFX breakdowns, and behind-the-scenes craft studies." },
                { tag: "E", label: "教程/讲座", color: "#6b7280", desc: "Financial tutorials, platform walkthroughs, product demos, and educational content from finance brands." },
              ].map((t) => (
                <div key={t.tag} className="p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-3" style={{ background: t.color }} />
                    <span className="text-sm font-black text-white">{t.tag}</span>
                    <span className="text-xs text-[#666]">{t.label}</span>
                  </div>
                  <p className="text-sm text-[#888] leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="section-full section-accent py-12">
        <div className="section-inner text-center">
          <FadeInView>
            <p className="text-lg font-black text-black mb-2">Daily at 10:00 BJT</p>
            <p className="text-sm text-black/60">New curated videos delivered every morning</p>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}
