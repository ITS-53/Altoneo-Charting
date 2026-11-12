/**
 * Contrôles du panneau « Contrôles » : déduits des argTypes de la story, des valeurs d'args
 * et, à défaut, de la documentation des props du composant (type, valeurs « a | b | c »).
 */

const LONG_TEXT = 60;

function controlSpec(control) {
  if (!control) return {};
  return typeof control === "string" ? { type: control } : control;
}

function typeFromValue(value, prop) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "string") return value.length > LONG_TEXT || value.includes("\n") ? "textarea" : "text";
  if (value && typeof value === "object") return "object";
  const t = prop?.type ?? "";
  if (/^Boolean$/.test(t)) return "boolean";
  if (/^Number$/.test(t)) return "number";
  if (/Array|Object/.test(t) && !/String/.test(t)) return "object";
  return "text";
}

/** Valeur par défaut lisible (« "md" », « true », « 18 ») convertie en valeur JS si possible. */
export function literal(text) {
  if (text === undefined) return undefined;
  const t = text.trim();
  if (t === "true" || t === "false") return t === "true";
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  const str = t.match(/^(["'`])([\s\S]*)\1$/);
  if (str) return str[2];
  return undefined;
}

/**
 * @param {object} story   story normalisée (args, argTypes, usesArgs)
 * @param {object} [docs]  résultat de parseSfc() pour le composant de la story
 * @returns {Array<{name, type, options?, min?, max?, step?, description, propType, defaultText, required}>}
 */
export function inferControls(story, docs) {
  if (!story.usesArgs) return [];
  const { args = {}, argTypes = {} } = story;
  const props = docs?.props ?? [];
  const names = [...new Set([...Object.keys(args), ...Object.keys(argTypes), ...props.map((p) => p.name)])];

  return names
    .filter((name) => {
      const at = argTypes[name] ?? {};
      return !at.action && typeof args[name] !== "function" && at.control !== false && !at.table?.disable;
    })
    .map((name) => {
      const at = argTypes[name] ?? {};
      const prop = props.find((p) => p.name === name);
      const spec = controlSpec(at.control);
      const options = at.options ?? spec.options ?? prop?.options ?? null;
      let type = spec.type;
      if (!type && options) type = options.length <= 4 ? "inline-radio" : "select";
      if (!type) type = typeFromValue(args[name], prop);
      return {
        name,
        type: type === "radio" ? "inline-radio" : type,
        options,
        min: spec.min,
        max: spec.max,
        step: spec.step,
        description: at.description ?? prop?.description ?? (name === "default" ? "Contenu du slot par défaut" : ""),
        propType: prop?.type ?? "",
        defaultText: prop?.default,
        required: Boolean(prop?.required),
        fromArgs: name in args || name in argTypes,
      };
    })
    .sort((a, b) => Number(b.fromArgs) - Number(a.fromArgs));
}

/** Noms des handlers d'actions : argTypes { action } + événements émis par le composant. */
export function actionNames(story, docs) {
  if (!story.usesArgs) return [];
  const out = new Map();
  for (const [name, at] of Object.entries(story.argTypes ?? {})) {
    if (at?.action) out.set(name, typeof at.action === "string" ? at.action : name);
  }
  for (const evt of docs?.emits ?? []) {
    const handler = `on${evt.charAt(0).toUpperCase()}${evt.slice(1)}`;
    if (!out.has(handler)) out.set(handler, evt);
  }
  return [...out].map(([handler, label]) => ({ handler, label }));
}

/** Args transmissibles par postMessage (sans fonctions). */
export function plainArgs(args) {
  const out = {};
  for (const [k, v] of Object.entries(args ?? {})) {
    if (typeof v === "function" || v === undefined) continue;
    try {
      out[k] = structuredClone(v);
    } catch {
      /* valeur non clonable (composant, nœud DOM…) : ignorée */
    }
  }
  return out;
}
