
export const SITE_NAME = "PlayFit";
export const SITE_NAME_AR = "بلاي فت";

function resolveSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (raw) {
    try {
      const u = new URL(raw);
      return u.origin;
    } catch {
      return null;
    }
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://playfit-gules.vercel.app";
}

/** رابط الموقع المستخدم في canonical و sitemap. */
export const SITE_URL: string | null = resolveSiteUrl();

export const ADS = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "",
  /** معرّفات وحدات الإعلان — تُملأ بعد موافقة AdSense */
  slots: {
    inContent: "",
    sidebar: "",
    footerBanner: "",
  },
} as const;

export const NAV_LINKS = [
  { href: "/check-my-pc", label: "افحص جهازي" },
  { href: "/games", label: "الألعاب" },
  { href: "/fps-calculator", label: "حاسبة FPS" },
  { href: "/gpus", label: "كروت الشاشة" },
  { href: "/cpus", label: "المعالجات" },
  { href: "/compare", label: "مقارنة" },
  { href: "/guides", label: "الأدلة" },
] as const;

export function absoluteUrl(path: string): string | null {
  return SITE_URL ? `${SITE_URL}${path}` : null;
}
