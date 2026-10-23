import { cpus } from "@/data/cpus";
import { buildMetadata } from "@/lib/seo";
import { DirectoryList } from "@/components/DirectoryList";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "قاعدة المعالجات: الأنوية والخيوط والألعاب المرتبطة",
  description: "معالجات Intel وAMD مع عدد الأنوية والخيوط والمعمارية، والألعاب التي تذكرها متطلباتها الرسمية.",
  path: "/cpus",
});

export default function Page() {
  const items = cpus.map((c) => ({ id: c.id, name: c.name, sub: `${c.manufacturer} · ${c.cores} أنوية / ${c.threads} خيط` }));
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "المعالجات" }]} />
      <h1 className="mb-2 text-3xl font-bold">المعالجات</h1>
      <p className="mb-8 max-w-2xl text-mist-300">قائمة مختارة من المعالجات التي تظهر في متطلبات الألعاب وبعض الشائع منها. تُضاف قطع جديدة عند الحاجة.</p>
      <DirectoryList items={items} basePath="/cpus" label="ابحث عن معالج" />
    </div>
  );
}
