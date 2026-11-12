/**
 * Registre des stories et de la documentation des composants, collecté au build par Vite.
 * Ajouter une story = créer un fichier stories/**\/*.stories.js : rien d'autre à déclarer.
 */
import { buildTree, flattenTree, normalizeFile } from "./core/csf.js";
import { parseSfc } from "./core/sfc-docs.js";

const modules = import.meta.glob("../../stories/**/*.stories.js", { eager: true });
const sources = import.meta.glob("../../stories/**/*.stories.js", { eager: true, query: "?raw", import: "default" });
const sfcSources = import.meta.glob("../../src/components/*.vue", { eager: true, query: "?raw", import: "default" });

/** Ordre de la barre latérale (même syntaxe que le storySort de Storybook). */
export const NAV_ORDER = [
  "Design Tokens",
  "Altonéo Next",
  "Composants",
  ["Boutons & Actions", "Formulaire", "Données", "Retour utilisateur", "Navigation", "Pages", "Marque", "Utilitaires"],
  "Variante HTML-CSS",
];

export const files = Object.entries(modules).map(([path, mod]) =>
  normalizeFile(path.replace(/^(\.\.\/)+/, ""), mod, sources[path]),
);
export const tree = buildTree(files, NAV_ORDER);
export const stories = flattenTree(tree);
export const storyById = new Map(stories.map((s) => [s.id, s]));
export const fileById = new Map(files.map((f) => [f.id, f]));

/** Documentation d'API par nom de composant (AltButton → { props, emits, slots }). */
export const componentDocs = new Map(
  Object.entries(sfcSources).map(([path, raw]) => [path.replace(/^.*\/|\.vue$/g, ""), parseSfc(raw)]),
);
export const componentSources = new Map(
  Object.entries(sfcSources).map(([path, raw]) => [path.replace(/^.*\/|\.vue$/g, ""), raw]),
);

export function docsFor(storyOrFile) {
  return componentDocs.get(storyOrFile?.componentName) ?? null;
}
