"use client";

import Link from "next/link";
import { Monogram } from "@/components/Logo";
import { useLocale } from "@/components/providers";

export default function NotFound() {
  const { lang, d } = useLocale();
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <Monogram className="h-16 w-auto text-gold" />
      <p className="num mt-8 text-sm text-gold-ink">404</p>
      <h1 className="display mt-4 text-4xl md:text-5xl">{d.notFound.title}</h1>
      <p className="mt-4 max-w-md text-muted">{d.notFound.text}</p>
      <Link href={`/${lang}`} className="btn-line mt-10">
        {d.notFound.back}
      </Link>
    </div>
  );
}
