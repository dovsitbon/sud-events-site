import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import partnersData from "@/data/partners.json";
import reviewsData from "@/data/reviews.json";
import { FormulaButton } from "@/components/FormulaButton";
import { Gallery, type GalleryCat, type GalleryItem } from "@/components/Gallery";
import { HeroMedia } from "@/components/HeroMedia";
import { ArrowIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Sprig } from "@/components/Logo";
import { QuoteForm } from "@/components/QuoteForm";
import { RentalCatalog } from "@/components/RentalCatalog";
import { Reveal } from "@/components/Reveal";
import { euros, formulas } from "@/lib/catalog";
import { altOf, fill, getDict, isLocale, type Dict, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { waLink } from "@/lib/quote";
import { homeJsonLd, jsonLd, pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "", d.meta.title, d.meta.description);
}

/** Photo de public/media avec son texte alternatif dans la langue de la page. */
function Photo({ d, src, sizes, className = "", fillBox = false, quality = 70 }: { d: Dict; src: string; sizes: string; className?: string; fillBox?: boolean; quality?: number }) {
  const m = img(src);
  return fillBox ? (
    <Image src={m.src} alt={altOf(d, src)} fill sizes={sizes} quality={quality} className={`object-cover ${className}`} />
  ) : (
    <Image src={m.src} alt={altOf(d, src)} width={m.width} height={m.height} sizes={sizes} quality={quality} className={`h-auto w-full ${className}`} />
  );
}

function SectionHead({ eyebrow, title, text, center = false, id }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
        {title}
      </h2>
      {text && <p className={`mt-6 text-[1.0625rem] leading-[1.8] text-muted ${center ? "mx-auto max-w-2xl" : ""}`}>{text}</p>}
    </Reveal>
  );
}

const M = {
  traiteur: "/media/traiteur-buffets",
  sucre: "/media/traiteur-sucre",
  deco: "/media/decoration",
  salles: "/media/salles",
  service: "/media/equipe-service",
  hero: "/media/hero",
  loc: "/media/location",
  mariages: "/media/mariages",
};

