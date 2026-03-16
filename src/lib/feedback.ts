"use client";

import type { FeedbackEntry } from "./types";
import { getAdminKey } from "./auth";

const FEEDBACK_COUNTS_KEY = "yt_inspo_feedback_counts";
const SHORTLIST_KEY = "yt_inspo_shortlist";

export type FeedbackCounts = Record<string, { thumbsup: number; thumbsdown: number; score: number }>;

function lsGetFeedbackCounts(): FeedbackCounts {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_COUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}
function lsSetFeedbackCounts(counts: FeedbackCounts) {
  localStorage.setItem(FEEDBACK_COUNTS_KEY, JSON.stringify(counts));
}
function lsGetShortlist(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(SHORTLIST_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function lsSetShortlist(sl: Set<string>) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...sl]));
}

let _kvAvailable: boolean | null = null;

async function postAction(videoId: string, action: string): Promise<{
  ok: boolean;
  state?: { feedbackCounts: FeedbackCounts; feedback: Record<string, "thumbsup" | "thumbsdown">; shortlist: string[] };
}> {
  try {
    const adminKey = getAdminKey();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (adminKey) headers["x-admin-key"] = adminKey;

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers,
      body: JSON.stringify({ videoId, action }),
    });
    const data = await res.json();
    if (_kvAvailable === null) _kvAvailable = data.kv ?? false;
    return { ok: data.ok && data.kv, state: data.state };
  } catch (err) {
    console.error("POST /api/feedback failed:", err);
    _kvAvailable = false;
    return { ok: false };
  }
}

export async function fetchRemoteFeedback(): Promise<{
  feedbackCounts: FeedbackCounts;
  feedback: Record<string, "thumbsup" | "thumbsdown">;
  shortlist: string[];
  kv: boolean;
}> {
  try {
    const url = `/api/feedback?_t=${Date.now()}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    const data = await res.json();
    _kvAvailable = data.kv ?? false;
    return {
      feedbackCounts: data.feedbackCounts || {},
      feedback: data.feedback || {},
      shortlist: data.shortlist || [],
      kv: !!data.kv,
    };
  } catch (err) {
    console.error("GET /api/feedback failed:", err);
    _kvAvailable = false;
    return { feedbackCounts: {}, feedback: {}, shortlist: [], kv: false };
  }
}

export function getFeedbackCounts(): FeedbackCounts {
  return lsGetFeedbackCounts();
}

// Legacy compatibility: derive per-video dominant sentiment.
export function getFeedback(): Record<string, "thumbsup" | "thumbsdown"> {
  const counts = lsGetFeedbackCounts();
  const out: Record<string, "thumbsup" | "thumbsdown"> = {};
  for (const [id, c] of Object.entries(counts)) {
    if (c.thumbsup > c.thumbsdown) out[id] = "thumbsup";
    else if (c.thumbsdown > c.thumbsup) out[id] = "thumbsdown";
  }
  return out;
}

export function getShortlist(): Set<string> {
  return lsGetShortlist();
}

export async function setFeedback(videoId: string, action: "thumbsup" | "thumbsdown"): Promise<FeedbackCounts> {
  const result = await postAction(videoId, action);
  if (!result.ok || !result.state) {
    const local = lsGetFeedbackCounts();
    const curr = local[videoId] || { thumbsup: 0, thumbsdown: 0, score: 0 };
    if (action === "thumbsup") curr.thumbsup += 1;
    else curr.thumbsdown += 1;
    curr.score = curr.thumbsup - curr.thumbsdown;
    local[videoId] = curr;
    lsSetFeedbackCounts(local);
    window.dispatchEvent(new Event("feedback-changed"));
    return local;
  }

  lsSetFeedbackCounts(result.state.feedbackCounts || {});
  lsSetShortlist(new Set(result.state.shortlist || []));
  window.dispatchEvent(new Event("feedback-changed"));
  return result.state.feedbackCounts || {};
}

export async function toggleShortlist(videoId: string): Promise<Set<string>> {
  const sl = lsGetShortlist();
  const action = sl.has(videoId) ? "remove_shortlist" : "shortlist";
  const result = await postAction(videoId, action);

  if (!result.ok || !result.state) {
    if (sl.has(videoId)) sl.delete(videoId);
    else sl.add(videoId);
    lsSetShortlist(sl);
    window.dispatchEvent(new Event("feedback-changed"));
    return sl;
  }

  lsSetFeedbackCounts(result.state.feedbackCounts || {});
  lsSetShortlist(new Set(result.state.shortlist || []));
  window.dispatchEvent(new Event("feedback-changed"));
  return new Set(result.state.shortlist || []);
}

export async function hydrateFromRemote(): Promise<void> {
  const remote = await fetchRemoteFeedback();
  if (!remote.kv) return;
  lsSetFeedbackCounts(remote.feedbackCounts || {});
  lsSetShortlist(new Set(remote.shortlist || []));
  window.dispatchEvent(new Event("feedback-changed"));
}

export function getAllFeedbackEntries(): FeedbackEntry[] {
  const counts = getFeedbackCounts();
  const sl = getShortlist();
  const entries: FeedbackEntry[] = [];
  for (const [id, c] of Object.entries(counts)) {
    if (c.thumbsup > c.thumbsdown) entries.push({ videoId: id, action: "thumbsup", timestamp: new Date().toISOString() });
    else if (c.thumbsdown > c.thumbsup) entries.push({ videoId: id, action: "thumbsdown", timestamp: new Date().toISOString() });
  }
  for (const id of sl) entries.push({ videoId: id, action: "shortlist", timestamp: new Date().toISOString() });
  return entries;
}
