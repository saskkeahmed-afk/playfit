export type Resolution = "720p" | "1080p" | "1440p" | "4k";
export type Preset = "low" | "medium" | "high" | "ultra";
export type UpscalingMode = "none" | "dlss" | "fsr" | "xess";
export type DeviceType = "desktop" | "laptop" | "integrated";

/** حالة التحقق من البيانات: لا نعرض أي رقم كحقيقة رسمية إلا بعد المراجعة. */
export type VerificationStatus = "verified" | "needs-review";

export interface Cpu {
  id: string;
  manufacturer: "Intel" | "AMD";
  name: string;
  cores: number;
  threads: number;
  architecture: string;
  /** فئة أداء نسبية تقريبية (Core i5-8400 = 100). ليست قياساً. */
  perfClass: number;
}

export interface Gpu {
  id: string;
  manufacturer: "NVIDIA" | "AMD" | "Intel";
  name: string;
  vramGb: number | null;
  architecture: string;
  deviceType: DeviceType;
  /** فئة أداء نسبية تقريبية (GTX 1060 6GB = 100). ليست قياساً. */
  perfClass: number;
}

export interface RequirementTier {
  os?: string;
  cpuText: string;
  /** بدائل المعالج المذكورة رسمياً؛ يكفي الوصول لأي منها. */
  cpuRefs: string[];
  gpuText: string;
  gpuRefs: string[];
  ramGb: number;
  vramGb?: number;
  storageGb?: number;
  storageType?: "HDD" | "SSD" | "SSD مفضّل";
  note?: string;
}

export interface GameImage {
  /** مسار محلي داخل public/ مرخّص للاستخدام. غير متوفر حالياً لأي لعبة. */
  src: string;
  width: number;
  height: number;
  credit?: string;
}

export interface Game {
  slug: string;
  title: string;
  titleAr?: string;
  genres: string[];
  releaseYear: number;
  developer: string;
  publisher: string;
  platforms: string[];
  descriptionAr: string;
  min: RequirementTier;
  recommended?: RequirementTier;
  /** مصدر المتطلبات الرسمي */
  requirementsSource: { label: string; url: string };
  verification: VerificationStatus;
  /** الإعدادات/الدقات المدعومة بالفعل في اللعبة */
  supportedUpscaling: UpscalingMode[];
  /** نصائح خاصة باللعبة */
  tipsAr: string[];
  faqAr: { q: string; a: string }[];
  similar: string[];
  guides: string[];
  /** مؤشر شعبية يدوي للترتيب فقط؛ ليس إحصاء حقيقياً. */
  editorialRank: number;
  /** معرّف اللعبة في Steam (لصورة الغلاف من متجر Steam) */
  steamAppId?: number;
  /** يحدد منحنى التقدير التقريبي: تنافسية خفيفة / خفيفة / عادية / ثقيلة */
  perfKind?: "esports" | "light" | "standard" | "heavy";
  image?: GameImage;
}

/** قياس حقيقي من مصدر مستقل. لا تُضف إلا قياسات موثّقة. */
export interface BenchmarkObservation {
  id: string;
  gameSlug: string;
  cpuId: string;
  gpuId: string;
  ramGb: number;
  resolution: Resolution;
  preset: Preset;
  upscaling: UpscalingMode;
  avgFps: number;
  /** فقط إن كان مقاساً فعلاً */
  onePercentLowFps?: number;
  gameVersion?: string;
  source: { label: string; url: string; retrievedAt: string };
}

export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  sections: GuideSection[];
}

export type GuideCategory =
  | "رفع FPS"
  | "حل مشاكل التشغيل"
  | "تحسين أداء اللابتوب"
  | "إعدادات الجرافيكس"
  | "تعريفات كروت الشاشة"
  | "متطلبات التشغيل"
  | "تقليل التقطيع";

export interface PcProfile {
  cpuId: string | null;
  gpuId: string | null;
  ramGb: number | null;
  resolution: Resolution;
  os: "windows11" | "windows10" | "windows-old" | "other";
}
