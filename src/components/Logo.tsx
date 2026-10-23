import Link from "next/link";
import { SITE_NAME, SITE_NAME_AR } from "@/lib/config";

/** علامة PlayFit: مثلث تشغيل بداخله علامة صح (اللعبة "تناسب" جهازك). المصدر: brand/logo-mark.svg */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#39ff88" />
          <stop offset="1" stopColor="#2de2e6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#14171b" stroke="url(#pf-g)" strokeWidth="3" />
      <path d="M24 17 L24 47 L49 32 Z" fill="none" stroke="url(#pf-g)" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M29.5 33.5 L33 37 L38.5 30.5" fill="none" stroke="#2de2e6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} — الصفحة الرئيسية`}>
      <LogoMark />
      <span className="leading-tight" style={{ direction: "ltr" }}>
        <span className="block text-lg font-bold tracking-tight text-mist-100">Play<span className="text-neon">Fit</span></span>
        <span className="block text-[11px] text-cyan-glow">{SITE_NAME_AR} · هل لعبتك هتشتغل؟</span>
      </span>
    </Link>
  );
}
