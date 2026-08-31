// Optimize Higgsfield originals into web derivatives (webp desktop + 9:16 mobile crop).
// Run from aigenvora/: node scripts/optimize-media.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "../docs/evidence/v3/higgsfield";
const OUT = "public/media";
await mkdir(OUT, { recursive: true });

const jobs = [
  { src: `${SRC}/hf01-final.png`, base: "hf01-chamber" },
  { src: `${SRC}/hf02-final.png`, base: "hf02-resolution" },
];

for (const { src, base } of jobs) {
  await sharp(src).resize({ width: 2560 }).webp({ quality: 76 }).toFile(`${OUT}/${base}.webp`);
  await sharp(src)
    .resize({ width: 1080, height: 1920, fit: "cover", position: "centre" })
    .webp({ quality: 76 })
    .toFile(`${OUT}/${base}-mobile.webp`);
  console.log(base, "done");
}
