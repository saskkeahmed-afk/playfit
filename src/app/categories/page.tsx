import Link from "next/link";
import { categories } from "@/data/categories";
import { gamesInCategory } from "@/lib/categories";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "أقسام الألعاب: أكشن وآر بي جي وتصويب وسباقات وغيرها",
  description: "تصفّح ألعاب الكمبيوتر حسب النوع، مع شرح لما يؤثر على الأداء في كل نوع وروابط لمتطلبات كل لعبة.",
  path: "/categories",
});

export default function Page() {
  const list = categories.map((c) => ({ c, n: gamesInCategory(c).length })).filter((x) => x.n > 0);
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "الأقسام" }]} />
      <h1 className="mb-2 text-3xl font-bold">أقسام الألعاب</h1>
      <p className="mb-8 max-w-2xl text-mist-300">اختر النوع الذي تحبه لتعرف الألعاب المتاحة وما الذي يهم في جهازك لتشغيلها.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ c, n }) => (
          <li key={c.slug}><Link href={`/categories/${c.slug}`} className="panel block h-full p-5 hover:border-neon/60"><span className="block font-bold">{c.title}</span><span className="mt-1 block text-sm text-mist-300">{c.intro}</span><span className="mt-2 block text-xs text-mist-500">{n} لعبة</span></Link></li>
        ))}
      </ul>
    </div>
  );
}
