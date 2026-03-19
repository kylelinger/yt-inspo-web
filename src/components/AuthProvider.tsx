"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // This deployment is the ADMIN branch.
  // Always run as admin.
  const isAdmin = true;

  return (
    <AuthContext.Provider value={{ isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
