"use client";

import { useState, useEffect } from "react";
import type { Video } from "@/lib/types";
import { getFeedback, setFeedback, getShortlist, toggleShortlist } from "@/lib/feedback";

function formatDuration(s: number | undefined): string | null {
  if (!s) return null;
  if (s >= 60) return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return `0:${String(s).padStart(2, '0')}`;
}

function YouTubeThumbnail({ videoId, duration }: { videoId: string; duration?: string | null }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg" style={{ background: 'var(--border)' }}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      {duration && (
        <div className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
          {duration}
        </div>
      )}
    </div>
  );
}

export default function VideoCard({ video, compact = false, onFeedbackChange }: { video: Video; compact?: boolean; onFeedbackChange?: () => void }) {
  const [fb, setFb] = useState<Record<string, 'thumbsup' | 'thumbsdown'>>({});
  const [sl, setSl] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFb(getFeedback());
    setSl(getShortlist());
    setMounted(true);
  }, []);

  const handleFeedback = async (action: 'thumbsup' | 'thumbsdown') => {
    const newFb = await setFeedback(video.id, action);
    setFb({ ...newFb });
    onFeedbackChange?.();
  };

  const handleShortlist = async () => {
    const newSl = await toggleShortlist(video.id);
    setSl(new Set(newSl));
    onFeedbackChange?.();
  };

  const currentFb = fb[video.id];
  const isShortlisted = sl.has(video.id);
  const displayTitle = video.title || video.brand || video.id;

  return (
    <div
      className="group rounded-xl border transition-shadow hover:shadow-md"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <a href={`/video/${video.id}`} className="block">
        <YouTubeThumbnail videoId={video.id} duration={formatDuration(video.duration_s)} />
      </a>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <a href={`/video/${video.id}`} className="block flex-1">
            <h3 className="font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
              {video.status === 'playback_risky' && <span title="可能不可播放" className="mr-1 text-xs opacity-60">⚠️</span>}
              {displayTitle}
            </h3>
          </a>
          {video.brand && (
            <span
              className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)' }}
            >
              {video.brand}
            </span>
          )}
        </div>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {video.tag && (
            <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{
              background: video.tag === 'B1' ? 'color-mix(in srgb, #f59e0b 15%, transparent)' :
                          video.tag === 'B2' ? 'color-mix(in srgb, #3b82f6 15%, transparent)' :
                          video.tag === 'A' ? 'color-mix(in srgb, #a855f7 15%, transparent)' :
                          'color-mix(in srgb, #6b7280 15%, transparent)',
              color: video.tag === 'B1' ? '#f59e0b' :
                     video.tag === 'B2' ? '#3b82f6' :
                     video.tag === 'A' ? '#a855f7' : '#9ca3af',
            }}>
              {video.tag === 'B1' ? '🎯 直接竞品' :
               video.tag === 'B2' ? '💰 金融品牌' :
               video.tag === 'A' ? '✨ 审美标杆' : '🎨 文化参考'}
            </span>
          )}
          {video.breakdown && (
            <span className="rounded px-1.5 py-0.5 text-xs font-medium" style={{ background: 'color-mix(in srgb, var(--accent) 8%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
              📐 拆解
            </span>
          )}
        </div>

        {!compact && video.why && (
          <p className="mb-3 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
            {video.why}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {video.date_added}
          </span>
          {mounted && (
            <div className="flex gap-1">
              <button
                onClick={(e) => { e.preventDefault(); handleFeedback('thumbsup'); }}
                className="rounded-lg px-2.5 py-1.5 text-sm transition-all hover:scale-105"
                style={{
                  background: currentFb === 'thumbsup'
                    ? 'color-mix(in srgb, var(--green) 20%, transparent)'
                    : 'transparent',
                  color: currentFb === 'thumbsup' ? 'var(--green)' : 'var(--text-muted)',
                }}
                title="👍"
              >
                👍
              </button>
              <button
                onClick={(e) => { e.preventDefault(); handleFeedback('thumbsdown'); }}
                className="rounded-lg px-2.5 py-1.5 text-sm transition-all hover:scale-105"
                style={{
                  background: currentFb === 'thumbsdown'
                    ? 'color-mix(in srgb, var(--red) 20%, transparent)'
                    : 'transparent',
                  color: currentFb === 'thumbsdown' ? 'var(--red)' : 'var(--text-muted)',
                }}
                title="👎"
              >
                👎
              </button>
              <button
                onClick={(e) => { e.preventDefault(); handleShortlist(); }}
                className="rounded-lg px-2.5 py-1.5 text-sm transition-all hover:scale-105"
                style={{
                  background: isShortlisted
                    ? 'color-mix(in srgb, var(--yellow) 20%, transparent)'
                    : 'transparent',
                  color: isShortlisted ? 'var(--yellow)' : 'var(--text-muted)',
                }}
                title="收藏"
              >
                ⭐
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
