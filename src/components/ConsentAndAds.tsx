"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ADS } from "@/lib/config";

const KEY = "playfit:ads-consent:v1";
type Choice = "accepted" | "rejected" | null;

/**
 * لا يظهر شيء ولا يُحمَّل أي سكربت إعلاني ما دامت الإعلانات معطّلة (الوضع الافتراضي).
 * عند التفعيل: لا يُحمَّل AdSense إلا بعد قبول صريح.
 * تنبيه: هذا ليس CMP معتمداً من IAB. جمهور EEA/UK يتطلب CMP معتمداً (انظر docs/ADS.md).
 */
export function ConsentAndAds() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(KEY);
      if (v === "accepted" || v === "rejected") setChoice(v);
    } catch { /* تجاهل */ }
    setReady(true);
  }, []);

  if (!ADS.enabled || !ADS.client) return null;

  const save = (c: Exclude<Choice, null>) => {
    setChoice(c);
    try { window.localStorage.setItem(KEY, c); } catch { /* تجاهل */ }
  };

  return (
    <>
      {choice === "accepted" && (
        <Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADS.client)}`} />
      )}
      {ready && choice === null && (
        <div role="dialog" aria-label="الموافقة على الإعلانات" className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-600 bg-ink-900 p-4 shadow-2xl">
          <div className="container-x flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-mist-300">يعرض الموقع إعلانات عبر طرف ثالث قد تستخدم الكوكيز. لن تُحمَّل إلا بموافقتك. <Link href="/cookies" className="text-cyan-glow underline">التفاصيل</Link></p>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => save("accepted")}>أوافق</button>
              <button className="btn-ghost" onClick={() => save("rejected")}>لا أوافق</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
