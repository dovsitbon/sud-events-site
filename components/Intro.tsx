"use client";

import { useEffect, useState, type CSSProperties } from "react";
import logo from "@/data/logo.json";

const KEY = "sudevents-intro";
// Reflets de bougie : position (en % de l'écran), taille (px), délai (s)
const GLINTS = [
  [20, 28, 110, 1.2],
  [76, 22, 80, 1.35],
  [66, 74, 130, 1.25],
  [28, 72, 70, 1.45],
] as const;

const at = (d: number, d2?: number) => ({ "--d": `${d}s`, ...(d2 !== undefined ? { "--d2": `${d2}s` } : {}) }) as CSSProperties;

/**
 * Ouverture (2 s, une fois par session) sur fond sable au grain de papier :
 * le cercle du logo se trace, la branche se dessine, le « SE » s'écrit à la plume,
 * puis « TRAITEUR & DÉCORATION » et « SUD EVENTS » apparaissent ; reflets dorés, puis fondu sur le hero.
 * Tout est en CSS (globals.css) : l'animation démarre dès le premier rendu, sans attendre le JavaScript.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const done = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      document.documentElement.classList.add("intro-seen");
    };
    const t = setTimeout(done, 2600);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex items-center justify-center overflow-hidden text-ink">
      <div aria-hidden="true" className="intro-grain absolute inset-0" />
      {GLINTS.map(([x, y, size, delay]) => (
        <span key={`${x}-${y}`} aria-hidden="true" className="intro-glint" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, ...at(delay) }} />
      ))}
      <svg viewBox={logo.viewBox} className="relative w-[min(68vw,320px)]" aria-hidden="true">
        <path className="intro-draw" style={{ ...at(0), "--t": "0.7s" } as CSSProperties} pathLength={1} d={logo.circle} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path className="intro-draw" style={{ ...at(0.45), "--t": "0.55s" } as CSSProperties} pathLength={1} d={logo.branch + logo.leaves} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <g className="intro-fade" style={at(0.85)} fill="currentColor">
          {logo.berries.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
        <path className="intro-pen" style={at(0.55, 0.95)} pathLength={1} d={logo.s} fill="currentColor" stroke="currentColor" strokeWidth="0.9" />
        <path className="intro-pen" style={at(0.85, 1.2)} pathLength={1} d={logo.e} fill="currentColor" stroke="currentColor" strokeWidth="0.9" />
        <path className="intro-fade" style={at(1.2)} d={logo.arc} fill="currentColor" />
        <path className="intro-fade" style={at(1.3)} d={logo.name} fill="currentColor" />
      </svg>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 min-h-11 px-4 text-ink/70 transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}
