/**
 * Tokens de couleur Altonéo exportés en JS.
 * Utile hors Tailwind : graphiques (Chart.js, D3…), styles inline, calculs.
 */

/** Échelle de marque 50 → 900. */
export const altoneo = {
  50: "#eaf0f7",
  100: "#fde38d",
  200: "#f9b233",
  300: "#f07f40",
  400: "#385697",
  500: "#2d519f",
  600: "#2d519f",
  700: "#253a6b",
  800: "#1c284d",
  900: "#131c36",
};

/** Couleurs nommées de la palette officielle (palette.scss). */
export const brand = {
  spaceIndigo: "#1c284d",
  sunflowerGold: "#f9b233",
  steelAzure: "#2d519f",
  jasmine: "#fde38d",
  amaranth: "#e83a5d",
  duskBlue: "#385697",
  atomicTangerine: "#f07f40",
  aliceBlue: "#eaf0f7",
};

/** Intentions sémantiques. */
export const semantic = {
  primary: altoneo[200],
  accent: altoneo[300],
  navy: altoneo[800],
  success: "#16a34a",
  warning: altoneo[200],
  danger: "#dc2626",
  info: altoneo[500],
};

/** Suite ordonnée pour des séries de graphiques (8 couleurs distinctes). */
export const chartPalette = [
  altoneo[500], // bleu
  altoneo[200], // orange
  altoneo[800], // navy
  "#e83a5d", // amaranth
  altoneo[400], // dusk-blue
  altoneo[300], // tangerine
  altoneo[100], // jasmine
  altoneo[700], // navy intermédiaire
];

export default { altoneo, brand, semantic, chartPalette };
