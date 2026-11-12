/**
 * Onglet « Code » : extrait le gabarit d'une story et y injecte les args courants, pour
 * obtenir un extrait copiable tel qu'on l'écrirait dans une application.
 */
import { literal } from "./controls.js";

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** Retire l'indentation commune (gabarits écrits en littéraux de gabarit indentés). */
export function dedent(text = "") {
  const lines = text.replace(/\t/g, "  ").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n");
}

function attr(name, value) {
  const key = kebab(name);
  if (typeof value === "boolean") return value ? key : `:${key}="false"`;
  if (typeof value === "number") return `:${key}="${value}"`;
  if (typeof value === "string") return `${key}="${value.replace(/"/g, "&quot;")}"`;
  return `:${key}='${JSON.stringify(value)}'`;
}

/** Attributs différents des valeurs par défaut documentées du composant. */
export function argsToAttrs(args = {}, docs) {
  const props = docs?.props ?? [];
  return Object.entries(args)
    .filter(([k, v]) => {
      if (k === "default" || v === undefined || v === null || typeof v === "function") return false;
      const prop = props.find((p) => p.name === k);
      return !(prop && literal(prop.default ?? "") === v) && !(prop && prop.default === undefined && v === "");
    })
    .map(([k, v]) => attr(k, v));
}

function joinAttrs(tag, attrs, indent) {
  const inline = attrs.join(" ");
  if (`<${tag} ${inline}`.length <= 72) return inline;
  return `\n${attrs.map((a) => `${indent}  ${a}`).join("\n")}\n${indent}`;
}

/** Extrait pour une story pilotée par les args et sans gabarit propre. */
export function componentSnippet(name, args = {}, docs) {
  const attrs = argsToAttrs(args, docs);
  const open = attrs.length ? `<${name} ${joinAttrs(name, attrs, "")}` : `<${name}`;
  const slot = typeof args.default === "string" ? args.default : "";
  return slot ? `${open}>${slot}</${name}>` : `${open} />`;
}

/**
 * Gabarit d'une story, args substitués : v-bind="args" → attributs, {{ args.x }} → valeur,
 * :prop="args.x" → valeur littérale, gestionnaires @evt="args.onX" retirés.
 */
export function storySource(story, args, docs) {
  let options;
  try {
    options = story.render ? story.render(args, { args, argTypes: story.argTypes, parameters: story.parameters }) : null;
  } catch {
    options = null;
  }
  const template = typeof options?.template === "string" ? dedent(options.template) : "";
  const name = story.componentName;
  if (!template) return name ? componentSnippet(name, args, docs) : "";
  if (!story.usesArgs) return template;

  const attrs = argsToAttrs(args, docs);
  return template
    .replace(/\s+@[\w:.-]+="args\.\w+"/g, "")
    .replace(/(<([\w-]+)[^>]*?)\s*v-bind="args"/g, (_, before, tag) =>
      attrs.length ? `${before} ${joinAttrs(tag, attrs, "")}` : before,
    )
    .replace(/\{\{\s*args\.(\w+)\s*\}\}/g, (_, k) => String(args[k] ?? ""))
    .replace(/:([\w-]+)="args\.(\w+)"/g, (_, p, k) => (args[k] === undefined ? "" : attr(p, args[k])))
    .replace(/ +>/g, ">");
}
