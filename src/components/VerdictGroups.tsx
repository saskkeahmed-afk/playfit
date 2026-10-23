import Link from "next/link";
import type { VerdictGroups } from "@/lib/hardware";

const sections: { key: keyof VerdictGroups; title: string; note: string; tone: string }[] = [
  { key: "rec", title: "يحقق المتطلبات الموصى بها رسمياً", note: "في هذه الألعاب يبلغ القطعة فئة المتطلب الموصى به أو أعلى.", tone: "text-neon" },
  { key: "min", title: "يحقق الحد الأدنى فقط", note: "تعمل غالباً بإعدادات منخفضة إلى متوسطة، والنتيجة تختلف حسب بقية الجهاز.", tone: "text-cyan-glow" },
  { key: "below", title: "أقل من الحد الأدنى الرسمي", note: "القطعة أضعف من المتطلب المذكور؛ توقع أداءً غير مريح أو عدم التشغيل.", tone: "text-red-300" },
  { key: "unknown", title: "غير محدد", note: "المتطلب الرسمي لا يطابق قطعة في قاعدتنا فلا نحكم.", tone: "text-mist-500" },
];

/** يعرض ألعاب القاعدة مجمّعة حسب حكم المقارنة. المقارنة تقريبية وبقطعة واحدة فقط. */
export function VerdictList({ groups, part }: { groups: VerdictGroups; part: string }) {
  return (
    <div className="space-y-6">
      {sections.map((s) => groups[s.key].length > 0 && (
        <section key={s.key} aria-label={s.title}>
          <h3 className={`mb-1 font-bold ${s.tone}`}>{s.title} <span className="text-sm font-normal text-mist-500">({groups[s.key].length})</span></h3>
          <p className="mb-2 text-sm text-mist-500">{s.note}</p>
          <ul className="flex flex-wrap gap-2">
            {groups[s.key].map((g) => <li key={g.slug}><Link href={`/games/${g.slug}`} className="chip hover:border-neon" dir="ltr">{g.title}</Link></li>)}
          </ul>
        </section>
      ))}
      <p className="text-xs text-mist-500">المقارنة تخص {part} وحده مقابل المتطلبات الرسمية (فئات أداء نسبية تقريبية)، ولا تأخذ بقية الجهاز في الحسبان، وليست فريمات متوقعة. استخدم <Link href="/check-my-pc" className="text-cyan-glow underline">فحص جهازي</Link> لمقارنة جهازك كاملاً.</p>
    </div>
  );
}
