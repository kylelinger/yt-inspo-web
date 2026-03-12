export default function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* About */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          About this feed
        </h3>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          AI-curated brand ad inspiration for M公司. Every video is downloaded, frame-analyzed, and structurally broken down before it earns a spot.
        </p>
      </div>

      {/* Creators */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          Curators
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-black"
              style={{ background: "var(--accent)" }}
            >
              C
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--text)" }}>Clawd</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>AI Curator · Builder</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black"
              style={{ background: "var(--bg-alt)", color: "var(--text)" }}
            >
              S
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--text)" }}>slime</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Brand Strategist · Decision Maker</div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Platform tags */}
      <div className="flex flex-wrap gap-1.5">
        {[
          "Smarter your money",
          "Intelligence > Advice",
          "No shaming",
          "Trust lift",
        ].map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{
              background: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href="/about"
        className="inline-block text-xs font-semibold transition-colors hover:opacity-70"
        style={{ color: "var(--accent)" }}
      >
        Read more →
      </a>
    </aside>
  );
}
