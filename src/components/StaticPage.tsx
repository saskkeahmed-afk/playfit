import { Breadcrumbs } from "./Breadcrumbs";

export function StaticPage({ title, crumb, children, intro }: { title: string; crumb: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-10">
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/" }, { name: crumb }]} />
      <h1 className="mb-3 text-3xl font-bold">{title}</h1>
      {intro && <p className="mb-8 max-w-2xl text-mist-300">{intro}</p>}
      <div className="prose-ar">{children}</div>
    </div>
  );
}

export function OwnerNote({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 max-w-2xl rounded-lg border border-amber-400/40 bg-amber-400/5 p-3 text-sm text-amber-200"><strong>يحتاج تأكيد صاحب الموقع قبل النشر:</strong> {children}</p>;
}
