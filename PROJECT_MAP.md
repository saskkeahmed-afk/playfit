# خريطة مشروع PlayFit — هيكل كل شيء وكيف تعدّله

> استخدم هذا الملف كدليل: ابحث عمّا تريد تغييره في قسم **«أريد أن… أين أذهب؟»** أولاً، ثم راجع شرح الملفات.
> التقنية: Next.js 15 (App Router) + TypeScript + Tailwind CSS. الصفحات تُبنى مسبقاً (Static) فتكون سريعة جداً.

---

## 1) أريد أن… أين أذهب؟

| أريد أن… | عدّل هذا |
|---|---|
| **أغيّر اسم الموقع** | `src/lib/config.ts` (`SITE_NAME`, `SITE_NAME_AR`) + `src/components/Logo.tsx` + نصوص `src/app/about`, `privacy`, `terms` + `brand/*.svg` ثم `npm run brand:export` |
| **أغيّر الشعار** | `brand/logo-mark.svg` و`brand/logo-full.svg` و`brand/og.svg` ثم `npm run brand:export` (يعيد توليد الأيقونات وصورة المشاركة) + `src/components/Logo.tsx` (نسخة الشعار داخل الموقع) |
| **أغيّر الألوان** | `tailwind.config.ts` (قسم `colors`) و`src/app/globals.css` |
| **أغيّر الخط** | `src/app/globals.css` (أسطر `@import "@fontsource/...`) و`tailwind.config.ts` (`fontFamily`) |
| **أضيف لعبة** | `src/data/games-extra.ts` (صيغة مختصرة: سطر واحد لكل لعبة) — انظر الخطوات في القسم 4 |
| **أصحّح متطلبات لعبة** | نفس الملف (أو `src/data/games.ts` للألعاب الـ15 الأولى) ثم غيّر `verification` إلى `"verified"` بعد المراجعة |
| **أصلح صورة غلاف لعبة** | `steamAppId` في بيانات اللعبة، أو ضع `image` محلية: `public/covers/x.jpg` ثم `image: { src: "/covers/x.jpg", width, height }` |
| **أضيف كرت شاشة أو معالج** | `src/data/gpus.ts` أو `src/data/cpus.ts` (سطر واحد لكل قطعة) |
| **أضيف قياسات فريمات حقيقية** | `src/data/benchmarks.ts` (انظر `docs/DATA_SOURCES.md`) |
| **أغيّر معادلة تقدير الفريمات التقريبية** | `src/lib/estimator.ts` (الثوابت `MODEL_ANCHOR_FPS`, `RESOLUTION_FACTOR`, `PRESET_FACTOR`, `SCALING_EXPONENT`) |
| **أضيف دليلاً/مقالة** | `src/data/guides.ts` (تظهر تلقائياً في الصفحات والـ sitemap وRSS) |
| **أضيف مصطلحاً للقاموس** | `src/data/glossary.ts` |
| **أضيف قسماً (نوعاً) للألعاب** | `src/data/categories.ts` (والنوع نفسه يجب أن يوجد في `genres` لألعاب) |
| **أغيّر نص الرئيسية** | `src/app/page.tsx` |
| **أغيّر القائمة العلوية** | `src/lib/config.ts` (`NAV_LINKS`) |
| **أغيّر الفوتر** | `src/components/Footer.tsx` |
| **أعدّل سياسة الخصوصية/الشروط** | `src/app/privacy/page.tsx` و`src/app/terms/page.tsx` و`src/app/cookies/page.tsx` |
| **أفعّل نموذج التواصل** | متغيرات البيئة `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (انظر `.env.example`) — المنطق في `src/app/api/contact/route.ts` |
| **أفعّل الإعلانات** | `docs/ADS.md` |
| **أغيّر عنوان/وصف صفحة** | دالة `metadata`/`generateMetadata` داخل `page.tsx` لتلك الصفحة؛ والقالب العام في `src/lib/seo.ts` |
| **أضبط الدومين** | متغير البيئة `NEXT_PUBLIC_SITE_URL` (في Vercel → Settings → Environment Variables) |
| **أفحص السيو والروابط** | `npm run seo:audit` (انظر `seo/README.md`) |

---

## 2) شجرة المشروع مع الشرح

```
playfit/
├── README.md                  مقدمة وأوامر التشغيل السريعة
├── PROJECT_MAP.md             هذا الملف
├── package.json               الأوامر (scripts) والاعتمادات
├── .env.example               أمثلة متغيرات البيئة (انسخه إلى .env.local)
├── next.config.ts             إعدادات Next + ترويسات الأمان
├── tailwind.config.ts         الألوان والخطوط (هوية الموقع)
├── tsconfig.json              إعدادات TypeScript الصارمة
├── eslint.config.mjs          قواعد فحص الكود
├── vitest.config.mts          إعدادات الاختبارات
├── postcss.config.mjs         يربط Tailwind
│
├── brand/                     ◀ الهوية البصرية (المصدر الوحيد للشعار)
│   ├── logo-mark.svg          علامة الشعار (مثلث تشغيل + علامة صح)
│   ├── logo-full.svg          الشعار الأفقي مع اسم PlayFit (للخلفيات الداكنة)
│   ├── logo-full-light.svg    نفسه للخلفيات الفاتحة
│   ├── og.svg                 تصميم صورة المشاركة (فيسبوك/واتساب/تويتر)
│   ├── *.png                  نسخ PNG جاهزة للاستخدام الخارجي (حسابات التواصل…)
│   └── export.mjs             سكربت يولّد PNG/ICO وينسخها إلى src/app (npm run brand:export)
│
├── seo/                       ◀ كل ما يخص السيو (قوائم، شرح، قوالب، تقرير الفحص)
│   ├── README.md              فهرس الفولدر
│   ├── 01…09-*.md             قائمة الإطلاق، Search Console، خطة المحتوى، البيانات المنظمة، …
│   └── audit-report.md        تقرير آخر فحص آلي
│
├── scripts/
│   └── seo-audit.mjs          يفحص كل صفحات الـ sitemap والروابط (npm run seo:audit)
│
├── docs/                      ◀ أدلة تقنية
│   ├── DEPLOY.md              خطوات النشر على Vercel/GitHub بالتفصيل
│   ├── DATA_SOURCES.md        كيف تضيف ألعاباً وقياسات وصوراً بشكل صحيح
│   └── ADS.md                 تفعيل الإعلانات (بعد الموافقة)
│
├── public/                    ملفات تُخدم كما هي (public/brand/ يحتوي الشعار للـ JSON-LD)
├── .github/workflows/ci.yml   فحص تلقائي عند كل رفع على GitHub (أنواع+lint+اختبارات+بناء)
│
├── tests/                     ◀ الاختبارات (65 اختباراً)
│   ├── data-integrity.test.ts يتأكد أن روابط البيانات سليمة (كل لعبة تشير لعتاد موجود…)
│   ├── estimator.test.ts      محرك تقدير الفريمات (قياسات + النموذج التقريبي)
│   ├── compat.test.ts         مقارنة العتاد بالمتطلبات الرسمية
│   ├── search.test.ts         البحث والتصفية والترقيم
│   └── misc.test.ts           slug، إدخال المواصفات، الأغلفة، اكتشاف الكرت، JSON-LD
│
└── src/
    ├── app/                   ◀ الصفحات (كل مجلد = رابط)
    │   ├── layout.tsx         الهيكل العام (رأس + فوتر + lang/dir + البيانات العامة)
    │   ├── page.tsx           الرئيسية (/)
    │   ├── globals.css        الأنماط العامة (الخط، الأزرار، الحقول…)
    │   ├── not-found.tsx      صفحة 404 مع بحث
    │   ├── check-my-pc/       /check-my-pc  فحص الجهاز
    │   ├── fps-calculator/    /fps-calculator  حاسبة الفريمات
    │   ├── games/             /games  المكتبة  +  games/[slug]  صفحة اللعبة
    │   ├── categories/        /categories  +  categories/[slug]  أقسام الألعاب
    │   ├── gpus/  cpus/       قاعدة الكروت والمعالجات + صفحة لكل قطعة ([id])
    │   ├── compare/           مقارنة المواصفات
    │   ├── guides/            الأدلة + guides/[slug]
    │   ├── glossary/          قاموس المصطلحات
    │   ├── methodology/       شرح طريقة التقدير بصراحة
    │   ├── about/ contact/ privacy/ terms/ cookies/   صفحات تعريفية وقانونية
    │   ├── api/contact/       واجهة نموذج التواصل (تحقق + حد طلبات + إرسال)
    │   ├── sitemap.ts         يولّد /sitemap.xml
    │   ├── robots.ts          يولّد /robots.txt
    │   ├── feed.xml/          RSS للأدلة
    │   ├── ads.txt/           يخدم ads.txt عند ضبط ADS_TXT_LINE
    │   ├── manifest.ts        manifest للتثبيت كتطبيق
    │   └── icon.svg, apple-icon.png, favicon.ico, opengraph-image.png, twitter-image.png   ← مولّدة من brand/
    │
    ├── components/            ◀ مكوّنات الواجهة
    │   ├── Header / Footer / Logo / Breadcrumbs / StaticPage     هيكل الصفحات
    │   ├── GameSearch         بحث فوري مع اقتراحات (لوحة المفاتيح مدعومة)
    │   ├── GameCard / GameCover      بطاقة اللعبة والغلاف (يجرّب عدة روابط ثم بطاقة مولّدة)
    │   ├── GameLibrary        المكتبة: تصفية/فرز/ترقيم (جانب المتصفح)
    │   ├── PcConfigurator     نموذج إدخال المواصفات + حفظ محلي بموافقة + إعادة ضبط
    │   ├── DetectCard         ما يستطيع المتصفح قراءته (بصدق عن حدوده)
    │   ├── CheckMyPc          جدول توافق كل الألعاب مع جهازك
    │   ├── FpsEstimator       الحاسبة: المتطلبات + الفريمات المتوقعة
    │   ├── CompatPanel / RequirementsTable / VerdictGroups   عرض النتائج والمتطلبات
    │   ├── CompareTool / DirectoryList / HardwareGames      المقارنة وقوائم العتاد
    │   ├── ContactForm        نموذج التواصل
    │   ├── AdSlot / ConsentAndAds     أماكن الإعلانات وموافقة المستخدم (معطّلة افتراضياً)
    │   └── JsonLd             يطبع البيانات المنظّمة بشكل آمن
    │
    ├── data/                  ◀ البيانات (أسهل مكان للتعديل)
    │   ├── games.ts           15 لعبة أساسية + دمج الإضافية + اشتقاق «المشابهة»
    │   ├── games-extra.ts     41 لعبة بصيغة مختصرة
    │   ├── gpus.ts / cpus.ts  قاعدة العتاد (مع «فئة أداء نسبية تقريبية»)
    │   ├── benchmarks.ts      القياسات الحقيقية (فارغة حالياً)
    │   ├── categories.ts      أقسام الألعاب
    │   ├── guides.ts          الأدلة (10)
    │   └── glossary.ts        القاموس (21 مصطلحاً)
    │
    └── lib/                   ◀ المنطق (بدون واجهة، قابل للاختبار)
        ├── types.ts           تعريف شكل البيانات (Game, Gpu, Cpu, …)
        ├── config.ts          الاسم والدومين والإعلانات والقائمة العلوية
        ├── estimator.ts       محرك تقدير الفريمات (قياسات أولاً ثم نموذج تقريبي)
        ├── compat.ts          مقارنة العتاد بالمتطلبات الرسمية
        ├── hardware.ts        ألعاب مرتبطة بكل قطعة + قاعدة الفهرسة
        ├── categories.ts      ألعاب كل قسم + قاعدة الفهرسة
        ├── search.ts / search-index.ts   البحث والتطبيع العربي والترقيم
        ├── detect.ts          مطابقة وصف كرت المتصفح بقاعدتنا
        ├── profile.ts / use-pc-profile.ts   مواصفات المستخدم والحفظ المحلي
        ├── cover.ts / rawg.ts / rawg-types.ts   صور الأغلفة
        ├── seo.ts             العناوين، canonical، OG، JSON-LD
        └── slug.ts            تحويل الأسماء لروابط
