/**
 * Documentation d'API tirée de la source d'un composant .vue (remplace l'autodocs Storybook) :
 * props (type, défaut, requis, commentaire JSDoc), événements émis et slots.
 * Analyse textuelle volontairement simple, adaptée aux conventions de src/components.
 */

/** Extrait le texte entre la parenthèse ouvrante qui suit `marker` et sa fermante. */
function balancedAfter(src, marker) {
  const at = src.indexOf(marker);
  if (at === -1) return "";
  let i = at + marker.length;
  const open = src[i - 1];
  const close = { "(": ")", "{": "}", "[": "]" }[open];
  let depth = 1;
  let quote = null;
  const start = i;
  for (; i < src.length && depth > 0; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === open) depth++;
    else if (c === close) depth--;
  }
  return src.slice(start, i - 1);
}

/** Découpe « a: 1, /** doc *\/ b: { … } » en entrées de premier niveau, commentaires compris. */
function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let cur = "";
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    const two = body.slice(i, i + 2);
    if (!quote && two === "/*") {
      const end = body.indexOf("*/", i + 2);
      cur += body.slice(i, end + 2);
      i = end + 1;
      continue;
    }
    if (!quote && two === "//") {
      const end = body.indexOf("\n", i);
      const stop = end === -1 ? body.length : end;
      cur += body.slice(i, stop);
      i = stop - 1;
      continue;
    }
    if (quote) {
      if (c === "\\") {
        cur += c + body[++i];
        continue;
      }
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if ("({[".includes(c)) depth++;
    else if (")}]".includes(c)) depth--;
    else if (c === "," && depth === 0) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}

function docText(chunk) {
  const lines = [];
  for (const m of chunk.matchAll(/\/\*\*?([\s\S]*?)\*\//g)) lines.push(m[1]);
  for (const m of chunk.matchAll(/\/\/(.*)$/gm)) lines.push(m[1]);
  return lines
    .join("\n")
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trim())
    .filter(Boolean)
    .join(" ");
}

function stripComments(chunk) {
  return chunk.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trim();
}

/** Valeurs proposées par un commentaire du type « sm | md | lg » ou « bottom (or) | left | none ». */
export function optionsFromDoc(doc) {
  const word = String.raw`['"]?[\w-]+['"]?(?:\s*\([^)]*\))?`;
  const runs = doc.match(new RegExp(`${word}(?:\\s*\\|\\s*${word})+`, "g"));
  if (!runs) return null;
  const values = runs.flatMap((run) => run.split("|").map((p) => p.trim().match(/^['"]?([\w-]+)/)[1]));
  return [...new Set(values)];
}

function field(obj, name) {
  const entry = splitTopLevel(obj).find((p) => stripComments(p).startsWith(`${name}:`));
  return entry ? stripComments(entry).slice(name.length + 1).trim() : undefined;
}

function parseProp(chunk) {
  const code = stripComments(chunk);
  const m = code.match(/^['"]?([\w$-]+)['"]?\s*:\s*([\s\S]*)$/);
  if (!m) return null;
  const [, name, value] = m;
  const description = docText(chunk);
  let type = value;
  let def;
  let required = false;
  if (value.startsWith("{")) {
    const obj = value.slice(1, -1);
    type = field(obj, "type") ?? "any";
    def = field(obj, "default");
    required = field(obj, "required") === "true";
  }
  type = type.replace(/^\[|\]$/g, "").split(/\s*,\s*/).filter(Boolean).join(" | ");
  return { name, type, default: def, required, description, options: optionsFromDoc(description) };
}

/** Commentaire de tête du <script setup> (description du composant). */
function componentDoc(script) {
  const body = script.replace(/^\s*import[^;]+;?/gm, "").trimStart();
  const m = body.match(/^\/\*\*([\s\S]*?)\*\//);
  return m ? docText(m[0]) : "";
}

export function parseSfc(raw = "") {
  const script = raw.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "";
  const template = raw.match(/<template>([\s\S]*)<\/template>/)?.[1] ?? "";

  const propsBody = balancedAfter(script, "defineProps(");
  const propsObj = propsBody.trim().startsWith("{") ? propsBody.trim().slice(1, -1) : "";
  const props = splitTopLevel(propsObj).map(parseProp).filter(Boolean);

  const emitsBody = balancedAfter(script, "defineEmits(");
  const emits = [...emitsBody.matchAll(/["']([\w:-]+)["']/g)].map((m) => m[1]);

  const slots = new Set();
  for (const m of template.matchAll(/<slot\b([^>]*)>/g)) {
    slots.add(m[1].match(/\bname="([^"]+)"/)?.[1] ?? "default");
  }

  return { description: componentDoc(script), props, emits: [...new Set(emits)], slots: [...slots] };
}
