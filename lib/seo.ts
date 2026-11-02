import type { Metadata } from "next";
import site from "@/data/site.json";
import reviewsData from "@/data/reviews.json";
import { formulas, rentalItems } from "@/lib/catalog";
import { getDict, locales, ogLocale, type Locale } from "@/lib/i18n";

export function pageMeta(lang: Locale, path: string, title: string, description: string, image = "/og.jpg"): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) as Record<string, string>;
  languages["x-default"] = `/fr${path}`;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}${path}`, languages },
    openGraph: {
      type: "website",
      siteName: "Sud Events",
      title,
      description,
      url: `/${lang}${path}`,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Traiteur (FoodEstablishment) + services + catalogue + avis réel + FAQ, dans un seul graphe JSON-LD. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const id = `${site.url}/#business`;
  const areaServed = site.areas.flatMap((a) => [
    { "@type": "AdministrativeArea", name: `${a.name} (${a.code})` },
    ...a.cities.map((c) => ({ "@type": "City", name: c })),
  ]);
  const services = d.trades.items.map((t) => ({
    "@type": "Service",
    name: t.name,
    description: t.text,
    provider: { "@id": id },
    areaServed: site.areas.map((a) => ({ "@type": "AdministrativeArea", name: a.name })),
  }));
  const reviews = reviewsData.reviews
    .filter((r) => r.published)
    .map((r) => ({ "@type": "Review", reviewBody: r.text, inLanguage: "fr", author: { "@type": "Person", name: r.author ?? "Client Sud Events" } }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        "@id": id,
        name: site.name,
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/hero/trone-dore-bougies.jpg`],
        logo: `${site.url}/logo.svg`,
        telephone: site.phoneIntl,
        sameAs: [site.instagram],
        servesCuisine: ["Oriental", "Méditerranéenne"],
        address: { "@type": "PostalAddress", addressRegion: "Provence-Alpes-Côte d'Azur", addressCountry: "FR" },
        areaServed,
        knowsLanguage: ["fr", "en", "ar"],
        contactPoint: { "@type": "ContactPoint", telephone: site.phoneIntl, contactType: "customer service", availableLanguage: ["French", "English", "Arabic"] },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: d.rental.title,
          itemListElement: [
            ...formulas.map((f) => ({
              "@type": "Offer",
              name: d.traiteur.formulas.items[f.id].name,
              description: d.traiteur.formulas.items[f.id].text,
              ...(f.priceFrom ? { priceSpecification: { "@type": "UnitPriceSpecification", minPrice: f.priceFrom, priceCurrency: "EUR", unitText: "personne" } } : {}),
            })),
            ...rentalItems.map((r) => ({
              "@type": "Offer",
              businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
              name: d.rental.items[r.id].name,
              description: d.rental.items[r.id].text,
              ...(r.priceFrom ? { priceSpecification: { "@type": "PriceSpecification", minPrice: r.priceFrom, priceCurrency: "EUR" } } : {}),
            })),
          ],
        },
        ...(reviews.length ? { review: reviews } : {}),
      },
      ...services,
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
