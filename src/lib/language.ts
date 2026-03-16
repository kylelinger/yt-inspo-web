export type Lang = "us" | "cn";

export const LANG_COOKIE = "bp_lang";

export function normalizeLang(value?: string | null): Lang {
  return value?.toLowerCase() === "cn" ? "cn" : "us";
}

export function tr(lang: Lang, us: string, cn: string): string {
  return lang === "cn" ? cn : us;
}

export function getClientLang(): Lang {
  if (typeof document === "undefined") return "us";
  const fromStorage = window.localStorage.getItem(LANG_COOKIE);
  if (fromStorage) return normalizeLang(fromStorage);

  const cookie = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${LANG_COOKIE}=`));
  return normalizeLang(cookie?.split("=")[1]);
}

export function setClientLang(lang: Lang) {
  if (typeof document === "undefined") return;
  window.localStorage.setItem(LANG_COOKIE, lang);
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}
