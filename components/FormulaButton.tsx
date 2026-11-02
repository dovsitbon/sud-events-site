"use client";

import { useBasket, useLocale } from "@/components/providers";
import type { FormulaId } from "@/lib/catalog";

/** Retient la formule choisie et descend au formulaire de devis. */
export function FormulaButton({ id }: { id: FormulaId }) {
  const { lang, d } = useLocale();
  const { setFormula } = useBasket();
  return (
    <a href={`/${lang}#devis`} onClick={() => setFormula(id)} className="btn-line w-full">
      {d.traiteur.formulas.choose}
    </a>
  );
}
