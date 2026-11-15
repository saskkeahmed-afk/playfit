
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

export default function AdsterraAd() {
  const nativeRef = useRef<HTMLDivElement>(null);
  const banner320Ref = useRef<HTMLDivElement>(null);
  const banner300Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nativeScript = document.createElement('script');
    nativeScript.async = true;
    nativeScript.setAttribute('data-cfasync', 'false');
    nativeScript.src =
      'https://bauval.org/21/5efecba69f9e969247dbb4d9ceb9677c';

    nativeRef.current?.appendChild(nativeScript);

    const loadBanner = (
      container: HTMLDivElement,
      key: string,
      width: number,
      height: number
    ): Promise<void> => {
      return new Promise((resolve) => {
        window.atOptions = {
          key,
          format: 'iframe',
          height,
          width,
          params: {},
        };

        const script = document.createElement('script');
        script.src = `https://bauval.org/22/${key}`;

        script.onload = () => resolve();
        script.onerror = () => resolve();

        container.appendChild(script);
      });
    };

    const loadAllBanners = async () => {
      if (banner320Ref.current) {
        await loadBanner(
          banner320Ref.current,
          '77fbc107c5f1cf0232615666f89b4e8e',
          320,
          50
        );
      }

      if (banner300Ref.current) {
        await loadBanner(
          banner300Ref.current,
          'f67143b4a39df97fae5af93c44591b15',
          300,
          250
        );
      }
    };

    loadAllBanners();

    return () => {
      nativeRef.current?.replaceChildren();
      banner320Ref.current?.replaceChildren();
      banner300Ref.current?.replaceChildren();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8 my-8">
      <div
        ref={nativeRef}
        id="container-5efecba69f9e969247dbb4d9ceb9677c"
        className="w-full flex justify-center"
      />

      <div
        ref={banner320Ref}
        className="w-full flex justify-center overflow-hidden"
      />

      <div
        ref={banner300Ref}
        className="w-full flex justify-center overflow-hidden"
      />
    </div>
  );
}
