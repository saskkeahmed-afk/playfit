# البيانات المنظّمة (JSON-LD)

| النوع | أين | الملف |
|---|---|---|
| WebSite + Organization (مع الشعار) | كل الصفحات | `src/lib/seo.ts` → `websiteJsonLd()` + `src/app/layout.tsx` |
| BreadcrumbList | الألعاب، الكروت، المعالجات، الأقسام، الأدلة | `breadcrumbJsonLd()` |
| VideoGame | صفحة اللعبة | `videoGameJsonLd()` |
| FAQPage | الرئيسية + صفحة اللعبة (الأسئلة ظاهرة فعلاً) | `faqJsonLd()` |
| Article | صفحات الأدلة | `articleJsonLd()` |

## قواعد التزمنا بها
- لا `aggregateRating` ولا `review` ولا `offers` (لا نملكها فعلاً).
- FAQPage فقط حيث الأسئلة والأجوبة ظاهرة للزائر في الصفحة نفسها.
- لا JSON-LD يعتمد على دومين بدون ضبط `NEXT_PUBLIC_SITE_URL`.
- كل JSON-LD يمر عبر `safeJsonLd()` لمنع كسر وسم السكربت.

## كيف تختبر
1. https://search.google.com/test/rich-results ← الصق رابط صفحة منشورة.
2. https://validator.schema.org للتحقق من صحة البنية.
3. الفحص الآلي `npm run seo:audit` يتأكد أن كل JSON-LD صالح كـ JSON.

> وجود الترميز لا يضمن ظهور نتائج مميزة (Rich Results). جوجل تقرر.
