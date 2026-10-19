// Converts owner-supplied media in raw_contents/ into web-ready files under public/ (A-8, A-9).
// Run with `npm run images` after adding or replacing source files; output is committed.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, "raw_contents", "images", ...p);
const out = (...p) => path.join(root, "public", ...p);

// Portraits of the consultant (O-6). Names describe the shot; the hero choice is the owner's.
const portraits = [
  { file: "131893.jpeg", name: "desislava-teal-suit" },
  { file: "572764.jpeg", name: "desislava-teal-suit-notebook" },
  { file: "352348.jpeg", name: "desislava-phone-call" },
];
const widths = [400, 640, 800];

// Bank logos (BL-3). `recolor` replaces white fills for files supplied only in a white variant.
const INK = "#0E1615";
const banks = [
  { file: "bank-allianz.svg", id: "allianz" },
  { file: "bank-investbank.svg", id: "investbank" },
  { file: "bank-bbr.svg", id: "bbr" },
  { file: "dsk-commons.svg", id: "dsk" },
  { file: "bank-ubb.svg", id: "ubb" },
  { file: "bank-fibank.svg", id: "fibank" },
  { file: "bank-procredit.svg", id: "procredit" },
  { file: "bank-unicredit-bulbank.svg", id: "unicredit" },
  { file: "bank-ccb-white.svg", id: "ccb", recolor: true },
  { file: "bank-postbank.svg", id: "postbank" },
];

async function portraitsTask() {
  await mkdir(out("img"), { recursive: true });
  for (const { file, name } of portraits) {
    const input = src("of_myself", file);
    const meta = await sharp(input).metadata();
    // Sources are ~800 px wide; never upscale, but always emit every nominal width.
    for (const w of widths) {
      const base = sharp(input)
        .rotate()
        .resize({ width: Math.min(w, meta.width ?? w) });
      await base
        .clone()
        .avif({ quality: 55 })
        .toFile(out("img", `${name}-${w}.avif`));
      await base
        .clone()
        .webp({ quality: 72 })
        .toFile(out("img", `${name}-${w}.webp`));
    }
    console.log(`portrait ${name}: ${meta.width}×${meta.height}`);
  }
}

function cleanSvg(svg, recolor) {
  let s = svg
    .replace(/^﻿/, "")
    .replace(/<\?xml[^>]*\?>\s*/g, "")
    .replace(/<metadata>[\s\S]*?<\/metadata>\s*/g, "")
    .replace(/<!--[\s\S]*?-->\s*/g, "");
  if (recolor) {
    s = s
      .replace(/fill:\s*#fff(fff)?\b/gi, `fill: ${INK}`)
      .replace(/fill="(#fff(fff)?|white)"/gi, `fill="${INK}"`);
  }
  return s.trim() + "\n";
}

async function banksTask() {
  await mkdir(out("banks"), { recursive: true });
  for (const { file, id, recolor } of banks) {
    const svg = await readFile(src("of_features", file), "utf8");
    await writeFile(out("banks", `${id}.svg`), cleanSvg(svg, recolor));
    console.log(`bank ${id}${recolor ? " (recoloured)" : ""}`);
  }
}

// Default social share image (TR-8): 1200×630 JPEG, petrol panel with the name beside the hero
// portrait. Text is drawn by librsvg with a system font, so check the output after regenerating.
async function ogTask() {
  await mkdir(out("og"), { recursive: true });
  const [W, H] = [1200, 630];
  const portrait = await sharp(src("of_myself", portraits[0].file))
    .rotate()
    .resize({ width: 520, height: H, fit: "cover", position: "top" })
    .toBuffer();
  const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${W - 520}" height="${H}">
    <rect width="100%" height="100%" fill="#0F3B3E"/>
    <rect x="72" y="200" width="64" height="6" fill="#C59A3D"/>
    <text x="72" y="300" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="60" fill="#FFFFFF" letter-spacing="-1.5">Десислава</text>
    <text x="72" y="368" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="60" fill="#FFFFFF" letter-spacing="-1.5">Арабаджиева</text>
    <text x="72" y="430" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#CFDAD7">Кредитен консултант · ExtraConsult</text>
  </svg>`;
  await sharp({ create: { width: W, height: H, channels: 3, background: "#0F3B3E" } })
    .composite([
      { input: Buffer.from(text), left: 0, top: 0 },
      { input: portrait, left: W - 520, top: 0 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out("og", "default.jpg"));
  console.log("og default.jpg");
}

const only = process.argv[2];
if (!only || only === "portraits") await portraitsTask();
if (!only || only === "banks") await banksTask();
if (!only || only === "og") await ogTask();
