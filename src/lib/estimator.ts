import type { BenchmarkObservation, Cpu, Game, Gpu, Preset, Resolution, UpscalingMode } from "./types";

export type Confidence = "high" | "medium" | "low";

export interface EstimateInput {
  game: Game;
  cpu: Cpu | undefined;
  gpu: Gpu | undefined;
  ramGb: number | null | undefined;
  resolution: Resolution;
  preset: Preset;
  upscaling: UpscalingMode;
}

export type InsufficientCode =
  | "missing-hardware"
  | "upscaling-unsupported-game"
  | "upscaling-unsupported-gpu"
  | "no-benchmarks"
  | "no-similar-benchmark"
  | "integrated-or-mismatched-device";

export type EstimateResult =
  | { status: "insufficient"; code: InsufficientCode; reason: string }
  | {
      status: "estimated";
      fpsLow: number;
      fpsHigh: number;
      confidence: Confidence;
      confidenceReasons: string[];
      basis: "exact-gpu-measured" | "scaled-from-similar-gpu" | "model-approx";
      likelyBottleneck: "cpu" | null;
      caveats: string[];
      usedObservations: BenchmarkObservation[];
    };


/** نطاق التشابه المقبول بين كرت المستخدم وكرت القياس (نسبة فئات الأداء) */
export const GPU_SIMILARITY_RANGE: readonly [number, number] = [0.8, 1.25];
/** أس التحجيم: أقل من 1 لأن الفريمات لا تتبع قدرة الكرت خطياً */
export const SCALING_EXPONENT = 0.7;

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? (s[m] as number) : ((s[m - 1] as number) + (s[m] as number)) / 2;
};

const downgrade = (c: Confidence): Confidence => (c === "high" ? "medium" : "low");

function insufficient(code: InsufficientCode, reason: string): EstimateResult {
  return { status: "insufficient", code, reason };
}

