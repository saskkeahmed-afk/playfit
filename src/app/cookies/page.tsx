import { ADS } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { OwnerNote, StaticPage } from "@/components/StaticPage";

export const metadata = buildMetadata({ title: "الكوكيز والإعلانات", description: "ما الذي يخزّنه الموقع في متصفحك، وحالة الإعلانات، وكيف تتحكم باختيارك.", path: "/cookies" });

export default function Page() {
  return (
    <StaticPage title="الكوكيز والإعلانات" crumb="الكوكيز" intro="حالة هذه الصفحة تعكس إعدادات النسخة المنشورة فعلياً.">
      <h2>حالة الإعلانات الآن</h2>
      <p><strong>{ADS.enabled && ADS.client ? "الإعلانات مفعّلة" : "الإعلانات غير مفعّلة"}</strong> في هذه النسخة. {ADS.enabled ? "لا يُحمَّل أي سكربت إعلاني إلا بعد موافقتك." : "لا يحمّل الموقع أي سكربت إعلاني ولا يضع كوكيز إعلانية."} الموقع لا يدّعي موافقة أي شبكة إعلانية عليه.</p>
      <h2>ما نخزّنه في متصفحك</h2>
      <ul>
        <li><code dir="ltr">playfit:pc-profile:v1</code> و<code dir="ltr">playfit:storage-consent:v1</code>: مواصفاتك واختيارك حفظها، فقط إن طلبت ذلك.</li>
        <li><code dir="ltr">playfit:ads-consent:v1</code>: اختيارك للإعلانات، فقط إن فُعّلت.</li>
      </ul>
      <h2>إذا فُعّلت الإعلانات</h2>
      <p>قد تستخدم شبكات الإعلان (مثل Google AdSense) كوكيز ومعرّفات لعرض الإعلانات وقياسها. يمكنك رفض الإعلانات من الشريط الذي سيظهر، أو مسح بيانات الموقع من المتصفح لتغيير اختيارك.</p>
      <OwnerNote>إن كان جمهورك يشمل المنطقة الاقتصادية الأوروبية أو بريطانيا فاستخدم أداة موافقة معتمدة (CMP) بدل الشريط المبسّط الموجود في هذه النسخة، وراجع سياسات Google قبل التفعيل.</OwnerNote>
    </StaticPage>
  );
}
