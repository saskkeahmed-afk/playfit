import Link from "next/link";
import { guideCategories, guides } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "أدلة الألعاب: رفع FPS وحل التقطيع وإعدادات الجرافيكس",
  description: "أدلة عملية بالعربية لرفع الفريمات، وحل التقطيع، وتحسين أداء اللابتوب، وفهم إعدادات الجرافيكس، وقراءة متطلبات التشغيل.",
  path: "/guides",
});

export default function Page() {
  const cats = guideCategories.filter((c) => guides.some((g) => g.category === c));
  const empty = guideCategories.filter((c) => !cats.includes(c));
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "الأدلة" }]} />
      <h1 className="mb-2 text-3xl font-bold">الأدلة</h1>
      <p className="mb-8 max-w-2xl text-mist-300">أدلة مكتوبة لتُطبَّق خطوة بخطوة، لا لحشو الكلمات المفتاحية.</p>
      {cats.map((c) => (
        <section key={c} className="mb-10" aria-labelledby={`cat-${c}`}>
          <h2 id={`cat-${c}`} className="mb-4 text-xl font-bold">{c}</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {guides.filter((g) => g.category === c).map((g) => (
              <li key={g.slug}><Link href={`/guides/${g.slug}`} className="panel block h-full p-5 hover:border-neon/60"><span className="block font-bold">{g.title}</span><span className="mt-2 block text-sm text-mist-300">{g.description}</span><span className="mt-2 block text-xs text-mist-500">قراءة {g.readingMinutes} دقائق · آخر تحديث {g.updatedAt}</span></Link></li>
            ))}
          </ul>
        </section>
      ))}
      {empty.length > 0 && <p className="text-sm text-mist-500">أقسام قيد الإعداد: {empty.join("، ")}.</p>}
    </div>
  );
}
