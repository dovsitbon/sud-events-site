"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon, CloseIcon } from "@/components/icons";
import type { Img } from "@/lib/media";

export type GalleryCat = "traiteur" | "decoration" | "salle";
export type GalleryItem = Img & { alt: string; cat: GalleryCat };
type Labels = { filterLabel: string; filters: Record<"all" | GalleryCat, string>; open: string; close: string; prev: string; next: string };

// Rythme asymétrique : largeur, format et décalage vertical, en boucle
const PATTERN = [
  "col-span-6 md:col-span-5 aspect-[4/5]",
  "col-span-6 md:col-span-4 md:mt-28 aspect-[3/4]",
  "col-span-12 md:col-span-3 aspect-[4/5] md:aspect-[2/3]",
  "col-span-6 md:col-span-3 md:-mt-20 aspect-[2/3]",
  "col-span-6 md:col-span-4 aspect-[3/4]",
  "col-span-12 md:col-span-5 md:mt-16 aspect-[4/5]",
];

export function Gallery({ items, labels }: { items: GalleryItem[]; labels: Labels }) {
  const [filter, setFilter] = useState<"all" | GalleryCat>("all");
  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const shown = filter === "all" ? items : items.filter((it) => it.cat === filter);

  const open = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setIndex(i);
  };
  const close = useCallback(() => {
    setIndex(null);
    lastFocus.current?.focus();
  }, []);
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const current = index === null ? null : shown[index];
  const filters = ["all", "traiteur", "decoration", "salle"] as const;

  return (
    <>
      <div role="group" aria-label={labels.filterLabel} className="mb-12 flex flex-wrap justify-center gap-x-8 gap-y-1 md:mb-16">
        {filters.map((f) => (
          <button key={f} type="button" className="tab" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {labels.filters[f]}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-12 gap-x-3 gap-y-3 md:gap-x-8 md:gap-y-10">
        {shown.map((it, i) => (
          <motion.li
            key={it.src}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className={`${PATTERN[i % PATTERN.length]} relative`}
          >
            <button type="button" onClick={() => open(i)} className="zoom group block h-full w-full cursor-zoom-in overflow-hidden bg-sand" aria-label={`${labels.open} : ${it.alt}`}>
              <Image src={it.src} alt={it.alt} fill sizes="(min-width: 768px) 40vw, 50vw" quality={70} className="object-cover" />
            </button>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center overscroll-contain bg-ink/95 p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            onClick={close}
          >
            <motion.figure key={current.src} className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} onClick={(e) => e.stopPropagation()}>
              <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="90vw" quality={80} className="h-auto max-h-[80svh] w-auto max-w-[88vw]" />
              <figcaption className="mt-4 text-center text-sm text-cream/75">{current.alt}</figcaption>
            </motion.figure>
            <button ref={closeRef} type="button" onClick={close} className="absolute end-3 top-3 flex h-12 w-12 items-center justify-center text-cream" aria-label={labels.close}>
              <CloseIcon className="h-6 w-6" />
            </button>
            <button type="button" onClick={(e) => (e.stopPropagation(), step(-1))} className="absolute start-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream md:start-5" aria-label={labels.prev}>
              <ArrowIcon className="h-6 w-6 -scale-x-100 rtl:scale-x-100" />
            </button>
            <button type="button" onClick={(e) => (e.stopPropagation(), step(1))} className="absolute end-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream md:end-5" aria-label={labels.next}>
              <ArrowIcon className="h-6 w-6 rtl:-scale-x-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