const GALLERY: [string, GalleryCat][] = [
  [`${M.deco}/table-roses-candelabres.jpg`, "decoration"],
  [`${M.traiteur}/buffet-fruits.jpg`, "traiteur"],
  [`${M.salles}/salle-voilages-lustres.jpg`, "salle"],
  [`${M.hero}/chandelier-cristal-provence.jpg`, "decoration"],
  [`${M.traiteur}/buffet-salades-composees.jpg`, "traiteur"],
  [`${M.salles}/reception-plein-air-provence.jpg`, "salle"],
  [`${M.deco}/centre-table-roses-hautes.jpg`, "decoration"],
  [`${M.traiteur}/cocktails-bleus.jpg`, "traiteur"],
  [`${M.salles}/table-piscine-vue.jpg`, "salle"],
  [`${M.hero}/salle-chandeliers-dores.jpg`, "decoration"],
  [`${M.sucre}/gateau-fruits-rouges.jpg`, "traiteur"],
  [`${M.salles}/tapis-rouge-entree.jpg`, "salle"],
  [`${M.deco}/roses-blanches-bougies.jpg`, "decoration"],
  [`${M.traiteur}/tajine-poulet-amandes.jpg`, "traiteur"],
  [`${M.mariages}/piste-voilages-lumieres.jpg`, "salle"],
  [`${M.deco}/support-dore-bougie-flottante.jpg`, "decoration"],
  [`${M.traiteur}/buffet-piscine.jpg`, "traiteur"],
  [`${M.mariages}/etincelles-fumee.jpg`, "salle"],
  [`${M.deco}/bougies-salle-vases-dores.jpg`, "decoration"],
  [`${M.sucre}/brownies-framboises.jpg`, "traiteur"],
  [`${M.salles}/salle-dressee-vases-dores.jpg`, "salle"],
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const trades = [`${M.traiteur}/buffet-fruits.jpg`, `${M.deco}/support-dore-bougie-flottante.jpg`, `${M.loc}/chandelier-cristal.jpg`];
  const tradeHref = ["#traiteur", "#decoration", "#location"];
  const review = reviewsData.reviews.find((r) => r.published);
  const gallery: GalleryItem[] = GALLERY.map(([src, cat]) => ({ ...img(src), alt: altOf(d, src), cat }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeJsonLd(lang))} />

      {/* ——— Hero ——— */}
      <section className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink text-cream" aria-labelledby="hero-title">
        <HeroMedia wide={img(`${M.hero}/poster-wide.jpg`)} tall={img(`${M.hero}/poster-tall.jpg`)} alt={d.hero.alt} videoWide="/media/hero-wide.mp4" videoTall="/media/hero-tall.mp4" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,26,23,0.45)_0%,rgba(30,26,23,0.1)_32%,rgba(30,26,23,0.25)_58%,rgba(30,26,23,0.78)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-[max(5.5rem,12svh)] text-center md:px-10 md:pb-28">
          <p className="eyebrow rise mx-auto max-w-[19rem] !text-cream/90 text-balance max-sm:!tracking-[0.2em] sm:max-w-none" style={{ animationDelay: "0.2s" }}>
            {d.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display mx-auto mt-6 max-w-5xl text-[2.9rem] leading-[1.02] md:text-[5.4rem] lg:text-[6.2rem] rtl:text-[2.5rem] rtl:leading-[1.3] md:rtl:text-[4.2rem] lg:rtl:text-[4.8rem]">
            {d.hero.title}
          </h1>
          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6" style={{ animationDelay: "0.5s" }}>
            <Link href="#devis" className="btn-line on-dark min-w-56">
              {d.hero.cta}
            </Link>
            <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex min-h-12 items-center gap-2.5 px-4 text-cream/90 transition-colors hover:text-cream">
              <WhatsAppIcon className="h-4 w-4" />
              <span className="link-line">{d.hero.whatsapp}</span>
            </a>
          </div>
        </div>
        <a href="#maison" className="absolute bottom-0 left-1/2 hidden h-16 w-10 -translate-x-1/2 justify-center md:flex" aria-label={d.hero.scroll}>
          <span className="scroll-line block h-full w-px bg-cream/70" />
        </a>
      </section>

      {/* ——— Manifeste ——— */}
      <section id="maison" className="scroll-mt-20 px-5 py-28 md:py-44" aria-labelledby="manifesto-title">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{d.manifesto.eyebrow}</p>
          <h2 id="manifesto-title" className="display mt-7 text-[2.3rem] md:text-[3.4rem]">
            {d.manifesto.title}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[1.0625rem] leading-[1.9] text-muted">{d.manifesto.text}</p>
          <Sprig className="mx-auto mt-12 h-12 w-auto text-gold" />
          <a href="#metiers" className="link-line nav-link mt-10 inline-block">
            {d.manifesto.link}
          </a>
        </Reveal>
      </section>

      {/* ——— 001 / 002 / 003 ——— */}
      <section id="metiers" className="scroll-mt-20 bg-ivory px-5 py-24 md:px-10 md:py-36" aria-labelledby="trades-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead eyebrow={d.trades.eyebrow} title={d.trades.title} id="trades-title" />
          </div>
          <ul className="mt-16 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
            {d.trades.items.map((t, i) => (
              <Reveal as="li" key={t.id} delay={i * 0.12} className={i === 1 ? "md:mt-20" : ""}>
                <a href={tradeHref[i]} className="group block">
                  <div className="zoom relative aspect-[3/4] overflow-hidden bg-sand">
                    <Photo d={d} src={trades[i]} fillBox sizes="(min-width: 768px) 31vw, 100vw" />
                  </div>
                  <p className="num mt-6 text-[0.875rem] text-gold-ink">{String(i + 1).padStart(3, "0")}</p>
                  <h3 className="display mt-2 text-[2rem] md:text-[2.3rem]">{t.name}</h3>
                  <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">{t.text}</p>
                  <span className="nav-link mt-5 inline-flex items-center gap-2 text-ink">
                    <span className="link-line">{d.trades.more}</span>
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Traiteur ——— */}
      <section id="traiteur" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="traiteur-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <SectionHead eyebrow={d.traiteur.eyebrow} title={d.traiteur.title} id="traiteur-title" />
            </div>
            <Reveal className="md:col-span-5 md:col-start-8 md:pt-16" delay={0.1}>
              <p className="text-[1.0625rem] leading-[1.85] text-muted">{d.traiteur.text}</p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-12">
            <Reveal className="relative md:col-span-5">
              <div className="zoom relative aspect-[4/5] overflow-hidden bg-sand">
                <Photo d={d} src={`${M.traiteur}/pastillas-cloches-argent.jpg`} fillBox sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <div className="zoom absolute -bottom-12 end-[-8%] hidden aspect-[3/4] w-[46%] overflow-hidden border-[10px] border-cream bg-sand md:block">
                <Photo d={d} src={`${M.traiteur}/poulet-olives-amandes.jpg`} fillBox sizes="20vw" />
              </div>
            </Reveal>
            <ol className="md:col-span-6 md:col-start-7 md:pt-4">
              {d.traiteur.specialties.map((s, i) => (
                <Reveal as="li" key={s.name} delay={i * 0.06} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-6 last:border-b">
                  <span className="num pt-1.5 text-[0.8125rem] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display text-[1.6rem] leading-tight">{s.name}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Service en salle */}
          <div className="mt-28 grid items-end gap-10 md:mt-40 md:grid-cols-12 md:gap-8">
            <Reveal className="md:col-span-4">
              {d.traiteur.service.script && <p className="script text-[2.4rem] leading-none text-gold-ink">{d.traiteur.service.script}</p>}
              <h3 className="display mt-3 text-[2.2rem] md:text-[2.8rem]">{d.traiteur.service.title}</h3>
              <p className="mt-5 text-[1rem] leading-[1.85] text-muted">{d.traiteur.service.text}</p>
            </Reveal>
            <div className="grid grid-cols-3 gap-3 md:col-span-8 md:gap-6">
              {[`${M.service}/serveuse-plateau-fumee.jpg`, `${M.service}/service-cloches-jardin.jpg`, `${M.service}/serveur-plateau-salle.jpg`].map((src, i) => (
                <Reveal key={src} delay={i * 0.1} className={`zoom relative aspect-[2/3] overflow-hidden bg-sand ${i === 1 ? "md:-translate-y-10" : ""}`}>
                  <Photo d={d} src={src} fillBox sizes="(min-width: 768px) 22vw, 33vw" />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Le sucré, de près */}
          <div className="mt-28 md:mt-40">
            <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h3 className="display text-[2.2rem] md:text-[2.8rem]">{d.traiteur.sweet.title}</h3>
              <p className="max-w-md text-[1rem] leading-relaxed text-muted">{d.traiteur.sweet.text}</p>
            </Reveal>
            <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
              {[`${M.sucre}/brownies-framboises.jpg`, `${M.sucre}/macarons-piscine.jpg`, `${M.sucre}/mignardises-tartelettes.jpg`, `${M.sucre}/verrines-panna-cotta.jpg`].map((src, i) => (
                <Reveal key={src} delay={i * 0.08} className="zoom relative aspect-[3/4] w-[70vw] shrink-0 snap-start overflow-hidden bg-sand md:w-auto">
                  <Photo d={d} src={src} fillBox sizes="(min-width: 768px) 23vw, 70vw" />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Formules */}
          <div id="formules" className="mt-28 scroll-mt-24 md:mt-44">
            <SectionHead eyebrow={d.traiteur.formulas.eyebrow} title={d.traiteur.formulas.title} text={d.traiteur.formulas.text} center />
            <ul className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
              {formulas.map((f, i) => {
                const t = d.traiteur.formulas.items[f.id];
                return (
                  <Reveal as="li" key={f.id} delay={i * 0.1} className="flex flex-col border border-line bg-ivory p-8 md:p-10">
                    <p className="num text-[0.8125rem] text-gold-ink">{String(i + 1).padStart(3, "0")}</p>
                    <h3 className="display mt-3 text-[2.2rem]">{t.name}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{t.text}</p>
                    <div className="rule-gold my-7 w-10" />
                    <p className="text-[0.8125rem] uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{f.priceFrom ? d.traiteur.formulas.from : " "}</p>
                    <p className="display mt-1 text-[2rem]">
                      {f.priceFrom ? (
                        <>
                          {euros(f.priceFrom, lang)} <span className="text-[1rem] text-muted">{d.traiteur.formulas.perPerson.replace("€", "").trim()}</span>
                        </>
                      ) : (
                        d.traiteur.formulas.onQuote
                      )}
                    </p>
                    {f.minGuests && <p className="mt-1 text-[0.8125rem] text-muted">{fill(d.traiteur.formulas.minGuests, { n: f.minGuests })}</p>}
                    <ul className="mt-7 mb-9 space-y-2.5 text-[0.9375rem]">
                      {t.includes.map((x) => (
                        <li key={x} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" />
                          {x}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <FormulaButton id={f.id} />
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— Chaque détail compte ——— */}
      <section className="relative flex min-h-[78svh] items-center justify-center overflow-hidden bg-ink text-cream" aria-labelledby="detail-title">
        <Photo d={d} src={`${M.deco}/table-roses-arches-lumineuses.jpg`} fillBox sizes="100vw" quality={75} className="object-[50%_60%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/60" />
        <Reveal className="relative px-5 text-center">
          <p className="eyebrow !text-cream/85">{d.detail.eyebrow}</p>
          <h2 id="detail-title" className="display mt-6 text-[3rem] md:text-[6rem]">
            {d.detail.title}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-cream/90">{d.detail.text}</p>
        </Reveal>
      </section>

      {/* ——— Décoration ——— */}
      <section id="decoration" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="deco-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <SectionHead eyebrow={d.decoration.eyebrow} title={d.decoration.title} text={d.decoration.text} id="deco-title" />
            </div>
          </div>
          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-12">
            <Reveal className="md:col-span-6">
              <div className="zoom relative aspect-[4/5] overflow-hidden bg-sand">
                <Photo d={d} src={`${M.deco}/chaises-maries-arche-roses.jpg`} fillBox sizes="(min-width: 768px) 48vw, 100vw" />
              </div>
            </Reveal>
            <div className="md:col-span-6 md:pt-8">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {d.decoration.items.map((it, i) => (
                  <Reveal as="li" key={it.name} delay={i * 0.06} className="border-t border-line py-6">
                    <p className="num text-[0.8125rem] text-gold-ink">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="display mt-2 text-[1.5rem] leading-tight">{it.name}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{it.text}</p>
                  </Reveal>
                ))}
              </ul>
              <Reveal className="mt-10 grid grid-cols-[5.5rem_1fr] items-center gap-6 bg-sand p-5 md:grid-cols-[7rem_1fr] md:p-7">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Photo d={d} src={`${M.salles}/tapis-rouge-entree.jpg`} fillBox sizes="112px" />
                </div>
                <p className="display text-[1.25rem] leading-snug md:text-[1.45rem]">{d.decoration.oriental}</p>
              </Reveal>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-3 md:mt-32 md:grid-cols-12 md:gap-8">
            <Reveal className="zoom relative col-span-1 aspect-[3/4] overflow-hidden bg-sand md:col-span-4">
              <Photo d={d} src={`${M.deco}/vases-dores-fleurs.jpg`} fillBox sizes="(min-width: 768px) 32vw, 50vw" />
            </Reveal>
            <Reveal delay={0.1} className="zoom relative col-span-1 aspect-[3/4] overflow-hidden bg-sand md:col-span-3 md:mt-24">
              <Photo d={d} src={`${M.deco}/bougie-flottante-centre-table.jpg`} fillBox sizes="(min-width: 768px) 24vw, 50vw" />
            </Reveal>
            <Reveal delay={0.2} className="zoom relative col-span-2 aspect-[4/5] overflow-hidden bg-sand md:col-span-5 md:aspect-[4/5]">
              <Photo d={d} src={`${M.deco}/arche-fleurs-entree.jpg`} fillBox sizes="(min-width: 768px) 40vw, 100vw" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— Location ——— */}
      <section id="location" className="scroll-mt-20 bg-ivory px-5 py-24 md:px-10 md:py-40" aria-labelledby="rental-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.rental.eyebrow} title={d.rental.title} text={d.rental.text} center id="rental-title" />
          <div className="mt-14 md:mt-20">
            <RentalCatalog />
          </div>
        </div>
      </section>

      {/* ——— Réalisations ——— */}
      <section id="realisations" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.gallery.eyebrow} title={d.gallery.title} text={d.gallery.text} center id="gallery-title" />
          <div className="mt-14">
            <Gallery items={gallery} labels={d.gallery} />
          </div>
          <div className="mt-16 text-center">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="nav-link inline-flex items-center gap-3">
              <InstagramIcon className="h-4 w-4" />
              <span className="link-line">{d.gallery.instagram}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ——— Avis ——— */}
      <section id="avis" className="scroll-mt-20 bg-sand px-5 py-24 md:px-10 md:py-40" aria-labelledby="reviews-title">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow">{d.reviews.eyebrow}</p>
            <h2 id="reviews-title" className="display mt-5 text-[2.5rem] md:text-[3.4rem]">
              {d.reviews.title}
            </h2>
          </Reveal>
          {review && (
            <Reveal delay={0.1}>
              <figure className="mt-14">
                <span aria-hidden="true" className="display block text-[5rem] leading-[0.5] text-gold">
                  “
                </span>
                {d.reviews.translation && <p className="eyebrow mt-6 !text-[0.625rem]">{d.reviews.original}</p>}
                <blockquote lang="fr" dir="ltr" className="display mt-6 text-[1.45rem] leading-[1.55] italic md:text-[1.9rem]">
                  {review.text}
                </blockquote>
                {d.reviews.translation && <p className="mx-auto mt-10 max-w-2xl border-t border-gold/40 pt-8 text-[1rem] leading-[1.85] text-muted">{d.reviews.translation}</p>}
                <figcaption className="mt-10 text-[0.8125rem] tracking-[0.18em] text-muted uppercase rtl:tracking-normal">{d.reviews.source}</figcaption>
              </figure>
            </Reveal>
          )}
          {/* À REMPLIR avec de vrais avis clients : data/reviews.json (published: true) */}
        </div>
      </section>

      {/* ——— Partenaires ——— */}
      <section className="border-b border-line px-5 py-20 md:px-10 md:py-28" aria-labelledby="partners-title">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">{d.partners.eyebrow}</p>
            <h2 id="partners-title" className="display mt-4 text-[2.2rem] md:text-[2.8rem]">
              {d.partners.title}
            </h2>
            <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-muted">{d.partners.text}</p>
          </Reveal>
          <ul className="grid gap-px bg-line sm:grid-cols-2 md:col-span-7">
            {partnersData.partners.map((p) => {
              const inner = (
                <>
                  <p className="display text-[1.7rem]">{p.name}</p>
                  <p className="mt-1 text-[0.875rem] text-muted">{d.partners.roles[p.role as keyof Dict["partners"]["roles"]]}</p>
                </>
              );
              return (
                <li key={p.name} className="bg-cream p-7 md:p-9">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-70">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
            {/* À COMPLÉTER : autres partenaires dans data/partners.json */}
          </ul>
        </div>
      </section>

      {/* ——— Zone d'intervention ——— */}
      <section id="zone" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-36" aria-labelledby="zone-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.zone.eyebrow} title={d.zone.title} text={d.zone.text} center id="zone-title" />
          <ul className="mt-16 grid gap-px bg-line md:mt-20 md:grid-cols-3">
            {site.areas.map((a, i) => (
              <Reveal as="li" key={a.code} delay={i * 0.1} className="bg-cream px-6 py-10 text-center md:px-10 md:py-14">
                <p className="display text-[4.5rem] leading-none text-gold [font-variant-numeric:lining-nums] md:text-[5.5rem]">{a.code}</p>
                <h3 className="display mt-4 text-[1.8rem]">{a.name}</h3>
                <p className="mt-4 text-[0.9375rem] leading-[1.9] text-muted" lang="fr">
                  {a.cities.join(" · ")}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="bg-ivory px-5 py-24 md:px-10 md:py-36" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} id="faq-title" />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {d.faq.items.map((f) => (
              <details key={f.q} className="group border-t border-line last:border-b">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5">
                  <h3 className="display text-[1.4rem] leading-snug md:text-[1.6rem]">{f.q}</h3>
                  <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                    <span className="absolute top-1/2 left-0 h-px w-4 bg-ink" />
                    <span className="absolute top-0 left-1/2 h-4 w-px bg-ink transition-transform duration-500 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="pb-7 text-[1rem] leading-[1.85] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Demande de devis ——— */}
      <section id="devis" className="scroll-mt-20 px-5 py-24 md:px-10 md:py-40" aria-labelledby="quote-title">
        <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <SectionHead eyebrow={d.quote.eyebrow} title={d.quote.title} text={d.quote.text} id="quote-title" />
              <Reveal className="mt-10 border-t border-line pt-8">
                <p className="label">{d.quote.direct}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-[1rem] hover:text-gold-ink">
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a href={`tel:${site.phoneIntl.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center gap-3 text-[1rem] hover:text-gold-ink">
                    <PhoneIcon className="h-4 w-4" />
                    <span dir="ltr">{site.phone}</span>
                  </a>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-[1rem] hover:text-gold-ink">
                    <InstagramIcon className="h-4 w-4" />
                    <span dir="ltr">{site.instagramHandle}</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
