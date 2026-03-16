import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HydrateProvider } from "@/components/HydrateProvider";
import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";

const brHendrix = localFont({
  src: [
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Regular Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Medium Italic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix SemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix SemiBold Italic.otf", weight: "600", style: "italic" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Bold Italic.otf", weight: "700", style: "italic" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Black.otf", weight: "900", style: "normal" },
    { path: "../../public/fonts/custom_upload/BR Hendrix/Brink - BR Hendrix Black Italic.otf", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-brand-en",
});

export const metadata: Metadata = {
  title: "Brand Pips",
  description: "AI-curated brand ad inspiration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className="dark">
      <body className={`${brHendrix.className} ${brHendrix.variable} antialiased`}>
        <AuthProvider>
          <NavBar />
          <div className="h-20" />
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
                Brand Pips
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
