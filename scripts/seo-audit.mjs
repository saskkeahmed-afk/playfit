#!/usr/bin/env node
// مراجعة SEO وروابط للموقع الشغال. لا تعتمد على أي حزمة.
// الاستخدام:
//   1) شغّل الموقع بنسخة الإنتاج مع دومين للتجربة:
//        NEXT_PUBLIC_SITE_URL=http://localhost:3131 npx next start -p 3131
//   2) node scripts/seo-audit.mjs http://localhost:3131
// يكتب التقرير في seo/audit-report.md ويخرج برمز 1 إن وُجدت أخطاء (Errors).
import { writeFileSync, mkdirSync } from "node:fs";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const errors = [];
const warns = [];
const err = (url, msg) => errors.push(`- ❌ \`${url}\` — ${msg}`);
const warn = (url, msg) => warns.push(`- ⚠️ \`${url}\` — ${msg}`);

async function get(path) {
  const res = await fetch(path.startsWith("http") ? path : base + path, { redirect: "manual" });
  return { status: res.status, headers: res.headers, text: await res.text() };
}
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const pick = (html, re) => { const m = html.match(re); return m ? decode(m[1]).trim() : null; };

const sm = await get("/sitemap.xml");
if (sm.status !== 200) { console.error("sitemap.xml غير متاح: شغّل الموقع بـ NEXT_PUBLIC_SITE_URL"); process.exit(2); }
const pages = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (pages.length === 0) { console.error("الـ sitemap فارغ: اضبط NEXT_PUBLIC_SITE_URL"); process.exit(2); }

const titles = new Map();
const descs = new Map();
const internal = new Set();
let rows = [];

for (const loc of pages) {
  const path = new URL(loc).pathname;
  if (!loc.startsWith(base)) err(path, `رابط في الـ sitemap لا يبدأ بالدومين المضبوط (${base})`);
  const r = await get(path);
  if (r.status !== 200) { err(path, `الحالة ${r.status}`); continue; }
  const h = r.text;
  const title = pick(h, /<title>([^<]*)<\/title>/);
  const desc = pick(h, /<meta name="description" content="([^"]*)"/);
  const canon = pick(h, /<link rel="canonical" href="([^"]*)"/);
  const robots = pick(h, /<meta name="robots" content="([^"]*)"/);
  const h1s = (h.match(/<h1[\s>]/g) ?? []).length;
  const lang = pick(h, /<html[^>]*lang="([^"]*)"/);
  const dir = pick(h, /<html[^>]*dir="([^"]*)"/);

  if (!title) err(path, "لا يوجد title"); else {
    if (title.length > 70) warn(path, `العنوان طويل (${title.length} حرفاً)`);
    if (title.length < 15) warn(path, `العنوان قصير (${title.length})`);
    (titles.get(title) ?? titles.set(title, []).get(title)).push(path);
  }
  if (!desc) err(path, "لا يوجد meta description"); else {
    if (desc.length < 60) warn(path, `الوصف قصير (${desc.length})`);
    if (desc.length > 200) warn(path, `الوصف طويل (${desc.length})`);
    (descs.get(desc) ?? descs.set(desc, []).get(desc)).push(path);
  }
  if (!canon) err(path, "لا يوجد canonical"); else if (canon !== loc) err(path, `canonical (${canon}) لا يطابق رابط الـ sitemap (${loc})`);
  if (robots && /noindex/.test(robots)) err(path, "الصفحة في الـ sitemap لكنها noindex");
  if (h1s !== 1) err(path, `عدد H1 = ${h1s} (المطلوب 1)`);
  if (lang !== "ar" || dir !== "rtl") err(path, `lang/dir غير صحيحين (${lang}/${dir})`);
  if (!/property="og:image"/.test(h)) warn(path, "لا توجد og:image");

  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]+"/.test(m[0])) err(path, "صورة بلا alt");
  for (const m of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(m[1]); } catch { err(path, "JSON-LD غير صالح"); }
  }
  for (const m of h.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)/g)) internal.add(m[1]);
  rows.push({ path, title: title?.length ?? 0, desc: desc?.length ?? 0 });
}
for (const [t, p] of titles) if (p.length > 1) err(p.join(" , "), `عنوان مكرر: «${t}»`);
for (const [d, p] of descs) if (p.length > 1) err(p.join(" , "), `وصف مكرر: «${d.slice(0, 50)}…»`);

// كل الروابط الداخلية يجب أن تُرجع 200
let checked = 0;
for (const path of internal) {
  const r = await get(path);
  checked++;
  if (r.status !== 200) err(path, `رابط داخلي مكسور (${r.status})`);
}

// ملفات الزحف والهوية
for (const [p, ct] of [["/robots.txt", "text/plain"], ["/feed.xml", "xml"], ["/manifest.webmanifest", "json"], ["/icon.svg", "svg"], ["/apple-icon.png", "png"], ["/opengraph-image.png", "png"], ["/favicon.ico", "icon"]]) {
  const r = await get(p);
  if (r.status !== 200) err(p, `الحالة ${r.status}`); else if (!r.headers.get("content-type")?.includes(ct) && ct !== "icon") warn(p, `نوع المحتوى ${r.headers.get("content-type")}`);
}
const robots = await get("/robots.txt");
if (!robots.text.includes(`Sitemap: ${base}/sitemap.xml`)) err("/robots.txt", "لا يشير إلى الـ sitemap");
const nf = await get("/this-page-does-not-exist");
if (nf.status !== 404) err("/404", `الصفحة غير الموجودة ترجع ${nf.status} بدل 404`);

const report = `# تقرير مراجعة SEO

- الدومين المُختبَر: \`${base}\` (تجريبي)
- عدد الصفحات في الـ sitemap: **${pages.length}**
- عدد الروابط الداخلية الفريدة المفحوصة: **${checked}**
- الأخطاء: **${errors.length}** · التحذيرات: **${warns.length}**
- التاريخ: ${new Date().toISOString().slice(0, 10)}

## الأخطاء
${errors.join("\n") || "لا يوجد ✅"}

## التحذيرات
${warns.join("\n") || "لا يوجد ✅"}

> هذا فحص آلي للـ HTML المُخدَّم. لا يغني عن Lighthouse ولا Search Console ولا مراجعة يدوية.
`;
mkdirSync("seo", { recursive: true });
writeFileSync("seo/audit-report.md", report);
console.log(`pages=${pages.length} links=${checked} errors=${errors.length} warnings=${warns.length}`);
process.exit(errors.length ? 1 : 0);
