import Link from "next/link";
import { games } from "@/data/games";
import { gpus } from "@/data/gpus";
import { cpus } from "@/data/cpus";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";
import { gamesInCategory } from "@/lib/categories";
import { toSlim } from "@/lib/search-index";
import { getRemoteCovers } from "@/lib/rawg";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { GameSearch } from "@/components/GameSearch";
import { GameCard } from "@/components/GameCard";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { ScanSearch, Gauge, FileCheck2 } from "lucide-react";

export const metadata = buildMetadata({
  title: "هل لعبتك هتشتغل على جهازك؟ افحص التوافق وقدّر الفريمات",
  description: "قارن مواصفات جهازك بالمتطلبات الرسمية للألعاب، واعرف الإعدادات المناسبة، مع تقدير للفريمات مبني على قياسات منشورة عند توفرها.",
  path: "/",
});

const FAQ = [
  { q: "هل يستطيع الموقع قراءة مواصفات جهازي تلقائياً؟", a: "جزئياً فقط. المتصفح يكشف دقة الشاشة وعدد المعالجات المنطقية وأحياناً وصف كرت الشاشة، لكنه لا يكشف موديل المعالج ولا الرام الحقيقي ولا ذاكرة الكرت. لذلك نطلب منك إدخال المواصفات يدوياً ونعتبر المكتشف اقتراحاً." },
  { q: "هل أرقام الفريمات دقيقة؟", a: "هي تقديرات وليست قياسات. نعرضها كنطاق مع مستوى ثقة وشرح. إن توفرت قياسات منشورة لعتاد مماثل نستخدمها، وإلا نحسب تقديراً تقريبياً بنموذج داخلي ونكتب ذلك بوضوح على النتيجة." },
  { q: "ما الفرق بين المتطلبات الرسمية وتقدير الفريمات؟", a: "المتطلبات الرسمية مواصفات يحددها الناشر. أما تقدير الفريمات فيحتاج قياسات فعلية. نفصل بينهما في كل صفحة لأن تحقيق المتطلبات لا يضمن فريمات معينة." },
  { q: "هل بياناتي تُرسل لخادم؟", a: "مواصفاتك تبقى في متصفحك، ولا تُحفظ حتى إلا إذا طلبت ذلك صراحةً. يمكنك مسحها بزر إعادة الضبط." },
];

