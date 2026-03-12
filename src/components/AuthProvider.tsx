"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAdminKey, setAdminKey } from "@/lib/auth";

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
    // Check URL param ?key=xxx
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('key');
    
    if (keyParam) {
      setAdminKey(keyParam);
      setKey(keyParam);
      // Clean URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('key');
      window.history.replaceState({}, '', url.toString());
    } else {
      // Check localStorage
      const stored = getAdminKey();
      setKey(stored);
    }
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={{ isAdmin: !!adminKey, adminKey }}>
      {children}
    </AuthContext.Provider>
  );
}
