"use client";

import type { FeedbackEntry } from "./types";
import { getAdminKey } from "./auth";

const FEEDBACK_KEY = "yt_inspo_feedback";
const SHORTLIST_KEY = "yt_inspo_shortlist";

// ─── localStorage helpers (now only used as cache) ──────────────────────────

function lsGetFeedback(): Record<string, 'thumbsup' | 'thumbsdown'> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '{}'); } catch { return {}; }
}
function lsSetFeedback(fb: Record<string, 'thumbsup' | 'thumbsdown'>) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(fb));
}
function lsGetShortlist(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(SHORTLIST_KEY) || '[]')); } catch { return new Set(); }
}
function lsSetShortlist(sl: Set<string>) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...sl]));
}

// ─── KV API (server is the single source of truth) ──────────────────────────

let _kvAvailable: boolean | null = null;

async function postAction(videoId: string, action: string): Promise<{
  ok: boolean;
  state?: { feedback: Record<string, 'thumbsup' | 'thumbsdown'>; shortlist: string[] };
}> {
  try {
    const adminKey = getAdminKey();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminKey) {
      headers['x-admin-key'] = adminKey;
    }
    
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers,
      body: JSON.stringify({ videoId, action }),
    });
    const data = await res.json();
    if (_kvAvailable === null) _kvAvailable = data.kv ?? false;
    return { ok: data.ok && data.kv, state: data.state };
  } catch (err) {
    console.error('POST /api/feedback failed:', err);
    _kvAvailable = false;
    return { ok: false };
  }
}

export async function fetchRemoteFeedback(): Promise<{
  feedback: Record<string, 'thumbsup' | 'thumbsdown'>;
  shortlist: string[];
  kv: boolean;
}> {
  try {
    // Add timestamp to URL to force fresh fetch (bypass any browser/CDN cache)
    const url = `/api/feedback?_t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    const data = await res.json();
    _kvAvailable = data.kv ?? false;
    return data;
  } catch (err) {
    console.error('GET /api/feedback failed:', err);
    _kvAvailable = false;
    return { feedback: {}, shortlist: [], kv: false };
  }
}

// ─── Public API (server-first, localStorage is cache only) ──────────────────

/** Get current feedback (from localStorage cache) */
export function getFeedback(): Record<string, 'thumbsup' | 'thumbsdown'> {
  return lsGetFeedback();
}

/** Get current shortlist (from localStorage cache) */
export function getShortlist(): Set<string> {
  return lsGetShortlist();
}

/**
 * Set feedback (thumbsup/thumbsdown) - server-first approach
 * 1. POST to KV
 * 2. Use returned state (don't fetch again - avoid CDN cache delay)
 * 3. Update localStorage cache
 * 4. Trigger UI update
 */
export async function setFeedback(
  videoId: string,
  action: 'thumbsup' | 'thumbsdown'
): Promise<Record<string, 'thumbsup' | 'thumbsdown'>> {
  // POST to server
  const result = await postAction(videoId, action);
  
  if (!result.ok || !result.state) {
    // Fallback: use localStorage if KV not available
    const fb = lsGetFeedback();
    if (fb[videoId] === action) {
      delete fb[videoId];
    } else {
      fb[videoId] = action;
    }
    lsSetFeedback(fb);
    window.dispatchEvent(new Event('feedback-changed'));
    return fb;
  }

  // Use state returned by API (avoids CDN cache delay)
  const newState = result.state;
  
  // Update localStorage cache
  lsSetFeedback(newState.feedback as Record<string, 'thumbsup' | 'thumbsdown'>);
  lsSetShortlist(new Set(newState.shortlist));
  
  // Trigger UI update
  window.dispatchEvent(new Event('feedback-changed'));
  
  return newState.feedback as Record<string, 'thumbsup' | 'thumbsdown'>;
}

/**
 * Toggle shortlist - server-first approach
 * 1. POST to KV
 * 2. Use returned state (don't fetch again - avoid CDN cache delay)
 * 3. Update localStorage cache
 * 4. Trigger UI update
 */
export async function toggleShortlist(videoId: string): Promise<Set<string>> {
  // Determine action
  const sl = lsGetShortlist();
  const action = sl.has(videoId) ? 'remove_shortlist' : 'shortlist';
  
  // POST to server
  const result = await postAction(videoId, action);
  
  if (!result.ok || !result.state) {
    // Fallback: use localStorage if KV not available
    if (sl.has(videoId)) {
      sl.delete(videoId);
    } else {
      sl.add(videoId);
    }
    lsSetShortlist(sl);
    window.dispatchEvent(new Event('feedback-changed'));
    return sl;
  }

  // Use state returned by API (avoids CDN cache delay)
  const newState = result.state;
  
  // Update localStorage cache
  lsSetFeedback(newState.feedback as Record<string, 'thumbsup' | 'thumbsdown'>);
  lsSetShortlist(new Set(newState.shortlist));
  
  // Trigger UI update
  window.dispatchEvent(new Event('feedback-changed'));
  
  return new Set(newState.shortlist);
}

/**
 * Load state from server on app mount
 * Server is the single source of truth - localStorage is just a cache
 * 
 * API now returns fresh data with aggressive no-cache headers + timestamp cache busting
 * so we can safely hydrate on every mount without worrying about stale cache
 */
export async function hydrateFromRemote(): Promise<void> {
  const remote = await fetchRemoteFeedback();
  if (!remote.kv) return; // KV not available, use localStorage

  // Update from server (API guarantees fresh data)
  lsSetFeedback(remote.feedback as Record<string, 'thumbsup' | 'thumbsdown'>);
  lsSetShortlist(new Set(remote.shortlist));
  
  // Trigger UI update
  window.dispatchEvent(new Event('feedback-changed'));
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
