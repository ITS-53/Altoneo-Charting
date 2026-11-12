/** Protocole coque ⇄ canevas (postMessage). */
export const MSG = "altoneo-playground";

/** Réglages globaux de la barre d'outils, transmis au canevas. */
export const DEFAULT_GLOBALS = {
  theme: "light", // light | dark
  motion: "cinema", // cinema | sober | none
  contrast: "normal", // normal | high
  bg: "charte", // charte | aurora | grid | transparent
  outline: "off", // off | on (contours de mise en page)
};

/** URL du canevas pour une story, avec réglages et args (lien partageable). */
export function canvasUrl(id, { globals = {}, args, frame, docs } = {}) {
  const q = new URLSearchParams({ id });
  for (const [k, v] of Object.entries(globals)) if (v !== DEFAULT_GLOBALS[k]) q.set(k, v);
  if (args && Object.keys(args).length) q.set("args", JSON.stringify(args));
  if (frame) q.set("frame", frame);
  if (docs) q.set("docs", "1");
  return `canvas.html?${q}`;
}

export function send(iframe, type, payload = {}) {
  iframe?.contentWindow?.postMessage({ source: MSG, type, ...payload }, "*");
}
