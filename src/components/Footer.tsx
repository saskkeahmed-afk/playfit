import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  { title: "الأدوات", links: [["/check-my-pc", "افحص جهازي"], ["/fps-calculator", "حاسبة FPS"], ["/compare", "مقارنة العتاد"], ["/games", "مكتبة الألعاب"], ["/categories", "أقسام الألعاب"]] },
  { title: "قواعد البيانات", links: [["/gpus", "كروت الشاشة"], ["/cpus", "المعالجات"], ["/guides", "الأدلة"], ["/glossary", "قاموس المصطلحات"], ["/methodology", "منهجية التقدير"]] },
  { title: "الموقع", links: [["/about", "عن الموقع"], ["/contact", "تواصل معنا"], ["/privacy", "سياسة الخصوصية"], ["/terms", "شروط الاستخدام"], ["/cookies", "الكوكيز والإعلانات"]] },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-700 bg-ink-900">
      <div className="container-x grid gap-8 py-10 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-mist-500">أداة مجانية لمعرفة توافق جهازك مع الألعاب. التقديرات إرشادية وليست اختباراً مباشراً لجهازك.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="mb-3 text-sm font-bold text-mist-100">{c.title}</h2>
            <ul className="space-y-2 text-sm">
              {c.links.map(([href, label]) => <li key={href}><Link href={href} className="text-mist-300 hover:text-neon">{label}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-ink-700 py-4 text-center text-xs text-mist-500">
        <p>أسماء الألعاب والعلامات التجارية ملك لأصحابها. الموقع غير تابع لأي ناشر أو مصنّع.</p>
      </div>
    </footer>
  );
}
