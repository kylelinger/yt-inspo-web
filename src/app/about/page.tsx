export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-16">
      {/* Hero */}
      <section className="text-center py-12">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white"
          style={{ background: "var(--accent)" }}
        >
          B
        </div>
        <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text)" }}>
          BrandCut
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--text-secondary)" }}>
          AI-curated brand ad inspiration, daily at 10:00 BJT
        </p>
      </section>

      {/* What is this */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
          What is this
        </h2>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          BrandCut is an internal brand inspiration feed built for M公司 &mdash; a global fintech company building the next-generation trading platform. Every day, an AI curator downloads, frame-analyzes, and structurally breaks down the best brand ads from around the world. Only videos that pass the full review process earn a spot.
        </p>
      </section>

      {/* Curators */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
          Who&apos;s behind this
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Clawd */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white"
                style={{ background: "var(--accent)" }}
              >
                C
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: "var(--text)" }}>Clawd</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>AI Curator · Builder</div>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Downloads every video. Extracts 20+ frames. Reads every subtitle. Writes structural breakdowns. Maintains the search framework. Built this website. Never sleeps.
            </p>
            <p className="mt-3 text-[13px] italic" style={{ color: "var(--text-muted)" }}>
              &ldquo;I don&apos;t find ads. I build taste.&rdquo;
            </p>
          </div>

          {/* slime */}
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black"
                style={{ background: "var(--bg-alt)", color: "var(--text)" }}
              >
                S
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: "var(--text)" }}>slime</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Brand Strategist · Decision Maker</div>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Sets the brand vision. Gives the thumbs up or thumbs down. Keeps the bar high. Every 👎 makes the algorithm smarter; every 👍 shapes what comes next.
            </p>
            <p className="mt-3 text-[13px] italic" style={{ color: "var(--text-muted)" }}>
              &ldquo;I keep it honest. No water content.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
          Operating Principles
        </h2>
        <div className="space-y-4">
          {[
            {
              num: "01",
              title: "Full review, no shortcuts",
              desc: "Every video is downloaded, frame-analyzed (20+ frames), subtitles extracted, and structurally broken down. No video earns a spot from title alone.",
            },
            {
              num: "02",
              title: "Brand platform alignment",
              desc: "Smarter your money. Intelligence → Confidence → Trust. Every selection is checked against this framework. No shaming, no guru-talks-down.",
            },
            {
              num: "03",
              title: "Quality over quantity",
              desc: "If the batch isn\u2019t ready, we skip the day. Zero videos is better than one that wasn\u2019t fully reviewed.",
            },
            {
              num: "04",
              title: "Feedback-driven evolution",
              desc: "Every 👍 and 👎 updates the search framework. Winning patterns become search queries; losing patterns become filters.",
            },
            {
              num: "05",
              title: "Craft matters",
              desc: "We study ads like directors study films. Structure, hooks, VO mechanics, end cards. The goal is transferable methodology, not surface imitation.",
            },
          ].map((p) => (
            <div
              key={p.num}
              className="flex gap-5 rounded-xl border p-5"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <span
                className="shrink-0 text-2xl font-black"
                style={{ color: "var(--accent)" }}
              >
                {p.num}
              </span>
              <div>
                <div className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>
                  {p.title}
                </div>
                <div className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
