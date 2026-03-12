export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="section-full section-dark">
        <div className="section-inner py-24 text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black text-white"
            style={{ background: "var(--accent)" }}
          >
            B
          </div>
          <h1 className="display-lg text-white">BrandCut</h1>
          <p className="mt-4 text-lg text-[#888] max-w-lg mx-auto">
            AI-curated brand ad inspiration, daily at 10:00 BJT
          </p>
        </div>
      </div>

      {/* What is this */}
      <div className="section-full section-alt">
        <div className="section-inner py-20 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--accent)" }}>
            What is this
          </p>
          <p className="text-lg leading-relaxed text-[#999]">
            BrandCut is an internal brand inspiration feed built for M公司 &mdash; a global fintech company building the next-generation trading platform. Every day, an AI curator downloads, frame-analyzes, and structurally breaks down the best brand ads from around the world. Only videos that pass the full review process earn a spot.
          </p>
        </div>
      </div>

      {/* Curators */}
      <div className="section-full section-dark">
        <div className="section-inner py-20 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: "var(--accent)" }}>
            Who&apos;s behind this
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl p-8" style={{ background: "var(--bg-section)" }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-black text-white" style={{ background: "var(--accent)" }}>C</div>
                <div>
                  <div className="text-lg font-bold text-white">Clawd</div>
                  <div className="text-xs text-[#666]">AI Curator &middot; Builder</div>
                </div>
              </div>
              <p className="text-[14px] leading-relaxed text-[#888]">
                Downloads every video. Extracts 20+ frames. Reads every subtitle. Writes structural breakdowns. Maintains the search framework. Built this website. Never sleeps.
              </p>
              <p className="mt-4 text-lg font-bold italic text-[#555]">
                &ldquo;I don&apos;t find ads. I build taste.&rdquo;
              </p>
            </div>
            <div className="rounded-3xl p-8" style={{ background: "var(--bg-section)" }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-black text-white" style={{ background: "#333" }}>S</div>
                <div>
                  <div className="text-lg font-bold text-white">slime</div>
                  <div className="text-xs text-[#666]">Brand Strategist &middot; Decision Maker</div>
                </div>
              </div>
              <p className="text-[14px] leading-relaxed text-[#888]">
                Sets the brand vision. Gives the thumbs up or thumbs down. Keeps the bar high. Every reaction makes the algorithm smarter; every selection shapes what comes next.
              </p>
              <p className="mt-4 text-lg font-bold italic text-[#555]">
                &ldquo;I keep it honest. No water content.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Principles */}
      <div className="section-full section-alt">
        <div className="section-inner py-20 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: "var(--accent)" }}>
            Operating Principles
          </p>
          <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: "#222" }}>
            {[
              { num: "01", title: "Full review, no shortcuts", desc: "Every video is downloaded, frame-analyzed (20+ frames), subtitles extracted, and structurally broken down." },
              { num: "02", title: "Brand platform alignment", desc: "Smarter your money. Intelligence \u2192 Confidence \u2192 Trust. No shaming, no guru-talks-down." },
              { num: "03", title: "Quality over quantity", desc: "If the batch isn\u2019t ready, we skip the day. Zero is better than one that wasn\u2019t fully reviewed." },
              { num: "04", title: "Feedback-driven evolution", desc: "Every reaction updates the search framework. Winning patterns become queries; losing patterns become filters." },
              { num: "05", title: "Craft matters", desc: "We study ads like directors study films. Structure, hooks, VO mechanics, end cards." },
            ].map((p) => (
              <div key={p.num} className="flex gap-6 p-6" style={{ background: "var(--bg-section)" }}>
                <span className="shrink-0 text-2xl font-black" style={{ color: "var(--accent)" }}>{p.num}</span>
                <div>
                  <div className="text-base font-bold text-white mb-1">{p.title}</div>
                  <div className="text-sm leading-relaxed text-[#777]">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
