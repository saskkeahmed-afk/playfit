import type { RequirementTier } from "@/lib/types";

function Col({ title, tier }: { title: string; tier?: RequirementTier }) {
  return (
    <section className="panel-soft p-4">
      <h3 className="mb-3 font-bold">{title}</h3>
      {!tier ? (
        <p className="text-sm text-mist-500">غير متوفرة في بياناتنا لهذه اللعبة.</p>
      ) : (
        <dl className="space-y-2 text-sm">
          {tier.os && <div><dt className="text-mist-500">النظام</dt><dd dir="ltr" className="text-start">{tier.os}</dd></div>}
          <div><dt className="text-mist-500">المعالج</dt><dd dir="ltr" className="text-start">{tier.cpuText}</dd></div>
          <div><dt className="text-mist-500">كرت الشاشة</dt><dd dir="ltr" className="text-start">{tier.gpuText}</dd></div>
          <div><dt className="text-mist-500">الرام</dt><dd>{tier.ramGb}GB</dd></div>
          {tier.storageGb && <div><dt className="text-mist-500">المساحة</dt><dd>{tier.storageGb}GB{tier.storageType ? ` · ${tier.storageType}` : ""}</dd></div>}
          {tier.note && <div><dt className="text-mist-500">ملاحظة المصدر</dt><dd>{tier.note}</dd></div>}
        </dl>
      )}
    </section>
  );
}

export function RequirementsTable({ min, recommended }: { min: RequirementTier; recommended?: RequirementTier }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Col title="الحد الأدنى (رسمي)" tier={min} />
      <Col title="الموصى به (رسمي)" tier={recommended} />
    </div>
  );
}
