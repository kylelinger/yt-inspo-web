"use client";

import type { FeedbackEntry } from "./types";
import { getAdminKey } from "./auth";

const FEEDBACK_KEY = "yt_inspo_feedback";
const SHORTLIST_KEY = "yt_inspo_shortlist";

// ─── localStorage helpers ───────────────────────────────────────────────────

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

// ─── KV-backed API helpers (best-effort, falls back to localStorage) ─────────

let _kvAvailable: boolean | null = null; // cached after first probe

async function postAction(videoId: string, action: string): Promise<boolean> {
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
    return data.ok && data.kv;
  } catch {
    _kvAvailable = false;
    return false;
  }
}

export async function fetchRemoteFeedback(): Promise<{
  feedback: Record<string, 'thumbsup' | 'thumbsdown'>;
  shortlist: string[];
  kv: boolean;
}> {
  try {
    const res = await fetch('/api/feedback', {
      cache: 'no-store', // Force fresh data, no browser cache
    });
    const data = await res.json();
    _kvAvailable = data.kv ?? false;
    return data;
  } catch {
    _kvAvailable = false;
    return { feedback: {}, shortlist: [], kv: false };
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getFeedback(): Record<string, 'thumbsup' | 'thumbsdown'> {
  return lsGetFeedback();
}

export async function setFeedback(
  videoId: string,
  action: 'thumbsup' | 'thumbsdown'
): Promise<Record<string, 'thumbsup' | 'thumbsdown'>> {
  // Optimistic local update
  const fb = lsGetFeedback();
  if (fb[videoId] === action) {
    delete fb[videoId];
  } else {
    fb[videoId] = action;
  }
  lsSetFeedback(fb);

  // Mark this action as pending (for race condition handling)
  const pending = JSON.parse(localStorage.getItem('yt_inspo_pending_actions') || '{}');
  pending[videoId] = { action, timestamp: Date.now() };
  localStorage.setItem('yt_inspo_pending_actions', JSON.stringify(pending));

  // Async sync to KV (await to ensure write completes)
  try {
    await postAction(videoId, action);
    // Clear pending marker after successful write
    const updatedPending = JSON.parse(localStorage.getItem('yt_inspo_pending_actions') || '{}');
    delete updatedPending[videoId];
    localStorage.setItem('yt_inspo_pending_actions', JSON.stringify(updatedPending));
  } catch (err) {
    console.error('Failed to sync feedback to KV:', err);
  }

  return fb;
}

export function getShortlist(): Set<string> {
  return lsGetShortlist();
}

export async function toggleShortlist(videoId: string): Promise<Set<string>> {
  const sl = lsGetShortlist();
  const action = sl.has(videoId) ? 'remove_shortlist' : 'shortlist';
  
  if (sl.has(videoId)) {
    sl.delete(videoId);
  } else {
    sl.add(videoId);
  }
  lsSetShortlist(sl);

  // Mark as pending
  const pending = JSON.parse(localStorage.getItem('yt_inspo_pending_actions') || '{}');
  pending[videoId] = { action, timestamp: Date.now() };
  localStorage.setItem('yt_inspo_pending_actions', JSON.stringify(pending));

  // Sync to KV
  try {
    await postAction(videoId, action);
    // Clear pending marker
    const updatedPending = JSON.parse(localStorage.getItem('yt_inspo_pending_actions') || '{}');
    delete updatedPending[videoId];
    localStorage.setItem('yt_inspo_pending_actions', JSON.stringify(updatedPending));
  } catch (err) {
    console.error('Failed to sync shortlist to KV:', err);
  }

  return sl;
}

/** Call on app mount to hydrate localStorage from KV (so cross-device state syncs) */
export async function hydrateFromRemote(): Promise<void> {
  const remote = await fetchRemoteFeedback();
  if (!remote.kv) return; // no KV configured — stay with localStorage

  // Smart merge: remote wins, except for very recent local actions
  const pending = JSON.parse(localStorage.getItem('yt_inspo_pending_actions') || '{}');
  const now = Date.now();
  const PENDING_THRESHOLD = 5000; // 5 seconds

  const mergedFeedback = { ...remote.feedback };
  const mergedShortlist = new Set(remote.shortlist);
  const localFb = lsGetFeedback();
  const localSl = lsGetShortlist();
  
  // Keep local pending actions if they're very recent (race condition protection)
  for (const [videoId, entry] of Object.entries(pending) as [string, any][]) {
    if (now - entry.timestamp < PENDING_THRESHOLD) {
      // This action is fresh, keep local version
      if (entry.action === 'thumbsup' || entry.action === 'thumbsdown') {
        if (localFb[videoId]) {
          mergedFeedback[videoId] = localFb[videoId];
        } else {
          delete mergedFeedback[videoId]; // User toggled it off
        }
      } else if (entry.action === 'shortlist') {
        mergedShortlist.add(videoId);
      } else if (entry.action === 'remove_shortlist') {
        mergedShortlist.delete(videoId);
      }
    }
  }

  lsSetFeedback(mergedFeedback as Record<string, 'thumbsup' | 'thumbsdown'>);
  lsSetShortlist(mergedShortlist);
  
  // Clean up old pending actions (they should be synced by now)
  const cleanedPending: Record<string, any> = {};
  for (const [videoId, entry] of Object.entries(pending) as [string, any][]) {
    if (now - entry.timestamp < PENDING_THRESHOLD) {
      cleanedPending[videoId] = entry;
    }
  }
  localStorage.setItem('yt_inspo_pending_actions', JSON.stringify(cleanedPending));
  
  // Dispatch event to update UI
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
