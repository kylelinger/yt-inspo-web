export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Who made this?
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          这个灵感库是一个 AI-human 协作实验——用 AI 做初筛和结构化拆解，用人类的审美做最终裁判。
        </p>
      </header>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Clawd */}
        <div
          className="rounded-xl border p-6"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <div className="mb-3 text-3xl">🧠</div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            xy (AI)
          </h2>
          <p className="mt-1 text-xs font-medium" style={{ color: "var(--accent)" }}>
            策展引擎 / Curation Engine
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            负责搜索、下载、抽帧分析、结构化拆解、去重与排期。
            每天北京时间 02:00 起开始准备，10:00 推送。
            所有判断都基于"完整观看"流程（下载原片 + 全片覆盖抽帧 + 读懂 VO/字幕）。
          </p>
        </div>

        {/* slime */}
        <div
          className="rounded-xl border p-6"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          <div className="mb-3 text-3xl">🎯</div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            slime (Human)
          </h2>
          <p className="mt-1 text-xs font-medium" style={{ color: "var(--accent)" }}>
            品味裁判 / Taste Judge
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            最终决策者。用 👍/👎 反馈持续校准 AI 的选片标准。
            擅长看穿创意骨架、辨别"真高级"与"装高级"。
            所有筛选硬闸门和品牌约束来自 slime 的判断。
          </p>
        </div>
      </div>

      {/* Operating Principles */}
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <h2 className="mb-4 text-lg font-bold" style={{ color: "var(--text)" }}>
          Operating Principles
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>01</span>
            <span><strong style={{ color: "var(--text)" }}>真看真听</strong>——不靠标题和关键词入选；每条必须完成下载 + 全片抽帧 + 读懂 VO/字幕的完整审计。</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>02</span>
            <span><strong style={{ color: "var(--text)" }}>宁缺毋滥</strong>——做不完就少发，绝不发未完整看完的条目。没有达标内容就暂停推送。</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>03</span>
            <span><strong style={{ color: "var(--text)" }}>品味校准 &gt; 产量</strong>——每一条 👍/👎 反馈都会沉淀为硬闸门规则，逐步收窄"什么值得看"。</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>04</span>
            <span><strong style={{ color: "var(--text)" }}>Brand Platform 约束</strong>——Smarter your money：intelligence → confidence → trust。禁止羞辱、禁止训话、禁止喊单、禁止黑箱。</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>05</span>
            <span><strong style={{ color: "var(--text)" }}>国际化审美</strong>——追求跨文化可读性与前沿 craft；过滤土味和低质模板。</span>
          </li>
        </ul>
      </div>

      {/* Credits */}
      <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        <p>Built with Next.js · Data curated daily · Hosted on Vercel</p>
        <p className="mt-1">Part of M公司 brand inspiration project</p>
      </div>
    </div>
  );
}
