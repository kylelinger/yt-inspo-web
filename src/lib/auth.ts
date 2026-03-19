"use client";

// This is the ADMIN branch deployment.
// Always return "admin" token so the API knows this is an admin request.

export function getAdminKey(): string {
  return "admin";
}

export function setAdminKey(key: string): void {
  // No-op on admin branch
}

export function clearAdminKey(): void {
  // No-op on admin branch
}

export function isAdmin(): boolean {
  return true;
}
