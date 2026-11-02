// Prépare les images classées dans assets/<catégorie>/ pour le web :
// public/media/<catégorie>/<nom>.jpg (côté long 1600 px max ; les images tirées des reels font 1080 × 1920).
// next/image sert ensuite des variantes AVIF/WebP à la bonne taille.
// Recrée aussi les boucles vidéo du hero (trône doré et bougies, reel 10) et l'image Open Graph.
//   npm run media
import { execFileSync } from "node:child_process";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATS = ["hero", "traiteur-buffets", "traiteur-sucre", "decoration", "salles", "location", "equipe-service", "mariages"];

let n = 0;
const sizes = {};
for (const cat of CATS) {
  const src = path.join(ROOT, "assets", cat);
  const out = path.join(ROOT, "public/media", cat);
  await mkdir(out, { recursive: true });
  const files = (await readdir(src).catch(() => [])).filter((f) => /\.jpe?g$/i.test(f));
  for (const f of files) {
    const info = await sharp(path.join(src, f))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(path.join(out, f));
    sizes[`/media/${cat}/${f}`] = [info.width, info.height];
    n += 1;
  }
}

// Boucles du hero : 6 s du reel 10, sans son. Horizontale (recadrage 16:9 sur le trône) et verticale pour mobile.
const reel = (await readdir(path.join(ROOT, "assets/raw"))).find((f) => f.startsWith("sud-events_10_") && f.endsWith(".mp4"));
const HERO = { from: 35.9, duration: 4.4 };
const encode = (vf, file) =>
  execFileSync(ffmpeg, [
    "-loglevel", "error", "-y", "-ss", String(HERO.from), "-t", String(HERO.duration), "-i", path.join(ROOT, "assets/raw", reel),
    "-an", "-vf", `${vf},fps=30`, "-c:v", "libx264", "-profile:v", "high", "-crf", "27", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(ROOT, "public/media", file),
  ]);
const POSTER = (vf, file) =>
  execFileSync(ffmpeg, ["-loglevel", "error", "-y", "-ss", String(HERO.from), "-i", path.join(ROOT, "assets/raw", reel), "-frames:v", "1", "-vf", vf, "-q:v", "2", path.join(ROOT, "assets/hero", file)]);
const WIDE = "crop=1080:608:0:620";
const TALL = "scale=720:1280";
if (reel) {
  encode(WIDE, "hero-wide.mp4");
  encode(TALL, "hero-tall.mp4");
  POSTER(WIDE, "poster-wide.jpg");
  POSTER(TALL, "poster-tall.jpg");
  for (const f of ["poster-wide.jpg", "poster-tall.jpg"]) {
    const info = await sharp(path.join(ROOT, "assets/hero", f)).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(ROOT, "public/media/hero", f));
    sizes[`/media/hero/${f}`] = [info.width, info.height];
  }
}

// Dimensions réelles, utilisées par next/image (évite tout décalage de mise en page)
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Image Open Graph 1200 × 630 : la table dressée de la photo de profil
await sharp(path.join(ROOT, "assets/decoration/table-roses-arches-lumineuses.jpg"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${n} images prêtes`);
