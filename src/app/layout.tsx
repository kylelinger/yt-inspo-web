import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HydrateProvider } from "@/components/HydrateProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BrandCut",
  description: "AI-curated brand ad inspiration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark">
      <body className={`${inter.className} antialiased`}>
        {/* ─── Nav ─── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 border-b"
          style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)", backdropFilter: "blur(20px)" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 h-14">
            <a href="/" className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center text-xs font-black text-white"
                style={{ background: "var(--accent)" }}
              >
                B
              </div>
              <span className="text-[15px] font-bold tracking-tight text-white">BrandCut</span>
            </a>
            <div className="flex items-center gap-7 text-[13px] font-medium text-[#666]">
              {[
                { href: "/", label: "Today" },
                { href: "/archive", label: "Archive" },
                { href: "/archive/foundation", label: "Foundation" },
                { href: "/shortlist", label: "Saved" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <a key={link.href} href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              ))}
              <a href="/admin" className="text-[#444] transition-colors hover:text-white" title="Admin">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>

        <div className="h-14" />

        <HydrateProvider>
          <main>{children}</main>
        </HydrateProvider>

        {/* ─── Footer: dark bottom + accent band ─── */}
        <footer>
          <div className="section-full" style={{ background: "#000000" }}>
            <div className="section-inner py-10">
              <div
                className="mt-8 select-none overflow-hidden"
                style={{
                  fontSize: "clamp(4rem, 16vw, 14rem)",
                  fontWeight: 900,
                  lineHeight: 0.82,
                  letterSpacing: "-0.05em",
                  color: "#000000",
                }}
              >
                BrandCut
              </div>
            </div>
          </div>
          <div className="section-full section-accent h-14">
            <div className="section-inner h-full flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight text-black">Build taste, not just campaigns.</h2>
              <a href="/about" className="bg-black px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105">
                Learn more
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
