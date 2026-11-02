import Link from "next/link";
import site from "@/data/site.json";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { LogoFull } from "@/components/Logo";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/quote";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pt-20 pb-12 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-10 md:pt-28">
        <div>
          <LogoFull className="h-auto w-40 text-cream" title="Sud Events" />
          <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-cream/75">{d.footer.tagline}</p>
        </div>
        <div>
          <p className="eyebrow !text-gold">{d.footer.contact}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a href={`tel:${site.phoneIntl.replace(/\s/g, "")}`} className="inline-flex min-h-8 items-center gap-3 hover:text-gold" dir="ltr">
                <PhoneIcon className="h-4 w-4" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <InstagramIcon className="h-4 w-4" />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-gold">{d.footer.zones}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem] text-cream/85">
            {site.areas.map((a) => (
              <li key={a.code}>
                <span className="num me-2 text-gold">{a.code}</span>
                {a.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-gold">Sud Events</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem] text-cream/85">
            <li>
              <Link href={`/${lang}#devis`} className="hover:text-gold">
                {d.nav.quote}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/mentions-legales`} className="hover:text-gold">
                {d.footer.legal}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-cream/15 px-5 py-6 text-[0.75rem] tracking-[0.12em] text-cream/60 md:flex-row md:justify-between md:px-10">
        <p>
          © {year} Sud Events · {d.footer.rights}
        </p>
        <p>{d.footer.photos}</p>
      </div>
    </footer>
  );
}
