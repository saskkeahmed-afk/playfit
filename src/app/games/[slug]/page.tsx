import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { games, getGame } from "@/data/games";
import { cpus } from "@/data/cpus";
import { gpus } from "@/data/gpus";
import { guideBySlug } from "@/data/guides";
import { benchmarkObservations } from "@/data/benchmarks";
import { resolveCover, toCardGame } from "@/lib/cover";
import { getRemoteCover } from "@/lib/rawg";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, videoGameJsonLd } from "@/lib/seo";
import { GameCover } from "@/components/GameCover";
import { GameCard } from "@/components/GameCard";
import { RequirementsTable } from "@/components/RequirementsTable";
import { FpsEstimator } from "@/components/FpsEstimator";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";

export const dynamicParams = false;
export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGame(slug);
  if (!g) return {};
  return buildMetadata({
    title: `متطلبات تشغيل ${g.title} على الكمبيوتر`,
    description: `المتطلبات الرسمية الدنيا${g.recommended ? " والموصى بها" : ""} للعبة ${g.titleAr ? `${g.titleAr} (${g.title})` : g.title}، مع مقارنة جهازك بها وتقدير الفريمات ونصائح لرفع الأداء. صدرت ${g.releaseYear} من تطوير ${g.developer}.`,
    path: `/games/${g.slug}`,
  });
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const remote = await getRemoteCover(game);
  const source = resolveCover(game, remote);
  const similar = game.similar.map((s) => getGame(s)).filter((g): g is NonNullable<typeof g> => !!g);
  const related = game.guides.map((s) => guideBySlug.get(s)).filter((g): g is NonNullable<typeof g> => !!g);
  const hasBench = benchmarkObservations.some((o) => o.gameSlug === game.slug);

  return (
    <div className="container-x py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "الألعاب", path: "/games" }, { name: game.title, path: `/games/${game.slug}` }])} />
      <JsonLd data={videoGameJsonLd(game)} />
      <JsonLd data={faqJsonLd(game.faqAr)} />
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "الألعاب", href: "/games" }, { name: game.titleAr ?? game.title }]} />

      <header className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="panel overflow-hidden self-start">
          <GameCover game={toCardGame(game)} source={source} priority />
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight"><span dir="ltr" className="block text-start">{game.title}</span>{game.titleAr && <span className="mt-1 block text-xl text-mist-300">{game.titleAr}</span>}</h1>
          <p className="mt-4 max-w-2xl text-mist-300">{game.descriptionAr}</p>
          <dl className="mt-5 grid max-w-xl grid-cols-2 gap-3 text-sm">
            <div><dt className="text-mist-500">سنة الإصدار (الكمبيوتر)</dt><dd>{game.releaseYear}</dd></div>
            <div><dt className="text-mist-500">المنصات</dt><dd>{game.platforms.join("، ")}</dd></div>
            <div><dt className="text-mist-500">المطوّر</dt><dd dir="ltr" className="text-start">{game.developer}</dd></div>
            <div><dt className="text-mist-500">الناشر</dt><dd dir="ltr" className="text-start">{game.publisher}</dd></div>
            <div className="col-span-2"><dt className="text-mist-500">النوع</dt><dd>{game.genres.join("، ")}</dd></div>
          </dl>
          {source.kind === "generated" && <p className="mt-3 text-xs text-mist-500">البطاقة أعلاه مولّدة محلياً لعدم توفر غلاف رسمي مرخّص لدينا.</p>}
          {source.kind === "image" && source.origin === "steam" && <p className="mt-3 text-xs text-mist-500">صورة الغلاف من صفحة اللعبة في متجر Steam، وهي ملك لأصحابها.</p>}
          {source.kind === "image" && source.origin === "rawg" && <p className="mt-3 text-xs text-mist-500">الصورة من <a className="underline" href="https://rawg.io" rel="noopener noreferrer" target="_blank">RAWG</a>.</p>}
        </div>
      </header>

      <section className="mt-12" aria-labelledby="req">
        <h2 id="req" className="mb-2 text-2xl font-bold">المتطلبات الرسمية</h2>
        <p className="mb-4 text-sm text-mist-300">
          المصدر: <a className="text-cyan-glow underline" href={game.requirementsSource.url} rel="noopener noreferrer nofollow" target="_blank">{game.requirementsSource.label}</a>.
          {game.verification === "needs-review" && " هذه البيانات بانتظار المراجعة النهائية من المصدر؛ تحقق منه قبل الشراء أو التحميل."}
        </p>
        <RequirementsTable min={game.min} recommended={game.recommended} />
        <p className="mt-3 text-sm text-mist-500">الإعدادات المسبقة والدقات المدعومة: غير متوفرة لدينا بتفصيل موثّق لهذه اللعبة.{game.supportedUpscaling.length ? ` تقنيات رفع الدقة المدعومة حسب بياناتنا: ${game.supportedUpscaling.map((u) => u.toUpperCase()).join("، ")}.` : ""}</p>
      </section>

      <section className="mt-12 scroll-mt-20" id="estimator" aria-labelledby="est">
        <h2 id="est" className="mb-2 text-2xl font-bold">هل تعمل اللعبة على جهازك؟</h2>
        <p className="mb-4 max-w-3xl text-sm text-mist-300">
          هذا القسم يفصل بين أمرين: <strong>مقارنة بالمتطلبات الرسمية</strong> (مواصفات الناشر)، و<strong>تقدير الفريمات</strong> (يحتاج قياسات فعلية).
          {!hasBench && " لا توجد لدينا قياسات منشورة لهذه اللعبة بعد، لذلك الفريمات المعروضة تقدير تقريبي بنموذج داخلي."}
        </p>
        <FpsEstimator games={[game]} cpus={cpus} gpus={gpus} observations={benchmarkObservations} fixedSlug={game.slug} />
      </section>

      <AdSlot name="inContent" />

      <section className="mt-12" aria-labelledby="tips">
        <h2 id="tips" className="mb-3 text-2xl font-bold">نصائح لتحسين الأداء في {game.titleAr ?? game.title}</h2>
        <div className="prose-ar"><ul>{game.tipsAr.map((t) => <li key={t}>{t}</li>)}</ul></div>
        <h3 className="mb-2 mt-6 text-lg font-bold">كيف ترفع الفريمات عموماً؟</h3>
        <div className="prose-ar"><p>اعرف أولاً هل الكرت أم المعالج هو الحلقة الأضعف، ثم خفّض الإعدادات الأثقل (الظلال، الانعكاسات، الكثافة) قبل خفض الدقة. التفاصيل في <Link href="/guides/how-to-increase-fps" className="text-cyan-glow underline">دليل رفع FPS</Link>.</p></div>
      </section>

      <section className="mt-12" aria-labelledby="faq">
        <h2 id="faq" className="mb-4 text-2xl font-bold">أسئلة عن {game.titleAr ?? game.title}</h2>
        <div className="space-y-3">{game.faqAr.map((f) => <details key={f.q} className="panel p-4"><summary className="cursor-pointer font-bold">{f.q}</summary><p className="mt-3 text-mist-300">{f.a}</p></details>)}</div>
      </section>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="rg">
          <h2 id="rg" className="mb-4 text-2xl font-bold">أدلة ذات صلة</h2>
          <ul className="grid gap-4 md:grid-cols-2">{related.map((g) => <li key={g.slug}><Link href={`/guides/${g.slug}`} className="panel block p-4 hover:border-neon/60"><span className="block font-bold">{g.title}</span><span className="mt-1 block text-sm text-mist-300">{g.description}</span></Link></li>)}</ul>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-12" aria-labelledby="sim">
          <h2 id="sim" className="mb-4 text-2xl font-bold">ألعاب مشابهة</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.map((g) => <li key={g.slug}><GameCard game={g} /></li>)}</ul>
        </section>
      )}
    </div>
  );
}
