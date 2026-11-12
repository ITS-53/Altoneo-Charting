/**
 * Contrôles d'accessibilité de base, exécutés dans le canevas (remplace l'addon a11y) :
 * textes alternatifs, noms accessibles, étiquettes de champs, identifiants dupliqués et
 * contraste du texte (WCAG 2.2 AA). Ce n'est pas un audit complet : un filet de sécurité.
 */

function parseColor(str) {
  const m = str?.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\)/);
  if (!m) return null;
  let a = m[4] === undefined ? 1 : parseFloat(m[4]);
  if (m[4]?.endsWith("%")) a /= 100;
  return { r: +m[1], g: +m[2], b: +m[3], a };
}

function luminance({ r, g, b }) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

function blend(top, bottom) {
  const a = top.a;
  return { r: top.r * a + bottom.r * (1 - a), g: top.g * a + bottom.g * (1 - a), b: top.b * a + bottom.b * (1 - a), a: 1 };
}

/** Fond effectif sous un élément ; null s'il dépend d'une image ou d'un dégradé. */
function backgroundOf(el) {
  const layers = [];
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
    const c = parseColor(cs.backgroundColor);
    if (c && c.a > 0) {
      layers.push(c);
      if (c.a >= 1) break;
    }
  }
  return layers.reduceRight((acc, c) => blend(c, acc), { r: 255, g: 255, b: 255, a: 1 });
}

function selectorOf(el) {
  const parts = [];
  for (let n = el; n && n.nodeType === 1 && parts.length < 4; n = n.parentElement) {
    let p = n.tagName.toLowerCase();
    if (n.id) {
      parts.unshift(`${p}#${n.id}`);
      break;
    }
    const cls = [...n.classList].filter((c) => !c.startsWith("pg-")).slice(0, 2);
    if (cls.length) p += `.${cls.join(".")}`;
    parts.unshift(p);
  }
  return parts.join(" > ");
}

function visible(el) {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
}

function accessibleName(el) {
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const t = labelledby.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? "").join(" ");
    if (t.trim()) return t.trim();
  }
  return (
    el.getAttribute("aria-label")?.trim() ||
    el.textContent?.trim() ||
    el.getAttribute("title")?.trim() ||
    [...el.querySelectorAll("img[alt], svg title")].map((n) => n.getAttribute("alt") ?? n.textContent).join(" ").trim()
  );
}

function hasLabel(field) {
  if (field.getAttribute("aria-label") || field.getAttribute("aria-labelledby") || field.title) return true;
  if (field.closest("label")) return true;
  return Boolean(field.id && document.querySelector(`label[for="${CSS.escape(field.id)}"]`));
}

function directText(el) {
  return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
}

function checkContrast(root, push) {
  let n = 0;
  for (const el of root.querySelectorAll("*")) {
    if (n > 600) break;
    if (!directText(el) || !visible(el)) continue;
    n++;
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color);
    if (!fg || fg.a === 0 || cs.webkitTextFillColor === "transparent") continue;
    const bg = backgroundOf(el);
    if (!bg) continue;
    const ratio = contrastRatio(fg.a < 1 ? blend(fg, bg) : fg, bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    const min = large ? 3 : 4.5;
    if (ratio < min) {
      push(el, "contraste", "serious", `Contraste ${ratio.toFixed(2)}:1 (minimum ${min}:1) — « ${el.textContent.trim().slice(0, 40)} »`);
    }
  }
}

export function runAudit(root = document.body) {
  const issues = [];
  const elements = [];
  const push = (el, rule, impact, message) => {
    elements.push(el);
    issues.push({ index: elements.length - 1, rule, impact, message, selector: selectorOf(el) });
  };

  for (const img of root.querySelectorAll("img:not([alt])")) push(img, "texte-alternatif", "critical", "Image sans attribut alt (alt=\"\" si décorative)");
  for (const el of root.querySelectorAll('button, a[href], [role="button"], [role="link"], [role="tab"], [role="switch"]')) {
    if (visible(el) && !accessibleName(el)) push(el, "nom-accessible", "critical", `${el.tagName.toLowerCase()} sans nom accessible (texte, aria-label ou title)`);
  }
  for (const f of root.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
    if (visible(f) && !hasLabel(f)) push(f, "etiquette", "serious", `Champ sans étiquette${f.placeholder ? " (le placeholder ne suffit pas)" : ""}`);
  }
  const ids = new Map();
  for (const el of root.querySelectorAll("[id]")) ids.set(el.id, [...(ids.get(el.id) ?? []), el]);
  for (const [id, list] of ids) if (list.length > 1) push(list[1], "id-duplique", "moderate", `Identifiant « ${id} » utilisé ${list.length} fois`);
  checkContrast(root, push);

  return { issues, elements };
}
