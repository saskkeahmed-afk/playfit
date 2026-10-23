import { games } from "@/data/games";
import { cpus } from "@/data/cpus";
import { gpus } from "@/data/gpus";
import { buildMetadata } from "@/lib/seo";
import { CheckMyPc } from "@/components/CheckMyPc";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "افحص جهازي: قارن مواصفات كمبيوترك بمتطلبات الألعاب",
  description: "أدخل معالجك وكرت الشاشة والرام، أو اقرأ ما يعرضه متصفحك، ثم اعرف أي الألعاب تحقق متطلباتها الرسمية. بدون تحميل أي برنامج.",
  path: "/check-my-pc",
});

export default function Page() {
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "افحص جهازي" }]} />
      <h1 className="mb-2 text-3xl font-bold">افحص جهازك</h1>
      <p className="mb-8 max-w-2xl text-mist-300">ابدأ بقراءة ما يعرضه المتصفح، ثم أكمل الباقي من قوائم المواصفات. ستظهر لك نتيجة كل لعبة مقابل متطلباتها الرسمية.</p>
      <CheckMyPc games={games} cpus={cpus} gpus={gpus} />
    </div>
  );
}
