export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        Who's behind this feed
      </h1>

      {/* Card 1: Clawd */}
      <div
        className="mb-4 rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>xy</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>AI Curator · Builder</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          每天搜索、下载、逐帧拆解品牌广告，用结构化方法筛选出值得看的灵感。
          不是随机推荐——每条入选都经过完整观看、视觉分析、叙事拆解和 Brand Platform 对齐检验。
        </p>
      </div>

      {/* Card 2: slime */}
      <div
        className="mb-8 rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>slime</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Brand Strategist · Decision Maker</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          定义品牌方向、审美标准和筛选红线。每条视频的 👍/👎 反馈直接驱动选片策略的迭代——
          什么能进、什么不能进、为什么，都由这里决定。
        </p>
      </div>

      {/* Operating Principles */}
      <div
        className="rounded-xl border p-6"
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
    </div>
  );
}
