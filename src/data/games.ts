import type { Game, RequirementTier } from "@/lib/types";
import { extraGames } from "./games-extra";

/**
 * قواعد إضافة لعبة جديدة (انظر docs/DATA_SOURCES.md):
 * 1) انسخ المتطلبات حرفياً من صفحة المتجر/الناشر الرسمية وضع الرابط في requirementsSource.
 * 2) اربط كل معالج/كرت بمعرّف موجود في cpus.ts / gpus.ts (أضفه أولاً إن لم يوجد).
 * 3) اترك verification = "needs-review" حتى يطابقها شخص ثانٍ مع المصدر ثم غيّرها إلى "verified".
 * 4) لا تضع قيماً غير معروفة: احذف الحقل (recommended / storageGb ...).
 */

const t = (x: RequirementTier): RequirementTier => x;

const coreGames: Game[] = [
  {
    slug: "grand-theft-auto-v",
    title: "Grand Theft Auto V",
    titleAr: "جراند ثيفت أوتو 5",
    genres: ["أكشن", "عالم مفتوح"],
    releaseYear: 2015,
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    platforms: ["PC"],
    descriptionAr:
      "لعبة أكشن في عالم مفتوح تدور في مدينة لوس سانتوس. نسخة الكمبيوتر تدعم إعدادات رسوميات واسعة، وتعمل على أجهزة قديمة نسبياً عند خفض الإعدادات.",
    min: t({ os: "Windows 8.1 64-bit", cpuText: "Intel Core 2 Quad Q6600 @ 2.40GHz / AMD Phenom 9850", cpuRefs: ["core-2-quad-q6600", "phenom-9850"], gpuText: "NVIDIA GeForce 9800 GT 1GB / AMD HD 4870 1GB", gpuRefs: [], ramGb: 4, storageGb: 72, storageType: "HDD" }),
    recommended: t({ os: "Windows 8.1 64-bit", cpuText: "Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz", cpuRefs: ["core-i5-3470", "fx-8350"], gpuText: "NVIDIA GeForce GTX 660 2GB / AMD HD 7870 2GB", gpuRefs: ["geforce-gtx-660", "radeon-hd-7870"], ramGb: 8, storageGb: 72, storageType: "HDD" }),
    requirementsSource: { label: "Rockstar Games Support", url: "https://support.rockstargames.com/articles/200426646/Grand-Theft-Auto-V-PC-system-requirements" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "ابدأ بخفض جودة الظلال والـ MSAA؛ هما من أثقل الإعدادات على الكرت في هذه اللعبة.",
      "إعدادات «Population Density» و«Distance Scaling» تؤثر على المعالج أكثر من الكرت.",
      "ثبّت اللعبة على SSD إن أمكن لتقليل التقطيع أثناء التنقل في العالم المفتوح.",
    ],
    faqAr: [
      { q: "هل تعمل GTA V على جهاز قديم؟", a: "المتطلبات الدنيا الرسمية متواضعة نسبياً، لكن التجربة الفعلية تعتمد على الدقة والإعدادات. راجع المتطلبات في أعلى الصفحة وقارنها بجهازك." },
      { q: "هل أحتاج SSD لتشغيلها؟", a: "المتطلبات الرسمية تذكر HDD، لكن SSD يخفف زمن التحميل وبعض حالات التقطيع." },
    ],
    similar: ["red-dead-redemption-2", "cyberpunk-2077", "the-witcher-3-wild-hunt"],
    guides: ["how-to-increase-fps", "fix-stuttering"],
    editorialRank: 1,
  },
  {
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    titleAr: "ريد ديد ريديمبشن 2",
    genres: ["أكشن", "مغامرة", "عالم مفتوح"],
    releaseYear: 2019,
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    platforms: ["PC"],
    descriptionAr:
      "مغامرة غرب أمريكي في عالم مفتوح ضخم وتفاصيل بصرية عالية. تُعد من الألعاب الثقيلة على الكرت وعلى المساحة التخزينية.",
    min: t({ os: "Windows 10 (April 2018 update)", cpuText: "Intel Core i5-2500K / AMD FX-6300", cpuRefs: ["core-i5-2500k", "fx-6300"], gpuText: "NVIDIA GeForce GTX 770 2GB / AMD Radeon R9 280 3GB", gpuRefs: ["geforce-gtx-770", "radeon-r9-280"], ramGb: 8, storageGb: 150, storageType: "HDD" }),
    recommended: t({ os: "Windows 10 (April 2018 update)", cpuText: "Intel Core i7-4770K / AMD Ryzen 5 1500X", cpuRefs: ["core-i7-4770k", "ryzen-5-1500x"], gpuText: "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB", gpuRefs: ["geforce-gtx-1060-6gb", "radeon-rx-480"], ramGb: 12, storageGb: 150, storageType: "HDD" }),
    requirementsSource: { label: "Rockstar Games Support", url: "https://support.rockstargames.com/articles/360035567433/Red-Dead-Redemption-2-PC-system-requirements" },
    verification: "needs-review",
    supportedUpscaling: ["dlss", "fsr"],
    tipsAr: [
      "جرّب التبديل بين Vulkan وDirectX 12؛ الأفضل يختلف حسب الكرت والتعريف.",
      "خفّض إعدادات جودة الأشجار والعشب المتقدمة والظلال قبل خفض الدقة.",
      "اللعبة كبيرة الحجم؛ اترك مساحة فارغة كافية على القرص.",
    ],
    faqAr: [
      { q: "هل تحتاج RDR2 إلى 12 جيجا رام؟", a: "المتطلبات الموصى بها رسمياً تذكر 12GB. أجهزة بذاكرة أقل قد تعمل لكن قد تلاحظ تقطيعاً." },
      { q: "ما الفرق بين Vulkan وDirectX 12 في اللعبة؟", a: "كلاهما مدعوم. الأداء يتفاوت حسب العتاد والتعريف، لذا جرّب الاثنين واحتفظ بالأفضل على جهازك." },
    ],
    similar: ["grand-theft-auto-v", "the-witcher-3-wild-hunt", "elden-ring"],
    guides: ["graphics-settings-explained", "update-gpu-drivers"],
    editorialRank: 2,
  },
  {
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    titleAr: "سايبربانك 2077",
    genres: ["آر بي جي", "أكشن", "عالم مفتوح"],
    releaseYear: 2020,
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT",
    platforms: ["PC"],
    descriptionAr:
      "لعبة آر بي جي بمنظور الشخص الأول في مدينة مستقبلية. تدعم تقنيات الرفع مثل DLSS وFSR وXeSS وتُستخدم كثيراً لاختبار الكروت الحديثة.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Core i7-6700 / Ryzen 5 1600", cpuRefs: ["core-i7-6700", "ryzen-5-1600"], gpuText: "GeForce GTX 1060 6GB / Radeon RX 580 8GB", gpuRefs: ["geforce-gtx-1060-6gb", "radeon-rx-580"], ramGb: 12, storageGb: 70, storageType: "SSD" }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Core i7-12700 / Ryzen 7 7800X3D", cpuRefs: ["core-i7-12700", "ryzen-7-7800x3d"], gpuText: "GeForce RTX 2060 SUPER / Radeon RX 5700 XT", gpuRefs: ["geforce-rtx-2060-super", "radeon-rx-5700-xt"], ramGb: 16, storageGb: 70, storageType: "SSD" }),
    requirementsSource: { label: "Cyberpunk 2077 — الموقع الرسمي", url: "https://www.cyberpunk.net/en/system-requirements" },
    verification: "needs-review",
    supportedUpscaling: ["dlss", "fsr", "xess"],
    tipsAr: [
      "فعّل DLSS أو FSR أو XeSS حسب كرتك قبل خفض الدقة الأصلية.",
      "الانعكاسات (Screen Space Reflections) وجودة الإضاءة من أثقل الإعدادات.",
      "اللعبة تتطلب SSD حسب المتطلبات الرسمية؛ HDD قد يسبب تقطيعاً.",
    ],
    faqAr: [
      { q: "هل الـ SSD إجباري؟", a: "المتطلبات الرسمية تذكر SSD. التشغيل من HDD غير موصى به وقد يسبب تقطيعاً شديداً." },
      { q: "أي تقنية رفع أختار؟", a: "DLSS لكروت RTX، FSR لمعظم الكروت، وXeSS خيار إضافي. جرّب كل واحدة وقارن الصورة والسلاسة." },
    ],
    similar: ["hogwarts-legacy", "black-myth-wukong", "the-witcher-3-wild-hunt"],
    guides: ["how-to-increase-fps", "graphics-settings-explained"],
    editorialRank: 3,
  },
  {
    slug: "counter-strike-2",
    title: "Counter-Strike 2",
    titleAr: "كاونتر سترايك 2",
    genres: ["تصويب", "تنافسية"],
    releaseYear: 2023,
    developer: "Valve",
    publisher: "Valve",
    platforms: ["PC"],
    descriptionAr:
      "لعبة تصويب تكتيكية تنافسية مجانية. الأداء المرتفع والثابت مهم جداً فيها، والمعالج غالباً يلعب دوراً كبيراً.",
    min: t({ os: "Windows 10", cpuText: "4 hardware CPU threads — Intel Core i5 750 أو أفضل", cpuRefs: ["core-i5-750"], gpuText: "كرت يدعم DirectX 11 وذاكرة 1GB", gpuRefs: [], ramGb: 8, storageGb: 85, storageType: "SSD مفضّل" }),
    requirementsSource: { label: "Steam — Counter-Strike 2", url: "https://store.steampowered.com/app/730/CounterStrike_2/" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "في الألعاب التنافسية يُفضّل خفض الظلال والتأثيرات لرفع الفريمات وتقليل التشويش البصري.",
      "حدّث تعريف الكرت وأغلق البرامج الثقيلة في الخلفية قبل اللعب.",
    ],
    faqAr: [
      { q: "هل لدى CS2 متطلبات موصى بها رسمياً؟", a: "صفحة Steam تعرض متطلبات دنيا فقط في بياناتنا، لذلك لا نعرض قسم متطلبات موصى بها." },
      { q: "هل المعالج مهم أكثر من الكرت؟", a: "في كثير من الحالات تتأثر الفريمات العالية بالمعالج، لكن النتيجة تتغير حسب الدقة والإعدادات." },
    ],
    similar: ["valorant", "pubg-battlegrounds", "fortnite"],
    guides: ["how-to-increase-fps", "fix-stuttering"],
    editorialRank: 4,
  },
  {
    slug: "fortnite",
    title: "Fortnite",
    titleAr: "فورت نايت",
    genres: ["باتل رويال", "تنافسية"],
    releaseYear: 2017,
    developer: "Epic Games",
    publisher: "Epic Games",
    platforms: ["PC"],
    descriptionAr:
      "لعبة باتل رويال مجانية مع تحديثات مستمرة. لديها أوضاع رسوميات متعددة تناسب الأجهزة الضعيفة والقوية.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Core i3-3225 3.3 GHz", cpuRefs: ["core-i3-3225"], gpuText: "Intel HD 4000", gpuRefs: ["intel-hd-graphics-4000"], ramGb: 8 }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Core i5-7300U 3.5 GHz", cpuRefs: [], gpuText: "NVIDIA GTX 960 / AMD R9 280", gpuRefs: ["geforce-gtx-960", "radeon-r9-280"], ramGb: 16 }),
    requirementsSource: { label: "Epic Games — Fortnite", url: "https://www.epicgames.com/fortnite/en-US/system-requirements" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "جرّب وضع الأداء (Performance Mode) على الأجهزة الضعيفة.",
      "قد تلاحظ تقطيعاً في أول تشغيل بسبب بناء الـ Shaders؛ يتحسن عادة بعد جلسات لعب.",
    ],
    faqAr: [
      { q: "هل تعمل على لابتوب بكرت مدمج؟", a: "المتطلبات الدنيا الرسمية تذكر كرتاً مدمجاً، لكن توقع إعدادات منخفضة وأداءً متواضعاً." },
      { q: "هل يوجد وضع للأجهزة الضعيفة؟", a: "نعم، توجد خيارات أداء داخل اللعبة. تتغير أسماؤها مع التحديثات." },
    ],
    similar: ["valorant", "pubg-battlegrounds", "counter-strike-2"],
    guides: ["laptop-gaming-performance", "how-to-increase-fps"],
    editorialRank: 5,
  },
  {
    slug: "minecraft",
    title: "Minecraft",
    titleAr: "ماين كرافت",
    genres: ["بناء", "نجاة", "ساندبوكس"],
    releaseYear: 2011,
    developer: "Mojang Studios",
    publisher: "Mojang / Xbox Game Studios",
    platforms: ["PC", "Console", "Mobile"],
    descriptionAr:
      "لعبة بناء واستكشاف مفتوحة. تعمل على أجهزة بسيطة، لكن الشيدرز والـ Mods قد ترفع المتطلبات كثيراً.",
    min: t({ os: "Windows 10", cpuText: "Intel Core i3-3210 / AMD A8-7600", cpuRefs: ["core-i3-3210"], gpuText: "Intel HD Graphics 4000 / AMD Radeon R5", gpuRefs: ["intel-hd-graphics-4000", "radeon-r5-integrated"], ramGb: 4, storageGb: 1 }),
    recommended: t({ os: "Windows 10", cpuText: "Intel Core i5-4690 / AMD A10-7800", cpuRefs: ["core-i5-4690"], gpuText: "GeForce 700 Series / Radeon Rx 200 Series", gpuRefs: [], ramGb: 8, storageGb: 4 }),
    requirementsSource: { label: "Minecraft Help — Java Edition requirements", url: "https://help.minecraft.net/hc/en-us/articles/4409225939853" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "المتطلبات أعلاه خاصة بالنسخة الأساسية (Java). الشيدرز والـ Mods تحتاج عتاداً أقوى.",
      "خفض مسافة العرض (Render Distance) من أسرع الطرق لرفع الفريمات.",
    ],
    faqAr: [
      { q: "هل المتطلبات تشمل الشيدرز؟", a: "لا. هذه متطلبات النسخة الأساسية. الشيدرز والإضافات تزيد الحمل على الكرت والمعالج." },
      { q: "كم رام أحتاج للـ Mods؟", a: "يعتمد على حجم الحزمة. ابحث عن متطلبات حزمة الـ Mods التي تريد تشغيلها تحديداً." },
    ],
    similar: ["fortnite", "valorant", "grand-theft-auto-v"],
    guides: ["laptop-gaming-performance", "how-to-increase-fps"],
    editorialRank: 6,
  },
  {
    slug: "elden-ring",
    title: "Elden Ring",
    titleAr: "إلدن رينج",
    genres: ["آر بي جي", "أكشن", "عالم مفتوح"],
    releaseYear: 2022,
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    platforms: ["PC", "Console"],
    descriptionAr:
      "لعبة آر بي جي أكشن في عالم مفتوح من مطوري سلسلة Dark Souls. معروفة بتقطيع Shaders عند التشغيل الأول على بعض الأجهزة.",
    min: t({ os: "Windows 10", cpuText: "Intel Core i5-8400 / AMD Ryzen 3 3300X", cpuRefs: ["core-i5-8400", "ryzen-3-3300x"], gpuText: "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB", gpuRefs: ["geforce-gtx-1060-3gb", "radeon-rx-580"], ramGb: 12, storageGb: 60, storageType: "SSD مفضّل" }),
    recommended: t({ os: "Windows 10/11", cpuText: "Intel Core i7-8700K / AMD Ryzen 5 3600X", cpuRefs: ["core-i7-8700k", "ryzen-5-3600x"], gpuText: "NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX Vega 56 8GB", gpuRefs: ["geforce-gtx-1070", "radeon-rx-vega-56"], ramGb: 16, storageGb: 60, storageType: "SSD مفضّل" }),
    requirementsSource: { label: "Steam — ELDEN RING", url: "https://store.steampowered.com/app/1245620/ELDEN_RING/" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "اللعبة تحدّد الفريمات بسقف معين؛ لا تتوقع قيماً مرتفعة جداً حتى مع عتاد قوي.",
      "تثبيتها على SSD يخفف التقطيع أثناء التنقل بين المناطق.",
    ],
    faqAr: [
      { q: "لماذا تتقطع اللعبة أول مرة؟", a: "كثير من الألعاب تبني الـ Shaders عند أول تشغيل، فيحدث تقطيع مؤقت. راجع دليل تقليل التقطيع." },
      { q: "هل تحتاج SSD؟", a: "المصدر الرسمي يفضّل SSD." },
    ],
    similar: ["red-dead-redemption-2", "hogwarts-legacy", "god-of-war"],
    guides: ["fix-stuttering", "graphics-settings-explained"],
    editorialRank: 7,
  },
  {
    slug: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    titleAr: "هوغورتس ليغاسي",
    genres: ["آر بي جي", "مغامرة", "عالم مفتوح"],
    releaseYear: 2023,
    developer: "Avalanche Software",
    publisher: "Warner Bros. Games",
    platforms: ["PC", "Console"],
    descriptionAr:
      "لعبة آر بي جي في عالم هاري بوتر. تستهلك ذاكرة الفيديو بشكل ملحوظ في الإعدادات العالية، وتدعم DLSS وFSR وXeSS.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i5-6600 (3.3Ghz) / AMD Ryzen 5 1400 (3.2Ghz)", cpuRefs: ["core-i5-6600", "ryzen-5-1400"], gpuText: "NVIDIA GeForce GTX 960 4GB / AMD Radeon RX 470 4GB", gpuRefs: ["geforce-gtx-960", "radeon-rx-470"], ramGb: 16, storageGb: 85, storageType: "SSD" }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i7-8700 / AMD Ryzen 5 3600", cpuRefs: ["core-i7-8700", "ryzen-5-3600"], gpuText: "NVIDIA GeForce GTX 1080 Ti / AMD Radeon RX 5700 XT", gpuRefs: ["geforce-gtx-1080-ti", "radeon-rx-5700-xt"], ramGb: 16, storageGb: 85, storageType: "SSD" }),
    requirementsSource: { label: "Steam — Hogwarts Legacy", url: "https://store.steampowered.com/app/990080/Hogwarts_Legacy/" },
    verification: "needs-review",
    supportedUpscaling: ["dlss", "fsr", "xess"],
    tipsAr: [
      "قلّل جودة الـ Textures إن كان كرتك بذاكرة فيديو محدودة.",
      "فعّل تقنية الرفع المناسبة لكرتك قبل خفض الدقة الأصلية.",
    ],
    faqAr: [
      { q: "هل تحتاج ذاكرة فيديو كبيرة؟", a: "المتطلبات الدنيا الرسمية تذكر كروتاً بذاكرة 4GB، لكن الإعدادات العالية تستهلك أكثر وقد تسبب تقطيعاً." },
      { q: "هل SSD مطلوب؟", a: "المصدر الرسمي يذكر SSD." },
    ],
    similar: ["cyberpunk-2077", "elden-ring", "black-myth-wukong"],
    guides: ["graphics-settings-explained", "how-to-increase-fps"],
    editorialRank: 8,
  },
  {
    slug: "forza-horizon-5",
    title: "Forza Horizon 5",
    titleAr: "فورزا هورايزن 5",
    genres: ["سباقات", "عالم مفتوح"],
    releaseYear: 2021,
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    platforms: ["PC", "Console"],
    descriptionAr:
      "لعبة سباقات في عالم مفتوح تدور أحداثها في المكسيك. تمتاز بتحميل سريع للتفاصيل وتحتاج مساحة تخزين كبيرة.",
    min: t({ os: "Windows 10 (v1909+)", cpuText: "Intel i5-4460 / AMD Ryzen 3 1200", cpuRefs: ["core-i5-4460", "ryzen-3-1200"], gpuText: "NVIDIA GTX 970 / AMD RX 470", gpuRefs: ["geforce-gtx-970", "radeon-rx-470"], ramGb: 8, storageGb: 110 }),
    recommended: t({ os: "Windows 10 (v1909+)", cpuText: "Intel i5-8400 / AMD Ryzen 5 1500X", cpuRefs: ["core-i5-8400", "ryzen-5-1500x"], gpuText: "NVIDIA GTX 1070 / AMD RX 590", gpuRefs: ["geforce-gtx-1070", "radeon-rx-590"], ramGb: 16, storageGb: 110 }),
    requirementsSource: { label: "Steam — Forza Horizon 5", url: "https://store.steampowered.com/app/1551360/Forza_Horizon_5/" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "اللعبة تحتاج مساحة تخزينية كبيرة؛ تأكد من توفرها قبل التحميل.",
      "إعدادات الجودة العالية للـ Textures تتطلب ذاكرة فيديو كافية.",
    ],
    faqAr: [
      { q: "كم مساحة تحتاجها؟", a: "المتطلب المسجّل في بياناتنا 110GB؛ قد يتغير مع التحديثات، فراجع صفحة المتجر." },
      { q: "هل تعمل بكرت 970؟", a: "GTX 970 مذكور رسمياً ضمن الحد الأدنى. النتيجة الفعلية تعتمد على الدقة والإعدادات." },
    ],
    similar: ["grand-theft-auto-v", "red-dead-redemption-2", "cyberpunk-2077"],
    guides: ["how-to-read-system-requirements", "graphics-settings-explained"],
    editorialRank: 9,
  },
  {
    slug: "the-witcher-3-wild-hunt",
    title: "The Witcher 3: Wild Hunt",
    titleAr: "ذا ويتشر 3",
    genres: ["آر بي جي", "عالم مفتوح"],
    releaseYear: 2015,
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT",
    platforms: ["PC", "Console"],
    descriptionAr:
      "لعبة آر بي جي في عالم مفتوح بقصة واسعة. المتطلبات أدناه للنسخة الأصلية؛ التحديث الأحدث (Next-Gen) يرفع المتطلبات.",
    min: t({ os: "Windows 7 / 8 / 8.1 64-bit", cpuText: "Intel CPU Core i5-2500K 3.3GHz / AMD CPU Phenom II X4 940", cpuRefs: ["core-i5-2500k", "phenom-ii-x4-940"], gpuText: "Nvidia GPU GeForce GTX 660 / AMD GPU Radeon HD 7870", gpuRefs: ["geforce-gtx-660", "radeon-hd-7870"], ramGb: 6, storageGb: 35 }),
    recommended: t({ os: "Windows 7 / 8 / 8.1 64-bit", cpuText: "Intel CPU Core i7 3770 3.4 GHz / AMD CPU AMD FX-8350 4 GHz", cpuRefs: ["core-i7-3770", "fx-8350"], gpuText: "Nvidia GPU GeForce GTX 770 / AMD GPU Radeon R9 290", gpuRefs: ["geforce-gtx-770", "radeon-r9-290"], ramGb: 8, storageGb: 35 }),
    requirementsSource: { label: "Steam — The Witcher 3", url: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "متطلبات النسخة الأصلية تختلف عن التحديث الأحدث؛ تحقق من نسختك.",
      "إعدادات HairWorks تثقل الكرت؛ عطّلها أو خفّضها للأجهزة المتوسطة.",
    ],
    faqAr: [
      { q: "هل المتطلبات تخص التحديث الجديد؟", a: "لا. المتطلبات المعروضة للنسخة الأصلية، والتحديث الأحدث يحتاج عتاداً أقوى." },
      { q: "هل تعمل على أجهزة قديمة؟", a: "المتطلبات الدنيا الرسمية قديمة نسبياً، لكن عليك التأكد من نسختك وإعداداتك." },
    ],
    similar: ["cyberpunk-2077", "elden-ring", "red-dead-redemption-2"],
    guides: ["how-to-read-system-requirements", "update-gpu-drivers"],
    editorialRank: 10,
  },
  {
    slug: "pubg-battlegrounds",
    title: "PUBG: Battlegrounds",
    titleAr: "ببجي: باتلجراوندز",
    genres: ["باتل رويال", "تصويب"],
    releaseYear: 2017,
    developer: "KRAFTON",
    publisher: "KRAFTON",
    platforms: ["PC", "Console"],
    descriptionAr:
      "لعبة باتل رويال بخرائط كبيرة. الأداء فيها يتأثر بالمعالج والذاكرة وبإعدادات المسافة والتفاصيل.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i5-4430 / AMD FX-6300", cpuRefs: ["core-i5-4430", "fx-6300"], gpuText: "NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB", gpuRefs: ["geforce-gtx-960", "radeon-r7-370"], ramGb: 8 }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i5-6600K / AMD Ryzen 5 1600", cpuRefs: ["core-i5-6600k", "ryzen-5-1600"], gpuText: "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB", gpuRefs: ["geforce-gtx-1060-3gb", "radeon-rx-580"], ramGb: 16 }),
    requirementsSource: { label: "Steam — PUBG: BATTLEGROUNDS", url: "https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "خفض جودة الظلال والمؤثرات مفيد في المواجهات الكثيفة.",
      "اللعبة حساسة للمعالج في الأماكن المزدحمة؛ أغلق البرامج الخلفية.",
    ],
    faqAr: [
      { q: "هل أحتاج 16 جيجا رام؟", a: "المتطلب الموصى به رسمياً 16GB. 8GB هي الحد الأدنى الرسمي." },
      { q: "هل المعالج مهم؟", a: "غالباً نعم في الحالات الكثيفة، لكن الأثر يختلف من جهاز لآخر." },
    ],
    similar: ["counter-strike-2", "fortnite", "valorant"],
    guides: ["how-to-increase-fps", "fix-stuttering"],
    editorialRank: 11,
  },
  {
    slug: "valorant",
    title: "VALORANT",
    titleAr: "فالورانت",
    genres: ["تصويب", "تنافسية"],
    releaseYear: 2020,
    developer: "Riot Games",
    publisher: "Riot Games",
    platforms: ["PC"],
    descriptionAr:
      "لعبة تصويب تكتيكية تنافسية مجانية خفيفة نسبياً. مصممة لتعمل على نطاق واسع من الأجهزة.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Intel Core 2 Duo E8400 / AMD Athlon 200GE", cpuRefs: ["core-2-duo-e8400", "athlon-200ge"], gpuText: "Intel HD 4000 / Radeon R5 200", gpuRefs: ["intel-hd-graphics-4000", "radeon-r5-integrated"], ramGb: 4, note: "الحد الأدنى يستهدف نحو 30 إطاراً/ثانية حسب المصدر." }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i3-4150 / AMD Ryzen 3 1200", cpuRefs: ["core-i3-4150", "ryzen-3-1200"], gpuText: "GeForce GT 730 / Radeon R7 240", gpuRefs: ["geforce-gt-730", "radeon-r7-240"], ramGb: 4, note: "الموصى به يستهدف نحو 60 إطاراً/ثانية حسب المصدر." }),
    requirementsSource: { label: "Riot Games Support", url: "https://support-valorant.riotgames.com/hc/en-us/articles/360057705733" },
    verification: "needs-review",
    supportedUpscaling: [],
    tipsAr: [
      "اضبط حد الفريمات (FPS Cap) على قيمة ثابتة لتجنب تذبذب الأداء.",
      "عطّل التأثيرات غير الضرورية لرفع الفريمات وتقليل الحمل.",
    ],
    faqAr: [
      { q: "هل تعمل على لابتوب بسيط؟", a: "المتطلبات الدنيا الرسمية متواضعة، لكن الفريمات الفعلية تختلف بحسب الجهاز." },
      { q: "ماذا يعني 30 و60 فريم في المتطلبات؟", a: "المصدر يربط الحد الأدنى بنحو 30 والموصى به بنحو 60 إطاراً/ثانية، وهذا هدف مذكور من الناشر وليس قياساً على جهازك." },
    ],
    similar: ["counter-strike-2", "fortnite", "pubg-battlegrounds"],
    guides: ["laptop-gaming-performance", "how-to-increase-fps"],
    editorialRank: 12,
  },
  {
    slug: "marvels-spider-man-remastered",
    title: "Marvel's Spider-Man Remastered",
    titleAr: "سبايدر مان ريماسترد",
    genres: ["أكشن", "مغامرة"],
    releaseYear: 2022,
    developer: "Insomniac Games / Nixxes Software",
    publisher: "Sony Interactive Entertainment",
    platforms: ["PC", "PlayStation"],
    descriptionAr:
      "مغامرة أكشن في نيويورك مع تنقل سريع بين المباني. تتطلب سرعة تخزين جيدة لتحميل المدينة بسلاسة.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i3-4160 / AMD Ryzen 3 1200", cpuRefs: ["core-i3-4160", "ryzen-3-1200"], gpuText: "NVIDIA GTX 950 / AMD Radeon RX 470", gpuRefs: ["geforce-gtx-950", "radeon-rx-470"], ramGb: 8, storageGb: 75, storageType: "SSD" }),
    requirementsSource: { label: "Steam — Marvel's Spider-Man Remastered", url: "https://store.steampowered.com/app/1817070/Marvels_SpiderMan_Remastered/" },
    verification: "needs-review",
    supportedUpscaling: ["dlss", "fsr", "xess"],
    tipsAr: [
      "اللعبة تُحمّل أجزاء كبيرة من المدينة أثناء التنقل؛ SSD يساعد كثيراً.",
      "جرّب تقنيات الرفع إن كان كرتك يدعمها.",
    ],
    faqAr: [
      { q: "لماذا لا يوجد قسم موصى به؟", a: "لم نُدخل متطلبات موصى بها لهذه اللعبة في بياناتنا حتى نراجعها من المصدر الرسمي." },
      { q: "هل تحتاج SSD؟", a: "المصدر يذكر SSD ضمن المتطلبات." },
    ],
    similar: ["god-of-war", "hogwarts-legacy", "cyberpunk-2077"],
    guides: ["graphics-settings-explained", "fix-stuttering"],
    editorialRank: 13,
  },
  {
    slug: "god-of-war",
    title: "God of War",
    titleAr: "غود أوف وور",
    genres: ["أكشن", "مغامرة"],
    releaseYear: 2022,
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    platforms: ["PC", "PlayStation"],
    descriptionAr:
      "مغامرة أكشن سينمائية بمنظور الكاميرا القريبة. نسخة الكمبيوتر تقدم إعدادات رسوميات مرنة تناسب أجهزة متنوعة.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Intel i5-2500k / AMD Ryzen 3 1200", cpuRefs: ["core-i5-2500k", "ryzen-3-1200"], gpuText: "NVIDIA GTX 960 4GB / AMD R9 290X 4GB", gpuRefs: ["geforce-gtx-960", "radeon-r9-290x"], ramGb: 8, storageGb: 70, storageType: "SSD" }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Intel i5-6600k / AMD Ryzen 5 2400 G", cpuRefs: ["core-i5-6600k", "ryzen-5-2400g"], gpuText: "NVIDIA GTX 1060 6GB / AMD RX 570 4GB", gpuRefs: ["geforce-gtx-1060-6gb", "radeon-rx-570"], ramGb: 8, storageGb: 70, storageType: "SSD" }),
    requirementsSource: { label: "Steam — God of War", url: "https://store.steampowered.com/app/1593500/God_of_War/" },
    verification: "needs-review",
    supportedUpscaling: ["dlss", "fsr"],
    tipsAr: [
      "اللعبة تقدم إعدادات مسبقة؛ ابدأ من الأقرب لجهازك ثم عدّل.",
      "تثبيتها على SSD هو المطلوب في المصدر الرسمي.",
    ],
    faqAr: [
      { q: "هل أحتاج SSD؟", a: "المصدر الرسمي يذكر SSD." },
      { q: "هل 8 جيجا رام تكفي؟", a: "الرقم الرسمي المسجل للحد الأدنى والموصى به هو 8GB، لكن إغلاق البرامج الخلفية مهم." },
    ],
    similar: ["marvels-spider-man-remastered", "elden-ring", "red-dead-redemption-2"],
    guides: ["graphics-settings-explained", "fix-stuttering"],
    editorialRank: 14,
  },
  {
    slug: "black-myth-wukong",
    title: "Black Myth: Wukong",
    titleAr: "بلاك ميث: ووكونغ",
    genres: ["آر بي جي", "أكشن"],
    releaseYear: 2024,
    developer: "Game Science",
    publisher: "Game Science",
    platforms: ["PC", "Console"],
    descriptionAr:
      "لعبة أكشن آر بي جي مستوحاة من الأساطير الصينية. من الألعاب الثقيلة على الكرت وتدعم تقنيات الرفع.",
    min: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i5-8400 / AMD Ryzen 5 1600", cpuRefs: ["core-i5-8400", "ryzen-5-1600"], gpuText: "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB", gpuRefs: ["geforce-gtx-1060-6gb", "radeon-rx-580"], ramGb: 16, storageGb: 130, storageType: "SSD" }),
    recommended: t({ os: "Windows 10 64-bit", cpuText: "Intel Core i7-9700 / AMD Ryzen 5 5500", cpuRefs: ["core-i7-9700", "ryzen-5-5500"], gpuText: "NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT", gpuRefs: ["geforce-rtx-2060", "radeon-rx-5700-xt"], ramGb: 16, storageGb: 130, storageType: "SSD" }),
    requirementsSource: { label: "Steam — Black Myth: Wukong", url: "https://store.steampowered.com/app/2358720/Black_Myth_Wukong/" },
    verification: "needs-review",
    supportedUpscaling: ["dlss", "fsr", "xess"],
    tipsAr: [
      "استخدم تقنيات الرفع قبل خفض الدقة الأصلية.",
      "مساحة التخزين المطلوبة كبيرة؛ تأكد من توفرها.",
    ],
    faqAr: [
      { q: "هل تعمل على RTX 2060؟", a: "RTX 2060 مذكور ضمن الموصى به رسمياً. الأداء الفعلي يعتمد على الدقة والإعدادات." },
      { q: "هل تحتاج SSD؟", a: "المصدر الرسمي يذكر SSD." },
    ],
    similar: ["elden-ring", "cyberpunk-2077", "hogwarts-legacy"],
    guides: ["graphics-settings-explained", "how-to-increase-fps"],
    editorialRank: 15,
  },
];


