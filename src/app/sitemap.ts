import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { games } from "@/data/games";
import { guides } from "@/data/guides";
import { gpus } from "@/data/gpus";
import { cpus } from "@/data/cpus";
import { cpuIsIndexable, gpuIsIndexable } from "@/lib/hardware";
import { categories } from "@/data/categories";
import { categoryIsIndexable } from "@/lib/categories";

/** بدون دومين إنتاجي مضبوط لا نُصدر روابط placeholder: الـ sitemap فارغ. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  const site: string = SITE_URL;
  const u = (path: string, lastModified?: string, priority?: number) => ({ url: path === "/" ? site : `${site}${path}`, ...(lastModified ? { lastModified } : {}), ...(priority ? { priority } : {}) });
  return [
    u("/", undefined, 1),
    u("/games", undefined, 0.9),
    ...games.map((g) => u(`/games/${g.slug}`, undefined, 0.8)),
    u("/check-my-pc", undefined, 0.8),
    u("/fps-calculator", undefined, 0.8),
    u("/gpus"),
    ...gpus.filter((g) => gpuIsIndexable(g)).map((g) => u(`/gpus/${g.id}`)),
    u("/cpus"),
    ...cpus.filter((c) => cpuIsIndexable(c)).map((c) => u(`/cpus/${c.id}`)),
    u("/compare"),
    u("/guides", undefined, 0.7),
    ...guides.map((g) => u(`/guides/${g.slug}`, g.updatedAt, 0.7)),
    u("/categories"),
    ...categories.filter(categoryIsIndexable).map((c) => u(`/categories/${c.slug}`)),
    u("/glossary"),
    u("/methodology"),
    u("/about"),
    u("/contact"),
  ];
}
