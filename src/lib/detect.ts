import type { Gpu, Resolution } from "./types";

/** مفتاح مطابقة مشتق من اسم الكرت: بدون العلامة التجارية والأقواس. */
export function gpuKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/geforce|radeon|intel|nvidia|amd/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * يحاول مطابقة نص WebGL renderer بكرت واحد فقط من قاعدتنا.
 * إن كان النص غامضاً (مثلاً GTX 1060 دون ذكر الذاكرة) أو مقنّعاً من المتصفح نعيد قائمة فارغة؛
 * لا نخمّن. المتصفحات قد تخفي أو تعمّم هذا النص، فالنتيجة اقتراح وليست حقيقة.
 */
export function matchGpusFromRenderer(renderer: string, gpus: Gpu[]): Gpu[] {
  const text = renderer.toLowerCase().replace(/\s+/g, " ");
  const wantsLaptop = /laptop|max-q|mobile/.test(text);
  const hits = gpus.filter((g) => {
    if (wantsLaptop ? g.deviceType !== "laptop" : g.deviceType === "laptop") return false;
    const key = gpuKey(g.name);
    if (key.length < 6) return false;
    const re = new RegExp(`(?<![a-z0-9])${esc(key)}(?![a-z0-9])(?!\\s?(ti|super|xt|xtx|x)\\b)`);
    return re.test(text);
  });
  if (hits.length <= 1) return hits;
  // نفضّل أطول مفتاح (الأكثر تحديداً) إن كان وحيداً.
  const maxLen = Math.max(...hits.map((g) => gpuKey(g.name).length));
  const longest = hits.filter((g) => gpuKey(g.name).length === maxLen);
  return longest.length === 1 ? longest : [];
}

/** دقة الشاشة لا تساوي دقة اللعب، لكنها اقتراح معقول (نستخدم الضلع الأطول بالبكسل الفعلي). */
export function suggestResolution(width: number, height: number): Resolution {
  const long = Math.max(width, height);
  if (long >= 3200) return "4k";
  if (long >= 2300) return "1440p";
  if (long >= 1800) return "1080p";
  return "720p";
}
