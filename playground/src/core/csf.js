/**
 * Lecture des fichiers de stories au format CSF (Component Story Format) — sans Storybook.
 *
 * Un fichier *.stories.js exporte par défaut ses métadonnées ({ title, component, args,
 * argTypes, parameters, decorators }) et une story par export nommé : objet CSF 3
 * ({ name, args, render, parameters }) ou fonction CSF 2 (Template.bind({})).
 * Fonctions pures : testées dans tests/unit/playground-csf.test.js.
 */

/** Identifiant d'URL : minuscules, sans accents ni ponctuation (compatible Storybook). */
export function sanitize(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** « AvecIcones » → « Avec Icones » (équivalent du startCase de Storybook). */
export function storyNameFromExport(key) {
  return String(key)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9À-ÿ])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function storyId(title, exportKey) {
  return `${sanitize(title)}--${sanitize(storyNameFromExport(exportKey))}`;
}

/**
 * Ordre des exports tel qu'écrit dans le fichier (un espace de noms ES trie ses clés par
 * ordre alphabétique : on relit donc la source brute).
 */
export function exportOrder(raw = "") {
  const keys = [];
  const decl = /^export\s+(?:const|let|var|function\*?|async\s+function)\s+([A-Za-z_$][\w$]*)/gm;
  for (const m of raw.matchAll(decl)) keys.push(m[1]);
  for (const m of raw.matchAll(/^export\s*\{([^}]*)\}/gm)) {
    for (const part of m[1].split(",")) {
      const name = part.split(/\s+as\s+/).pop().trim();
      if (name && name !== "default") keys.push(name);
    }
  }
  return [...new Set(keys)];
}

/** Une story CSF 2 (fonction) ou CSF 3 (objet) ramenée à une forme unique. */
function storyFields(exp) {
  if (typeof exp === "function") {
    return {
      render: exp,
      name: exp.storyName,
      args: exp.args,
      argTypes: exp.argTypes,
      parameters: exp.parameters,
      decorators: exp.decorators,
      tags: exp.tags,
    };
  }
  return { ...exp, name: exp.name ?? exp.storyName };
}

/** La story lit-elle ses args ? (fonction de rendu à paramètre, ou rendu par défaut). */
export function usesArgs(story) {
  return !story.render || story.render.length > 0;
}

function isStoryExport(key, value, meta) {
  if (key === "default" || key === "__namedExportsOrder") return false;
  if (value === null || (typeof value !== "object" && typeof value !== "function")) return false;
  const { includeStories, excludeStories } = meta;
  const match = (rule) => (Array.isArray(rule) ? rule.includes(key) : rule instanceof RegExp && rule.test(key));
  if (includeStories && !match(includeStories)) return false;
  if (excludeStories && match(excludeStories)) return false;
  return true;
}

/**
 * Normalise un module de stories.
 * @param {string} path  chemin du fichier (affichage, lien vers la source)
 * @param {object} mod   module importé
 * @param {string} raw   source brute (ordre des exports, onglet « Fichier »)
 */
export function normalizeFile(path, mod, raw = "") {
  const meta = mod.default ?? {};
  const title = meta.title ?? path.replace(/^.*\//, "").replace(/\.stories\.\w+$/, "");
  const fileId = sanitize(title);
  const order = exportOrder(raw);
  const keys = Object.keys(mod)
    .filter((k) => isStoryExport(k, mod[k], meta))
    .sort((a, b) => rank(order, a) - rank(order, b) || a.localeCompare(b));

  const stories = keys.map((key) => {
    const s = storyFields(mod[key]);
    const parameters = { ...meta.parameters, ...s.parameters };
    return {
      id: storyId(title, key),
      key,
      fileId,
      title,
      name: s.name ?? storyNameFromExport(key),
      args: { ...meta.args, ...s.args },
      argTypes: mergeArgTypes(meta.argTypes, s.argTypes),
      parameters,
      layout: parameters.layout ?? "padded",
      render: s.render ?? meta.render,
      decorators: [...(s.decorators ?? []), ...(meta.decorators ?? [])],
      component: meta.component,
      componentName: componentName(meta.component),
      usesArgs: usesArgs({ render: s.render ?? meta.render }),
    };
  });

  return {
    id: fileId,
    title,
    path,
    segments: title.split("/").map((s) => s.trim()),
    component: meta.component,
    componentName: componentName(meta.component),
    tags: meta.tags ?? [],
    description: meta.parameters?.docs?.description?.component ?? "",
    raw,
    stories,
  };
}

function rank(order, key) {
  const i = order.indexOf(key);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

function mergeArgTypes(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = { ...a[k], ...v };
  return out;
}

export function componentName(component) {
  if (!component) return "";
  return component.__name || component.name || (component.__file ?? "").replace(/^.*[\\/]|\.vue$/g, "");
}

/**
 * Arborescence de navigation à partir des titres « Groupe/Sous-groupe/Composant ».
 * `order` reprend la syntaxe storySort de Storybook : ["A", "B", ["B1", "B2"], "C"].
 */
export function buildTree(files, order = []) {
  const root = { type: "group", name: "", key: "", children: [] };
  for (const file of files) {
    let node = root;
    file.segments.slice(0, -1).forEach((seg, i) => {
      const key = file.segments.slice(0, i + 1).join("/");
      let child = node.children.find((c) => c.type === "group" && c.name === seg);
      if (!child) {
        child = { type: "group", name: seg, key, children: [] };
        node.children.push(child);
      }
      node = child;
    });
    node.children.push({ type: "file", name: file.segments.at(-1), key: file.title, file });
  }
  sortNode(root, order);
  return root.children;
}

function sortNode(node, order) {
  const names = order.filter((o) => typeof o === "string");
  const pos = (n) => {
    const i = names.indexOf(n.name);
    return i === -1 ? names.length : i;
  };
  node.children.sort((a, b) => pos(a) - pos(b) || a.name.localeCompare(b.name, "fr"));
  for (const child of node.children) {
    if (child.type !== "group") continue;
    const i = order.indexOf(child.name);
    const sub = i !== -1 && Array.isArray(order[i + 1]) ? order[i + 1] : [];
    sortNode(child, sub);
  }
}

/** Toutes les stories dans l'ordre de la navigation. */
export function flattenTree(nodes, out = []) {
  for (const n of nodes) {
    if (n.type === "file") out.push(...n.file.stories);
    else flattenTree(n.children, out);
  }
  return out;
}
