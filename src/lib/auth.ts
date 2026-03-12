"use client";

const AUTH_KEY = "yt_inspo_admin_key";

export function getAdminKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEY);
}

export function setAdminKey(key: string): void {
  localStorage.setItem(AUTH_KEY, key);
}

export function clearAdminKey(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAdmin(): boolean {
  return !!getAdminKey();
}
