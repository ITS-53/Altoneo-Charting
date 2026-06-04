import { altoneo, brand, chartPalette } from "../src/tokens/colors.js";

export default {
  title: "Design Tokens",
};

const Swatch = (name, value, sub = "") => `
  <div style="border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:${value};height:72px;"></div>
    <div style="padding:8px 10px;background:#fff;">
      <div style="font-weight:600;font-size:13px;color:#1c284d;">${name}</div>
      <div style="font-family:monospace;font-size:12px;color:#6b7280;">${value}${sub ? " · " + sub : ""}</div>
    </div>
  </div>`;

export const Palette = {
  name: "Palette de marque",
  render: () => ({
    template: `
      <div style="font-family:Inter,system-ui,sans-serif;color:#1c284d;">
        <h2 style="margin:0 0 4px;">Palette officielle Altonéo</h2>
        <p style="color:#6b7280;margin:0 0 20px;">Les 8 couleurs de la charte (palette.scss).</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:14px;margin-bottom:32px;">${brandSwatches}</div>

        <h2 style="margin:0 0 4px;">Échelle <code>altoneo</code> (Tailwind)</h2>
        <p style="color:#6b7280;margin:0 0 20px;">Utilisable en classes : <code>bg-altoneo-200</code>, <code>text-altoneo-800</code>…</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:32px;">${scaleSwatches}</div>

        <h2 style="margin:0 0 4px;">Palette graphiques</h2>
        <p style="color:#6b7280;margin:0 0 20px;">Séquence ordonnée pour les séries de graphiques (<code>chartPalette</code>).</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">${chartSwatches}</div>
      </div>`,
  }),
};

const brandSwatches = Object.entries(brand)
  .map(([k, v]) => Swatch(k, v))
  .join("");

const scaleSwatches = Object.entries(altoneo)
  .map(([k, v]) => Swatch(`altoneo-${k}`, v))
  .join("");

const chartSwatches = chartPalette
  .map(
    (c) =>
      `<div style="width:54px;height:54px;border-radius:8px;background:${c};border:1px solid #e5e7eb;" title="${c}"></div>`,
  )
  .join("");
