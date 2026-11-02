import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Amiri, Cormorant_Garamond, Jost, Noto_Naskh_Arabic, Pinyon_Script } from "next/font/google";
import "../globals.css";
import site from "@/data/site.json";
import { dirOf, getDict, isLocale, locales } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { BasketBar } from "@/components/BasketBar";

// Cormorant (titre du hero = élément LCP) est préchargée ; les autres polices arrivent en swap.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const jost = Jost({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-jost", display: "swap" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: ["400"], variable: "--font-pinyon", display: "swap", preload: false });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400"], variable: "--font-amiri", display: "swap", preload: false });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500"], variable: "--font-naskh", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: "Sud Events",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#f7f1e8", width: "device-width", initialScale: 1 };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

const introScript = `try{if(sessionStorage.getItem("sudevents-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${cormorant.variable} ${jost.variable} ${pinyon.variable} ${amiri.variable} ${naskh.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Providers lang={lang} d={d}>
          <Intro skipLabel={d.intro.skip} />
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} d={d} />
          <BasketBar />
          <WhatsAppFloat label={d.whatsapp.float} message={d.whatsapp.hello} />
        </Providers>
      </body>
    </html>
  );
}
