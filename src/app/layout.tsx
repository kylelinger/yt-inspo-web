import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HydrateProvider } from "@/components/HydrateProvider";
import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";

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
        <AuthProvider>
          <NavBar />
          <div className="h-14" />
          <HydrateProvider>
            <main>{children}</main>
          </HydrateProvider>
        </AuthProvider>

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
          <div className="section-full section-accent min-h-14">
            <div className="section-inner h-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 py-3 sm:py-0 sm:h-14">
              <h2 className="text-sm sm:text-2xl font-black tracking-tight text-black text-center sm:text-left leading-tight">Build taste, not just campaigns.</h2>
              <a href="/about" className="bg-black px-6 py-2 text-sm font-bold text-white transition-transform hover:scale-105 shrink-0">
                Learn more
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