```

---

## 3) كيف تعمل الأجزاء المهمة

### تقدير الفريمات (`src/lib/estimator.ts`)
1. إن وُجدت قياسات في `benchmarks.ts` تطابق (اللعبة + الدقة + الإعدادات + الرفع + نفس نوع الجهاز) تُستخدم أولاً (ثقة أعلى).
2. وإلا يعمل **نموذج تقريبي**: يأخذ عتاد «الموصى به» الرسمي للعبة كنقطة ارتكاز (مثلاً 60 فريماً لألعاب عادية عند 1080p/High)، ثم يضرب في نسبة جهازك (أس 0.7) وعوامل الدقة والإعدادات والرفع، ويخفض عند معالج أضعف أو رام ناقصة أو لابتوب.
3. النتيجة نطاق (±20%) ومكتوب عليها «تقدير تقريبي». **الثوابت افتراضات**؛ اضبطها حسب تجربتك الفعلية.

### مقارنة المتطلبات (`src/lib/compat.ts`)
كل معالج/كرت له `perfClass` (فئة نسبية تقريبية). نقارن جهازك بأقل بديل رسمي مذكور. تحقيق المتطلبات لا يعني فريمات محددة.

### صور الأغلفة (`src/lib/cover.ts`)
الأولوية: صورة محلية في `public/covers` ← غلاف Steam (`steamAppId`) ← RAWG (مع مفتاح) ← بطاقة مولّدة. المكوّن `GameCover` يجرّب عدة روابط Steam قبل الاستسلام للبطاقة.

### الفهرسة (`src/lib/hardware.ts`, `src/lib/categories.ts`)
صفحات القسم (أقل من 3 ألعاب) وصفحات العتاد بلا حكم معروف تكون `noindex` وخارج الـ sitemap تلقائياً لتجنب الصفحات الرقيقة.

---

## 4) وصفات سريعة

### إضافة لعبة جديدة (في `src/data/games-extra.ts`)
أضف كائناً إلى مصفوفة `specs`:
```ts
{ slug: "my-game", title: "My Game", titleAr: "ماي جيم", genres: ["أكشن"], year: 2024,
  dev: "Studio", pub: "Publisher", steam: 123456, kind: "standard",
  desc: "وصف أصلي بالعربية.",
  min: ["نص المعالج", ["core-i5-8400"], "نص الكرت", ["geforce-gtx-1060-6gb"], 8, 50, true],
  rec: ["...", ["..."], "...", ["..."], 16, 50, true] },
