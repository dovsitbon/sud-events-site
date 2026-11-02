"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { useBasket, useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";

/** Rappel discret de la demande en cours, visible tant que le formulaire de devis n'est pas à l'écran. */
export function BasketBar() {
  const { lang, d } = useLocale();
  const { items } = useBasket();
  const [formInView, setFormInView] = useState(false);
  const count = items.reduce((n, it) => n + it.qty, 0);

  useEffect(() => {
    const el = document.getElementById("devis");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { rootMargin: "0px 0px -20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {count > 0 && !formInView && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed start-4 end-[5.25rem] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 md:end-auto md:start-8 md:bottom-8"
        >
          <a href={`/${lang}#devis`} className="flex min-h-14 items-center justify-between gap-4 bg-cream px-4 text-ink shadow-[0_10px_30px_-10px_rgba(30,26,23,0.35)] ring-1 ring-line md:px-5">
            <span className="min-w-0 truncate text-[0.8125rem] md:text-[0.875rem]" aria-live="polite">
              {fill(count > 1 ? d.rental.barMany : d.rental.barOne, { n: count })}
            </span>
            <span className="nav-link flex shrink-0 items-center gap-2 text-gold-ink">
              {d.rental.barCta}
              <ArrowIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
