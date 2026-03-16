import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { HydrateProvider } from "@/components/HydrateProvider";
import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import FooterStats from "@/components/FooterStats";
import { normalizeLang, tr } from "@/lib/language";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = normalizeLang((await cookies()).get("bp_lang")?.value);

  return (
    <html lang={lang === "cn" ? "zh" : "en"} className="dark">
      <body className={`${brHendrix.className} ${brHendrix.variable} antialiased`}>
        <AuthProvider>
          <NavBar initialLang={lang} />
          <div className="h-20" />
          <HydrateProvider>
            <main>{children}</main>
          </HydrateProvider>
        </AuthProvider>

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
              <h2 className="text-sm sm:text-2xl font-black tracking-tight text-black text-center sm:text-left leading-tight">
                {tr(lang, "Craft taste. Ship signal.", "打磨品味，输出信号。")}
              </h2>
              <FooterStats initialLang={lang} />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