```
- `min/rec` = [نص المعالج، معرّفات المعالجات، نص الكرت، معرّفات الكروت، الرام، المساحة GB، SSD؟].
- المعرّف = اسم القطعة بحروف صغيرة وشرطات (مثل `geforce-gtx-1060-6gb`). إن كانت القطعة غير موجودة أضفها أولاً في `gpus.ts/cpus.ts` أو اترك القائمة فارغة.
- `kind`: `esports | light | standard | heavy` (يحدد منحنى الفريمات التقريبي).
- شغّل `npm test`؛ اختبار سلامة البيانات يكتشف أي معرّف خاطئ.

### إضافة قطعة عتاد (`src/data/gpus.ts`)
سطر: `["NVIDIA", "GeForce RTX 5060", 8, "Blackwell", "desktop", 260],` (الرقم الأخير فئة الأداء النسبية التقريبية: GTX 1060 6GB = 100).

### تغيير الدومين/الاسم بعد النشر
غيّر `NEXT_PUBLIC_SITE_URL` في منصة الاستضافة وأعد النشر (Redeploy).

---

## 5) الأوامر
| الأمر | وظيفته |
|---|---|
| `npm run dev` | تطوير (بطيء أول زيارة لكل صفحة — طبيعي) |
| `npm run prod` | يبني ويشغّل نسخة الإنتاج للتجربة الحقيقية |
| `npm run check` | أنواع + lint + اختبارات |
| `npm run build` | بناء الإنتاج |
| `npm run seo:audit -- <url>` | فحص السيو والروابط |
| `npm run brand:export` | إعادة توليد الأيقونات وصورة المشاركة من brand/ |

---

## 6) حدود يجب أن تعرفها
- متطلبات الألعاب منقولة من الذاكرة ومعلّمة «بانتظار المراجعة» حتى تراجعها من الروابط الرسمية.
- أرقام الفريمات تقديرية بنموذج داخلي حتى تضيف قياسات حقيقية.
- صور Steam ملك لأصحابها؛ راجع شروط الاستخدام.
- شريط موافقة الإعلانات مبسّط وليس CMP معتمداً.
