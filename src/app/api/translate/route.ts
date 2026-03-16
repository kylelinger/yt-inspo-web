import { NextResponse } from "next/server";

const mem = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const { text, target } = (await req.json()) as { text?: string; target?: "en" | "zh-CN" };
    const raw = (text || "").trim();
    if (!raw) return NextResponse.json({ ok: true, translated: "" });
    const tl = target === "zh-CN" ? "zh-CN" : "en";
    const key = `${tl}::${raw}`;
    if (mem.has(key)) return NextResponse.json({ ok: true, translated: mem.get(key) });

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(raw)}`;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(`translate failed ${r.status}`);
    const arr = (await r.json()) as any[];
    const translated = Array.isArray(arr?.[0])
      ? arr[0].map((s: any[]) => s?.[0] || "").join("")
      : raw;

    mem.set(key, translated || raw);
    return NextResponse.json({ ok: true, translated: translated || raw });
  } catch {
    return NextResponse.json({ ok: false, translated: "" }, { status: 500 });
  }
}
