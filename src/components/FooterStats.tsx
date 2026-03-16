"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackCounts = Record<string, { thumbsup?: number; thumbsdown?: number }>;

export default function FooterStats({ visits }: { visits: number }) {
  const [counts, setCounts] = useState<FeedbackCounts>({});

  useEffect(() => {
    fetch(`/api/feedback?_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setCounts(data.feedbackCounts || {}))
      .catch(() => setCounts({}));
  }, []);

  const { up, down } = useMemo(() => {
    let up = 0;
    let down = 0;
    for (const c of Object.values(counts)) {
      up += Number(c.thumbsup || 0);
      down += Number(c.thumbsdown || 0);
    }
    return { up, down };
  }, [counts]);

  return (
    <div className="text-[11px] sm:text-xs font-semibold text-black/70 text-center sm:text-right leading-relaxed">
      访问量 {visits} · 👍 总数量 {up} · 👎 总数量 {down}
    </div>
  );
}
