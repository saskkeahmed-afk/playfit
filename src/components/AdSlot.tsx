import { ADS } from "@/lib/config";

type SlotName = keyof typeof ADS.slots;

/**
 * مكان إعلان محجوز المساحة (لتقليل CLS). لا يعرض شيئاً (ولا يحجز مساحة) ما دامت الإعلانات معطّلة
 * أو لم تُضبط المعرّفات. التفعيل: انظر docs/ADS.md. لا تضع هذا المكوّن فوق أدوات الحاسبة أو داخل نتائج البحث.
 */
export function AdSlot({ name, minHeight = 250 }: { name: SlotName; minHeight?: number }) {
  const slotId = ADS.slots[name];
  if (!ADS.enabled || !ADS.client || !slotId) return null;
  return (
    <aside aria-label="إعلان" className="my-8">
      <p className="mb-1 text-center text-[11px] text-mist-500">إعلان</p>
      <div style={{ minHeight }} className="flex items-center justify-center overflow-hidden rounded-lg border border-ink-700">
        <ins className="adsbygoogle" style={{ display: "block", width: "100%", minHeight }} data-ad-client={ADS.client} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true" />
      </div>
    </aside>
  );
}
