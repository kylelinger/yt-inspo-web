"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearAdminKey, getAdminKey, setAdminKey } from "@/lib/auth";

interface AuthContextType {
  isAdmin: boolean;
  adminKey: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  adminKey: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [adminKey, setKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get("key");
    const logoutParam = params.get("logout");

    // Support ?logout=1 to drop admin privilege quickly for testing.
    if (logoutParam === "1" || logoutParam === "true") {
      clearAdminKey();
      setKey(null);

      const url = new URL(window.location.href);
      url.searchParams.delete("logout");
      window.history.replaceState({}, "", url.toString());
      setMounted(true);
      return;
    }

    if (keyParam) {
      setAdminKey(keyParam);
      setKey(keyParam);

      const url = new URL(window.location.href);
      url.searchParams.delete("key");
      window.history.replaceState({}, "", url.toString());
    } else {
      const stored = getAdminKey();
      setKey(stored);
    }

    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const isAdmin = adminKey === "slime";

  return (
    <AuthContext.Provider value={{ isAdmin, adminKey }}>
      {children}
    </AuthContext.Provider>
  );
}
