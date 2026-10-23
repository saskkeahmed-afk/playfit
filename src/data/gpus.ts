import type { Gpu } from "@/lib/types";
import { slugify } from "@/lib/slug";

type Row = [mfr: Gpu["manufacturer"], name: string, vram: number | null, arch: string, type: Gpu["deviceType"], perfClass: number];

/**
 * perfClass: فئة نسبية تقريبية (GTX 1060 6GB = 100) مبنية على قوائم الأداء العامة.
 * تُستخدم فقط للتحقق من المتطلبات الرسمية، وليست قياساً ولا تتنبأ بالفريمات.
 * لا تُقارن كروت اللابتوب بنظيراتها المكتبية بالاسم: لكل منها deviceType منفصل.
 */
const rows: Row[] = [
  ["Intel", "Intel HD Graphics 4000", null, "Ivy Bridge", "integrated", 5],
  ["Intel", "Intel UHD Graphics 620", null, "Kaby Lake R", "integrated", 7],
  ["AMD", "Radeon R5 (مدمج)", null, "GCN", "integrated", 5],
  ["NVIDIA", "GeForce GT 730", 2, "Kepler", "desktop", 8],
  ["AMD", "Radeon R7 240", 2, "GCN 1.0", "desktop", 8],
  ["AMD", "Radeon R7 370", 2, "GCN 1.0", "desktop", 45],
  ["NVIDIA", "GeForce GTX 660", 2, "Kepler", "desktop", 45],
  ["NVIDIA", "GeForce GTX 770", 2, "Kepler", "desktop", 60],
  ["AMD", "Radeon HD 7870", 2, "GCN 1.0", "desktop", 50],
  ["AMD", "Radeon R9 280", 3, "GCN 1.0", "desktop", 60],
  ["AMD", "Radeon R9 290", 4, "GCN 2.0", "desktop", 95],
  ["AMD", "Radeon R9 290X", 4, "GCN 2.0", "desktop", 105],
  ["NVIDIA", "GeForce GTX 950", 2, "Maxwell", "desktop", 45],
  ["NVIDIA", "GeForce GTX 960", 4, "Maxwell", "desktop", 58],
  ["NVIDIA", "GeForce GTX 970", 4, "Maxwell", "desktop", 95],
  ["NVIDIA", "GeForce GTX 1050 Ti", 4, "Pascal", "desktop", 65],
  ["NVIDIA", "GeForce GTX 1060 3GB", 3, "Pascal", "desktop", 88],
  ["NVIDIA", "GeForce GTX 1060 6GB", 6, "Pascal", "desktop", 100],
  ["NVIDIA", "GeForce GTX 1070", 8, "Pascal", "desktop", 140],
  ["NVIDIA", "GeForce GTX 1080 Ti", 11, "Pascal", "desktop", 215],
  ["NVIDIA", "GeForce GTX 1650", 4, "Turing", "desktop", 78],
  ["NVIDIA", "GeForce GTX 1660 Super", 6, "Turing", "desktop", 130],
  ["NVIDIA", "GeForce RTX 2060", 6, "Turing", "desktop", 150],
  ["NVIDIA", "GeForce RTX 2060 Super", 8, "Turing", "desktop", 175],
  ["NVIDIA", "GeForce RTX 3050 (8GB)", 8, "Ampere", "desktop", 130],
  ["NVIDIA", "GeForce RTX 3060 (12GB)", 12, "Ampere", "desktop", 190],
  ["NVIDIA", "GeForce RTX 4060", 8, "Ada Lovelace", "desktop", 215],
  ["NVIDIA", "GeForce RTX 4070", 12, "Ada Lovelace", "desktop", 310],
  ["AMD", "Radeon RX 470", 4, "Polaris", "desktop", 85],
  ["AMD", "Radeon RX 480", 8, "Polaris", "desktop", 95],
  ["AMD", "Radeon RX 570", 4, "Polaris", "desktop", 100],
  ["AMD", "Radeon RX 580", 8, "Polaris", "desktop", 115],
  ["AMD", "Radeon RX 590", 8, "Polaris", "desktop", 120],
  ["AMD", "Radeon RX Vega 56", 8, "Vega", "desktop", 150],
  ["AMD", "Radeon RX 5700 XT", 8, "RDNA", "desktop", 180],
  ["AMD", "Radeon RX 6600", 8, "RDNA 2", "desktop", 175],
  // اللابتوب: أمثلة بأسماء مميزة. فئاتها تقريبية وتتأثر بحد الطاقة والتبريد.
  ["NVIDIA", "GeForce GTX 1650 (لابتوب)", 4, "Turing", "laptop", 65],
  ["NVIDIA", "GeForce RTX 3050 (لابتوب)", 4, "Ampere", "laptop", 105],
  ["NVIDIA", "GeForce RTX 3060 (لابتوب)", 6, "Ampere", "laptop", 150],
  ["NVIDIA", "GeForce GTX 750 Ti", 2, "Maxwell", "desktop", 45],
  ["NVIDIA", "GeForce GTX 760", 2, "Kepler", "desktop", 55],
  ["NVIDIA", "GeForce GTX 780", 3, "Kepler", "desktop", 85],
  ["AMD", "Radeon HD 7950", 3, "GCN 1.0", "desktop", 58],
  ["AMD", "Radeon R7 260X", 2, "GCN 1.1", "desktop", 45],
  ["AMD", "Radeon RX 460", 4, "Polaris", "desktop", 60],
  ["AMD", "Radeon RX 560", 4, "Polaris", "desktop", 62],
  ["NVIDIA", "GeForce GTX 1050", 2, "Pascal", "desktop", 55],
  ["NVIDIA", "GeForce GTX 1070 Ti", 8, "Pascal", "desktop", 155],
  ["NVIDIA", "GeForce GTX 1080", 8, "Pascal", "desktop", 180],
  ["NVIDIA", "GeForce GTX 1660", 6, "Turing", "desktop", 115],
  ["NVIDIA", "GeForce RTX 2070", 8, "Turing", "desktop", 185],
  ["NVIDIA", "GeForce RTX 2080", 8, "Turing", "desktop", 235],
  ["NVIDIA", "GeForce RTX 3070", 8, "Ampere", "desktop", 280],
  ["NVIDIA", "GeForce RTX 3080", 10, "Ampere", "desktop", 380],
  ["NVIDIA", "GeForce RTX 4060 Ti", 8, "Ada Lovelace", "desktop", 255],
  ["AMD", "Radeon RX 5600 XT", 6, "RDNA", "desktop", 165],
  ["AMD", "Radeon RX 5700", 8, "RDNA", "desktop", 165],
  ["AMD", "Radeon RX 6600 XT", 8, "RDNA 2", "desktop", 200],
  ["AMD", "Radeon RX 6700 XT", 12, "RDNA 2", "desktop", 245],
  ["AMD", "Radeon RX 6800 XT", 16, "RDNA 2", "desktop", 340],
  ["AMD", "Radeon RX Vega 64", 8, "Vega", "desktop", 170],
];

export const gpus: Gpu[] = rows.map(([manufacturer, name, vramGb, architecture, deviceType, perfClass]) => ({
  id: slugify(name.replace("لابتوب", "laptop").replace("مدمج", "integrated").replace(/[()]/g, " ")),
  manufacturer,
  name,
  vramGb,
  architecture,
  deviceType,
  perfClass,
}));

export const gpuById = new Map(gpus.map((g) => [g.id, g]));
export const getGpu = (id: string) => gpuById.get(id);
