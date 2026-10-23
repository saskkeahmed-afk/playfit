import type { Game, RequirementTier } from "@/lib/types";

/**
 * ألعاب إضافية بصيغة مختصرة. كل لعبة لها صفحة Steam كمصدر رسمي للمتطلبات وللغلاف.
 * كل القيم منقولة حسب معرفتي من صفحات المتاجر وتحتاج مراجعة (verification: needs-review).
 * عند التطابق غير الكامل مع عتاد قاعدتنا اخترنا أقرب بديل (مرجع واحد أو أكثر)، أو تركنا المرجع فارغاً فيظهر "غير محدد".
 */
type Kind = NonNullable<Game["perfKind"]>;
// [نص المعالج، مراجع المعالج، نص الكرت، مراجع الكرت، الرام، المساحة، SSD؟]
type Hw = [string, string[], string, string[], number, number?, boolean?];

const tier = ([cpuText, cpuRefs, gpuText, gpuRefs, ramGb, storageGb, ssd]: Hw): RequirementTier => ({
  cpuText, cpuRefs, gpuText, gpuRefs, ramGb,
  ...(storageGb ? { storageGb } : {}),
  ...(ssd ? { storageType: "SSD" as const } : {}),
});

const TIPS: Record<Kind, string[]> = {
  esports: [
    "خفّض الظلال والتأثيرات لرفع الفريمات وتقليل التشويش البصري.",
    "ثبّت حداً للفريمات (FPS Cap) لأداء أكثر ثباتاً.",
    "حدّث تعريف الكرت وأغلق برامج الخلفية قبل اللعب.",
  ],
  light: [
    "اللعبة خفيفة نسبياً؛ إن تعثرت فغالباً السبب برامج الخلفية أو الحرارة.",
    "في اللابتوب تأكد أن اللعبة تعمل على الكرت المنفصل لا المدمج.",
  ],
  standard: [
    "ابدأ بالإعدادات المتوسطة ثم ارفع تدريجياً حسب ثبات الأداء.",
    "جرّب تقنية رفع الدقة إن توفرت في اللعبة قبل خفض الدقة الأصلية.",
    "ثبّت اللعبة على SSD إن أمكن لتقليل التقطيع وزمن التحميل.",
  ],
  heavy: [
    "لعبة ثقيلة: ابدأ بخفض الظلال والإضاءة والانعكاسات وكثافة العالم.",
    "تأكد من وجود مساحة كافية وتثبيتها على SSD، وأغلق برامج الخلفية.",
    "راقب حرارة الجهاز؛ التقطيع قد يأتي من خفض السرعة بسبب الحرارة (Throttling).",
  ],
};
const GUIDE2: Record<Kind, string> = { esports: "fix-stuttering", light: "laptop-gaming-performance", standard: "fix-stuttering", heavy: "graphics-settings-explained" };

interface Spec {
  slug: string; title: string; titleAr?: string; genres: string[]; year: number;
  dev: string; pub: string; platforms?: string[]; desc: string; steam: number; kind: Kind;
  min: Hw; rec?: Hw;
}

function mk(o: Spec, i: number): Game {
  const min = tier(o.min);
  const recommended = o.rec ? tier(o.rec) : undefined;
  const name = o.titleAr ?? o.title;
  const faq = [
    { q: `كم رام تحتاج ${name}؟`, a: `الحد الأدنى الرسمي في بياناتنا ${min.ramGb}GB${recommended ? ` والموصى به ${recommended.ramGb}GB` : ""}.` },
    recommended
      ? { q: `ما الفرق بين الحد الأدنى والموصى به في ${name}؟`, a: "الحد الأدنى يشغّل اللعبة غالباً بإعدادات منخفضة، والموصى به يستهدف تجربة أفضل. كلاهما مواصفات ناشر وليسا فريمات مضمونة." }
      : { q: `هل لـ ${name} متطلبات موصى بها؟`, a: "لم ندخل متطلبات موصى بها لهذه اللعبة في بياناتنا؛ نعرض الحد الأدنى فقط." },
  ];
  if (min.storageGb) faq.push({ q: `كم مساحة تحتاجها ${name}؟`, a: `المساحة المسجّلة لدينا ${min.storageGb}GB${min.storageType ? ` على ${min.storageType}` : ""}؛ قد تتغير مع التحديثات فراجع صفحة المتجر.` });
  return {
    slug: o.slug, title: o.title, titleAr: o.titleAr, genres: o.genres, releaseYear: o.year,
    developer: o.dev, publisher: o.pub, platforms: o.platforms ?? ["PC"],
    descriptionAr: o.desc, min, recommended,
    requirementsSource: { label: `Steam — ${o.title}`, url: `https://store.steampowered.com/app/${o.steam}/` },
    verification: "needs-review", supportedUpscaling: [], tipsAr: TIPS[o.kind], faqAr: faq,
    similar: [], guides: ["how-to-increase-fps", GUIDE2[o.kind]],
    editorialRank: 100 + i, steamAppId: o.steam, perfKind: o.kind,
  };
}

