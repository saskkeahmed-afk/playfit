import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuide, guides } from "@/data/guides";
import { games } from "@/data/games";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return buildMetadata({ title: g.title, description: g.description, path: `/guides/${g.slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const relatedGames = games.filter((g) => g.guides.includes(guide.slug)).slice(0, 6);
  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <article className="container-x py-10">
      <JsonLd data={articleJsonLd(guide)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "الأدلة", path: "/guides" }, { name: guide.title, path: `/guides/${guide.slug}` }])} />
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "الأدلة", href: "/guides" }, { name: guide.category }]} />
      <header className="mb-8 max-w-3xl">
        <span className="chip mb-3">{guide.category}</span>
        <h1 className="text-3xl font-bold leading-snug">{guide.title}</h1>
        <p className="mt-3 text-mist-300">{guide.description}</p>
        <p className="mt-2 text-xs text-mist-500">نُشر {guide.publishedAt} · آخر تحديث {guide.updatedAt} · قراءة {guide.readingMinutes} دقائق</p>
      </header>
      <div className="prose-ar">
        {guide.sections.map((s, i) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
            {i === 1 && <AdSlot name="inContent" />}
          </section>
        ))}
      </div>
      {relatedGames.length > 0 && (
        <section className="mt-12 max-w-3xl"><h2 className="mb-3 text-xl font-bold">ألعاب يفيدها هذا الدليل</h2>
          <ul className="flex flex-wrap gap-2">{relatedGames.map((g) => <li key={g.slug}><Link href={`/games/${g.slug}`} className="chip hover:border-neon" dir="ltr">{g.title}</Link></li>)}</ul>
        </section>
      )}
      <section className="mt-10 max-w-3xl"><h2 className="mb-3 text-xl font-bold">أدلة أخرى</h2>
        <ul className="space-y-2">{others.map((g) => <li key={g.slug}><Link href={`/guides/${g.slug}`} className="text-cyan-glow hover:underline">{g.title}</Link></li>)}</ul>
        <p className="mt-4"><Link href="/fps-calculator" className="btn-primary">جرّب حاسبة FPS</Link></p>
      </section>
    </article>
  );
}
