"use client";

import { useId, useState } from "react";
import type { Cpu, Gpu, PcProfile } from "@/lib/types";
import { RESOLUTIONS, osLabel, parseRamInput, resolutionLabel } from "@/lib/profile";

interface Props {
  profile: PcProfile;
  onChange: (patch: Partial<PcProfile>) => void;
  consent: boolean;
  onConsent: (on: boolean) => void;
  onReset: () => void;
  cpus: Cpu[];
  gpus: Gpu[];
  showResolution?: boolean;
  showOs?: boolean;
}

export function PcConfigurator({ profile, onChange, consent, onConsent, onReset, cpus, gpus, showResolution = true, showOs = true }: Props) {
  const uid = useId();
  const [ramText, setRamText] = useState(profile.ramGb?.toString() ?? "");
  const [ramError, setRamError] = useState<string | null>(null);

  // مزامنة حقل الرام عند تحميل ملف محفوظ.
  const shownRam = profile.ramGb?.toString() ?? "";
  const [lastSynced, setLastSynced] = useState(shownRam);
  if (shownRam !== lastSynced) {
    setLastSynced(shownRam);
    if (ramText !== shownRam) setRamText(shownRam);
  }

  const groupBy = <T extends { manufacturer: string }>(items: T[]) =>
    Object.entries(items.reduce<Record<string, T[]>>((acc, it) => ((acc[it.manufacturer] ??= []).push(it), acc), {}));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${uid}-cpu`}>المعالج (CPU)</label>
          <select id={`${uid}-cpu`} className="field" value={profile.cpuId ?? ""} onChange={(e) => onChange({ cpuId: e.target.value || null })}>
            <option value="">اختر المعالج…</option>
            {groupBy(cpus).map(([m, list]) => (
              <optgroup key={m} label={m}>
                {list.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-gpu`}>كرت الشاشة (GPU)</label>
          <select id={`${uid}-gpu`} className="field" value={profile.gpuId ?? ""} onChange={(e) => onChange({ gpuId: e.target.value || null })}>
            <option value="">اختر كرت الشاشة…</option>
            {groupBy(gpus).map(([m, list]) => (
              <optgroup key={m} label={m}>
                {list.map((g) => <option key={g.id} value={g.id}>{g.name}{g.deviceType === "integrated" ? " — مدمج" : ""}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-ram`}>الرام (GB)</label>
          <input
            id={`${uid}-ram`}
            className="field"
            inputMode="numeric"
            dir="ltr"
            placeholder="مثال: 16"
            value={ramText}
            aria-invalid={!!ramError}
            aria-describedby={ramError ? `${uid}-ram-err` : undefined}
            onChange={(e) => {
              const t = e.target.value;
              setRamText(t);
              const r = parseRamInput(t);
              if (r.ok) { setRamError(null); onChange({ ramGb: r.value }); } else setRamError(r.error);
            }}
          />
          {ramError && <p id={`${uid}-ram-err`} role="alert" className="mt-1 text-sm text-red-400">{ramError}</p>}
        </div>
        {showResolution && (
          <div>
            <label className="label" htmlFor={`${uid}-res`}>دقة الشاشة</label>
            <select id={`${uid}-res`} className="field" value={profile.resolution} onChange={(e) => onChange({ resolution: e.target.value as PcProfile["resolution"] })}>
              {RESOLUTIONS.map((r) => <option key={r} value={r}>{resolutionLabel[r]}</option>)}
            </select>
          </div>
        )}
        {showOs && (
          <div>
            <label className="label" htmlFor={`${uid}-os`}>نظام التشغيل</label>
            <select id={`${uid}-os`} className="field" value={profile.os} onChange={(e) => onChange({ os: e.target.value as PcProfile["os"] })}>
              {(Object.keys(osLabel) as PcProfile["os"][]).map((k) => <option key={k} value={k}>{osLabel[k]}</option>)}
            </select>
          </div>
        )}
      </div>
      <p className="text-xs text-mist-500">لم تجد معالجك أو كرتك؟ قائمتنا محدودة حالياً؛ اترك الخانة فارغة وستظهر النتائج «غير محددة» بدل تخمين خاطئ.</p>

      <div className="panel-soft flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-mist-300">
          <input type="checkbox" className="mt-1.5 h-4 w-4 accent-[#39ff88]" checked={consent} onChange={(e) => onConsent(e.target.checked)} />
          <span>احفظ مواصفاتي على هذا المتصفح فقط (تخزين محلي، لا يُرسل لأي خادم).</span>
        </label>
        <button type="button" className="btn-ghost" onClick={() => { onReset(); setRamText(""); setRamError(null); }}>
          إعادة ضبط ومسح المحفوظ
        </button>
      </div>
    </div>
  );
}
