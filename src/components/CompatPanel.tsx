import type { CompatibilityResult, PartResult, Verdict } from "@/lib/compat";
import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";

const verdictText: Record<Verdict, { title: string; tone: string }> = {
  "meets-recommended": { title: "جهازك يحقق المتطلبات الموصى بها رسمياً", tone: "border-neon/60 text-neon" },
  "meets-minimum": { title: "جهازك يحقق الحد الأدنى الرسمي فقط", tone: "border-cyan-glow/60 text-cyan-glow" },
  "below-minimum": { title: "جهازك أقل من الحد الأدنى الرسمي في جزء واحد على الأقل", tone: "border-red-400/60 text-red-300" },
  unknown: { title: "لا يمكن الحكم بعد: أكمل المواصفات أو بعضها غير مقارَن", tone: "border-ink-600 text-mist-300" },
};

function Icon({ s }: { s: PartResult["status"] }) {
  if (s === "meets") return <CheckCircle2 size={16} className="text-neon" aria-label="محقق" />;
  if (s === "below") return <XCircle size={16} className="text-red-400" aria-label="غير محقق" />;
  return <CircleHelp size={16} className="text-mist-500" aria-label="غير معروف" />;
}

function Row({ label, r }: { label: string; r: PartResult }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="mt-1 shrink-0"><Icon s={r.status} /></span>
      <span><strong className="text-mist-100">{label}:</strong> <span className="text-mist-300">{r.detail}</span></span>
    </li>
  );
}

export function CompatPanel({ result }: { result: CompatibilityResult }) {
  const v = verdictText[result.verdict];
  return (
    <div className="space-y-4" aria-live="polite">
      <p className={`rounded-lg border bg-ink-950 px-4 py-3 font-bold ${v.tone}`}>{v.title}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel-soft p-4">
          <h4 className="mb-2 font-bold">مقارنة بالحد الأدنى الرسمي</h4>
          <ul className="space-y-2">
            <Row label="المعالج" r={result.min.cpu} />
            <Row label="كرت الشاشة" r={result.min.gpu} />
            <Row label="الرام" r={result.min.ram} />
          </ul>
        </section>
        {result.recommended ? (
          <section className="panel-soft p-4">
            <h4 className="mb-2 font-bold">مقارنة بالموصى به رسمياً</h4>
            <ul className="space-y-2">
              <Row label="المعالج" r={result.recommended.cpu} />
              <Row label="كرت الشاشة" r={result.recommended.gpu} />
              <Row label="الرام" r={result.recommended.ram} />
            </ul>
          </section>
        ) : null}
      </div>
      {result.notes.length > 0 && (
        <ul className="list-disc space-y-1 pe-5 text-sm text-mist-500">
          {result.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}
      <p className="text-xs text-mist-500">المقارنة تعتمد على فئات أداء نسبية تقريبية وليست قياساً لجهازك.</p>
    </div>
  );
}
