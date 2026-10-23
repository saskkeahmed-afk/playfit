# Google Search Console وBing

> لم يتم أي توثيق أو إرسال فعلي من طرفي. هذه خطوات تنفذها أنت بعد النشر.

## Google Search Console
1. ادخل https://search.google.com/search-console بحساب جوجل.
2. اضغط **Add property** واختر **Domain** (الأفضل) وأدخل دومينك بدون `https://`.
3. انسخ سجل **TXT** وأضفه في إعدادات DNS عند مزوّد الدومين، ثم اضغط Verify (قد يتأخر دقائق إلى ساعات).
   - بديل: **URL prefix** مع طريقة وسم HTML. في هذه الحالة أضف الوسم في `src/app/layout.tsx` داخل `metadata.verification = { google: "الكود" }`.
4. من القائمة: **Sitemaps** → اكتب `sitemap.xml` → Submit.
5. من **URL Inspection** الصق رابط الصفحة الرئيسية ثم **Request indexing**. كرر لصفحات مهمة.
6. راقب: **Pages** (ما تم فهرسته وسبب عدم فهرسة الباقي)، **Performance** (الاستعلامات والنقرات)، **Core Web Vitals**.

## Bing Webmaster Tools
1. https://www.bing.com/webmasters ← سجّل الدخول.
2. استيراد الموقع من Search Console (أسهل) أو تحقق يدوي.
3. أرسل `https://دومينك/sitemap.xml` من قسم Sitemaps.
4. اختياري: IndexNow لإبلاغ Bing بالصفحات الجديدة فوراً.

## ما الطبيعي أن تراه
- «Discovered – currently not indexed» أو «Crawled – not indexed» في الأسابيع الأولى أمر شائع للمواقع الجديدة. لا يعني خللاً بالضرورة؛ حسّن المحتوى وأضف روابط حقيقية وانتظر.
- صفحات `noindex` (مثل قسم فيه أقل من 3 ألعاب) لن تظهر بقصد.
