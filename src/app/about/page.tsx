import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";
import { games } from "@/data/games";
import { benchmarkObservations } from "@/data/benchmarks";

export const metadata = buildMetadata({ title: "عن PlayFit: هدفنا وحدود تقديراتنا", description: "ما هو الموقع، كيف نبني تقدير الفريمات، حدود اكتشاف العتاد من المتصفح، وكيف تبلّغ عن خطأ في البيانات.", path: "/about" });

export default function Page() {
  return (
    <StaticPage title="عن الموقع" crumb="عن الموقع" intro="أداة مجانية تساعد لاعبي الكمبيوتر الناطقين بالعربية على فهم توافق جهازهم مع الألعاب قبل التحميل.">
      <h2>ماذا نقدّم؟</h2>
      <p>نقارن مواصفات جهازك بالمتطلبات الرسمية المنشورة للألعاب، ونعرض عدد الفريمات المتوقع كتقدير: من قياسات منشورة عند توفرها، وإلا بنموذج تقريبي نذكر أنه كذلك.</p>
      <h2>حالة البيانات الآن</h2>
      <ul>
        <li>عدد الألعاب في القاعدة: {games.length}، ومتطلباتها منقولة من مصادر رسمية وبانتظار مراجعة نهائية.</li>
        <li>عدد القياسات المنشورة المدخلة: {benchmarkObservations.length}. {benchmarkObservations.length === 0 && "لذلك تعتمد أرقام الفريمات حالياً على نموذج تقريبي داخلي، وهي موسومة بذلك على كل نتيجة."}</li>
        <li>لم نختبر كل تجميعات الأجهزة الممكنة، ولا ندّعي ذلك.</li>
      </ul>
      <h2>حدود اكتشاف المواصفات</h2>
      <p>المتصفح لا يكشف موديل المعالج ولا الرام الحقيقي ولا ذاكرة الكرت. نقرأ ما يعرضه فقط ونطلب منك تأكيد الباقي يدوياً. لا نُحمّل ولا نشغّل برامج على جهازك.</p>
      <h2>كيف نقدّر الفريمات؟</h2>
      <p>التفاصيل الكاملة في <Link href="/methodology" className="text-cyan-glow underline">صفحة المنهجية</Link>.</p>
      <h2>أبلغ عن خطأ</h2>
      <p>وجدت متطلباً خاطئاً أو قطعة ناقصة؟ أخبرنا عبر <Link href="/contact" className="text-cyan-glow underline">صفحة التواصل</Link> مع رابط المصدر، وسنراجعه.</p>
    </StaticPage>
  );
}
