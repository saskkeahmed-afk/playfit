import { buildMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/StaticPage";
import { ContactForm } from "@/components/ContactForm";

export const metadata = buildMetadata({ title: "تواصل معنا: أبلغ عن خطأ أو اقترح لعبة", description: "أرسل لنا تصحيحاً لمتطلبات لعبة أو اقتراح لعبة أو قطعة عتاد، مع رابط المصدر إن أمكن.", path: "/contact" });

export default function Page() {
  return (
    <StaticPage title="تواصل معنا" crumb="التواصل" intro="الإبلاغ عن خطأ في المتطلبات مع رابط المصدر يساعدنا على تصحيحه أسرع.">
      <div className="max-w-2xl"><ContactForm /></div>
    </StaticPage>
  );
}
