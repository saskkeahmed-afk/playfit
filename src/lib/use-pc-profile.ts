"use client";

import { useCallback, useEffect, useState } from "react";
import type { PcProfile } from "./types";
import { CONSENT_KEY, DEFAULT_PROFILE, STORAGE_KEY, parseStoredProfile } from "./profile";

function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* التخزين غير متاح: نتجاهل */ }
}
function safeRemove(key: string) {
  try { window.localStorage.removeItem(key); } catch { /* تجاهل */ }
}

/** يحفظ الإعدادات محلياً فقط بعد موافقة صريحة من المستخدم، ويوفّر إعادة ضبط تمسح كل شيء. */
export function usePcProfile() {
  const [profile, setProfile] = useState<PcProfile>(DEFAULT_PROFILE);
  const [consent, setConsent] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (safeGet(CONSENT_KEY) === "yes") {
      setConsent(true);
      const stored = parseStoredProfile(safeGet(STORAGE_KEY));
      if (stored) setProfile(stored);
    }
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<PcProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      if (safeGet(CONSENT_KEY) === "yes") safeSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setSaveConsent = useCallback((on: boolean) => {
    setConsent(on);
    if (on) {
      safeSet(CONSENT_KEY, "yes");
      setProfile((p) => { safeSet(STORAGE_KEY, JSON.stringify(p)); return p; });
    } else {
      safeRemove(CONSENT_KEY);
      safeRemove(STORAGE_KEY);
    }
  }, []);

  const reset = useCallback(() => {
    safeRemove(CONSENT_KEY);
    safeRemove(STORAGE_KEY);
    setConsent(false);
    setProfile(DEFAULT_PROFILE);
  }, []);

  return { profile, update, consent, setSaveConsent, reset, ready };
}
