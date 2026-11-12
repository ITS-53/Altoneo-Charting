/** Config Tailwind LOCALE — sert au dev et au playground (playground/).
 *  Les projets consommateurs n'utilisent PAS ce fichier : ils importent
 *  directement le preset (voir README + tailwind-preset.cjs).
 */
import altoneoPreset from "./tailwind-preset.cjs";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [altoneoPreset],
  content: {
    // Chemins résolus depuis ce fichier (le playground tourne avec root: playground/).
    relative: true,
    files: [
      "./index.html",
      "./src/**/*.{vue,js}",
      "./stories/**/*.{vue,js}",
      "./playground/**/*.{html,vue,js}",
    ],
  },
  theme: { extend: {} },
  plugins: [],
};
