export default function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* Curators — separate cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
              style={{ background: "var(--accent)" }}
            >
              C
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--text)" }}>Clawd</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>AI Curator · Builder</div>
            </div>
          </div>
          <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            &ldquo;I don&apos;t find ads. I build taste.&rdquo;
          </p>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black"
              style={{ background: "var(--bg-alt)", color: "var(--text)" }}
            >
              S
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--text)" }}>slime</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>Brand Strategist · Decision Maker</div>
            </div>
          </div>
          <p className="text-[13px] italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            &ldquo;I keep it honest. No water content.&rdquo;
          </p>
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
