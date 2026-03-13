import { NextRequest, NextResponse } from "next/server";

/**
 * Feedback API using GitHub Contents API as persistence layer.
 *
 * Why GitHub?
 * - Strong consistency (no CDN caching like Vercel Blob)
 * - Zero new services (already have gh auth)
 * - Free (within GitHub API rate limits: 5000 req/hr)
 * - Atomic read-modify-write via SHA-based optimistic locking
 *
 * Requires: GITHUB_TOKEN env var (personal access token with repo scope)
 * File stored at: data/feedback.json in the repo
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "kylelinger";
const REPO_NAME = "yt-inspo-web";
const FILE_PATH = "data/feedback.json";
const BRANCH = "main";

const GITHUB_AVAILABLE = !!GITHUB_TOKEN;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

interface FeedbackState {
  feedback: Record<string, "thumbsup" | "thumbsdown">;
  shortlist: string[];
}

const EMPTY_STATE: FeedbackState = { feedback: {}, shortlist: [] };

/**
 * Read feedback state from GitHub.
 * Returns { state, sha } where sha is needed for updates (optimistic locking).
 */
async function readFromGitHub(): Promise<{
  state: FeedbackState;
  sha: string | null;
}> {
  if (!GITHUB_TOKEN) return { state: EMPTY_STATE, sha: null };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}&_t=${Date.now()}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "If-None-Match": "", // Bypass GitHub API caching
        },
        cache: "no-store",
      }
    );

    if (res.status === 404) {
      // File doesn't exist yet — first write will create it
      return { state: EMPTY_STATE, sha: null };
    }

    if (!res.ok) {
      console.error("GitHub read error:", res.status, await res.text());
      return { state: EMPTY_STATE, sha: null };
    }

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const state = JSON.parse(content) as FeedbackState;
    return { state, sha: data.sha };
  } catch (e) {
    console.error("GitHub read exception:", e);
    return { state: EMPTY_STATE, sha: null };
  }
}

/**
 * Write feedback state to GitHub.
 * Uses SHA for optimistic locking (prevents lost updates).
 */
async function writeToGitHub(
  state: FeedbackState,
  sha: string | null
): Promise<{ ok: boolean; error?: string }> {
  if (!GITHUB_TOKEN) return { ok: false, error: "GitHub token not configured" };

  try {
    const content = Buffer.from(
      JSON.stringify(state, null, 2),
      "utf-8"
    ).toString("base64");

    const body: Record<string, unknown> = {
      message: `chore: update feedback state [auto]`,
      content,
      branch: BRANCH,
    };

    // Include SHA for update (required for existing files)
    if (sha) {
      body.sha = sha;
    }

    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("GitHub write error:", res.status, errText);

      // SHA conflict — retry once with fresh SHA
      if (res.status === 409) {
        const fresh = await readFromGitHub();
        if (fresh.sha) {
          return writeToGitHub(state, fresh.sha);
        }
      }
      return { ok: false, error: `GitHub API ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GitHub write exception:", msg);
    return { ok: false, error: msg };
  }
}

// ─── GET /api/feedback ──────────────────────────────────────────────────────

export async function GET() {
  const { state } = await readFromGitHub();
  return NextResponse.json(
    { ...state, kv: GITHUB_AVAILABLE },
    { headers: NO_CACHE_HEADERS }
  );
}

// ─── POST /api/feedback ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!GITHUB_AVAILABLE) {
    return NextResponse.json({ ok: true, kv: false });
  }

  // Auth check
  const adminKey = process.env.ADMIN_KEY?.trim();
  const authHeader = req.headers.get("x-admin-key");
  if (adminKey && authHeader !== adminKey) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const { videoId, action } = await req.json();
  if (!videoId || !action) {
    return NextResponse.json(
      { ok: false, error: "missing fields" },
      { status: 400 }
    );
  }

  // Read current state (with SHA for atomic update)
  const { state, sha } = await readFromGitHub();

  // Apply mutation
  if (action === "shortlist") {
    if (!state.shortlist.includes(videoId)) state.shortlist.push(videoId);
  } else if (action === "remove_shortlist") {
    state.shortlist = state.shortlist.filter((id) => id !== videoId);
  } else if (action === "thumbsup" || action === "thumbsdown") {
    if (state.feedback[videoId] === action) {
      delete state.feedback[videoId]; // Toggle off
    } else {
      state.feedback[videoId] = action;
    }
  } else if (action === "clear") {
    delete state.feedback[videoId];
  }

  // Write back (atomic via SHA)
  const result = await writeToGitHub(state, sha);

  return NextResponse.json({
    ...result,
    kv: true,
    state,
  });
}
