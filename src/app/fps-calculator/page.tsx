import { games } from "@/data/games";
import { cpus } from "@/data/cpus";
import { gpus } from "@/data/gpus";
import { benchmarkObservations } from "@/data/benchmarks";
import { buildMetadata } from "@/lib/seo";
import { FpsEstimator } from "@/components/FpsEstimator";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "حاسبة FPS: قدّر فريمات لعبتك على جهازك",
  description: "اختر لعبتك ومواصفات جهازك والدقة ومستوى الجرافيكس. نقارن بالمتطلبات الرسمية ونقدّر الفريمات فقط عند توفر قياسات منشورة لعتاد مماثل.",
  path: "/fps-calculator",
});

export default function Page() {
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "حاسبة FPS" }]} />
      <h1 className="mb-2 text-3xl font-bold">حاسبة FPS</h1>
      <p className="mb-2 max-w-3xl text-mist-300">النتيجة تتحدث تلقائياً عند تغيير أي اختيار، وتعرض عدد الفريمات المتوقع كتقدير مع شرح مستوى الثقة.</p>
      <p className="mb-8 max-w-3xl text-sm text-mist-500">حالة البيانات الآن: {benchmarkObservations.length === 0 ? "لا توجد قياسات منشورة مُدخلة بعد، لذا الأرقام تقديرات تقريبية بنموذج داخلي وليست قياسات." : `${benchmarkObservations.length} قياس منشور (تُستخدم أولاً عند مطابقتها).`}</p>
      <FpsEstimator games={games} cpus={cpus} gpus={gpus} observations={benchmarkObservations} />
    </div>
  );
}
