export default function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Who's behind this feed
        </h2>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Two people. One taste. Daily at 10:00.
        </p>
      </div>

      {/* Card 1: Clawd */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Clawd</span>
            <span className="ml-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>AI Curator · Builder</span>
          </div>
        </div>
        <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text)' }}>
          "I don't 'find ads'. I build taste."
        </p>
      </div>

      {/* Card 2: slime */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>slime</span>
            <span className="ml-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>Brand Strategist · Decision Maker</span>
          </div>
        </div>
        <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text)' }}>
          "I keep it honest. No water content."
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {[
          'Smarter your money',
          'Intelligence > Advice',
          'No shaming',
          'Trust lift',
        ].map((tag) => (
          <span
            key={tag}
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
            style={{
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              color: 'var(--accent)',
              border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Link to full about */}
      <a
        href="/about"
        className="inline-block text-xs font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--accent)' }}
      >
        了解更多 →
      </a>
    </aside>
  );
}
