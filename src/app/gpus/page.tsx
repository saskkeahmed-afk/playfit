import { gpus } from "@/data/gpus";
import { buildMetadata } from "@/lib/seo";
import { DirectoryList } from "@/components/DirectoryList";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "قاعدة كروت الشاشة: المواصفات والألعاب المرتبطة",
  description: "كروت شاشة مكتبية ولابتوب ومدمجة مع الشركة والذاكرة والمعمارية، والألعاب التي تذكرها متطلباتها الرسمية. نفصل بين اللابتوب والمكتبي.",
  path: "/gpus",
});

const typeLabel = { desktop: "مكتبي", laptop: "لابتوب", integrated: "مدمج" } as const;

export default function Page() {
  const items = gpus.map((g) => ({ id: g.id, name: g.name, sub: `${g.manufacturer} · ${g.vramGb ? `${g.vramGb}GB` : "ذاكرة مشتركة"}`, badge: typeLabel[g.deviceType] }));
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "كروت الشاشة" }]} />
      <h1 className="mb-2 text-3xl font-bold">كروت الشاشة</h1>
      <p className="mb-8 max-w-2xl text-mist-300">لا نقارن كروت اللابتوب بنظيراتها المكتبية بالاسم؛ لكل نوع وسم منفصل لأن الأداء يتأثر بحد الطاقة والتبريد.</p>
      <DirectoryList items={items} basePath="/gpus" label="ابحث عن كرت شاشة" />
    </div>
  );
}
