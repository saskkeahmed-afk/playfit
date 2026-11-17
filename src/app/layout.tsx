
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SITE_NAME, SITE_NAME_AR, SITE_URL } from "@/lib/config";
import { games } from "@/data/games";
import { toSlim } from "@/lib/search-index";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentAndAds } from "@/components/ConsentAndAds";
import { JsonLd } from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/seo";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import AdsterraAd from "@/components/AdsterraAd";

const siteTitle =
  "PlayFit (بلاي فت) | حساب الفريمات FPS ومتطلبات تشغيل الألعاب";

const siteDescription =
  "PlayFit بلاي فت منصة عربية لفحص توافق الكمبيوتر مع الألعاب. اعرف هل لعبتك هتشتغل على جهازك، وقارن المعالج وكرت الشاشة، واكتشف الفريمات FPS المتوقعة ومتطلبات التشغيل الرسمية.";

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,

  title: {
    default: siteTitle,
    template: `%s | ${SITE_NAME}`,
  },

  description: siteDescription,

  applicationName: "PlayFit",

  authors: [{ name: "PlayFit" }],
  creator: "PlayFit",
  publisher: "PlayFit",

  category: "Technology",

  keywords: [
    "PlayFit",
    "بلاي فت",
    "حساب الفريمات",
    "FPS Calculator",
    "حساب FPS",
    "متطلبات تشغيل الألعاب",
    "فحص توافق الألعاب",
    "هل لعبتي هتشتغل",
    "كروت الشاشة",
    "المعالجات",
    "Gaming PC Checker",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "PlayFit | بلاي فت",
    title: siteTitle,
    description: siteDescription,
    ...(SITE_URL ? { url: SITE_URL } : {}),
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },

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
        <meta
          name="google-adsense-account"
          content="ca-pub-5789292170505318"
        />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5789292170505318"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>

      <body>
        <JsonLd data={websiteJsonLd()} />

        <Header items={items} />

        <main id="main">
          {children}
          <AdsterraAd />
        </main>

        <Footer />

        {/* Adsterra Social Bar */}
        <Script
          id="adsterra-social-bar"
          src="https://bauval.org/14/9a1e9a7eed71952b97ad191ab5039fb9"
          strategy="afterInteractive"
          data-cfasync="false"
        />

        <ConsentAndAds />

        <GoogleAnalytics gaId="G-F14809YL5W" />
      </body>
    </html>
  );
}