export function estimateFps(
  input: EstimateInput,
  observations: BenchmarkObservation[],
  lookup: { cpu: (id: string) => Cpu | undefined; gpu: (id: string) => Gpu | undefined },
): EstimateResult {
  const { game, cpu, gpu, ramGb, resolution, preset, upscaling } = input;

  if (!cpu || !gpu || ramGb == null) {
    return insufficient("missing-hardware", "حدّد المعالج وكرت الشاشة وحجم الرام أولاً.");
  }
  if (upscaling !== "none") {
    if (!game.supportedUpscaling.includes(upscaling))
      return insufficient("upscaling-unsupported-game", "هذه التقنية غير مدعومة في اللعبة حسب بياناتنا.");
    if (upscaling === "dlss" && !(gpu.manufacturer === "NVIDIA" && /RTX/i.test(gpu.name)))
      return insufficient("upscaling-unsupported-gpu", "تقنية DLSS تتطلب كرت NVIDIA من سلسلة RTX.");
  }
  const gameObs = observations.filter((o) => o.gameSlug === game.slug);
  if (gameObs.length === 0) return modelEstimate(input, cpu, gpu, ramGb, lookup);

  // لا نخلط لابتوب بمكتبي، ولا نقدّر بين دقات/إعدادات/تقنيات رفع مختلفة (لا دليل على التحويل).
  const comparable = gameObs
    .filter((o) => o.resolution === resolution && o.preset === preset && o.upscaling === upscaling)
    .map((o) => ({ o, obsGpu: lookup.gpu(o.gpuId), obsCpu: lookup.cpu(o.cpuId) }))
    .filter((x): x is { o: BenchmarkObservation; obsGpu: Gpu; obsCpu: Cpu | undefined } => !!x.obsGpu)
    .filter((x) => x.obsGpu.deviceType === gpu.deviceType);

  const exact = comparable.filter((x) => x.obsGpu.id === gpu.id);
  const [lo, hi] = GPU_SIMILARITY_RANGE;
  const near = comparable.filter((x) => {
    const r = gpu.perfClass / x.obsGpu.perfClass;
    return x.obsGpu.id !== gpu.id && r >= lo && r <= hi;
  });

  const pool = exact.length ? exact : near;
  if (pool.length === 0) return modelEstimate(input, cpu, gpu, ramGb, lookup);

  const caveats: string[] = [
    "هذا تقدير مبني على قياسات منشورة لعتاد مشابه، وليس اختباراً مباشراً لجهازك.",
  ];
  const reasons: string[] = [];
  let confidence: Confidence;
  let low: number;
  let high: number;
  let basis: "exact-gpu-measured" | "scaled-from-similar-gpu";

  if (exact.length) {
    const fps = exact.map((x) => x.o.avgFps);
    low = Math.min(...fps) * 0.92;
    high = Math.max(...fps) * 1.08;
    basis = "exact-gpu-measured";
    confidence = exact.length >= 2 ? "high" : "medium";
    reasons.push(`توجد ${exact.length} قياسات لنفس كرت الشاشة بنفس الدقة والإعدادات.`);
  } else {
    const scaled = near.map((x) => x.o.avgFps * Math.pow(gpu.perfClass / x.obsGpu.perfClass, SCALING_EXPONENT));
    const m = median(scaled);
    low = m * 0.85;
    high = m * 1.15;
    basis = "scaled-from-similar-gpu";
    confidence = "low";
    reasons.push("لا يوجد قياس لنفس الكرت؛ جرى التقدير من كرت قريب في الفئة مع تحجيم غير خطي.");
    caveats.push("التحجيم بين كرتين مختلفين يضيف عدم يقين إضافياً.");
  }

  // المعالج: اختلاف كبير عن جهاز القياس قد يغيّر النتيجة.
  let likelyBottleneck: "cpu" | null = null;
  const cpuRatios = pool.filter((x) => x.obsCpu).map((x) => cpu.perfClass / (x.obsCpu as Cpu).perfClass);
  if (cpuRatios.length) {
    const r = median(cpuRatios);
    if (r < 0.75) {
      likelyBottleneck = "cpu";
      low *= 0.8;
      confidence = downgrade(confidence);
      reasons.push("معالجك أضعف بوضوح من معالج جهاز القياس؛ قد يكون هو الحلقة الأضعف.");
      caveats.push("المعالج الأضعف قد يخفض الفريمات حتى لو كان الكرت مطابقاً.");
    } else if (r > 1.6) {
      confidence = confidence === "high" ? "medium" : confidence;
      reasons.push("معالجك أقوى بكثير من معالج جهاز القياس؛ يصعب الجزم بمدى الاستفادة.");
    } else {
      reasons.push("المعالج قريب من معالج جهاز القياس.");
    }
  } else {
    confidence = downgrade(confidence);
    reasons.push("لا تتوفر بيانات معالج مقارنة لهذه القياسات.");
  }

  // الرام.
  if (ramGb < game.min.ramGb) {
    confidence = downgrade(confidence);
    caveats.push(`رامك (${ramGb}GB) أقل من الحد الأدنى الرسمي (${game.min.ramGb}GB)؛ توقع تقطيعاً.`);
  }
  const obsRams = pool.map((x) => x.o.ramGb);
  if (Math.max(...obsRams) >= ramGb * 2) {
    confidence = downgrade(confidence);
    reasons.push("حجم الرام في جهاز القياس أكبر بكثير من رامك.");
  }

  // ذاكرة الفيديو.
  const obsVram = pool.map((x) => x.obsGpu.vramGb).filter((v): v is number => v != null);
  if (gpu.vramGb != null && obsVram.length && gpu.vramGb < Math.max(...obsVram) * 0.75) {
    confidence = downgrade(confidence);
    caveats.push("ذاكرة الفيديو لديك أقل من كرت القياس؛ قد يحدث تقطيع في الإعدادات العالية.");
  }

  if (gpu.deviceType === "laptop") {
    caveats.push("اللابتوب يتأثر بحد الطاقة والتبريد؛ الأداء الفعلي قد يقل عن القياسات.");
  }
  caveats.push("لا يشمل التقدير تقطيع الـ Shaders أو اختلافات إصدارات اللعبة والتعريفات.");

  return {
    status: "estimated",
    fpsLow: Math.max(1, Math.round(low)),
    fpsHigh: Math.max(1, Math.round(high)),
    confidence,
    confidenceReasons: reasons,
    basis,
    likelyBottleneck,
    caveats,
    usedObservations: pool.map((x) => x.o),
  };
}


// ---------------------------------------------------------------------------
// نموذج تقريبي (يُستخدم فقط عند غياب قياسات مناسبة). ليس قياساً ولا يدّعي دقة.
// يقارن جهازك بعتاد المتطلبات الرسمية للعبة (نقطة ارتكاز) ثم يطبّق عوامل دقة وإعدادات
// تقريبية وتحجيماً غير خطي. كل الثوابت تقديرية وتُعرض للمستخدم كتقدير.
// ---------------------------------------------------------------------------
/** الفريمات المفترضة لعتاد "الموصى به" عند 1080p/High حسب نوع اللعبة */
export const MODEL_ANCHOR_FPS = { esports: 140, light: 100, standard: 60, heavy: 50 } as const;
export const RESOLUTION_FACTOR: Record<Resolution, number> = { "720p": 1.7, "1080p": 1, "1440p": 0.62, "4k": 0.32 };
export const PRESET_FACTOR: Record<Preset, number> = { low: 1.45, medium: 1.2, high: 1, ultra: 0.78 };
const UPSCALE_FACTOR = 1.35;

