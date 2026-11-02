// Régénère CONTENU.md : infos à demander au client, puis tous les textes du site dans les 3 langues,
// les formules et le catalogue de location, pour validation.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const json = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));
const L = { fr: await json("locales/fr.json"), en: await json("locales/en.json"), ar: await json("locales/ar.json") };
const formules = await json("data/formules.json");
const location = await json("data/location.json");
const reviews = await json("data/reviews.json");

const out = [];
out.push(`# SUD EVENTS — contenu du site à valider

Site : https://sud-events.vercel.app (FR /fr, EN /en, AR /ar). Les textes se modifient dans \`locales/fr.json\`, \`en.json\`, \`ar.json\` ; ce fichier est régénéré par \`npm run contenu\`.

## Infos à demander à Sud Events

1. **Prix des formules** traiteur (cocktail, buffet, repas servi) : prix « à partir de » par personne et nombre minimum d'invités → \`data/formules.json\`. Tant qu'ils sont vides, le site affiche « Sur devis ».
2. **Liste exacte du matériel de location**, avec prix et unité (pièce, table, invité, lot) → \`data/location.json\`. Le catalogue actuel reprend le matériel visible dans leurs reels ; à confirmer, compléter ou retirer.
3. **Photos produit** du matériel de location (sur fond neutre si possible) : aujourd'hui ce sont des images tirées des reels.
4. **Nom du gérant** et présentation de l'équipe.
5. **Adresse ou ville du siège**, forme juridique et **SIRET** (mentions légales, fiche Google, données structurées).
6. **E-mail de contact** qui recevra les demandes de devis (variable \`QUOTE_NOTIFY_EMAIL\`) et un domaine pour envoyer les e-mails (Resend).
7. **Autres avis clients** (texte, prénom, type d'événement, accord pour publication) → \`data/reviews.json\`.
8. **Vidéos en bonne qualité** (fichiers originaux, pas les reels compressés), en particulier un plan horizontal pour le haut de page.
9. **Partenaires** : liens Instagram de DJ Tahar et autres prestataires → \`data/partners.json\`.
10. **Dates déjà réservées** à griser dans le formulaire → \`data/dates.json\`.
11. **Photos publiées** : seuls les 11 reels publics ont pu être récupérés (Instagram limite l'accès sans connexion). Les 73 publications, les stories « Devis », « Avis client », « Plat » et le visuel du logo en haute définition sont à fournir.
12. Confirmer : cuisine halal ou non, déplacements hors 84 / 13 / 34, délai de réservation conseillé (non indiqués sur le site tant qu'ils ne sont pas confirmés).
`);

out.push(`## Formules (data/formules.json)\n`);
for (const f of formules.formules) {
  const t = L.fr.traiteur.formulas.items[f.id];
  out.push(`- **${t.name}** — ${f.priceFrom ? `à partir de ${f.priceFrom} € / pers.` : "prix à fournir (affiché « Sur devis »)"} — ${t.includes.join(", ")}`);
}
out.push(`\n## Catalogue de location (data/location.json)\n\n| Catégorie | Article | Description | Prix |\n| --- | --- | --- | --- |`);
for (const it of location.items) {
  const t = L.fr.rental.items[it.id];
  out.push(`| ${L.fr.rental.cats[it.cat]} | ${t.name} | ${t.text} | ${it.priceFrom ? `${it.priceFrom} € ${L.fr.rental.units[it.unit]}` : "à fournir"} |`);
}
out.push(`\n## Avis clients publiés\n`);
for (const r of reviews.reviews.filter((r) => r.published)) out.push(`> ${r.text}\n`);

// Tous les textes, clé par clé, dans les 3 langues
const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${p}${k}.`) : Array.isArray(v) ? v.flatMap((x, i) => (typeof x === "object" ? flat(x, `${p}${k}.${i}.`) : [[`${p}${k}.${i}`, x]])) : [[`${p}${k}`, v]],
  );
const maps = Object.fromEntries(Object.entries(L).map(([l, d]) => [l, Object.fromEntries(flat(d))]));
let section = "";
out.push(`\n## Textes du site (FR / EN / AR)\n`);
for (const [key] of flat(L.fr)) {
  const top = key.split(".")[0];
  if (top !== section) {
    section = top;
    out.push(`\n### ${top}\n`);
  }
  const cell = (l) => String(maps[l][key] ?? "").replace(/\n/g, " ").replace(/\|/g, "\\|");
  if (!cell("fr") && !cell("en")) continue;
  out.push(`- \`${key}\`\n  - FR : ${cell("fr")}\n  - EN : ${cell("en")}\n  - AR : ${cell("ar")}`);
}

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md à jour");
