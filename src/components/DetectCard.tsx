"use client";

import { useState } from "react";
import { Cpu as CpuIcon, ScanSearch } from "lucide-react";
import type { Gpu, PcProfile } from "@/lib/types";
import { matchGpusFromRenderer, suggestResolution } from "@/lib/detect";

interface Detected {
  screen: string;
  dpr: number;
  logicalCores: number | null;
  memoryHint: number | null;
  renderer: string | null;
  platform: string;
  suggestionGpu: Gpu | null;
  suggestionRes: PcProfile["resolution"];
}

function detect(gpus: Gpu[]): Detected {
  const dpr = window.devicePixelRatio || 1;
  const w = Math.round(window.screen.width * dpr);
  const h = Math.round(window.screen.height * dpr);
  const nav = navigator as Navigator & { deviceMemory?: number; userAgentData?: { platform?: string } };
  let renderer: string | null = null;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    if (gl && ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
  } catch {
    renderer = null;
  }
  const matches = renderer ? matchGpusFromRenderer(renderer, gpus) : [];
  return {
    screen: `${w}×${h}`,
    dpr,
    logicalCores: nav.hardwareConcurrency ?? null,
    memoryHint: nav.deviceMemory ?? null,
    renderer,
    platform: nav.userAgentData?.platform ?? nav.platform ?? "غير معروف",
    suggestionGpu: matches.length === 1 ? (matches[0] as Gpu) : null,
    suggestionRes: suggestResolution(w, h),
  };
}

export function DetectCard({ gpus, onApply }: { gpus: Gpu[]; onApply: (patch: Partial<PcProfile>) => void }) {
  const [d, setD] = useState<Detected | null>(null);

  return (
    <section className="panel relative overflow-hidden p-5" aria-labelledby="detect-title">
      <div className="mb-3 flex items-center gap-2">
        <ScanSearch className="text-cyan-glow" size={22} aria-hidden />
        <h2 id="detect-title" className="text-xl font-bold">ما يستطيع المتصفح قراءته من جهازك</h2>
      </div>
      <p className="mb-4 text-sm text-mist-300">
        المتصفح لا يكشف موديل المعالج ولا حجم الرام الحقيقي ولا ذاكرة كرت الشاشة. نقرأ فقط ما يعرضه بنفسه، وكل ما هو مكتشف أدناه <strong>اقتراح</strong> لا يُطبَّق إلا بضغطك.
        لا نُحمّل ولا نُشغّل أي برنامج على جهازك.
      </p>
      {!d ? (
        <button className="btn-primary" onClick={() => setD(detect(gpus))}>
          <CpuIcon size={18} aria-hidden /> اقرأ ما يعرضه المتصفح
        </button>
      ) : (
        <div className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="panel-soft p-3"><dt className="text-mist-500">دقة الشاشة (بالبكسل الفعلي)</dt><dd className="font-bold" dir="ltr">{d.screen} · ×{d.dpr}</dd></div>
            <div className="panel-soft p-3"><dt className="text-mist-500">النظام (كما يبلّغه المتصفح)</dt><dd className="font-bold" dir="ltr">{d.platform}</dd></div>
            <div className="panel-soft p-3"><dt className="text-mist-500">عدد المعالجات المنطقية</dt><dd className="font-bold">{d.logicalCores ?? "غير متاح"} <span className="font-normal text-mist-500">(لا يحدد الموديل)</span></dd></div>
            <div className="panel-soft p-3"><dt className="text-mist-500">تلميح الرام</dt><dd className="font-bold">{d.memoryHint ? `≈ ${d.memoryHint}GB أو أكثر` : "غير متاح في هذا المتصفح"} <span className="font-normal text-mist-500">(مقرَّب وله سقف)</span></dd></div>
            <div className="panel-soft p-3 sm:col-span-2"><dt className="text-mist-500">وصف كرت الشاشة (WebGL)</dt><dd className="font-bold" dir="ltr">{d.renderer ?? "غير متاح أو مخفي من المتصفح"}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <button className="btn-ghost" onClick={() => onApply({ resolution: d.suggestionRes })}>استخدم الدقة المقترحة ({d.suggestionRes})</button>
            {d.suggestionGpu ? (
              <button className="btn-ghost" onClick={() => onApply({ gpuId: d.suggestionGpu?.id ?? null })}>استخدم الكرت المقترح: {d.suggestionGpu.name}</button>
            ) : (
              <p className="text-sm text-amber-300">لم نتمكن من تحديد كرتك بثقة؛ اخترته يدوياً من القائمة أدناه.</p>
            )}
          </div>
          <p className="text-xs text-mist-500">للمعالج والرام: افتح مدير المهام (Ctrl+Shift+Esc) ← Performance، وانسخ القيم يدوياً.</p>
        </div>
      )}
    </section>
  );
}
