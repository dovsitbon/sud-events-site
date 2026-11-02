"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Monogram, Sprig } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  // En haut de l'accueil, le header flotte sur la vidéo du hero (texte crème)
  const home = `/${lang}`;
  const onHero = usePathname() === home && !scrolled && !menu;
  const links = [
    { href: `${home}#traiteur`, label: d.nav.traiteur },
    { href: `${home}#decoration`, label: d.nav.decoration },
    { href: `${home}#location`, label: d.nav.location },
    { href: `${home}#realisations`, label: d.nav.realisations },
    { href: `${home}#avis`, label: d.nav.avis },
    { href: `${home}#devis`, label: d.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-700 ${
          onHero ? "border-b border-cream/15 text-cream" : "border-b border-line bg-cream/95 text-ink backdrop-blur-sm"
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-cream focus:px-4 focus:py-2 focus:text-ink">
          {d.nav.skip}
        </a>
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[5.25rem] md:px-10">
          <div className="flex items-center">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1360px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-7 min-[1360px]:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap transition-opacity duration-500 hover:opacity-60">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} className="flex flex-col items-center gap-1" aria-label={d.nav.home}>
            <Monogram className="h-8 w-auto md:h-10" />
            <span className="hidden text-[0.56rem] tracking-[0.42em] md:block" dir="ltr" translate="no">
              SUD EVENTS
            </span>
          </Link>

          <div className="flex items-center justify-end gap-4 md:gap-6">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="-m-2 hidden h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 lg:flex" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <Link
              href={`${home}#devis`}
              className={`nav-link flex min-h-10 items-center border px-3 transition-colors duration-500 md:px-5 ${
                onHero ? "border-cream/60 hover:bg-cream hover:text-ink" : "border-ink/50 hover:bg-ink hover:text-cream"
              }`}
            >
              <span className="hidden sm:inline">{d.nav.quote}</span>
              <span className="sm:hidden">{d.nav.quoteShort}</span>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col overscroll-contain bg-cream text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            role="dialog"
            aria-modal="true"
            aria-label={d.nav.menu}
          >
            <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[5.25rem] md:px-10">
              <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
                <CloseIcon />
              </button>
              <Monogram className="h-8 w-auto md:h-10" />
              <span />
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-5" aria-label={d.nav.menu}>
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1, duration: 0.7 }}>
                  <Link href={l.href} onClick={() => setMenu(false)} className="display text-[2.4rem] leading-tight">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }} className="mt-6">
                <Link href={`${home}#devis`} onClick={() => setMenu(false)} className="btn-ink">
                  {d.nav.quote}
                </Link>
              </motion.div>
              <Sprig className="mt-8 h-14 w-auto text-gold" />
            </nav>
            <div className="flex items-center justify-between border-t border-line px-6 py-4">
              <LangSwitch lang={lang} label={d.nav.language} />
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm">
                <InstagramIcon />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
