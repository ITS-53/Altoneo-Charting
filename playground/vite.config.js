import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { fileURLToPath, URL } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Altonéo Playground — l'atelier maison qui remplace Storybook.
 *   npm run playground         → http://localhost:6006
 *   npm run build-playground   → playground-dist/ (publié sur GitHub Pages)
 * Deux pages : la coque (index.html) et le canevas isolé qui rend une story (canvas.html).
 */
export default defineConfig({
  root: here("."),
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": here("../src"),
      // Les stories décrivent leurs gabarits en chaînes : il faut le compilateur de Vue.
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss({ config: here("../tailwind.config.js") }), autoprefixer()],
    },
  },
  server: { port: 6006, strictPort: true, fs: { allow: [here("..")] } },
  preview: { port: 6006 },
  build: {
    outDir: here("../playground-dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: { index: here("index.html"), canvas: here("canvas.html") },
    },
  },
});