const STEAM_IDS: Record<string, number> = {
  "grand-theft-auto-v": 271590, "red-dead-redemption-2": 1174180, "cyberpunk-2077": 1091500, "counter-strike-2": 730,
  "elden-ring": 1245620, "hogwarts-legacy": 990080, "forza-horizon-5": 1551360, "the-witcher-3-wild-hunt": 292030,
  "pubg-battlegrounds": 578080, "marvels-spider-man-remastered": 1817070, "god-of-war": 1593500, "black-myth-wukong": 2358720,
};
const KINDS: Record<string, NonNullable<Game["perfKind"]>> = {
  "counter-strike-2": "esports", valorant: "esports", fortnite: "esports", minecraft: "light",
  "red-dead-redemption-2": "heavy", "cyberpunk-2077": "heavy", "hogwarts-legacy": "heavy", "black-myth-wukong": "heavy",
};

const withMeta = coreGames.map((g) => ({ ...g, steamAppId: STEAM_IDS[g.slug], perfKind: KINDS[g.slug] ?? "standard" }));
const all: Game[] = [...withMeta, ...extraGames];

// الألعاب المشابهة للإضافية: أقرب ثلاث ألعاب تشاركها نوعاً (مرتبة بالأبرز).
export const games: Game[] = all.map((g) => {
  if (g.similar.length) return g;
  const sim = all
    .filter((o) => o.slug !== g.slug && o.genres.some((x) => g.genres.includes(x)))
    .sort((a, b) => b.genres.filter((x) => g.genres.includes(x)).length - a.genres.filter((x) => g.genres.includes(x)).length || a.editorialRank - b.editorialRank)
    .slice(0, 3)
    .map((o) => o.slug);
  return { ...g, similar: sim };
});

export const gameBySlug = new Map(games.map((g) => [g.slug, g]));
export const getGame = (slug: string) => gameBySlug.get(slug);
export const allGenres = Array.from(new Set(games.flatMap((g) => g.genres))).sort((a, b) => a.localeCompare(b, "ar"));
