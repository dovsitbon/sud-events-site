"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FormulaId } from "@/lib/catalog";
import type { Dict, Locale } from "@/lib/i18n";
import type { QuoteItem } from "@/lib/quote";

type LocaleCtx = { lang: Locale; d: Dict };
const LocaleContext = createContext<LocaleCtx | null>(null);

export function useLocale() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocale hors de Providers");
  return v;
}

/** Demande en cours : articles de location et formule choisis avant d'arriver au formulaire. */
type Basket = {
  items: QuoteItem[];
  formula: FormulaId | "";
  setQty: (id: string, qty: number) => void;
  setFormula: (f: FormulaId | "") => void;
  clear: () => void;
};
const BasketContext = createContext<Basket | null>(null);
const KEY = "sudevents-demande";

export function useBasket() {
  const v = useContext(BasketContext);
  if (!v) throw new Error("useBasket hors de Providers");
  return v;
}

export function Providers({ lang, d, children }: { lang: Locale; d: Dict; children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [formula, setFormula] = useState<FormulaId | "">("");
  const [ready, setReady] = useState(false);

  // La demande survit à un changement de langue ou un rechargement (onglet en cours seulement)
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as { items?: QuoteItem[]; formula?: FormulaId | "" } | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique au montage
      if (saved?.items) setItems(saved.items);
      if (saved?.formula) setFormula(saved.formula);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ items, formula }));
    } catch {}
  }, [items, formula, ready]);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((list) => {
      if (qty <= 0) return list.filter((it) => it.id !== id);
      const q = Math.min(999, Math.round(qty));
      return list.some((it) => it.id === id) ? list.map((it) => (it.id === id ? { ...it, qty: q } : it)) : [...list, { id, qty: q }];
    });
  }, []);
  const clear = useCallback(() => {
    setItems([]);
    setFormula("");
  }, []);

  const basket = useMemo(() => ({ items, formula, setQty, setFormula, clear }), [items, formula, setQty, clear]);

  return (
    <LocaleContext.Provider value={{ lang, d }}>
      <BasketContext.Provider value={basket}>{children}</BasketContext.Provider>
    </LocaleContext.Provider>
  );
}