const specs: Spec[] = [
  { slug: "dota-2", title: "Dota 2", titleAr: "دوتا 2", genres: ["MOBA", "تنافسية"], year: 2013, dev: "Valve", pub: "Valve", steam: 570, kind: "esports",
    desc: "لعبة مواجهات جماعية استراتيجية مجانية بين فريقين. مصممة لتعمل على نطاق واسع من الأجهزة.",
    min: ["Dual core from Intel or AMD at 2.8 GHz", ["core-2-duo-e8400"], "NVIDIA GeForce 8600/9600GT, ATI/AMD Radeon HD2600/3600", ["radeon-r5-integrated"], 4, 15] },
  { slug: "apex-legends", title: "Apex Legends", titleAr: "أبكس ليجندز", genres: ["باتل رويال", "تصويب", "تنافسية"], year: 2019, dev: "Respawn Entertainment", pub: "Electronic Arts", steam: 1172470, kind: "esports",
    desc: "باتل رويال سريعة بفرق من ثلاثة لاعبين وشخصيات ذات قدرات مختلفة، مجانية على الكمبيوتر.",
    min: ["Intel Core i3-6300 3.8GHz / AMD FX-4350 4.2GHz Quad-Core", ["core-i3-4160", "fx-4350"], "NVIDIA GeForce GT 640 / Radeon HD 7730", ["geforce-gt-730"], 6, 56],
    rec: ["Intel i5 3570K or equivalent", ["core-i5-3570k"], "Nvidia GeForce GTX 970 / AMD Radeon R9 290", ["geforce-gtx-970", "radeon-r9-290"], 8, 56] },
  { slug: "rust", title: "Rust", titleAr: "راست", genres: ["نجاة", "مغامرة"], year: 2018, dev: "Facepunch Studios", pub: "Facepunch Studios", steam: 252490, kind: "standard",
    desc: "لعبة نجاة جماعية قاسية تعتمد على جمع الموارد وبناء القواعد في مواجهة لاعبين آخرين.",
    min: ["Intel Core i7-3770 / AMD FX-9590", ["core-i7-3770", "fx-8350"], "GTX 670 2GB / AMD R9 280", ["geforce-gtx-760", "radeon-r9-280"], 10, 20, true] },
  { slug: "terraria", title: "Terraria", titleAr: "تيراريا", genres: ["بناء", "مغامرة", "نجاة"], year: 2011, dev: "Re-Logic", pub: "Re-Logic", platforms: ["PC", "Console", "Mobile"], steam: 105600, kind: "light",
    desc: "لعبة استكشاف وبناء ثنائية الأبعاد مليئة بالأعداء والكنوز. خفيفة جداً على الجهاز.",
    min: ["2.0 GHz", ["core-2-duo-e8400"], "128MB Video Memory, Shader Model 2.0+", ["radeon-r5-integrated"], 2.5, 0.2] },
  { slug: "stardew-valley", title: "Stardew Valley", titleAr: "ستاردو فالي", genres: ["محاكاة", "مغامرة"], year: 2016, dev: "ConcernedApe", pub: "ConcernedApe", platforms: ["PC", "Console", "Mobile"], steam: 413150, kind: "light",
    desc: "لعبة محاكاة مزرعة هادئة تجمع الزراعة والصداقات واستكشاف المناجم.",
    min: ["2 Ghz", ["core-2-duo-e8400"], "256 MB video memory, OpenGL 3.0+", ["radeon-r5-integrated"], 2, 0.5] },
  { slug: "baldurs-gate-3", title: "Baldur's Gate 3", titleAr: "بالدرز جيت 3", genres: ["آر بي جي", "استراتيجية"], year: 2023, dev: "Larian Studios", pub: "Larian Studios", steam: 1086940, kind: "heavy",
    desc: "لعبة آر بي جي بأدوار تعتمد على القرارات والقصة التفاعلية في عالم فانتازيا غني.",
    min: ["Intel i5-4690 / AMD FX 4350", ["core-i5-4690", "fx-4350"], "Nvidia GTX 970 / RX 480 (4GB+ of VRAM)", ["geforce-gtx-970", "radeon-rx-480"], 8, 150],
    rec: ["Intel i7 8700K / AMD r5 3600", ["core-i7-8700k", "ryzen-5-3600"], "Nvidia RTX 2060 Super / RX 5700 XT (8GB+ of VRAM)", ["geforce-rtx-2060-super", "radeon-rx-5700-xt"], 16, 150, true] },
  { slug: "palworld", title: "Palworld", titleAr: "بالورلد", genres: ["نجاة", "مغامرة", "عالم مفتوح"], year: 2024, dev: "Pocketpair", pub: "Pocketpair", steam: 1623730, kind: "standard",
    desc: "لعبة نجاة في عالم مفتوح تجمع المخلوقات وتستخدمها في القتال والبناء والعمل.",
    min: ["Intel Core i5-3570K 3.4 GHz", ["core-i5-3570k"], "NVIDIA GeForce GTX 1050 (2GB)", ["geforce-gtx-1050"], 16, 40],
    rec: ["Intel Core i9-9900K 3.6 GHz", ["core-i9-9900k"], "NVIDIA GeForce RTX 2050 (4GB)", ["geforce-rtx-2060"], 32, 40, true] },
  { slug: "helldivers-2", title: "HELLDIVERS 2", titleAr: "هيل دايفرز 2", genres: ["تصويب", "أكشن"], year: 2024, dev: "Arrowhead Game Studios", pub: "Sony Interactive Entertainment", platforms: ["PC", "PlayStation"], steam: 553850, kind: "standard",
    desc: "لعبة تصويب تعاوني من منظور الكتف تُلعب بفرق ضد حشود من الأعداء.",
    min: ["Intel Core i7-4790K / AMD Ryzen 5 1500X", ["core-i7-4790k", "ryzen-5-1500x"], "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 470", ["geforce-gtx-1050-ti", "radeon-rx-470"], 16, 100, true],
    rec: ["Intel Core i7-9700K / AMD Ryzen 7 3700X", ["core-i7-9700k", "ryzen-7-3700x"], "NVIDIA GeForce RTX 2060 / AMD Radeon RX 6600 XT", ["geforce-rtx-2060", "radeon-rx-6600-xt"], 16, 100, true] },
  { slug: "left-4-dead-2", title: "Left 4 Dead 2", titleAr: "ليفت فور ديد 2", genres: ["تصويب", "رعب", "أكشن"], year: 2009, dev: "Valve", pub: "Valve", steam: 550, kind: "light",
    desc: "لعبة تصويب تعاونية ضد حشود الزومبي بفرق من أربعة لاعبين. قديمة وتعمل على أجهزة بسيطة.",
    min: ["Pentium 4 3.0GHz (or better)", ["core-2-duo-e8400"], "Video card with 128 MB, Shader model 2.0+", ["radeon-r5-integrated"], 2, 13] },
  { slug: "skyrim-special-edition", title: "The Elder Scrolls V: Skyrim Special Edition", titleAr: "سكايريم", genres: ["آر بي جي", "عالم مفتوح"], year: 2016, dev: "Bethesda Game Studios", pub: "Bethesda Softworks", platforms: ["PC", "Console"], steam: 489830, kind: "standard",
    desc: "آر بي جي في عالم مفتوح فانتازي واسع، وتتميز بدعم كبير للتعديلات (Mods).",
    min: ["Intel i5-750 / AMD Phenom II X4-945", ["core-i5-750", "phenom-ii-x4-940"], "NVIDIA GTX 470 1GB / AMD HD 7870 2GB", ["radeon-hd-7870"], 8, 12] },
  { slug: "fallout-4", title: "Fallout 4", titleAr: "فولاوت 4", genres: ["آر بي جي", "عالم مفتوح"], year: 2015, dev: "Bethesda Game Studios", pub: "Bethesda Softworks", platforms: ["PC", "Console"], steam: 377160, kind: "standard",
    desc: "آر بي جي في عالم مفتوح بعد الدمار النووي مع بناء المستوطنات واستكشاف واسع.",
    min: ["Intel Core i5-2300 2.8 GHz / AMD Phenom II X4 945 3.0 GHz", ["core-i5-2300", "phenom-ii-x4-940"], "NVIDIA GTX 550 Ti 2GB / AMD Radeon HD 7870 2GB", ["radeon-hd-7870"], 8, 30],
    rec: ["Intel Core i7 4790 3.6 GHz / AMD FX-9590 4.7 GHz", ["core-i7-4790", "fx-8350"], "NVIDIA GTX 780 3GB / AMD Radeon R9 290X 4GB", ["geforce-gtx-780", "radeon-r9-290x"], 8, 30] },
  { slug: "starfield", title: "Starfield", titleAr: "ستارفيلد", genres: ["آر بي جي", "عالم مفتوح"], year: 2023, dev: "Bethesda Game Studios", pub: "Bethesda Softworks", platforms: ["PC", "Console"], steam: 1716740, kind: "heavy",
    desc: "آر بي جي فضائي من بيثيسدا لاستكشاف المجرة والكواكب وبناء الطاقم والسفن.",
    min: ["AMD Ryzen 5 2600X, Intel Core i7-6800K", ["ryzen-5-2600x", "core-i7-6800k"], "AMD Radeon RX 5700, NVIDIA GeForce 1070 Ti", ["radeon-rx-5700", "geforce-gtx-1070-ti"], 16, 125, true],
    rec: ["AMD Ryzen 5 3600X, Intel i5-10600K", ["ryzen-5-3600x", "core-i5-10600k"], "AMD Radeon RX 6800 XT, NVIDIA GeForce RTX 2080", ["radeon-rx-6800-xt", "geforce-rtx-2080"], 16, 125, true] },
  { slug: "resident-evil-4", title: "Resident Evil 4", titleAr: "ريزدنت إيفل 4", genres: ["رعب", "أكشن"], year: 2023, dev: "Capcom", pub: "Capcom", platforms: ["PC", "Console"], steam: 2050650, kind: "standard",
    desc: "إعادة صنع للعبة الرعب والأكشن الشهيرة بمنظور الكتف وتفاصيل بصرية حديثة.",
    min: ["Ryzen 5 1500X / Core i5-7500", ["ryzen-5-1500x", "core-i5-7500"], "GeForce GTX 1050 Ti / Radeon RX 560 (VRAM 4GB)", ["geforce-gtx-1050-ti", "radeon-rx-560"], 8, 60],
    rec: ["Ryzen 5 3600 / Core i7 8700", ["ryzen-5-3600", "core-i7-8700"], "GeForce GTX 1070 / Radeon RX 5700", ["geforce-gtx-1070", "radeon-rx-5700"], 16, 60] },
  { slug: "resident-evil-village", title: "Resident Evil Village", titleAr: "ريزدنت إيفل فيليج", genres: ["رعب", "أكشن"], year: 2021, dev: "Capcom", pub: "Capcom", platforms: ["PC", "Console"], steam: 1196590, kind: "standard",
    desc: "لعبة رعب وبقاء بمنظور الشخص الأول في قرية غامضة مليئة بالمخلوقات.",
    min: ["AMD Ryzen 3 1200 / Intel Core i5-7500", ["ryzen-3-1200", "core-i5-7500"], "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560", ["geforce-gtx-1050-ti", "radeon-rx-560"], 8, 35],
    rec: ["AMD Ryzen 5 3600 / Intel Core i7 8700", ["ryzen-5-3600", "core-i7-8700"], "NVIDIA GeForce GTX 1070 / AMD Radeon RX 5700", ["geforce-gtx-1070", "radeon-rx-5700"], 16, 35] },
  { slug: "sekiro-shadows-die-twice", title: "Sekiro: Shadows Die Twice", titleAr: "سيكيرو", genres: ["أكشن", "مغامرة"], year: 2019, dev: "FromSoftware", pub: "Activision", steam: 814380, kind: "standard",
    desc: "لعبة أكشن مغامرة بقتال سيوف يعتمد على الدقة والتوقيت في اليابان الإقطاعية.",
    min: ["Intel Core i3-2100 / AMD FX-6300", ["core-i3-2100", "fx-6300"], "NVIDIA GeForce GTX 760 / AMD Radeon HD 7950", ["geforce-gtx-760", "radeon-hd-7950"], 4, 25],
    rec: ["Intel Core i7-3770 / AMD Ryzen 5 1600", ["core-i7-3770", "ryzen-5-1600"], "NVIDIA GeForce GTX 970 / AMD Radeon RX 480", ["geforce-gtx-970", "radeon-rx-480"], 8, 25] },
  { slug: "dark-souls-iii", title: "DARK SOULS III", titleAr: "دارك سولز 3", genres: ["آر بي جي", "أكشن"], year: 2016, dev: "FromSoftware", pub: "Bandai Namco Entertainment", platforms: ["PC", "Console"], steam: 374320, kind: "standard",
    desc: "آر بي جي أكشن معروف بصعوبته ومعاركه الدقيقة وعوالمه المظلمة.",
    min: ["Intel Core i3-2100 / AMD FX-6300", ["core-i3-2100", "fx-6300"], "NVIDIA GeForce GTX 750 Ti / ATI Radeon HD 7950", ["geforce-gtx-750-ti", "radeon-hd-7950"], 8, 25],
    rec: ["Intel Core i7-3770K / AMD FX-8350", ["core-i7-3770", "fx-8350"], "NVIDIA GeForce GTX 970 / AMD Radeon R9 290", ["geforce-gtx-970", "radeon-r9-290"], 8, 25] },
  { slug: "monster-hunter-world", title: "Monster Hunter: World", titleAr: "مونستر هانتر وورلد", genres: ["أكشن", "آر بي جي"], year: 2018, dev: "Capcom", pub: "Capcom", platforms: ["PC", "Console"], steam: 582010, kind: "standard",
    desc: "لعبة أكشن تدور حول صيد وحوش ضخمة في بيئات حية وصناعة العتاد من أجزائها.",
    min: ["Intel Core i5-4460 / AMD FX-6300", ["core-i5-4460", "fx-6300"], "NVIDIA GeForce GTX 760 / AMD Radeon R7 260x", ["geforce-gtx-760", "radeon-r7-260x"], 8, 48],
    rec: ["Intel Core i7-3770 / AMD Ryzen 5 1500X", ["core-i7-3770", "ryzen-5-1500x"], "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 570 4GB", ["geforce-gtx-1060-3gb", "radeon-rx-570"], 8, 48] },
  { slug: "far-cry-6", title: "Far Cry 6", titleAr: "فار كراي 6", genres: ["تصويب", "أكشن", "عالم مفتوح"], year: 2021, dev: "Ubisoft Toronto", pub: "Ubisoft", platforms: ["PC", "Console"], steam: 2369390, kind: "standard",
    desc: "لعبة تصويب في عالم مفتوح داخل جزيرة كاريبية تحت حكم ديكتاتور.",
    min: ["AMD Ryzen 3 1200 / Intel Core i5-4460", ["ryzen-3-1200", "core-i5-4460"], "AMD RX 460 4GB / NVIDIA GTX 960 4GB", ["radeon-rx-460", "geforce-gtx-960"], 8, 60],
    rec: ["AMD Ryzen 5 3600X / Intel Core i7-7700", ["ryzen-5-3600x", "core-i7-7700"], "AMD RX Vega 64 8GB / NVIDIA GTX 1080 8GB", ["radeon-rx-vega-64", "geforce-gtx-1080"], 16, 60] },
  { slug: "rainbow-six-siege", title: "Tom Clancy's Rainbow Six Siege", titleAr: "رينبو سيكس سيج", genres: ["تصويب", "تنافسية"], year: 2015, dev: "Ubisoft Montreal", pub: "Ubisoft", platforms: ["PC", "Console"], steam: 359550, kind: "esports",
    desc: "لعبة تصويب تكتيكية تنافسية تعتمد على الهجوم والدفاع وتدمير البيئة.",
    min: ["Intel Core i3 560 @ 3.3 GHz / AMD Phenom II X4 945 @ 3.0 GHz", ["core-i5-750", "phenom-ii-x4-940"], "NVIDIA GeForce GTX 460 / AMD Radeon HD 5870 (1GB VRAM)", [], 6, 61],
    rec: ["Intel Core i5-2500K @ 3.3 GHz / AMD FX-8120 @ 3.1 GHz", ["core-i5-2500k", "fx-6300"], "NVIDIA GeForce GTX 670 / AMD Radeon R9 280X", ["geforce-gtx-760", "radeon-r9-280"], 8, 61] },
  { slug: "ark-survival-evolved", title: "ARK: Survival Evolved", titleAr: "آرك", genres: ["نجاة", "مغامرة"], year: 2017, dev: "Studio Wildcard", pub: "Studio Wildcard", platforms: ["PC", "Console"], steam: 346110, kind: "heavy",
    desc: "لعبة نجاة في جزيرة ديناصورات تقوم على ترويض المخلوقات وبناء القواعد.",
    min: ["Intel Core i5-2400 / AMD FX-8320", ["core-i5-2300", "fx-6300"], "NVIDIA GTX 670 2GB / AMD Radeon HD 7870 2GB", ["geforce-gtx-760", "radeon-hd-7870"], 8, 60] },
  { slug: "subnautica", title: "Subnautica", titleAr: "سبنوتيكا", genres: ["نجاة", "مغامرة"], year: 2018, dev: "Unknown Worlds Entertainment", pub: "Unknown Worlds Entertainment", platforms: ["PC", "Console"], steam: 264710, kind: "light",
    desc: "لعبة نجاة واستكشاف تحت الماء على كوكب غريب مع بناء القواعد والغواصات.",
    min: ["Intel Haswell 2 cores @ 2.5Ghz", ["core-i3-4150"], "Intel HD 4600", ["intel-hd-graphics-4000"], 4, 20] },
  { slug: "hades", title: "Hades", titleAr: "هيديس", genres: ["آر بي جي", "أكشن"], year: 2020, dev: "Supergiant Games", pub: "Supergiant Games", platforms: ["PC", "Console"], steam: 1145360, kind: "light",
    desc: "لعبة أكشن روج لايك سريعة تتسلق فيها العالم السفلي مع قصة تتطور بعد كل محاولة.",
    min: ["Dual Core 2.4 GHz", ["core-2-duo-e8400"], "1GB VRAM / DirectX 10+ support", ["radeon-r5-integrated"], 4, 15] },
  { slug: "hollow-knight", title: "Hollow Knight", titleAr: "هولو نايت", genres: ["مغامرة", "أكشن"], year: 2017, dev: "Team Cherry", pub: "Team Cherry", platforms: ["PC", "Console"], steam: 367520, kind: "light",
    desc: "مغامرة ثنائية الأبعاد بأسلوب الاستكشاف المترابط في مملكة حشرات تحت الأرض.",
    min: ["Intel Core 2 Duo E5200", ["core-2-duo-e8400"], "GeForce 9800GTX+ (1GB)", ["geforce-gt-730"], 4, 9] },
  { slug: "forza-horizon-4", title: "Forza Horizon 4", titleAr: "فورزا هورايزن 4", genres: ["سباقات", "عالم مفتوح"], year: 2021, dev: "Playground Games", pub: "Xbox Game Studios", platforms: ["PC", "Console"], steam: 1293830, kind: "standard",
    desc: "لعبة سباقات في عالم مفتوح داخل بريطانيا بفصول سنوية متغيرة.",
    min: ["Intel i3-4170 @ 3.7Ghz OR Intel i5 750 @ 2.67Ghz", ["core-i3-4160", "core-i5-750"], "NVidia 650TI OR NVidia GT 740 OR AMD R7 250x", [], 8, 70],
    rec: ["Intel i7-3820 @ 3.6Ghz", ["core-i7-3820"], "NVidia GTX 970 OR GTX 1060 3GB OR AMD R9 290x OR AMD RX 470", ["geforce-gtx-970", "geforce-gtx-1060-3gb", "radeon-r9-290x", "radeon-rx-470"], 12, 70] },
  { slug: "euro-truck-simulator-2", title: "Euro Truck Simulator 2", titleAr: "يورو تراك سيميوليتر 2", genres: ["محاكاة", "سباقات"], year: 2012, dev: "SCS Software", pub: "SCS Software", steam: 227300, kind: "light",
    desc: "محاكاة قيادة شاحنات عبر طرق أوروبا مع إدارة الشحنات والأعمال.",
    min: ["Dual core CPU 2.4 GHz", ["core-2-duo-e8400"], "GeForce GTS 450-class (Intel HD 4000)", [], 4],
    rec: ["Quad core CPU 3.0 GHz", ["core-i5-2300"], "GeForce GTX 760-class (3GB)", ["geforce-gtx-760"], 6] },
  { slug: "ea-sports-fc-24", title: "EA SPORTS FC 24", titleAr: "إي إيه سبورتس إف سي 24", genres: ["رياضة"], year: 2023, dev: "EA Vancouver / EA Romania", pub: "Electronic Arts", platforms: ["PC", "Console"], steam: 2195250, kind: "standard",
    desc: "لعبة كرة قدم بأوضاع لعب مختلفة وفرق ولاعبين مرخّصين.",
    min: ["Intel Core i5-6600K / AMD Ryzen 5 1600", ["core-i5-6600k", "ryzen-5-1600"], "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 570", ["geforce-gtx-1050-ti", "radeon-rx-570"], 8, 100],
    rec: ["Intel Core i7-6800K / AMD Ryzen 7 2700X", ["core-i7-6800k", "ryzen-7-2700x"], "NVIDIA GeForce GTX 1660 / AMD Radeon RX 5600 XT", ["geforce-gtx-1660", "radeon-rx-5600-xt"], 12, 100] },
  { slug: "horizon-zero-dawn", title: "Horizon Zero Dawn", titleAr: "هورايزن زيرو دون", genres: ["أكشن", "مغامرة", "عالم مفتوح"], year: 2020, dev: "Guerrilla Games", pub: "Sony Interactive Entertainment", platforms: ["PC", "PlayStation"], steam: 1151640, kind: "heavy",
    desc: "أكشن مغامرة في عالم مفتوح ما بعد الانهيار تواجه فيه آلات عملاقة على هيئة حيوانات.",
    min: ["Intel Core i5-2500K @ 3.3GHz / AMD FX 6300 @ 3.5GHz", ["core-i5-2500k", "fx-6300"], "NVIDIA GeForce GTX 780 (3 GB) / AMD Radeon R9 290 (4 GB)", ["geforce-gtx-780", "radeon-r9-290"], 8, 100],
    rec: ["Intel Core i7-4770K @ 3.5GHz / AMD Ryzen 5 1500X @ 3.5GHz", ["core-i7-4770k", "ryzen-5-1500x"], "NVIDIA GeForce GTX 1060 (6 GB) / AMD Radeon RX 580 (8 GB)", ["geforce-gtx-1060-6gb", "radeon-rx-580"], 16, 100] },
  { slug: "the-last-of-us-part-i", title: "The Last of Us Part I", titleAr: "ذا لاست أوف أس", genres: ["أكشن", "مغامرة"], year: 2023, dev: "Naughty Dog / Iron Galaxy", pub: "Sony Interactive Entertainment", platforms: ["PC", "PlayStation"], steam: 1888930, kind: "heavy",
    desc: "مغامرة أكشن سينمائية بعد انتشار وباء، تركز على القصة والبقاء.",
    min: ["Intel Core i7-4770K / AMD Ryzen 5 1500X", ["core-i7-4770k", "ryzen-5-1500x"], "AMD Radeon RX 470 (4 GB) / NVIDIA GeForce GTX 970 (4 GB)", ["radeon-rx-470", "geforce-gtx-970"], 16, 100, true] },
  { slug: "valheim", title: "Valheim", titleAr: "فالهايم", genres: ["نجاة", "مغامرة"], year: 2021, dev: "Iron Gate AB", pub: "Coffee Stain Publishing", steam: 892970, kind: "light",
    desc: "لعبة نجاة واستكشاف مستوحاة من الأساطير الإسكندنافية، يمكن لعبها تعاونياً.",
    min: ["2.6 GHz Dual Core or better", ["core-i3-3210"], "GeForce GTX 500 series or better", [], 8, 1] },
  { slug: "civilization-vi", title: "Sid Meier's Civilization VI", titleAr: "سيفيلايزيشن 6", genres: ["استراتيجية"], year: 2016, dev: "Firaxis Games", pub: "2K", platforms: ["PC", "Console"], steam: 289070, kind: "light",
    desc: "لعبة استراتيجية بأدوار لبناء حضارة عبر العصور بالدبلوماسية أو الحرب.",
    min: ["Intel Core i3 2.5 GHz or AMD Phenom II 2.6 GHz", ["core-i3-3210", "phenom-ii-x4-940"], "1 GB Video RAM (AMD 5570 / NVIDIA 450)", [], 4, 12],
    rec: ["Intel Core i5 2.5 GHz or AMD FX8350 4.0 GHz", ["core-i5-2300", "fx-8350"], "2 GB Video RAM (AMD 7970 / NVIDIA 770)", ["radeon-r9-280", "geforce-gtx-770"], 8, 12] },
  { slug: "metro-exodus", title: "Metro Exodus", titleAr: "ميترو إكسودوس", genres: ["تصويب", "أكشن"], year: 2019, dev: "4A Games", pub: "Deep Silver", platforms: ["PC", "Console"], steam: 412020, kind: "heavy",
    desc: "لعبة تصويب سردية في روسيا ما بعد الكارثة برحلة قطار عبر مناطق مفتوحة.",
    min: ["Intel Core i5-4440", ["core-i5-4430"], "NVIDIA GeForce GTX 670 / GTX 1050", ["geforce-gtx-1050"], 8, 59],
    rec: ["Intel Core i7-4770K", ["core-i7-4770k"], "NVIDIA GeForce GTX 1070 / AMD Radeon RX Vega 56", ["geforce-gtx-1070", "radeon-rx-vega-56"], 8, 59] },
  { slug: "death-stranding", title: "DEATH STRANDING", titleAr: "ديث سترانديج", genres: ["أكشن", "مغامرة"], year: 2020, dev: "KOJIMA PRODUCTIONS", pub: "505 Games", platforms: ["PC", "PlayStation"], steam: 1190460, kind: "standard",
    desc: "مغامرة أكشن غير تقليدية تدور حول توصيل الشحنات وإعادة ربط عالم مفكك.",
    min: ["Intel Core i5-3470 / AMD Ryzen 3 1200", ["core-i5-3470", "ryzen-3-1200"], "NVIDIA GeForce GTX 1050 3GB / AMD Radeon RX 560 4GB", ["geforce-gtx-1050", "radeon-rx-560"], 8, 80],
    rec: ["Intel Core i7-3770 / AMD Ryzen 5 1600", ["core-i7-3770", "ryzen-5-1600"], "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 590 8GB", ["geforce-gtx-1060-6gb", "radeon-rx-590"], 8, 80] },
  { slug: "diablo-iv", title: "Diablo IV", titleAr: "ديابلو 4", genres: ["آر بي جي", "أكشن"], year: 2023, dev: "Blizzard Entertainment", pub: "Blizzard Entertainment", platforms: ["PC", "Console"], steam: 2344520, kind: "standard",
    desc: "آر بي جي أكشن بمنظور علوي في عالم مظلم مع غنائم وبناء شخصيات متعدد.",
    min: ["Intel Core i5-2500K / AMD FX-8350", ["core-i5-2500k", "fx-8350"], "NVIDIA GeForce GTX 660 / AMD Radeon R9 280", ["geforce-gtx-660", "radeon-r9-280"], 8, 90, true],
    rec: ["Intel Core i5-4670K / AMD Ryzen 1300X", ["core-i5-4670", "ryzen-3-1300x"], "NVIDIA GeForce GTX 970 / AMD Radeon R9 390", ["geforce-gtx-970", "radeon-r9-290"], 16, 90, true] },
  { slug: "overwatch-2", title: "Overwatch 2", titleAr: "أوفرووتش 2", genres: ["تصويب", "تنافسية"], year: 2022, dev: "Blizzard Entertainment", pub: "Blizzard Entertainment", platforms: ["PC", "Console"], steam: 2357570, kind: "esports",
    desc: "تصويب جماعي بالأبطال وقدراتهم، مجاني وبمباريات سريعة.",
    min: ["Intel Core i3 / AMD Phenom X3 8650", ["core-i3-3210"], "NVIDIA GeForce GTX 600 series / AMD Radeon HD 7000 series", ["geforce-gtx-660", "radeon-hd-7870"], 6, 50] },
  { slug: "destiny-2", title: "Destiny 2", titleAr: "ديستني 2", genres: ["تصويب", "آر بي جي"], year: 2017, dev: "Bungie", pub: "Bungie", platforms: ["PC", "Console"], steam: 1085660, kind: "standard",
    desc: "تصويب آر بي جي جماعي مجاني بعالم مشترك ومهام وغارات تعاونية.",
    min: ["Intel Core i3 3250 3.5 GHz / AMD FX-4350 4.2 GHz", ["core-i3-4160", "fx-4350"], "NVIDIA GeForce GTX 660 2GB / AMD Radeon HD 7850 2GB", ["geforce-gtx-660", "radeon-hd-7870"], 6],
    rec: ["Intel Core i5 2400 3.4 GHz / AMD Ryzen R5 1600X 3.6 GHz", ["core-i5-2300", "ryzen-5-1600"], "NVIDIA GeForce GTX 970 4GB / AMD Radeon R9 390 8GB", ["geforce-gtx-970", "radeon-r9-290"], 8] },
  { slug: "among-us", title: "Among Us", titleAr: "أمونج أس", genres: ["تنافسية"], year: 2018, dev: "Innersloth", pub: "Innersloth", platforms: ["PC", "Mobile", "Console"], steam: 945360, kind: "light",
    desc: "لعبة استنتاج جماعية على متن سفينة فضائية حيث يختبئ محتال بين الطاقم.",
    min: ["معالج يدعم تعليمات SSE2", ["core-2-duo-e8400"], "كرت مدمج يدعم DirectX 10", ["radeon-r5-integrated"], 1] },
  { slug: "need-for-speed-unbound", title: "Need for Speed Unbound", titleAr: "نيد فور سبيد أنباوند", genres: ["سباقات"], year: 2022, dev: "Criterion Games", pub: "Electronic Arts", platforms: ["PC", "Console"], steam: 1846380, kind: "standard",
    desc: "لعبة سباقات شوارع بأسلوب بصري مرسوم وتخصيص كبير للسيارات.",
    min: ["Intel Core i5-8600K / AMD Ryzen 5 2600", ["core-i5-8600k", "ryzen-5-2600"], "NVIDIA GTX 1050 Ti / AMD RX 560 (4GB)", ["geforce-gtx-1050-ti", "radeon-rx-560"], 8, 50] },
  { slug: "tekken-8", title: "TEKKEN 8", titleAr: "تيكن 8", genres: ["قتال"], year: 2024, dev: "Bandai Namco Studios", pub: "Bandai Namco Entertainment", platforms: ["PC", "Console"], steam: 1778820, kind: "standard",
    desc: "لعبة قتال ثلاثية الأبعاد بأسلوب هجومي وتأثيرات تدمير للبيئة.",
    min: ["Intel Core i5-6600K / AMD Ryzen 5 2600", ["core-i5-6600k", "ryzen-5-2600"], "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 5500 XT", ["geforce-gtx-1050-ti"], 16, 100, true] },
  { slug: "dying-light-2", title: "Dying Light 2 Stay Human", titleAr: "دايينج لايت 2", genres: ["أكشن", "رعب", "عالم مفتوح"], year: 2022, dev: "Techland", pub: "Techland", platforms: ["PC", "Console"], steam: 534380, kind: "heavy",
    desc: "أكشن رعب في مدينة مفتوحة مليئة بالمصابين، يعتمد على التنقل السريع (باركور) والقتال.",
    min: ["Intel Core i3-9100 / AMD Ryzen 3 3100", ["core-i3-9100", "ryzen-3-3100"], "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560X", ["geforce-gtx-1050-ti", "radeon-rx-560"], 8, 60, true] },
  { slug: "battlefield-2042", title: "Battlefield 2042", titleAr: "باتلفيلد 2042", genres: ["تصويب", "أكشن"], year: 2021, dev: "DICE", pub: "Electronic Arts", platforms: ["PC", "Console"], steam: 1517290, kind: "standard",
    desc: "تصويب حربي واسع النطاق بمعارك تصل لعدد كبير من اللاعبين وخرائط ضخمة.",
    min: ["AMD Ryzen 5 1600 / Intel Core i5 6600K", ["ryzen-5-1600", "core-i5-6600k"], "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 560", ["geforce-gtx-1050-ti", "radeon-rx-560"], 8, 100] },
  { slug: "street-fighter-6", title: "Street Fighter 6", titleAr: "ستريت فايتر 6", genres: ["قتال"], year: 2023, dev: "Capcom", pub: "Capcom", platforms: ["PC", "Console"], steam: 1364780, kind: "standard",
    desc: "لعبة قتال ثنائية الأبعاد بوضع عالم مفتوح للتدريب وأوضاع تنافسية.",
    min: ["Core i5-7500 / Ryzen 3 1200", ["core-i5-7500", "ryzen-3-1200"], "GTX 1060 (VRAM 6GB) / Radeon RX 580 (VRAM 8GB)", ["geforce-gtx-1060-6gb", "radeon-rx-580"], 8, 60] },
];

export const extraGames: Game[] = specs.map(mk);
