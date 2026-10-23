import { glossary } from "@/data/glossary";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "قاموس مصطلحات الألعاب والعتاد: FPS وVRAM وDLSS",
  description: "شرح مبسّط بالعربية لأهم مصطلحات الألعاب والعتاد: الفريمات، الاختناق، ذاكرة الفيديو، DLSS وFSR، تتبع الأشعة، والتقطيع.",
  path: "/glossary",
});

export default function Page() {
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "القاموس" }]} />
      <h1 className="mb-2 text-3xl font-bold">قاموس المصطلحات</h1>
      <p className="mb-8 max-w-2xl text-mist-300">مصطلحات تقابلها كثيراً عند قراءة متطلبات الألعاب ومراجعات العتاد، بشرح مبسّط.</p>
      <dl className="grid gap-4 md:grid-cols-2">
        {glossary.map((t) => (
          <div key={t.en} id={t.en.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="panel scroll-mt-24 p-5">
            <dt className="font-bold">{t.term} <span className="text-sm font-normal text-mist-500" dir="ltr">· {t.en}</span></dt>
            <dd className="mt-2 text-sm text-mist-300">{t.def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
