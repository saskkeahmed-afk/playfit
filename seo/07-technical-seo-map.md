# خريطة السيو التقنية: أين كل شيء في الكود

| العنصر | الملف | ملاحظات |
|---|---|---|
| الدومين الإنتاجي | `src/lib/config.ts` (من `NEXT_PUBLIC_SITE_URL`) | بدونه: لا canonical ولا sitemap ولا RSS (عمداً) |
| Canonical + OG + Twitter | `src/lib/seo.ts → buildMetadata()` | يُستدعى في كل صفحة |
| robots.txt | `src/app/robots.ts` | يمنع `/api/` ويضيف رابط الـ sitemap |
| sitemap.xml | `src/app/sitemap.ts` | فقط صفحات قانونية قابلة للفهرسة |
| noindex تلقائي | أقسام فيها أقل من 3 ألعاب (`src/lib/categories.ts`)، وكروت/معالجات بلا حكم معروف (`src/lib/hardware.ts`) | وتُستثنى من الـ sitemap |
| 404 حقيقي | `src/app/not-found.tsx` + `dynamicParams=false` في المسارات الديناميكية | تعرض بحثاً وتُرجع 404 |
| RSS للأدلة | `src/app/feed.xml/route.ts` | يعمل مع الدومين المضبوط |
| Manifest (PWA) | `src/app/manifest.ts` | |
| الأيقونات | `src/app/icon.svg`, `apple-icon.png`, `favicon.ico` | تُولَّد من `brand/` عبر `npm run brand:export` |
| صورة المشاركة | `src/app/opengraph-image.png`, `twitter-image.png` | من `brand/og.svg` |
| ads.txt | `src/app/ads.txt/route.ts` | 404 حتى تضبط `ADS_TXT_LINE` |
| ترويسات الأمان | `next.config.ts` | HSTS وX-Frame-Options وغيرها |
| الصفحة الثابتة (SSG) | كل الصفحات | تُبنى وقت البناء → سرعة عالية |
| صور الأغلفة | `src/lib/cover.ts` + `src/components/GameCover.tsx` | Steam ثم RAWG ثم بطاقة مولّدة |
| اللغة والاتجاه | `src/app/layout.tsx` (`lang="ar" dir="rtl"`) | |
| الفحص الآلي | `scripts/seo-audit.mjs` | `npm run seo:audit` |

## ما لم يُنفَّذ (للشفافية)
- لا `hreflang` (الموقع عربي فقط).
- لا Content-Security-Policy صارمة (تحتاج nonce مع Next؛ يُضاف لاحقاً).
- لا تحليلات (Analytics)؛ أضف أداة تحترم الخصوصية وحدّث `/privacy` معها.
