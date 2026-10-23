/** يُخدَّم فقط إذا ضبط المالك ADS_TXT_LINE. لا نخترع معرّف ناشر. */
export function GET() {
  const line = process.env.ADS_TXT_LINE?.trim();
  if (!line) return new Response("Not found", { status: 404 });
  return new Response(`${line}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
