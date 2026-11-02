import logo from "@/data/logo.json";

/**
 * Logo Sud Events redessiné en tracés (scripts/logo.py) d'après le logo imprimé de la maison :
 * cercle fin, « TRAITEUR & DÉCORATION » sur l'arc, monogramme « SE », « SUD EVENTS », branche à baies.
 * La couleur suit `currentColor` : version sombre ou claire selon le fond.
 */
export function LogoFull({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={logo.viewBox} className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={logo.circle} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <g fill="currentColor">
        <path d={logo.arc} />
        <path d={logo.s} />
        <path d={logo.e} />
        <path d={logo.name} />
        {logo.berries.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <path d={logo.branch + logo.leaves} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Monogramme seul (header, favicon) : le « SE » calligraphique. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="112 112 180 168" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d={logo.s} />
        <path d={logo.e} />
      </g>
    </svg>
  );
}

/** Rameau au trait repris du logo, pour séparer les sections. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="56 262 186 146" className={className} aria-hidden="true">
      <path d={logo.branch + logo.leaves} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <g fill="currentColor">
        {logo.berries.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}
