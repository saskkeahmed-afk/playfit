import { gpus } from "@/data/gpus";
import { cpus } from "@/data/cpus";
import { benchmarkObservations } from "@/data/benchmarks";
import { buildMetadata } from "@/lib/seo";
import { CompareTool } from "@/components/CompareTool";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "مقارنة كروت الشاشة والمعالجات: المواصفات والقياسات",
  description: "قارن مواصفات كرتين أو ثلاثة من كروت الشاشة أو المعالجات جنباً إلى جنب، مع تنبيه عند المقارنة بين لابتوب ومكتبي. لا نعرض نسباً غير موثّقة.",
  path: "/compare",
});

export default function Page() {
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "مقارنة" }]} />
      <h1 className="mb-2 text-3xl font-bold">مقارنة العتاد</h1>
      <p className="mb-8 max-w-2xl text-mist-300">نعرض المواصفات والقياسات المنشورة فقط. لا نعرض نسب تفوّق أو ترتيباً ما لم تدعمه قياسات موثّقة بظروف اختبار.</p>
      <CompareTool gpus={gpus} cpus={cpus} observations={benchmarkObservations} />
    </div>
  );
}
