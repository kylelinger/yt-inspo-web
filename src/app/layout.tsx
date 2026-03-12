import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HydrateProvider } from "@/components/HydrateProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BrandCut — 每日品牌广告灵感",
  description: "AI-curated brand ad inspiration, daily at 10:00 Beijing time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} antialiased`}>
        {/* Nav */}
        <nav
          className="sticky top-0 z-50 border-b backdrop-blur-lg"
          style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)" }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
            <a href="/" className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-black text-white"
                style={{ background: "var(--accent)" }}
              >
                B
              </div>
              <span className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>
                BrandCut
              </span>
            </a>
            <div className="flex items-center gap-6 text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              <a href="/" className="transition-colors hover:text-[var(--text)]">Today</a>
              <a href="/archive" className="transition-colors hover:text-[var(--text)]">Archive</a>
              <a href="/archive/foundation" className="transition-colors hover:text-[var(--text)]">Foundation</a>
              <a href="/shortlist" className="transition-colors hover:text-[var(--text)]">Saved</a>
              <a href="/about" className="transition-colors hover:text-[var(--text)]">About</a>
              <a href="/admin" className="transition-colors hover:text-[var(--text)]" title="Admin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>

        <HydrateProvider>
          <main className="mx-auto max-w-6xl px-6 py-8">
            {children}
          </main>
        </HydrateProvider>

        {/* Footer */}
        <footer className="border-t mt-16 py-8" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-black text-white"
                  style={{ background: "var(--accent)" }}
                >
                  B
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  BrandCut · AI-curated brand ad inspiration
                </span>
              </div>
              <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Updated daily at 10:00 BJT</span>
                <span>·</span>
                <span>Part of M公司 brand project</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
