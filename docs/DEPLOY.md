# النشر خطوة بخطوة (Vercel + GitHub)

> لم يتم النشر من طرفي (لا أملك وصولاً لحساباتك). الخطوات أدناه تنفّذها أنت وتستغرق نحو 10–15 دقيقة.

## 0) تجهيز
```bash
cd playfit
npm install
npm run check          # لازم ينجح
npm run prod           # جرّب نسخة الإنتاج محلياً على http://localhost:3000 ثم أوقفها (Ctrl+C)
```

## 1) GitHub
1. أنشئ مستودعاً جديداً **فارغاً** على https://github.com/new باسم `playfit` (Private أو Public).
2. من داخل مجلد المشروع:
```bash
git init
git add .
git commit -m "PlayFit: first release"
git branch -M main
git remote add origin https://github.com/USERNAME/playfit.git
git push -u origin main
```
(استبدل `USERNAME` باسم حسابك). ملف `.gitignore` يمنع رفع `.env` و`node_modules`.

## 2) Vercel
1. ادخل https://vercel.com وسجّل بحساب GitHub.
2. **Add New → Project** واختر المستودع `playfit` ثم **Import**.
3. الإطار يُكتشف تلقائياً (Next.js). افتح **Environment Variables** وأضف:
   | الاسم | القيمة |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://دومينك.com` (بدون `/` في النهاية) — إجباري للسيو |
   | `CONTACT_TO_EMAIL` | بريدك لاستلام الرسائل |
   | `CONTACT_FROM_EMAIL` | بريد مرسل مُتحقَّق منه في Resend |
   | `RESEND_API_KEY` | من https://resend.com (اختياري لكنه يفعّل النموذج) |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | بريد بديل يظهر لو فشل النموذج |
   | `RAWG_API_KEY` | اختياري لصور الألعاب غير الموجودة على Steam |
4. اضغط **Deploy**. سيعطيك رابطاً مؤقتاً `https://playfit-xxx.vercel.app`.

## 3) الدومين
1. اشترِ دومين (Namecheap/GoDaddy/…).
2. في Vercel: **Project → Settings → Domains → Add** واكتب دومينك.
3. انسخ سجلات DNS التي تعرضها Vercel (A لـ `@` وCNAME لـ `www`) وأضفها عند مزوّد الدومين.
4. انتظر التفعيل (دقائق إلى ساعات). تأكد أن `NEXT_PUBLIC_SITE_URL` يطابق دومينك ثم **Redeploy**.

## 4) تحقق بعد النشر
```bash
npm run seo:audit -- https://دومينك.com
```
يجب أن تكون الأخطاء 0. ثم اتبع `seo/01-launch-checklist.md` و`seo/02-search-console-bing.md`.

## 5) التحديثات لاحقاً
أي `git push` إلى `main` ينشر نسخة جديدة تلقائياً. ملف `.github/workflows/ci.yml` يشغّل الفحوصات عند كل رفع.

## مشاكل شائعة
| المشكلة | الحل |
|---|---|
| لا يوجد sitemap/canonical | `NEXT_PUBLIC_SITE_URL` غير مضبوط → اضبطه وأعد النشر |
| النموذج يقول «غير مفعّل» | لم تُضبط متغيرات Resend |
| صورة لعبة خاطئة/مفقودة | صحّح `steamAppId` أو ضع صورة في `public/covers` |
| فشل البناء على Vercel | شغّل `npm run check` محلياً وانظر الخطأ |
