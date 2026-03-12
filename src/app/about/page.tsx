export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="section-full section-dark">
        <div className="section-inner py-28">
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center text-2xl font-black text-white"
            style={{ background: "var(--accent)" }}
          >
            B
          </div>
          <h1 className="display-lg text-white">BrandCut</h1>
          <p className="mt-4 text-lg text-[#666] max-w-lg">
            AI-curated brand ad inspiration, daily at 10:00 BJT
          </p>
        </div>
      </div>

      {/* What is this */}
      <div className="section-full section-alt">
        <div className="section-inner py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: "var(--accent)" }}>
            What is this
          </p>
          <p className="text-lg leading-relaxed text-[#888] max-w-2xl">
            BrandCut is an internal brand inspiration feed built for M公司 &mdash; a global fintech company building the next-generation trading platform. Every day, an AI curator downloads, frame-analyzes, and structurally breaks down the best brand ads from around the world. Only videos that pass the full review process earn a spot.
          </p>
        </div>
      </div>

      {/* Curators — two side-by-side blocks */}
      <div className="section-full" style={{ background: "#0e0e0e" }}>
        <div className="grid sm:grid-cols-2 gap-[2px]">
          <div className="p-12 sm:p-16" style={{ background: "#1a1a1a" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center text-xl font-black text-white" style={{ background: "var(--accent)" }}>C</div>
              <div>
                <div className="text-lg font-bold text-white">Clawd</div>
                <div className="text-xs text-[#666]">AI Curator &middot; Builder</div>
              </div>
            </div>
            <p className="text-[15px] leading-relaxed text-[#888]">
              Downloads every video. Extracts 20+ frames. Reads every subtitle. Writes structural breakdowns. Maintains the search framework. Built this website. Never sleeps.
            </p>
            <p className="mt-6 text-xl font-black italic text-[#333]">
              &ldquo;I don&apos;t find ads.<br />I build taste.&rdquo;
            </p>
          </div>
          <div className="p-12 sm:p-16" style={{ background: "#1a1a1a" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center text-xl font-black text-white" style={{ background: "#222" }}>S</div>
              <div>
                <div className="text-lg font-bold text-white">slime</div>
                <div className="text-xs text-[#666]">Brand Strategist &middot; Decision Maker</div>
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
      </div>

      {/* Operating Principles — stacked full-width blocks */}
      <div className="section-full">
        {[
          { num: "01", title: "Full review, no shortcuts", desc: "Every video is downloaded, frame-analyzed (20+ frames), subtitles extracted, and structurally broken down.", bg: "#0a0a0a" },
          { num: "02", title: "Brand platform alignment", desc: "Smarter your money. Intelligence \u2192 Confidence \u2192 Trust. No shaming, no guru-talks-down.", bg: "#0e0e0e" },
          { num: "03", title: "Quality over quantity", desc: "If the batch isn\u2019t ready, we skip the day. Zero videos is better than one that wasn\u2019t fully reviewed.", bg: "#0a0a0a" },
          { num: "04", title: "Feedback-driven evolution", desc: "Every reaction updates the search framework. Winning patterns become queries; losing patterns become filters.", bg: "#0e0e0e" },
          { num: "05", title: "Craft matters", desc: "We study ads like directors study films. Structure, hooks, VO mechanics, end cards.", bg: "#0a0a0a" },
        ].map((p) => (
          <div key={p.num} style={{ background: p.bg }}>
            <div className="section-inner py-10 flex gap-8 items-start">
              <span className="shrink-0 text-3xl font-black" style={{ color: "var(--accent)" }}>{p.num}</span>
              <div>
                <div className="text-lg font-bold text-white mb-1">{p.title}</div>
                <div className="text-sm leading-relaxed text-[#666]">{p.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
