"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getClientLang, setClientLang, tr, type Lang } from "@/lib/language";

export default function NavBar({ initialLang = "us" }: { initialLang?: Lang }) {
  const { isAdmin } = useAuth();
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    setLang(getClientLang());
  }, []);

  const links = useMemo(
    () =>
      isAdmin
        ? [
            { href: "/", label: tr(lang, "Today", "今日") },
            { href: "/videos", label: tr(lang, "All Videos", "全部视频") },
            { href: "/archive", label: tr(lang, "Archive", "往期") },
            { href: "/shortlist", label: tr(lang, "Saved", "收藏"), mobile: true },
            { href: "/archive/foundation", label: tr(lang, "Foundation", "地基"), mobile: false },
            { href: "/about", label: tr(lang, "About", "关于"), mobile: false },
          ]
        : [
            { href: "/", label: tr(lang, "Today", "今日") },
            { href: "/videos", label: tr(lang, "All Videos", "全部视频") },
            { href: "/archive", label: tr(lang, "Archive", "往期") },
          ],
    [isAdmin, lang]
  );

  const toggleLang = () => {
    const next: Lang = lang === "us" ? "cn" : "us";
    setClientLang(next);
    window.location.reload();
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ borderColor: "var(--nav-border)", background: "var(--nav-bg)", backdropFilter: "blur(20px)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 h-20">
        <a href="/" className="flex items-center gap-2 min-w-0">
          <img src="/logo.png" alt="Claw Pips" className="h-8 shrink-0" />
          <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white whitespace-nowrap">Claw Pips</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-6 text-[14px] sm:text-[15px] font-medium text-[#666]">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-white ${link.mobile === false ? "hidden sm:inline" : ""}`}
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={toggleLang}
            className="rounded border border-[#2a2a2a] px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#aaa] transition-colors hover:border-[var(--accent)] hover:text-white"
            title={tr(lang, "Switch language", "切换语言")}
          >
            {lang === "us" ? "CN" : "US"}
          </button>

          {isAdmin && (
            <a href="/admin" className="hidden sm:inline text-[#444] transition-colors hover:text-white" title="Admin">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
