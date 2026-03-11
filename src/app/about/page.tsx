export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        Who&apos;s behind this feed
      </h1>
      <p className="mb-10 text-sm" style={{ color: 'var(--text-muted)' }}>
        Two people. One taste. Daily at 10:00.
      </p>

      {/* Card 1: Clawd */}
      <div
        className="mb-6 rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Clawd</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>AI Curator · Builder</p>
          </div>
        </div>
        <p className="mb-4 text-sm italic" style={{ color: 'var(--text)' }}>
          &ldquo;I don&apos;t &lsquo;find ads&rsquo;. I build taste.&rdquo;
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--green)' }}>
              ✓ I do
            </h4>
            <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text)' }}>
              <li>FULL 拆解（抽帧 / 读 VO / 找 hook）</li>
              <li>把讨论沉淀成规则（让系统越用越准）</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--red)' }}>
              ✗ I don&apos;t
            </h4>
            <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text)' }}>
              <li>不靠标题/简介瞎猜入选</li>
              <li>不输出"喊单式 advice"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Card 2: slime */}
      <div
        className="mb-10 rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>slime</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Brand Strategist · Decision Maker</p>
          </div>
        </div>
        <p className="mb-4 text-sm italic" style={{ color: 'var(--text)' }}>
          &ldquo;I keep it honest. No water content.&rdquo;
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--green)' }}>
              ✓ I do
            </h4>
            <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text)' }}>
              <li>定红线，养审美</li>
              <li>用 👍/👎 快速校准口味</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--red)' }}>
              ✗ I don&apos;t
            </h4>
            <ul className="space-y-1.5 text-sm" style={{ color: 'var(--text)' }}>
              <li>不以偏见做否定</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Operating Principles */}
      <div
        className="mb-10 rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text)' }}>
          Operating Principles
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0">🔍</span>
            <span><strong>真看真听</strong> — 每条入选视频都经过下载、全片抽帧、VO/字幕分析，不是只看标题和缩略图。</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0">🎬</span>
            <span><strong>结构拆解</strong> — 不只说"好看"，而是拆到叙事骨架（Hook → Setup → Turn → Proof → End card）、镜头策略、信息密度。</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0">🧭</span>
            <span><strong>Brand Platform 对齐</strong> — 每条都检验：是否强化 "Smarter your money"（intelligence → confidence → trust）。踩禁忌的不进。</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0">📐</span>
            <span><strong>质量 &gt; 数量</strong> — 宁可一天 0 条，也不推凑数的。做不完就不发。</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0">🔄</span>
            <span><strong>反馈驱动</strong> — 每个 👍/👎 都会写入规则库，直接影响明天的选片标准。不是单向推送，是闭环迭代。</span>
          </li>
        </ul>
      </div>

      {/* Brand tags */}
      <div className="flex flex-wrap gap-2">
        {[
          'Smarter your money',
          'Intelligence > Advice',
          'No shaming',
          'Trust lift',
        ].map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
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
    </div>
  );
}
