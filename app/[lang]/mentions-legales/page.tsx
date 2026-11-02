import type { Metadata } from "next";
import Link from "next/link";
import { Sprig } from "@/components/Logo";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "/mentions-legales", d.meta.legalTitle, d.meta.legalDescription);
}

// À COMPLÉTER quand Sud Events les fournit : forme juridique, SIRET, adresse du siège, responsable de la publication.
export default async function Legal({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  const d = getDict(lang as Locale);
  return (
    <article className="mx-auto max-w-3xl px-5 pt-36 pb-28 md:pt-48 md:pb-40">
      <h1 className="display text-[2.8rem] md:text-[3.8rem]">{d.legal.title}</h1>
      <Sprig className="mt-8 h-10 w-auto text-gold" />
      <div className="mt-12 space-y-10">
        {d.legal.sections.map((s) => (
          <section key={s.title}>
            <h2 className="eyebrow">{s.title}</h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.85] text-muted">{s.text}</p>
          </section>
        ))}
      </div>
      <Link href={`/${lang}`} className="btn-line mt-16">
        {d.legal.back}
      </Link>
    </article>
  );
}
