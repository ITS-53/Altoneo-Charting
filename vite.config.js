import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// Config Vite — utilisée par Storybook et pour un éventuel build en mode librairie.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // NE PAS vider dist/ : il contient `altoneo.css`, une CSS autonome
    // maintenue à la main (variante HTML/CSS sans dépendance, cf. README) qui
    // n'est PAS produite par ce build. Avec emptyOutDir par défaut, `vite build`
    // l'effacerait. Les artefacts de ce build (altoneo-charting.*) sont gitignorés.
    emptyOutDir: false,
    lib: {
      entry: fileURLToPath(new URL("./src/index.js", import.meta.url)),
      name: "AltoneoCharting",
      fileName: (format) => `altoneo-charting.${format}.js`,
    },
    rollupOptions: {
      // Vue reste externe : fourni par le projet consommateur (peerDependency).
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
});
