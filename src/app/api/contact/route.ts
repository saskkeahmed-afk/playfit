import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2, "اكتب اسمك (حرفان على الأقل).").max(80),
  email: z.string().trim().email("بريد إلكتروني غير صالح.").max(120),
  subject: z.enum(["error", "suggestion", "other"]),
  message: z.string().trim().min(10, "الرسالة قصيرة جداً (10 أحرف على الأقل).").max(3000, "الرسالة طويلة جداً."),
  website: z.string().max(200).optional(),
  elapsedMs: z.number().optional(),
});

const subjectText = { error: "إبلاغ عن خطأ في البيانات", suggestion: "اقتراح", other: "أخرى" } as const;

// حد طلبات بسيط في الذاكرة (يكفي كحماية أولية؛ في بيئة متعددة النسخ استخدم خدمة مشتركة).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_HITS;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "عدد المحاولات كبير. حاول بعد قليل." }, { status: 429 });

  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > 10_000) return NextResponse.json({ ok: false, error: "الطلب كبير جداً." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: "طلب غير صالح." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) { const k = String(issue.path[0] ?? "form"); fields[k] ??= issue.message; }
    return NextResponse.json({ ok: false, error: "تحقق من الحقول المظللة.", fields }, { status: 400 });
  }
  const d = parsed.data;

  // فخ الروبوتات: حقل مخفي ممتلئ أو إرسال فوري جداً. نرد بنجاح شكلي لعدم إرشاد الروبوت.
  if (d.website || (d.elapsedMs !== undefined && d.elapsedMs < 2500)) return NextResponse.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    // لا نتظاهر بالإرسال، ولا نسجّل محتوى الرسالة.
    return NextResponse.json({ ok: false, error: "إرسال الرسائل غير مفعّل على هذا الموقع حالياً." }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: d.email,
        subject: `[PlayFit] ${subjectText[d.subject]}`,
        text: `الاسم: ${d.name}\nالبريد: ${d.email}\n\n${d.message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "تعذّر إرسال الرسالة الآن. حاول لاحقاً." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "تعذّر إرسال الرسالة الآن. حاول لاحقاً." }, { status: 502 });
  }
}
