"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/language";

const cjk = /[\u4e00-\u9fff]/;
const cache = new Map<string, string>();

export function useTranslatedText(text: string | undefined, lang: Lang) {
  const raw = (text || "").trim();
  const [value, setValue] = useState(raw);

  useEffect(() => {
    if (!raw) return void setValue("");

    const want = lang === "cn" ? "zh-CN" : "en";
    const already = lang === "cn" ? cjk.test(raw) : !cjk.test(raw);
    if (already) return void setValue(raw);

    const key = `${want}::${raw}`;
    if (cache.has(key)) return void setValue(cache.get(key)!);

    let dead = false;
    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: raw, target: want }),
    })
      .then((r) => r.json())
      .then((d) => {
        const translated = (d?.translated || raw) as string;
        cache.set(key, translated);
        if (!dead) setValue(translated);
      })
      .catch(() => {
        if (!dead) setValue(raw);
      });

    return () => {
      dead = true;
    };
  }, [raw, lang]);

  return value;
}
