"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { useBasket, useLocale } from "@/components/providers";
import { euros, rentalCats, rentalItems, type RentalCat } from "@/lib/catalog";
import { altOf } from "@/lib/i18n";

/** Catalogue de location : onglets par catégorie, fiches sobres, « Ajouter à ma demande » avec quantité. */
export function RentalCatalog() {
  const { lang, d } = useLocale();
  const { items, setQty } = useBasket();
  const [cat, setCat] = useState<"all" | RentalCat>("all");
  const shown = cat === "all" ? rentalItems : rentalItems.filter((i) => i.cat === cat);
  const r = d.rental;

  return (
    <>
      <div role="group" aria-label={r.filterLabel} className="mb-10 flex gap-x-7 overflow-x-auto border-b border-line [scrollbar-width:none] md:mb-14 md:justify-center md:gap-x-10">
        {(["all", ...rentalCats] as const).map((c) => (
          <button key={c} type="button" className="tab shrink-0 whitespace-nowrap" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c === "all" ? r.all : r.cats[c]}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
        {shown.map((it, i) => {
          const name = r.items[it.id].name;
          const qty = items.find((x) => x.id === it.id)?.qty ?? 0;
          return (
            <motion.li key={it.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: Math.min(i, 6) * 0.05 }} className="flex flex-col">
              <div className="zoom relative aspect-[4/5] overflow-hidden bg-sand">
                <Image src={it.img} alt={altOf(d, it.img)} fill sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw" quality={70} className="object-cover" />
                <span className="num absolute start-3 top-3 bg-cream/90 px-2 py-0.5 text-[0.7rem] text-ink">{String(rentalItems.indexOf(it) + 1).padStart(2, "0")}</span>
              </div>
              <p className="eyebrow mt-4 !text-[0.6rem] md:!text-[0.6875rem]">{r.cats[it.cat]}</p>
              <h3 className="display mt-1.5 text-[1.25rem] leading-snug md:text-[1.45rem]">{name}</h3>
              <p className="mt-1.5 hidden text-[0.875rem] leading-relaxed text-muted sm:block">{r.items[it.id].text}</p>
              <p className="mt-2.5 text-[0.8125rem] text-ink">
                {it.priceFrom ? (
                  <>
                    {r.from} <span className="num text-[1rem]">{euros(it.priceFrom, lang)}</span> <span className="text-muted">{r.units[it.unit]}</span>
                  </>
                ) : (
                  <span className="text-muted">{r.onRequest}</span>
                )}
              </p>
              <div className="mt-auto pt-4">
                <AnimatePresence mode="wait" initial={false}>
                  {qty === 0 ? (
                    <motion.button
                      key="add"
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setQty(it.id, 1)}
                      className="flex min-h-11 w-full items-center justify-center gap-2 border border-ink/40 px-2 py-2 text-center text-[0.625rem] leading-snug tracking-[0.16em] uppercase transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-cream rtl:text-[0.875rem] rtl:tracking-normal"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      <span>{r.add}</span>
                    </motion.button>
                  ) : (
                    <motion.div key="qty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className="flex min-h-11 items-stretch border border-ink bg-ink text-cream">
                        <button type="button" onClick={() => setQty(it.id, qty - 1)} className="flex w-11 items-center justify-center hover:bg-gold-ink" aria-label={`${r.decrease} : ${name}`}>
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <label className="flex flex-1 items-center justify-center">
                          <span className="sr-only">
                            {r.qty} : {name}
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={999}
                            value={qty}
                            onChange={(e) => setQty(it.id, Math.max(1, Number(e.target.value) || 1))}
                            className="num w-full bg-transparent text-center text-[1rem] [appearance:textfield] focus:outline-none focus-visible:ring-1 focus-visible:ring-gold [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </label>
                        <button type="button" onClick={() => setQty(it.id, qty + 1)} className="flex w-11 items-center justify-center hover:bg-gold-ink" aria-label={`${r.increase} : ${name}`}>
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-[0.75rem] text-gold-ink" role="status">
                        <CheckIcon className="h-3.5 w-3.5" />
                        {r.added}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ul>
      <p className="mt-12 text-center text-[0.875rem] text-muted">{r.note}</p>
    </>
  );
}
