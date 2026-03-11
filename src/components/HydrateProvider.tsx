"use client";

import { useEffect } from "react";
import { hydrateFromRemote } from "@/lib/feedback";

/** Silently syncs KV → localStorage on first mount (no-op if KV not configured). */
export function HydrateProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateFromRemote().catch(() => {/* swallow */});
  }, []);
  return <>{children}</>;
}
