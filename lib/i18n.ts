import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export type Dict = typeof fr;

const dictionaries: Record<Locale, Dict> = { fr, en, ar };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const getDict = (lang: Locale): Dict => dictionaries[lang];
export const dirOf = (lang: Locale) => (lang === "ar" ? "rtl" : "ltr");

export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", ar: "ar_AR" };
export const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", ar: "ar" };

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/** Texte alternatif d'une image de public/media, d'après son nom de fichier. */
export function altOf(d: Dict, src: string) {
  const key = src.split("/").pop()!.replace(/\.\w+$/, "") as keyof Dict["alt"];
  return d.alt[key] ?? "";
}
