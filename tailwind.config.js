/** Config Tailwind LOCALE — sert au dev et à Storybook.
 *  Les projets consommateurs n'utilisent PAS ce fichier : ils importent
 *  directement le preset (voir README + tailwind-preset.cjs).
 */
import altoneoPreset from "./tailwind-preset.cjs";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [altoneoPreset],
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
    "./stories/**/*.{vue,js,mdx}",
    "./.storybook/**/*.{js,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
