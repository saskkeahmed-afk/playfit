import { games, allGenres } from "@/data/games";
import { getRemoteCovers } from "@/lib/rawg";
import { toCardGame } from "@/lib/cover";
import { buildMetadata } from "@/lib/seo";
import { GameLibrary } from "@/components/GameLibrary";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "مكتبة الألعاب: متطلبات التشغيل وتوافق الجهاز",
  description: "تصفّح ألعاب الكمبيوتر الموثّقة في قاعدتنا، وصفّها بالنوع وسنة الإصدار ومتطلبات الرام، وافتح صفحة كل لعبة لمقارنة جهازك بمتطلباتها الرسمية.",
  path: "/games",
});

export default async function GamesPage() {
  const covers = await getRemoteCovers(games);
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: "الألعاب" }]} />
      <h1 className="mb-2 text-3xl font-bold">مكتبة الألعاب</h1>
      <p className="mb-8 max-w-2xl text-mist-300">قاعدتنا صغيرة عن قصد: نضيف لعبة فقط عند توفر مصدر رسمي لمتطلباتها. اختر لعبة لترى المتطلبات ومقارنة جهازك.</p>
      <GameLibrary games={games.map(toCardGame)} genres={allGenres} remoteCovers={covers} />
    </div>
  );
}
