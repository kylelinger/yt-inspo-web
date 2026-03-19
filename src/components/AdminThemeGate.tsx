"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function AdminThemeGate() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) document.body.classList.add("admin-theme");
    else document.body.classList.remove("admin-theme");

    return () => document.body.classList.remove("admin-theme");
  }, [isAdmin]);

  return null;
}
