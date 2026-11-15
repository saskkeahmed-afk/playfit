
'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraAd() {
  const nativeRef = useRef<HTMLDivElement>(null);
  const banner320Ref = useRef<HTMLDivElement>(null);
  const banner300Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Native Banner
    const nativeScript = document.createElement('script');
    nativeScript.async = true;
    nativeScript.setAttribute('data-cfasync', 'false');
    nativeScript.src =
      'https://bauval.org/21/5efecba69f9e969247dbb4d9ceb9677c';

    nativeRef.current?.appendChild(nativeScript);

    // 2. Banner 320x50
    // 3. Banner 300x250
    const loadBanner = (
      container: HTMLDivElement,
      key: string,
      width: number,
      height: number
    ) => {
      return new Promise<void>((resolve) => {
        (window as any).atOptions = {
          key,
          format: 'iframe',
          height,
          width,
          params: {},
        };

        const script = document.createElement('script');
        script.src = `https://bauval.org/22/${key}`;
        script.async = false;

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

  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8 my-8">

      {/* Native Banner */}
      <div
        id="container-5efecba69f9e969247dbb4d9ceb9677c"
        ref={nativeRef}
        className="w-full flex justify-center"
      />

      {/* Banner 320x50 */}
      <div
        ref={banner320Ref}
        className="w-full flex justify-center overflow-hidden"
      />

      {/* Banner 300x250 */}
      <div
        ref={banner300Ref}
        className="w-full flex justify-center overflow-hidden"
      />

    </div>
  );
}
