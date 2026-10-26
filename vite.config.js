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
  // Tests Vitest : règles métier (tests/unit) et parcours composants (tests/components).
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.js"],
    // Node ≥ 25 expose un localStorage natif (inutilisable sans --localstorage-file)
    // qui masque celui de happy-dom : on le désactive dans les workers de test.
    execArgv: Number(process.versions.node.split(".")[0]) >= 25 ? ["--no-experimental-webstorage"] : [],
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
