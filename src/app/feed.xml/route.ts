import { SITE_NAME, SITE_URL } from "@/lib/config";
import { guides } from "@/data/guides";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS للأدلة. لا يعمل بدون NEXT_PUBLIC_SITE_URL (لا روابط placeholder). */
export function GET() {
  if (!SITE_URL) return new Response("Not found", { status: 404 });
  const items = [...guides].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map((g) => `
    <item>
      <title>${esc(g.title)}</title>
      <link>${SITE_URL}/guides/${g.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/guides/${g.slug}</guid>
      <pubDate>${new Date(g.publishedAt).toUTCString()}</pubDate>
      <category>${esc(g.category)}</category>
      <description>${esc(g.description)}</description>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${esc(SITE_NAME)} — الأدلة</title>
  <link>${SITE_URL}/guides</link>
  <description>أدلة عربية لرفع الفريمات وحل مشاكل الألعاب</description>
  <language>ar</language>${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