export default async function HomePage() {
  const popular = [...games].sort((a, b) => a.editorialRank - b.editorialRank).slice(0, 6);
  const recent = [...games].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 3);
  const covers = await getRemoteCovers([...popular, ...recent]);
  const popularGpus = gpus.filter((g) => ["geforce-gtx-1650", "geforce-gtx-1660-super", "geforce-rtx-3060-12gb", "geforce-rtx-4060", "radeon-rx-580", "radeon-rx-6600"].includes(g.id));
  const popularCpus = cpus.filter((c) => ["ryzen-5-5600x", "core-i5-12400f", "ryzen-5-3600", "core-i5-8400", "ryzen-7-7800x3d", "core-i7-12700"].includes(c.id));

  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="border-b border-ink-700 bg-[radial-gradient(ellipse_at_top_left,rgba(45,226,230,0.08),transparent_55%)]">
        <div className="container-x grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">هل لعبتك هتشتغل على جهازك؟</h1>
            <p className="mt-5 max-w-xl text-lg text-mist-300">اعرف مدى توافق جهازك مع الألعاب، واكتشف متوسط الفريمات المتوقع والإعدادات المناسبة قبل ما تحمل اللعبة.</p>
            <div className="mt-7 max-w-xl"><GameSearch items={games.map(toSlim)} placeholder="ابحث عن لعبتك: Cyberpunk, GTA V, فالورانت…" /></div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/check-my-pc" className="btn-primary">افحص جهازي</Link>
              <Link href="/games" className="btn-ghost">استكشف الألعاب</Link>
            </div>
          </div>
          <div className="scanline panel relative overflow-hidden p-6" aria-label="خطوات الاستخدام">
            <p className="mb-4 text-sm text-cyan-glow" dir="ltr">&gt; playfit --steps</p>
            <ol className="space-y-5">
              {[
                [FileCheck2, "اختر اللعبة", "نعرض متطلباتها الرسمية مع المصدر."],
                [ScanSearch, "أدخل مواصفاتك", "من القوائم، أو اقرأ ما يعرضه المتصفح ثم أكّده."],
                [Gauge, "اقرأ النتيجة", "مقارنة بالمتطلبات الرسمية وعدد الفريمات المتوقع كتقدير."],
              ].map(([Icon, t, d], i) => {
                const I = Icon as typeof Gauge;
                return (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-md border border-neon/40 text-neon"><I size={18} aria-hidden /></span>
                    <span><strong className="block">{t as string}</strong><span className="text-sm text-mist-300">{d as string}</span></span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <div className="container-x space-y-16 py-14">
        <section aria-labelledby="popular">
          <div className="mb-5 flex items-end justify-between"><h2 id="popular" className="text-2xl font-bold">ألعاب شائعة</h2><Link href="/games" className="text-sm text-cyan-glow hover:underline">كل الألعاب</Link></div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((g, i) => <li key={g.slug}><GameCard game={g} remote={covers[g.slug]} priority={i < 3} /></li>)}
          </ul>
        </section>

        <section aria-labelledby="cats">
          <div className="mb-5 flex items-end justify-between"><h2 id="cats" className="text-2xl font-bold">تصفّح حسب النوع</h2><Link href="/categories" className="text-sm text-cyan-glow hover:underline">كل الأقسام</Link></div>
          <ul className="flex flex-wrap gap-2">{categories.filter((c) => gamesInCategory(c).length > 0).map((c) => <li key={c.slug}><Link href={`/categories/${c.slug}`} className="chip px-3 py-1.5 text-sm hover:border-neon">{c.genre}</Link></li>)}</ul>
        </section>

        <section aria-labelledby="pc-detect" className="panel grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 id="pc-detect" className="mb-2 text-2xl font-bold">فحص مواصفات جهازك</h2>
            <p className="max-w-2xl text-mist-300">نقرأ ما يعرضه المتصفح فقط (دقة الشاشة، عدد المعالجات المنطقية، وصف الكرت إن أتاحه)، وتُكمل الباقي يدوياً. لا نُحمّل ولا نشغّل أي برنامج على جهازك، ولا نزعم اكتشاف ما لا يكشفه المتصفح.</p>
          </div>
          <Link href="/check-my-pc" className="btn-primary">ابدأ الفحص</Link>
        </section>

        <section aria-labelledby="recent">
          <h2 id="recent" className="mb-5 text-2xl font-bold">أحدث الألعاب إصداراً في قاعدتنا</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((g) => <li key={g.slug}><GameCard game={g} remote={covers[g.slug]} /></li>)}
          </ul>
        </section>

        <AdSlot name="inContent" />

        <section aria-labelledby="hw" className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 id="hw" className="mb-4 text-2xl font-bold">كروت شاشة شائعة</h2>
            <ul className="space-y-2">{popularGpus.map((g) => <li key={g.id}><Link href={`/gpus/${g.id}`} className="panel-soft block px-4 py-3 hover:border-neon/60" dir="ltr"><span className="block text-start">{g.name}</span></Link></li>)}</ul>
            <Link href="/gpus" className="mt-3 inline-block text-sm text-cyan-glow hover:underline">كل كروت الشاشة</Link>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">معالجات شائعة</h2>
            <ul className="space-y-2">{popularCpus.map((c) => <li key={c.id}><Link href={`/cpus/${c.id}`} className="panel-soft block px-4 py-3 hover:border-neon/60" dir="ltr"><span className="block text-start">{c.name}</span></Link></li>)}</ul>
            <Link href="/cpus" className="mt-3 inline-block text-sm text-cyan-glow hover:underline">كل المعالجات</Link>
          </div>
        </section>

        <section aria-labelledby="guides">
          <div className="mb-5 flex items-end justify-between"><h2 id="guides" className="text-2xl font-bold">أدلة مفيدة</h2><Link href="/guides" className="text-sm text-cyan-glow hover:underline">كل الأدلة</Link></div>
          <ul className="grid gap-4 md:grid-cols-3">
            {[...guides].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3).map((g) => (
              <li key={g.slug}><Link href={`/guides/${g.slug}`} className="panel block h-full p-5 hover:border-neon/60"><span className="chip mb-2">{g.category}</span><span className="block font-bold">{g.title}</span><span className="mt-2 block text-sm text-mist-300">{g.description}</span></Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how" className="panel p-6">
          <h2 id="how" className="mb-3 text-2xl font-bold">كيف نقدّر الفريمات؟</h2>
          <div className="prose-ar">
            <p>عند توفر قياسات حقيقية منشورة نستخدمها أولاً (نفس اللعبة والدقة والإعدادات وكرت مماثل). وإن لم نجد قياساً مناسباً نحسب تقديراً تقريبياً من مقارنة جهازك بعتاد المتطلبات الرسمية للعبة، ونكتب على النتيجة أنها تقدير بثقة منخفضة.</p>
            <p>لا نفترض أن الفريمات تتناسب خطياً مع قوة الكرت، ونخفّض الثقة عند اختلاف المعالج أو الرام أو نوع الجهاز (لابتوب/مكتبي). التفاصيل في <Link href="/methodology" className="text-cyan-glow underline">صفحة المنهجية</Link>.</p>
          </div>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" className="mb-4 text-2xl font-bold">أسئلة شائعة</h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="panel group p-4">
                <summary className="cursor-pointer font-bold">{f.q}</summary>
                <p className="mt-3 text-mist-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
