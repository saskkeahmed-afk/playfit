import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cpus, getCpu } from "@/data/cpus";
import { cpuIsIndexable, cpuVerdicts, gamesMentioningCpu } from "@/lib/hardware";
import { VerdictList } from "@/components/VerdictGroups";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HardwareGames } from "@/components/HardwareGames";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export const generateStaticParams = () => cpus.map((c) => ({ id: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = getCpu(id);
  if (!c) return {};
  return buildMetadata({
    title: `${c.name}: المواصفات والألعاب المناسبة`,
    description: `مواصفات معالج ${c.manufacturer} ${c.name} (${c.cores} أنوية، ${c.threads} خيط، ${c.architecture})، وأي ألعاب يحقق فيها المتطلبات الدنيا والموصى بها حسب مصادر الناشرين.`,
    path: `/cpus/${c.id}`,
    noindex: !cpuIsIndexable(c),
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCpu(id);
  if (!c) notFound();
  const rows = gamesMentioningCpu(c.id);
  const verdicts = cpuVerdicts(c);
  const same = cpus.filter((x) => x.id !== c.id && x.architecture === c.architecture);
  return (
    <div className="container-x py-10">
      <JsonLd data={breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }, { name: "المعالجات", path: "/cpus" }, { name: c.name, path: `/cpus/${c.id}` }])} />
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "المعالجات", href: "/cpus" }, { name: c.name }]} />
      <h1 className="mb-6 text-3xl font-bold" dir="ltr">{c.name}</h1>
      <dl className="panel grid max-w-2xl grid-cols-2 gap-4 p-5 text-sm sm:grid-cols-4">
        <div><dt className="text-mist-500">الشركة</dt><dd>{c.manufacturer}</dd></div>
        <div><dt className="text-mist-500">الأنوية</dt><dd>{c.cores}</dd></div>
        <div><dt className="text-mist-500">الخيوط</dt><dd>{c.threads}</dd></div>
        <div><dt className="text-mist-500">المعمارية</dt><dd dir="ltr" className="text-start">{c.architecture}</dd></div>
      </dl>
      <section className="mt-10"><h2 className="mb-3 text-xl font-bold">أي الألعاب يناسب هذا المعالج؟</h2><VerdictList groups={verdicts} part="المعالج" /></section>
      <section className="mt-10"><h2 className="mb-3 text-xl font-bold">ألعاب تذكر هذا المعالج</h2><HardwareGames rows={rows} kind="المعالج" /></section>
      {same.length > 0 && <section className="mt-10"><h2 className="mb-3 text-xl font-bold">من نفس المعمارية</h2><ul className="flex flex-wrap gap-2">{same.map((x) => <li key={x.id}><Link className="chip hover:border-neon" href={`/cpus/${x.id}`} dir="ltr">{x.name}</Link></li>)}</ul></section>}
      <p className="mt-10"><Link href="/compare" className="text-cyan-glow underline">قارن المواصفات</Link></p>
    </div>
  );
}
