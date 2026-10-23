import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — هل لعبتك هتشتغل على جهازك؟`,
    short_name: SITE_NAME,
    description: "افحص توافق جهازك مع الألعاب وقدّر الفريمات المتوقعة.",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    background_color: "#0e1013",
    theme_color: "#0e1013",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/brand/logo-mark-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
