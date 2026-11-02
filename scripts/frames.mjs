// Tire des images nettes des reels Instagram (assets/raw/sud-events_NN_*_video.mp4)
// et les range directement dans assets/<catégorie>/<nom>.jpg.
// `crop: [haut, bas]` (fractions de la hauteur) retire le texte incrusté « sud events » ;
// `x: [gauche, droite]` recadre en largeur.
//   node scripts/frames.mjs <chemin de ffmpeg>
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const FFMPEG = process.argv[2] ?? process.env.FFMPEG ?? "ffmpeg";
const ROOT = path.resolve(import.meta.dirname, "..");
const RAW = path.join(ROOT, "assets/raw");

// [reel, seconde, options]
const PICKS = {
  hero: {
    "trone-dore-bougies": ["10", 36],
    "salle-chandeliers-dores": ["10", 10],
    "chandelier-cristal-provence": ["06", 18.4],
  },
  "traiteur-buffets": {
    "pastillas-cloches-argent": ["01", 3.4, { crop: [0, 0.8] }],
    "pastilla-fruits-de-mer": ["01", 5.4, { crop: [0.08, 0.8] }],
    "poulet-olives-amandes": ["01", 7, { crop: [0, 0.8] }],
    "buffet-fruits": ["01", 10.6, { crop: [0, 0.8] }],
    "poulets-rotis": ["04", 1, {}],
    "buffet-salades-composees": ["04", 7, {}],
    "tajine-poulet-amandes": ["02", 12.4, {}],
    "buffet-salades-pates": ["02", 14.4, {}],
    "buffet-piscine": ["03", 16, {}],
    "cocktails-bleus": ["08", 10.5, { crop: [0, 0.74] }],
    "verrines-menthe": ["08", 23, { crop: [0, 0.74] }],
    "mini-pizzas": ["08", 28.6, { crop: [0, 0.74] }],
  },
  "traiteur-sucre": {
    "brownies-framboises": ["08", 33, { crop: [0, 0.74] }],
    "macarons-piscine": ["03", 0.4, {}],
    "gateau-fruits-rouges": ["02", 42.4, {}],
    "verrines-panna-cotta": ["08", 15, { crop: [0, 0.74] }],
    "mignardises-tartelettes": ["01", 0.3, { crop: [0, 0.8] }],
    "buffet-patisseries": ["08", 2, { crop: [0, 0.74] }],
  },
  decoration: {
    "chaises-maries-arche-roses": ["05", 6.4],
    "bougie-flottante-centre-table": ["05", 10.2],
    "roses-blanches-bougies": ["05", 30.4],
    "centre-table-roses-hautes": ["05", 14.4],
    "vases-dores-fleurs": ["07", 7],
    "bougies-salle-vases-dores": ["07", 14.6],
    "support-dore-bougie-flottante": ["10", 16.4],
    "table-dressee-or": ["10", 41],
    "arche-fleurs-entree": ["10", 0.4],
    "chaises-trone-mariage-plein-air": ["06", 20],
    "table-roses-candelabres": ["10", 25],
  },
  salles: {
    "salle-voilages-lustres": ["03", 9],
    "salle-tables-rondes": ["05", 20.4],
    "salle-dressee-vases-dores": ["07", 24.6],
    "salle-candelabres-dores": ["10", 12.4],
    "tapis-rouge-entree": ["03", 7.4],
    "reception-plein-air-provence": ["06", 22.4],
    "table-piscine-vue": ["06", 14.4],
    "tables-dressees-fleurs": ["03", 11],
  },
  location: {
    "trone-canape-dore": ["10", 37.4],
    "chandelier-dore-5-branches": ["10", 8.4],
    "chandelier-cristal": ["06", 10.4],
    "arche-fleurs-blanches": ["10", 1.4],
    "centre-table-vase-haut": ["05", 14.4],
    "cloche-argent": ["01", 3.4, { crop: [0, 0.8] }],
    "presentoirs-plexi": ["08", 14.6, { crop: [0, 0.74] }],
    "photophore-bougie-flottante": ["05", 10.2],
    "art-de-la-table-dore": ["06", 4.4],
    "tapis-rouge": ["03", 7.4],
    "chaises-chiavari-cristal": ["05", 18.4],
    "support-geometrique-dore": ["10", 16.4],
  },
  "equipe-service": {
    "serveuse-plateau-fumee": ["03", 22.4],
    "serveur-plateau-salle": ["02", 4.4],
    "serveuse-plateau-salades": ["02", 8.4],
    "service-cloches-jardin": ["09", 2.4, { crop: [0.1, 0.76] }],
    "serveuse-poulet-piscine": ["03", 18.4],
  },
  mariages: {
    "etincelles-fumee": ["02", 39],
    "piste-voilages-lumieres": ["02", 25],
    "soiree-jardin": ["03", 26.4],
  },
};

const videos = readdirSync(RAW).filter((f) => f.endsWith("_video.mp4"));
let n = 0;
for (const [cat, items] of Object.entries(PICKS)) {
  const out = path.join(ROOT, "assets", cat);
  mkdirSync(out, { recursive: true });
  for (const [name, [reel, t, opt = {}]] of Object.entries(items)) {
    const file = videos.find((f) => f.startsWith(`sud-events_${reel}_`));
    if (!file) { console.warn(`reel ${reel} introuvable`); continue; }
    const [top, bottom] = opt.crop ?? [0, 1];
    const [left, right] = opt.x ?? [0, 1];
    const vf = `crop=iw*${right - left}:ih*${bottom - top}:iw*${left}:ih*${top}`;
    execFileSync(FFMPEG, ["-loglevel", "error", "-y", "-ss", String(t), "-i", path.join(RAW, file), "-frames:v", "1", "-vf", vf, "-q:v", "1", path.join(out, `${name}.jpg`)]);
    n += 1;
  }
}
console.log(`${n} images extraites`);
