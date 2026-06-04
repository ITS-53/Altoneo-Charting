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
