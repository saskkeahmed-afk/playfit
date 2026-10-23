import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGpu, gpus } from "@/data/gpus";
import { benchmarkObservations } from "@/data/benchmarks";
import { gamesMentioningGpu, gpuIsIndexable, gpuVerdicts } from "@/lib/hardware";
import { VerdictList } from "@/components/VerdictGroups";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HardwareGames } from "@/components/HardwareGames";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export const generateStaticParams = () => gpus.map((g) => ({ id: g.id }));
const typeLabel = { desktop: "مكتبي", laptop: "لابتوب", integrated: "مدمج" } as const;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const g = getGpu(id);
  if (!g) return {};
  return buildMetadata({
    title: `${g.name}: المواصفات والألعاب المناسبة`,
    description: `مواصفات ${g.manufacturer} ${g.name} (${typeLabel[g.deviceType]}، ${g.architecture})${g.vramGb ? ` بذاكرة ${g.vramGb}GB` : ""}، وأي ألعاب يحقق فيها المتطلبات الدنيا والموصى بها حسب مصادر الناشرين.`,
    path: `/gpus/${g.id}`,
    noindex: !gpuIsIndexable(g),
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = getGpu(id);
  if (!g) notFound();
  const rows = gamesMentioningGpu(g.id);
  const verdicts = gpuVerdicts(g);
  const bench = benchmarkObservations.filter((o) => o.gpuId === g.id);
  const sameFamily = gpus.filter((x) => x.id !== g.id && x.manufacturer === g.manufacturer && x.architecture === g.architecture);

  return (
    <div className="container-x py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "كروت الشاشة", path: "/gpus" }, { name: g.name, path: `/gpus/${g.id}` }])} />
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "كروت الشاشة", href: "/gpus" }, { name: g.name }]} />
      <h1 className="mb-6 text-3xl font-bold" dir="ltr">{g.name}</h1>
      <dl className="panel grid max-w-2xl grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-4">
        <div><dt className="text-mist-500">الشركة</dt><dd>{g.manufacturer}</dd></div>
        <div><dt className="text-mist-500">الذاكرة</dt><dd>{g.vramGb ? `${g.vramGb}GB` : "مشتركة"}</dd></div>
        <div><dt className="text-mist-500">المعمارية</dt><dd dir="ltr" className="text-start">{g.architecture}</dd></div>
        <div><dt className="text-mist-500">النوع</dt><dd>{typeLabel[g.deviceType]}</dd></div>
      </dl>
      {g.deviceType === "laptop" && <p className="mt-4 max-w-2xl rounded-lg border border-amber-400/40 bg-amber-400/5 p-3 text-sm text-amber-200">كرت لابتوب: أداؤه يتأثر بحد الطاقة والتبريد في كل جهاز، ولا يُقارن بالكرت المكتبي الذي يحمل اسماً مشابهاً.</p>}

      <section className="mt-10" aria-labelledby="perf">
        <h2 id="perf" className="mb-3 text-xl font-bold">قياسات الأداء</h2>
        {bench.length === 0 ? <p className="text-mist-300">لا توجد قياسات منشورة لهذا الكرت في قاعدتنا بعد. لن نعرض أرقاماً غير موثّقة.</p> : (
          <ul className="space-y-2 text-sm">{bench.map((o) => <li key={o.id}>{o.gameSlug}: {o.avgFps} FPS متوسط عند {o.resolution} / {o.preset} — <a className="text-cyan-glow underline" href={o.source.url} rel="noopener noreferrer nofollow">{o.source.label}</a></li>)}</ul>
        )}
      </section>

      <section className="mt-10" aria-labelledby="vs">
        <h2 id="vs" className="mb-3 text-xl font-bold">أي الألعاب يناسب هذا الكرت؟</h2>
        <VerdictList groups={verdicts} part="كرت الشاشة" />
      </section>

      <section className="mt-10" aria-labelledby="games">
        <h2 id="games" className="mb-3 text-xl font-bold">ألعاب تذكر هذا الكرت</h2>
        <HardwareGames rows={rows} kind="الكرت" />
      </section>

      {sameFamily.length > 0 && (
        <section className="mt-10"><h2 className="mb-3 text-xl font-bold">من نفس المعمارية</h2>
          <ul className="flex flex-wrap gap-2">{sameFamily.map((x) => <li key={x.id}><Link className="chip hover:border-neon" href={`/gpus/${x.id}`} dir="ltr">{x.name}</Link></li>)}</ul>
          <p className="mt-4"><Link href="/compare" className="text-cyan-glow underline">قارن المواصفات</Link></p>
        </section>
      )}
    </div>
  );
}
