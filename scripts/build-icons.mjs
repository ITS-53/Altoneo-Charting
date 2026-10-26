// Exporte chaque icône du registre en fichier .svg autonome (src/icons/svg/<nom>.svg)
// et vérifie au passage que chaque icône est rangée dans une catégorie de la vitrine.
// Usage : npm run icons
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ICON_CATEGORIES, ICON_NAMES, iconSvg } from "../src/icons/registry.js";

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/icons/svg");
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (f.endsWith(".svg")) rmSync(join(out, f));
for (const name of ICON_NAMES) writeFileSync(join(out, `${name}.svg`), `${iconSvg(name)}\n`);

const categorized = new Set(Object.values(ICON_CATEGORIES).flat());
const orphans = ICON_NAMES.filter((n) => !categorized.has(n));
const unknown = [...categorized].filter((n) => !ICON_NAMES.includes(n));
if (orphans.length || unknown.length) {
  console.error(`Catégories incohérentes — sans catégorie : ${orphans.join(", ") || "∅"} · inconnues : ${unknown.join(", ") || "∅"}`);
  process.exit(1);
}
console.log(`${ICON_NAMES.length} icônes exportées dans src/icons/svg`);
