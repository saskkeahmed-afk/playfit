import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, categoryBySlug } from "@/data/categories";
import { categoryIsIndexable, gamesInCategory } from "@/lib/categories";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { GameCard } from "@/components/GameCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug.get(slug);
  if (!c) return {};
  const n = gamesInCategory(c).length;
  return buildMetadata({
    title: `${c.title}: متطلبات التشغيل وهل تعمل على جهازك؟`,
    description: `${n} لعبة من نوع ${c.genre} مع متطلباتها الرسمية، وما الذي يؤثر على الأداء في هذا النوع من العتاد.`,
    path: `/categories/${c.slug}`,
    noindex: !categoryIsIndexable(c),
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug.get(slug);
  if (!c) notFound();
  const list = gamesInCategory(c);
  const others = categories.filter((x) => x.slug !== c.slug && gamesInCategory(x).length > 0).slice(0, 8);
  return (
    <div className="container-x py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "الأقسام", path: "/categories" }, { name: c.title, path: `/categories/${c.slug}` }])} />
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "الأقسام", href: "/categories" }, { name: c.title }]} />
      <h1 className="mb-3 text-3xl font-bold">{c.title}</h1>
      <p className="max-w-2xl text-mist-300">{c.intro}</p>
      <section className="mt-6 max-w-2xl"><h2 className="mb-2 text-xl font-bold">ما الذي يهم في جهازك؟</h2><p className="text-mist-300">{c.hardware}</p></section>
      <h2 className="mb-4 mt-10 text-xl font-bold">الألعاب ({list.length})</h2>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((g) => <li key={g.slug}><GameCard game={g} /></li>)}</ul>
      <section className="mt-12"><h2 className="mb-3 text-xl font-bold">أقسام أخرى</h2>
        <ul className="flex flex-wrap gap-2">{others.map((o) => <li key={o.slug}><Link href={`/categories/${o.slug}`} className="chip hover:border-neon">{o.title}</Link></li>)}</ul>
      </section>
    </div>
  );
}
