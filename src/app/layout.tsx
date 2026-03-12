import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HydrateProvider } from "@/components/HydrateProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BrandCut \u2014 Daily Brand Ad Inspiration",
  description: "AI-curated brand ad inspiration, daily at 10:00 Beijing time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark">
      <body className={`${inter.className} antialiased`}>
        {/* ─── Nav (Robinhood-style: minimal, floating) ─── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
          style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
                style={{ background: "var(--accent)" }}
              >
                B
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                BrandCut
              </span>
            </a>
            <div className="flex items-center gap-8 text-[13px] font-medium text-[#888]">
              {[
                { href: "/", label: "Today" },
                { href: "/archive", label: "Archive" },
                { href: "/archive/foundation", label: "Foundation" },
                { href: "/shortlist", label: "Saved" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a href="/admin" className="transition-colors hover:text-white" title="Admin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>

        {/* Spacer for fixed nav */}
        <div className="h-16" />

        <HydrateProvider>
          <main>
            {children}
          </main>
        </HydrateProvider>

        {/* ─── Footer (Robinhood-style: accent band + giant brand) ─── */}
        <footer>
          {/* Accent band */}
          <div className="section-full" style={{ background: "var(--accent)" }}>
            <div className="section-inner flex flex-col items-center py-16 text-center">
              <h2 className="display-md text-black">
                Build taste,<br />not just campaigns.
              </h2>
              <a
                href="/about"
                className="mt-6 inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Dark bottom */}
          <div className="section-full" style={{ background: "#080808" }}>
            <div className="section-inner py-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4 text-xs text-[#555]">
                    <span>Updated daily at 10:00 BJT</span>
                    <span>&middot;</span>
                    <span>Part of M\u516C\u53F8 brand project</span>
                  </div>
                  <div className="flex gap-6 text-xs text-[#444]">
                    <a href="/" className="hover:text-[#888]">Today</a>
                    <a href="/archive" className="hover:text-[#888]">Archive</a>
                    <a href="/about" className="hover:text-[#888]">About</a>
                    <a href="/admin" className="hover:text-[#888]">Admin</a>
                  </div>
                </div>
              </div>

              {/* Giant brand name */}
              <div
                className="mt-12 overflow-hidden select-none"
                style={{
                  fontSize: "clamp(4rem, 15vw, 12rem)",
                  fontWeight: 900,
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  color: "#151515",
                }}
              >
                BrandCut
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
