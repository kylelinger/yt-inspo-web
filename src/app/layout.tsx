import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yt-brand-inspo",
  description: "每日品牌广告灵感",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} antialiased`}>
        <nav className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 80%, transparent)' }}>
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <a href="/" className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
              yt-brand-inspo
            </a>
            <div className="flex gap-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              <a href="/" className="hover:opacity-80 transition-opacity">Today</a>
              <a href="/archive" className="hover:opacity-80 transition-opacity">Archive</a>
              <a href="/shortlist" className="hover:opacity-80 transition-opacity">收藏</a>
              <a href="/about" className="hover:opacity-80 transition-opacity">About</a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-4xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
