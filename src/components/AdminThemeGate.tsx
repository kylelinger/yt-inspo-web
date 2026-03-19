"use client";

import { useEffect } from "react";

export default function AdminThemeGate() {
  // This deployment is the ADMIN branch.
  // Always apply admin-theme styling.
  useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => document.body.classList.remove("admin-theme");
  }, []);

  return null;
}
