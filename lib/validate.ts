import { getRental, isFormulaId } from "@/lib/catalog";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { EVENT_TYPES, SERVICES, type EventType, type Quote, type QuoteItem, type Service } from "@/lib/quote";

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max).trim() : "");

export function parseLang(v: unknown): Locale {
  return typeof v === "string" && isLocale(v) ? v : "fr";
}

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function parseItems(v: unknown): QuoteItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .flatMap((it) => {
      const o = (it ?? {}) as Record<string, unknown>;
      const id = str(o.id, 40);
      const qty = Math.min(999, Math.max(1, Math.round(Number(o.qty) || 1)));
      return getRental(id) ? [{ id, qty }] : [];
    })
    .slice(0, 40);
}

/** Revalide côté serveur tout ce qui vient du formulaire de devis. */
export function parseQuote(raw: unknown, lang: Locale): Quote | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const eventType = str(r.eventType, 20);
  const service = str(r.service, 20);
  const formula = str(r.formula, 20);
  const budget = str(r.budget, 60);
  const q: Quote = {
    eventType: (EVENT_TYPES as readonly string[]).includes(eventType) ? (eventType as EventType) : "other",
    date: str(r.date, 10),
    venue: str(r.venue, 160),
    guests: str(r.guests, 6).replace(/\D/g, ""),
    tables: str(r.tables, 4).replace(/\D/g, ""),
    service: (SERVICES as readonly string[]).includes(service) ? (service as Service) : "both",
    formula: isFormulaId(formula) ? formula : "",
    items: parseItems(r.items),
    budget: getDict(lang).quote.fields.budgets.includes(budget) ? budget : "",
    name: str(r.name, 120),
    phone: str(r.phone, 30),
    email: str(r.email, 160),
    message: str(r.message, 1500),
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(q.date) || !q.name || !isPhone(q.phone)) return null;
  if (q.email && !isEmail(q.email)) q.email = "";
  return q;
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
