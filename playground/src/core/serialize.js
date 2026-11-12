/**
 * Mise à plat des arguments d'une action (événements DOM, nœuds, objets circulaires) pour
 * l'envoyer du canevas vers le panneau « Actions ».
 */

function describeNode(node) {
  if (!node?.tagName) return node?.nodeName ?? "Node";
  const id = node.id ? `#${node.id}` : "";
  const cls = typeof node.className === "string" && node.className.trim()
    ? `.${node.className.trim().split(/\s+/).slice(0, 2).join(".")}`
    : "";
  return `<${node.tagName.toLowerCase()}${id}${cls}>`;
}

export function serialize(value, depth = 0, seen = new WeakSet()) {
  if (value === null || value === undefined) return value ?? null;
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return value;
  if (t === "bigint") return `${value}n`;
  if (t === "function") return `ƒ ${value.name || "anonyme"}()`;
  if (t === "symbol") return value.toString();
  if (typeof Event !== "undefined" && value instanceof Event) {
    const out = { "⚡": value.constructor.name, type: value.type, target: describeNode(value.target) };
    if ("key" in value) out.key = value.key;
    if ("clientX" in value) Object.assign(out, { clientX: value.clientX, clientY: value.clientY });
    return out;
  }
  if (typeof Node !== "undefined" && value instanceof Node) return describeNode(value);
  if (seen.has(value)) return "[circulaire]";
  if (depth > 4) return Array.isArray(value) ? `[Array(${value.length})]` : "{…}";
  seen.add(value);
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => serialize(v, depth + 1, seen));
  if (value instanceof Date) return value.toISOString();
  const out = {};
  for (const [k, v] of Object.entries(value).slice(0, 50)) out[k] = serialize(v, depth + 1, seen);
  return out;
}
