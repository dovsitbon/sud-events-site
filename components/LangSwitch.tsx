"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = { fr: "FR", en: "EN", ar: "ع" };
const NAMES: Record<Locale, string> = { fr: "Français", en: "English", ar: "العربية" };

export function LangSwitch({ lang, label, className = "" }: { lang: Locale; label: string; className?: string }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(/^\/(fr|en|ar)(?=\/|$)/, "");

  return (
    <nav aria-label={label} className={`flex items-center gap-2 text-[0.75rem] tracking-[0.16em] ${className}`} dir="ltr">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
          )}
          <a
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            aria-label={NAMES[l]}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000;samesite=lax`;
            }}
            className={`inline-flex min-h-10 min-w-6 items-center justify-center transition-opacity ${l === "ar" ? "font-[family-name:var(--font-amiri)] text-[0.95rem] tracking-normal" : ""} ${l === lang ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
          >
            {LABELS[l]}
          </a>
        </span>
      ))}
    </nav>
  );
}