function minClass(refs: string[], pick: (id: string) => number | undefined): number | null {
  const v = refs.map(pick).filter((x): x is number => typeof x === "number");
  return v.length ? Math.min(...v) : null;
}

export function modelEstimate(
  input: EstimateInput,
  cpu: Cpu,
  gpu: Gpu,
  ramGb: number,
  lookup: { cpu: (id: string) => Cpu | undefined; gpu: (id: string) => Gpu | undefined },
): EstimateResult {
  const { game, resolution, preset, upscaling } = input;
  const kind = game.perfKind ?? "standard";
  const useRec = !!game.recommended;
  const anchor = game.recommended ?? game.min;
  const other = game.recommended ? game.min : undefined;
  const refGpu = minClass(anchor.gpuRefs, (id) => lookup.gpu(id)?.perfClass) ?? (other ? minClass(other.gpuRefs, (id) => lookup.gpu(id)?.perfClass) : null) ?? 100;
  const refCpu = minClass(anchor.cpuRefs, (id) => lookup.cpu(id)?.perfClass) ?? (other ? minClass(other.cpuRefs, (id) => lookup.cpu(id)?.perfClass) : null) ?? 100;

  const base = MODEL_ANCHOR_FPS[kind] * (useRec ? 1 : 0.7);
  const anchorPreset: Preset = useRec ? "high" : "low";
  const gpuRatio = gpu.perfClass / refGpu;
  const gpuTerm = Math.pow(gpuRatio, SCALING_EXPONENT);
  const cpuRatio = cpu.perfClass / refCpu;
  const cpuUpper = kind === "esports" || kind === "light" ? 1.3 : 1.05;
  const cpuTerm = Math.min(cpuUpper, Math.max(0.45, Math.pow(cpuRatio, 0.5)));

  let fps = base * gpuTerm * cpuTerm * RESOLUTION_FACTOR[resolution] * (PRESET_FACTOR[preset] / PRESET_FACTOR[anchorPreset]);
  if (upscaling !== "none" && resolution !== "720p") fps *= UPSCALE_FACTOR;
  if (ramGb < game.min.ramGb) fps *= 0.7;
  if (gpu.deviceType === "laptop") fps *= 0.85;
  fps = Math.min(kind === "esports" ? 400 : 240, Math.max(4, fps));

  const likelyBottleneck = cpuTerm < 0.8 && cpuRatio < gpuRatio * 0.8 ? ("cpu" as const) : null;
  const caveats = [
    "هذا تقدير تقريبي بنموذج داخلي وليس قياساً على جهازك؛ النتيجة الفعلية قد تختلف بوضوح.",
    "يعتمد النموذج على فئات أداء نسبية تقريبية وعلى افتراض أن عتاد «الموصى به» يحقق نحو " + Math.round(MODEL_ANCHOR_FPS[kind] * (useRec ? 1 : 0.7)) + " إطاراً عند 1080p.",
    "لا يشمل التقدير تقطيع الـ Shaders أو إصدار اللعبة والتعريفات أو برامج الخلفية.",
  ];
  if (ramGb < game.min.ramGb) caveats.push(`رامك (${ramGb}GB) أقل من الحد الأدنى الرسمي (${game.min.ramGb}GB)؛ توقع تقطيعاً.`);
  if (gpu.deviceType === "laptop") caveats.push("اللابتوب يتأثر بحد الطاقة والتبريد؛ الأداء الفعلي قد يقل.");
  if (gpu.deviceType === "integrated") caveats.push("الكروت المدمجة غالباً تتطلب دقة وإعدادات منخفضة.");
  if (gpu.vramGb != null && game.min.vramGb && gpu.vramGb < game.min.vramGb) caveats.push("ذاكرة الفيديو أقل من المطلوب؛ قد يحدث تقطيع.");

  return {
    status: "estimated",
    fpsLow: Math.max(1, Math.round(fps * 0.8)),
    fpsHigh: Math.max(2, Math.round(fps * 1.2)),
    confidence: "low",
    confidenceReasons: ["لا توجد قياسات منشورة مطابقة، لذلك الثقة منخفضة دائماً في هذا النوع من التقدير."],
    basis: "model-approx",
    likelyBottleneck,
    caveats,
    usedObservations: [],
  };
}

export const confidenceLabel: Record<Confidence, string> = {
  high: "مرتفعة",
  medium: "متوسطة",
  low: "منخفضة",
};
