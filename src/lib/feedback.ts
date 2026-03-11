"use client";

import type { FeedbackEntry } from "./types";

const FEEDBACK_KEY = "yt_inspo_feedback";
const SHORTLIST_KEY = "yt_inspo_shortlist";

export function getFeedback(): Record<string, 'thumbsup' | 'thumbsdown'> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '{}');
  } catch { return {}; }
}

export function setFeedback(videoId: string, action: 'thumbsup' | 'thumbsdown') {
  const fb = getFeedback();
  if (fb[videoId] === action) {
    // Toggle off
    delete fb[videoId];
  } else {
    fb[videoId] = action;
  }
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(fb));
  return fb;
}

export function getShortlist(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(SHORTLIST_KEY) || '[]'));
  } catch { return new Set(); }
}

export function toggleShortlist(videoId: string): Set<string> {
  const sl = getShortlist();
  if (sl.has(videoId)) {
    sl.delete(videoId);
  } else {
    sl.add(videoId);
  }
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...sl]));
  return sl;
}

export function getAllFeedbackEntries(): FeedbackEntry[] {
  const fb = getFeedback();
  const sl = getShortlist();
  const entries: FeedbackEntry[] = [];
  for (const [id, action] of Object.entries(fb)) {
    entries.push({ videoId: id, action, timestamp: new Date().toISOString() });
  }
  for (const id of sl) {
    entries.push({ videoId: id, action: 'shortlist', timestamp: new Date().toISOString() });
  }
  return entries;
}
