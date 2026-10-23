"use client";

import { useRef, useState } from "react";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; fields?: Record<string, string> };
const FALLBACK_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const startedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"), email: form.get("email"), subject: form.get("subject"), message: form.get("message"),
          website: form.get("website"), elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (res.ok && data.ok) { setState({ kind: "sent" }); (e.target as HTMLFormElement).reset(); return; }
      setState({ kind: "error", message: data.error ?? "تعذّر الإرسال. حاول لاحقاً.", fields: data.fields });
    } catch {
      setState({ kind: "error", message: "تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مجدداً." });
    }
  }

  const err = (f: string) => (state.kind === "error" ? state.fields?.[f] : undefined);

  if (state.kind === "sent") return <p role="status" className="panel border-neon/60 p-5 text-neon">تم استلام رسالتك. شكراً لك.</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="panel space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">الاسم</label>
          <input id="c-name" name="name" className="field" required maxLength={80} aria-invalid={!!err("name")} />
          {err("name") && <p role="alert" className="mt-1 text-sm text-red-400">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="label">البريد الإلكتروني</label>
          <input id="c-email" name="email" type="email" dir="ltr" className="field" required maxLength={120} aria-invalid={!!err("email")} />
          {err("email") && <p role="alert" className="mt-1 text-sm text-red-400">{err("email")}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="label">الموضوع</label>
        <select id="c-subject" name="subject" className="field" defaultValue="error">
          <option value="error">الإبلاغ عن خطأ في بيانات لعبة أو عتاد</option>
          <option value="suggestion">اقتراح لعبة أو ميزة</option>
          <option value="other">أخرى</option>
        </select>
      </div>
      <div>
        <label htmlFor="c-msg" className="label">الرسالة</label>
        <textarea id="c-msg" name="message" rows={6} className="field" required maxLength={3000} aria-invalid={!!err("message")} />
        {err("message") && <p role="alert" className="mt-1 text-sm text-red-400">{err("message")}</p>}
      </div>
      {/* حقل فخ للروبوتات: مخفي عن البشر */}
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden"><label>الموقع<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state.kind === "error" && (
        <p role="alert" className="rounded-lg border border-red-400/50 bg-red-400/5 p-3 text-sm text-red-300">
          {state.message}
          {FALLBACK_EMAIL && <> يمكنك مراسلتنا مباشرة على <a className="underline" href={`mailto:${FALLBACK_EMAIL}`} dir="ltr">{FALLBACK_EMAIL}</a>.</>}
        </p>
      )}
      <button className="btn-primary" disabled={state.kind === "sending"}>{state.kind === "sending" ? "جارٍ الإرسال…" : "إرسال الرسالة"}</button>
    </form>
  );
}
