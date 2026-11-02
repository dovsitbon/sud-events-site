import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import { getRental, isFormulaId, type FormulaId } from "@/lib/catalog";
import { intlLocale, type Dict, type Locale } from "@/lib/i18n";

export const EVENT_TYPES = ["wedding", "engagement", "henna", "birthday", "corporate", "other"] as const;
export const SERVICES = ["deco", "traiteur", "both", "location"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export type Service = (typeof SERVICES)[number];
export type QuoteItem = { id: string; qty: number };

export type Quote = {
  eventType: EventType;
  date: string;
  venue: string;
  guests: string;
  tables: string;
  service: Service;
  formula: FormulaId | "";
  items: QuoteItem[];
  budget: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export const bookedDates = new Set<string>(calendar.booked as string[]);

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/** Date du jour au format AAAA-MM-JJ, en heure de Paris. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDay(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Récapitulatif envoyé sur WhatsApp et par e-mail, dans la langue du visiteur. */
export function quoteMessage(q: Quote, lang: Locale, d: Dict, ref?: string) {
  const m = d.quote.message;
  const f = d.quote.fields;
  // Espace avant les deux-points en français
  const c = lang === "fr" ? " :" : ":";
  const items = q.items.flatMap((it) => {
    const r = getRental(it.id);
    return r ? [`• ${d.rental.items[r.id].name} × ${it.qty}`] : [];
  });
  const event = [
    `${m.event}${c} ${f.eventTypes[q.eventType]}`,
    `${m.date}${c} ${formatDay(q.date, lang)}`,
    q.venue ? `${m.venue}${c} ${q.venue}` : "",
    q.guests ? `${m.guests}${c} ${q.guests}` : "",
    q.tables ? `${m.tables}${c} ${q.tables}` : "",
    `${m.service}${c} ${f.services[q.service]}`,
    q.formula && isFormulaId(q.formula) ? `${m.formula}${c} ${d.traiteur.formulas.items[q.formula].name}` : "",
    items.length ? `${m.items}${c}\n${items.join("\n")}` : "",
    q.budget ? `${m.budget}${c} ${q.budget}` : "",
  ];
  const contact = [
    `${m.name}${c} ${q.name}`,
    `${m.phone}${c} ${q.phone}`,
    q.email ? `${m.email}${c} ${q.email}` : "",
    q.message ? `${m.notes}${c} ${q.message}` : "",
    ref ? `${m.ref}${c} ${ref}` : "",
  ];
  return [[`*${m.title}*`], event, contact, [m.closing]].map((block) => block.filter(Boolean).join("\n")).join("\n\n");
}
