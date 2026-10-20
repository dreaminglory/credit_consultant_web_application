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

// Photos of the consultant with clients, in the order of the testimonials (O-1, FR-24).
const clients = [
  "208723.JPG",
  "IMG_0137.JPG",
  "viber_image_2026-10-20_19-38-52-974.jpg",
  "viber_image_2026-10-20_19-38-53-069.jpg",
  "viber_image_2026-10-20_19-38-53-079.jpg",
  "viber_image_2026-10-20_19-38-53-095.jpg",
  "viber_image_2026-10-20_19-38-52-990.jpg",
  "viber_image_2026-10-20_19-38-52-963.jpg",
];

// Bank logos (BL-3). `recolor` replaces white fills for files supplied only in a white variant.
const INK = "#0E1615";
const banks = [
  { file: "bank-allianz.svg", id: "allianz" },
  { file: "bank-investbank.svg", id: "investbank" },
  { file: "bank-dcommerce.svg", id: "dcommerce" },
  { file: "dsk-commons.svg", id: "dsk" },
  { file: "bank-ubb.svg", id: "ubb" },
  { file: "bank-fibank.svg", id: "fibank" },
  { file: "bank-procredit.svg", id: "procredit" },
  { file: "bank-unicredit-bulbank.svg", id: "unicredit" },
  { file: "bank-ccb-white.svg", id: "ccb", recolor: true },
  { file: "bank-postbank.svg", id: "postbank" },
];

/** Writes every nominal width as AVIF and WebP; never upscales the source. */
async function emitResponsive(input, name) {
  const meta = await sharp(input).metadata();
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
  return meta;
}

async function clientsTask() {
  await mkdir(out("img"), { recursive: true });
  for (const [index, file] of clients.entries()) {
    const name = `client-${index + 1}`;
    const meta = await emitResponsive(src("clinets", file), name);
    console.log(`client ${name}: ${meta.width}×${meta.height}`);
  }
}

async function portraitsTask() {
  await mkdir(out("img"), { recursive: true });
  for (const { file, name } of portraits) {
    const meta = await emitResponsive(src("of_myself", file), name);
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
if (!only || only === "clients") await clientsTask();
if (!only || only === "banks") await banksTask();
if (!only || only === "og") await ogTask();
