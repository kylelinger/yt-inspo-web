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
            { href: "/", label: tr(lang, "Home", "首页"), mobile: true },
            { href: "/videos", label: tr(lang, "Videos", "视频"), mobile: true },
            { href: "/archive", label: tr(lang, "Archive", "往期"), mobile: true },
            { href: "/shortlist", label: tr(lang, "Saved", "收藏"), mobile: false },
            { href: "/about", label: tr(lang, "About", "关于"), mobile: false },
          ]
        : [
            { href: "/", label: tr(lang, "Home", "首页"), mobile: true },
            { href: "/videos", label: tr(lang, "Videos", "视频"), mobile: true },
            { href: "/archive", label: tr(lang, "Archive", "往期"), mobile: true },
          ],
    [isAdmin, lang]
  );

  const toggleLang = () => {
    const next: Lang = lang === "us" ? "cn" : "us";
    setClientLang(next);
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)", background: "var(--bg)", backdropFilter: "blur(10px)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8 h-16">
        {/* Logo / Brand */}
        <a href="/" className="flex items-center gap-2 min-w-0 font-bold text-sm tracking-wider">
          {isAdmin ? (
            <>
              <span style={{ color: "var(--text)" }}>CLAW</span>
              <span style={{ color: "var(--accent)" }}>PIPS</span>
            </>
          ) : (
            <span style={{ color: "var(--text)" }}>CLAW PIPS</span>
          )}
        </a>

        {/* Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[0.875rem] font-medium transition-colors ${link.mobile === false ? "hidden sm:inline" : ""}`}
              style={{ color: "var(--text-muted)" }}
            >
              {link.label}
            </a>
          ))}

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-[0.75rem] font-bold tracking-widest transition-colors"
            style={{ color: "var(--text-muted)" }}
            title={tr(lang, "Toggle language", "切换语言")}
          >
            {lang === "us" ? "EN" : "CN"}
          </button>
        </div>
      </div>
    </nav>
  );
}
