/**
 * Coloration syntaxique minimale (gabarits Vue/HTML et JavaScript), sans dépendance.
 * Produit du HTML échappé : chaque jeton est un <span class="tk-…">.
 */

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const span = (cls, s) => `<span class="tk-${cls}">${esc(s)}</span>`;

const JS_KEYWORDS =
  "import|from|export|default|const|let|var|function|return|if|else|for|of|in|new|async|await|true|false|null|undefined|this|class|extends|typeof";

const JS = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // 1 commentaire
    String.raw`("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\`(?:\\.|[^\`\\])*\`)`, // 2 chaîne
    String.raw`\b(${JS_KEYWORDS})\b`, // 3 mot-clé
    String.raw`\b(\d+(?:\.\d+)?)\b`, // 4 nombre
    String.raw`\b([A-Z][\w$]*)\b`, // 5 identifiant capitalisé
  ].join("|"),
  "g",
);

const HTML = new RegExp(
  [
    String.raw`(<!--[\s\S]*?-->)`, // 1 commentaire
    String.raw`(\{\{[\s\S]*?\}\})`, // 2 interpolation
    String.raw`(<\/?)([\w-]+)`, // 3-4 balise
    String.raw`(\s)([:@#]?[\w.:-]+)(=)("[^"]*"|'[^']*')`, // 5-8 attribut + valeur
    String.raw`(\s)([:@#]?[\w.:-]+)(?=[\s/>])`, // 9-10 attribut booléen
    String.raw`(\/?>)`, // 11 fin de balise
  ].join("|"),
  "g",
);

function run(re, text, onMatch) {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(re)) {
    out += esc(text.slice(last, m.index)) + onMatch(m);
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

export function highlightJs(code) {
  return run(JS, code, (m) => {
    if (m[1]) return span("comment", m[1]);
    if (m[2]) return span("string", m[2]);
    if (m[3]) return span("keyword", m[3]);
    if (m[4]) return span("number", m[4]);
    return span("type", m[5]);
  });
}

export function highlightHtml(code) {
  return run(HTML, code, (m) => {
    if (m[1]) return span("comment", m[1]);
    if (m[2]) return span("interp", m[2]);
    if (m[4]) return span("punct", m[3]) + span(/^[A-Z]/.test(m[4]) ? "component" : "tag", m[4]);
    if (m[6]) return esc(m[5]) + span(/^[:@#]/.test(m[6]) ? "directive" : "attr", m[6]) + span("punct", m[7]) + span("string", m[8]);
    if (m[10]) return esc(m[9]) + span(/^[:@#]/.test(m[10]) ? "directive" : "attr", m[10]);
    return span("punct", m[11]);
  });
}

export function highlight(code, lang = "html") {
  if (lang === "js" || lang === "javascript") return highlightJs(code);
  if (lang === "bash" || lang === "text") return esc(code);
  return highlightHtml(code);
}
