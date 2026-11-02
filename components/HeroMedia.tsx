"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import type { Img } from "@/lib/media";

/**
 * Image du hero (LCP, horizontale sur ordinateur, verticale sur mobile) puis courte boucle vidéo
 * du même plan, chargée après le rendu et jamais si l'utilisateur préfère réduire les animations.
 */
export function HeroMedia({ wide, tall, alt, videoWide, videoTall }: { wide: Img; tall: Img; alt: string; videoWide: string; videoTall: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g|3g/.test(conn?.effectiveType ?? "")) return;
    let t: ReturnType<typeof setTimeout>;
    const start = () => (t = setTimeout(() => setSrc(window.matchMedia("(min-width: 768px)").matches ? videoWide : videoTall), 1200));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", start);
    };
  }, [videoWide, videoTall]);

  const common = { alt, quality: 80, sizes: "100vw" };
  const { props: wideProps } = getImageProps({ ...common, ...wide, preload: true });
  const {
    props: { srcSet: tallSet, ...tallProps },
  } = getImageProps({ ...common, ...tall, preload: true });

  return (
    <>
      <picture>
        <source media="(min-width: 768px)" srcSet={wideProps.srcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt transmis par getImageProps */}
        <img {...tallProps} srcSet={tallSet} className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      {src && (
        <video
          src={src}
          muted
          loop
          autoPlay
          playsInline
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </>
  );
}
