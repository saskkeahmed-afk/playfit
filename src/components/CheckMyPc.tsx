"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Cpu, Game, Gpu } from "@/lib/types";
import { usePcProfile } from "@/lib/use-pc-profile";
import { checkCompatibility, type Verdict } from "@/lib/compat";
import { DetectCard } from "./DetectCard";
import { PcConfigurator } from "./PcConfigurator";

const label: Record<Verdict, { t: string; c: string }> = {
  "meets-recommended": { t: "يحقق الموصى به", c: "text-neon" },
  "meets-minimum": { t: "يحقق الحد الأدنى", c: "text-cyan-glow" },
  "below-minimum": { t: "أقل من الحد الأدنى", c: "text-red-300" },
  unknown: { t: "غير محدد", c: "text-mist-500" },
};

export function CheckMyPc({ games, cpus, gpus }: { games: Game[]; cpus: Cpu[]; gpus: Gpu[] }) {
  const { profile, update, consent, setSaveConsent, reset } = usePcProfile();
  const cpu = cpus.find((c) => c.id === profile.cpuId);
  const gpu = gpus.find((g) => g.id === profile.gpuId);
  const rows = useMemo(() => games.map((g) => ({ g, r: checkCompatibility(g, { cpu, gpu, ramGb: profile.ramGb }) })), [games, cpu, gpu, profile.ramGb]);

  return (
    <div className="space-y-6">
      <DetectCard gpus={gpus} onApply={update} />
      <section className="panel p-5">
        <h2 className="mb-4 text-xl font-bold">مواصفاتك (تُدخل أو تُؤكَّد يدوياً)</h2>
        <PcConfigurator profile={profile} onChange={update} consent={consent} onConsent={setSaveConsent} onReset={reset} cpus={cpus} gpus={gpus} />
      </section>
      <section className="panel p-5" aria-live="polite">
        <h2 className="mb-1 text-xl font-bold">نتيجة الألعاب مقابل المتطلبات الرسمية</h2>
        <p className="mb-4 text-sm text-mist-500">هذه مقارنة بمواصفات الناشر، وليست فريمات متوقعة. افتح صفحة اللعبة لتفاصيل أكثر.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <caption className="sr-only">توافق الألعاب مع جهازك</caption>
            <thead><tr className="border-b border-ink-700 text-start text-mist-500"><th scope="col" className="py-2 text-start">اللعبة</th><th scope="col" className="py-2 text-start">النتيجة</th></tr></thead>
            <tbody>
              {rows.map(({ g, r }) => (
                <tr key={g.slug} className="border-b border-ink-800">
                  <td className="py-2"><Link href={`/games/${g.slug}`} className="hover:text-neon" dir="ltr">{g.title}</Link></td>
                  <td className={`py-2 font-bold ${label[r.verdict].c}`}>{label[r.verdict].t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
