import Link from "next/link";
import { games } from "@/data/games";
import { toSlim } from "@/lib/search-index";
import { GameSearch } from "@/components/GameSearch";

export const metadata = { title: "الصفحة غير موجودة", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center">
      <p className="mb-2 text-sm text-mist-500" dir="ltr">404</p>
      <h1 className="mb-3 text-3xl font-bold">لم نجد هذه الصفحة</h1>
      <p className="mx-auto mb-8 max-w-md text-mist-300">قد يكون الرابط قديماً أو غير صحيح. ابحث عن لعبتك من هنا أو ارجع للرئيسية.</p>
      <div className="mx-auto mb-8 max-w-md text-start"><GameSearch items={games.map(toSlim)} /></div>
      <Link href="/" className="btn-primary">العودة للرئيسية</Link>
    </div>
  );
}
