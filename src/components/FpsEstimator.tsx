"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BenchmarkObservation, Cpu, Game, Gpu, Preset, UpscalingMode } from "@/lib/types";
import type { SlimGame } from "@/lib/search-index";
import { PRESETS, presetLabel, RESOLUTIONS, resolutionLabel } from "@/lib/profile";
import { usePcProfile } from "@/lib/use-pc-profile";
import { checkCompatibility } from "@/lib/compat";
import { confidenceLabel, estimateFps } from "@/lib/estimator";
import { PcConfigurator } from "./PcConfigurator";
import { CompatPanel } from "./CompatPanel";

type GameLite = Pick<Game, "slug" | "title" | "titleAr" | "supportedUpscaling" | "min" | "recommended" | "verification" | "tipsAr">;

const upscalingLabel: Record<UpscalingMode, string> = { none: "بدون", dlss: "DLSS (كروت RTX)", fsr: "FSR", xess: "XeSS" };

interface Props {
  games: (GameLite & SlimGame)[];
  cpus: Cpu[];
  gpus: Gpu[];
  observations: BenchmarkObservation[];
  /** عند تمريره تُثبَّت اللعبة (صفحة اللعبة) ولا يظهر منتقي الألعاب */
  fixedSlug?: string;
}

export function FpsEstimator({ games, cpus, gpus, observations, fixedSlug }: Props) {
  const { profile, update, consent, setSaveConsent, reset } = usePcProfile();
  const [slug, setSlug] = useState(fixedSlug ?? games[0]?.slug ?? "");
  const [preset, setPreset] = useState<Preset>("medium");
  const [upscaling, setUpscaling] = useState<UpscalingMode>("none");

  const game = games.find((g) => g.slug === slug);
  const cpu = cpus.find((c) => c.id === profile.cpuId);
  const gpu = gpus.find((g) => g.id === profile.gpuId);

  // لا تظهر خيارات الرفع إلا للعبة التي تدعمها فعلاً، وDLSS لكروت RTX فقط.
  const upscalingOptions = useMemo(() => {
    const opts: UpscalingMode[] = ["none"];
    for (const u of game?.supportedUpscaling ?? []) {
      if (u === "dlss" && !(gpu && gpu.manufacturer === "NVIDIA" && /RTX/i.test(gpu.name))) continue;
      opts.push(u);
    }
    return opts;
  }, [game, gpu]);
  const effectiveUpscaling = upscalingOptions.includes(upscaling) ? upscaling : "none";

  const compat = useMemo(() => (game ? checkCompatibility(game as Game, { cpu, gpu, ramGb: profile.ramGb }) : null), [game, cpu, gpu, profile.ramGb]);
  const estimate = useMemo(
    () => game ? estimateFps(
      { game: game as Game, cpu, gpu, ramGb: profile.ramGb, resolution: profile.resolution, preset, upscaling: effectiveUpscaling },
      observations,
      { cpu: (id) => cpus.find((c) => c.id === id), gpu: (id) => gpus.find((g) => g.id === id) },
    ) : null,
    [game, cpu, gpu, profile.ramGb, profile.resolution, preset, effectiveUpscaling, observations, cpus, gpus],
  );

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h2 className="mb-4 text-xl font-bold">1) مواصفات جهازك</h2>
        <PcConfigurator profile={profile} onChange={update} consent={consent} onConsent={setSaveConsent} onReset={reset} cpus={cpus} gpus={gpus} showResolution={false} showOs={false} />
      </div>

      <div className="panel p-5">
        <h2 className="mb-4 text-xl font-bold">2) اللعبة والإعدادات</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {!fixedSlug && (
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="label" htmlFor="est-game">اللعبة</label>
              <select id="est-game" className="field" value={slug} onChange={(e) => setSlug(e.target.value)}>
                {games.map((g) => <option key={g.slug} value={g.slug}>{g.title}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="label" htmlFor="est-res">الدقة</label>
            <select id="est-res" className="field" value={profile.resolution} onChange={(e) => update({ resolution: e.target.value as typeof profile.resolution })}>
              {RESOLUTIONS.map((r) => <option key={r} value={r}>{resolutionLabel[r]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="est-preset">مستوى الجرافيكس</label>
            <select id="est-preset" className="field" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
              {PRESETS.map((p) => <option key={p} value={p}>{presetLabel[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="est-up">تقنية رفع الدقة</label>
            <select id="est-up" className="field" value={effectiveUpscaling} onChange={(e) => setUpscaling(e.target.value as UpscalingMode)} disabled={upscalingOptions.length === 1}>
              {upscalingOptions.map((u) => <option key={u} value={u}>{upscalingLabel[u]}</option>)}
            </select>
            {upscalingOptions.length === 1 && <p className="mt-1 text-xs text-mist-500">لا تتوفر خيارات رفع لهذه اللعبة/الكرت في بياناتنا.</p>}
          </div>
        </div>
      </div>

      <div className="panel p-5" aria-live="polite">
        <h2 className="mb-4 text-xl font-bold">3) النتيجة</h2>
        {game && compat && (
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-lg font-bold">هل يحقق جهازك المتطلبات الرسمية؟</h3>
              <CompatPanel result={compat} />
            </section>

            <section>
              <h3 className="mb-2 text-lg font-bold">كم فريم هتلعب؟</h3>
              {estimate?.status === "estimated" ? (
                <div className="space-y-3">
                  <p className="text-4xl font-bold text-neon" dir="ltr"><span className="text-xl text-mist-300">≈ </span>{estimate.fpsLow}–{estimate.fpsHigh} <span className="text-base text-mist-300">FPS</span></p>
                  <p className="text-sm text-mist-300">الدقة: {resolutionLabel[profile.resolution]} · الإعدادات: {presetLabel[preset]} · الرفع: {upscalingLabel[effectiveUpscaling]}</p>
                  <p className="rounded-lg border border-amber-400/40 bg-amber-400/5 p-3 text-sm text-amber-200">
                    {estimate.basis === "model-approx"
                      ? "تقدير تقريبي بنموذج داخلي وليس قياساً حقيقياً على جهازك، فالنتيجة الفعلية قد تختلف."
                      : estimate.basis === "exact-gpu-measured"
                        ? "نطاق مبني على قياسات منشورة لنفس كرت الشاشة، وليس اختباراً مباشراً لجهازك."
                        : "تقدير مُحجَّم من كرت قريب في الفئة، وليس اختباراً مباشراً لجهازك."}
                  </p>
                  <p className="text-sm"><strong>مستوى الثقة: {confidenceLabel[estimate.confidence]}</strong></p>
                  <ul className="list-disc space-y-1 pe-5 text-sm text-mist-300">{estimate.confidenceReasons.map((r) => <li key={r}>{r}</li>)}</ul>
                  {estimate.likelyBottleneck === "cpu" && <p className="text-sm text-amber-300">الحلقة الأضعف المحتملة: المعالج.</p>}
                  <ul className="list-disc space-y-1 pe-5 text-sm text-mist-500">{estimate.caveats.map((c) => <li key={c}>{c}</li>)}</ul>
                  <ul className="text-xs text-mist-500">
                    {estimate.usedObservations.map((o) => <li key={o.id}>المصدر: <a className="text-cyan-glow underline" href={o.source.url} rel="noopener noreferrer nofollow" target="_blank">{o.source.label}</a> (اطُّلع عليه {o.source.retrievedAt})</li>)}
                  </ul>
                </div>
              ) : (
                <p className="rounded-lg border border-ink-600 bg-ink-950 p-4 text-sm text-mist-300">
                  {estimate?.status === "insufficient" && estimate.code === "missing-hardware"
                    ? "اختر المعالج وكرت الشاشة واكتب حجم الرام في الأعلى، وسيظهر لك عدد الفريمات المتوقع هنا مباشرة."
                    : estimate?.status === "insufficient" ? estimate.reason : "اختر مواصفات جهازك لعرض الفريمات المتوقعة."}
                </p>
              )}
            </section>

            <section>
              <h3 className="mb-2 text-lg font-bold">إعدادات مقترحة</h3>
              <ul className="list-disc space-y-1 pe-5 text-sm text-mist-300">
                {game.tipsAr.map((t) => <li key={t}>{t}</li>)}
                {compat.verdict === "below-minimum" && <li>جهازك أقل من الحد الأدنى الرسمي: ابدأ بأقل دقة وأقل إعدادات، وتوقع أداءً غير مريح.</li>}
              </ul>
            </section>

            {!fixedSlug && <Link href={`/games/${game.slug}`} className="btn-primary">صفحة {game.titleAr ?? game.title}</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
