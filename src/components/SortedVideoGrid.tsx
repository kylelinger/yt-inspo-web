"use client";

import { useState, useEffect, useMemo } from "react";
import type { Video } from "@/lib/types";
import VideoCard from "./VideoCard";
import { getFeedback } from "@/lib/feedback";

export default function SortedVideoGrid({ videos }: { videos: Video[] }) {
  const [fb, setFb] = useState<Record<string, "thumbsup" | "thumbsdown">>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFb(getFeedback());
    setMounted(true);

    // Re-read feedback when localStorage changes (from VideoCard interactions)
    const handler = () => setFb(getFeedback());
    window.addEventListener("feedback-changed", handler);
    return () => window.removeEventListener("feedback-changed", handler);
  }, []);

  const sorted = useMemo(() => {
    if (!mounted) return videos;
    return [...videos].sort((a, b) => {
      const scoreA = fb[a.id] === "thumbsup" ? 1 : fb[a.id] === "thumbsdown" ? -1 : 0;
      const scoreB = fb[b.id] === "thumbsup" ? 1 : fb[b.id] === "thumbsdown" ? -1 : 0;
      return scoreB - scoreA; // 👍 first, 👎 last
    });
  }, [videos, fb, mounted]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sorted.map((v) => (
        <VideoCard key={v.id} video={v} onFeedbackChange={() => setFb(getFeedback())} />
      ))}
    </div>
  );
}
