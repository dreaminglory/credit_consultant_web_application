// Lists every open content item still used in src/ (A-6). Exit code 1 when any remain, so the
// launch checklist can gate on it. Usage: npm run check:content
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "src");
const pattern = /pending\(\s*"([OD]-\d+)",\s*"([^"]+)"/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) yield full;
  }
}

const found = new Map();
for await (const file of walk(srcDir)) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(pattern)) {
    const [, id, hint] = match;
    const line = text.slice(0, match.index).split("\n").length;
    const list = found.get(id) ?? [];
    list.push(`${hint}  (${path.relative(root, file)}:${line})`);
    found.set(id, list);
  }
}

if (found.size === 0) {
  console.log("No open content items. Ready for launch content-wise.");
  process.exit(0);
}

const ids = [...found.keys()].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
let total = 0;
for (const id of ids) {
  console.log(`\n${id}`);
  for (const item of found.get(id)) {
    console.log(`  - ${item}`);
    total++;
  }
}
console.log(`\n${total} placeholder(s) across ${ids.length} open item(s).`);
process.exit(1);
