
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { games } from "@/data/games";
import { toSlim } from "@/lib/search-index";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentAndAds } from "@/components/ConsentAndAds";
import { JsonLd } from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/seo";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,

  title: {
    default: `${SITE_NAME} — هل لعبتك هتشتغل على جهازك؟`,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "اعرف مدى توافق جهازك مع الألعاب وقارنه بالمتطلبات الرسمية، مع تقدير للفريمات مبني على بيانات حقيقية عند توفرها.",

  applicationName: SITE_NAME,

  alternates: SITE_URL
    ? {
        types: {
          "application/rss+xml": `${SITE_URL}/feed.xml`,
        },
      }
    : undefined,

  verification: {
    google: "EFF_fqEKkVoMtwBu3upf5Z_ogDtBL_RpwKr4CAtBGBw",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e1013",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = games.map(toSlim);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5789292170505318"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <JsonLd data={websiteJsonLd()} />
        <Header items={items} />
        <main id="main">{children}</main>
        <Footer />
        <ConsentAndAds />
      </body>
    </html>
  );
}
