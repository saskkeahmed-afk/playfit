import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./config";
import type { Game, Guide } from "./types";

interface MetaInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/** كل صفحة تحصل على canonical فقط عند ضبط الدومين الإنتاجي. */
export function buildMetadata({ title, description, path, noindex }: MetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: noindex ? { index: false, follow: true } : undefined,
    // صورة المشاركة الافتراضية (brand/og-1200x630.png → src/app/opengraph-image.png). لا نضعها بدون دومين مضبوط.
    openGraph: { title, description, type: "website", locale: "ar_AR", siteName: SITE_NAME, ...(url ? { url, images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: SITE_NAME }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(url ? { images: ["/opengraph-image.png"] } : {}) },
  };
}

/** يمنع كسر وسم <script> عبر محتوى مُدخل. */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function websiteJsonLd() {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, alternateName: "بلاي فت", url: SITE_URL, inLanguage: "ar", publisher: { "@id": `${SITE_URL}/#org` } },
      { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-mark-512.png`, width: 512, height: 512 } },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  if (!SITE_URL) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function videoGameJsonLd(game: Game) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.descriptionAr,
    inLanguage: "ar",
    genre: game.genres,
    gamePlatform: game.platforms,
    datePublished: String(game.releaseYear),
    author: { "@type": "Organization", name: game.developer },
    publisher: { "@type": "Organization", name: game.publisher },
    ...(SITE_URL ? { url: `${SITE_URL}/games/${game.slug}` } : {}),
  };
}

export function articleJsonLd(guide: Guide) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    inLanguage: "ar",
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    ...(SITE_URL ? { mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}` } : {}),
  };
}

/** يُستخدم فقط عندما تُعرض الأسئلة والأجوبة نفسها ظاهرة في الصفحة. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
