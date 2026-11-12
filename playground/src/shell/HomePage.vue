<script setup>
/** Accueil du playground (ex-Introduction.mdx de Storybook). */
import { computed } from "vue";
import AltAurora from "../../../src/components/AltAurora.vue";
import AltButton from "../../../src/components/AltButton.vue";
import AltGlassCard from "../../../src/components/AltGlassCard.vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import { ICON_NAMES } from "../../../src/icons/registry.js";
import CodeBlock from "./CodeBlock.vue";
import pkg from "../../../package.json";
import { componentDocs, stories, tree } from "../registry.js";
import { go } from "./store.js";

const stats = [
  { label: "Composants", value: componentDocs.size, icon: "app" },
  { label: "Stories", value: stories.length, icon: "layers" },
  { label: "Icônes", value: ICON_NAMES.length, icon: "spark" },
];

const SECTION_META = {
  "Design Tokens": { icon: "diamond", text: "Palette officielle, échelle altoneo, couleurs des graphiques.", accent: "var(--alt-gold)" },
  "Altonéo Next": { icon: "spark", text: "Verre dépoli, aurores, néons, données animées, icônes internes.", accent: "var(--alt-neon-violet)" },
  Composants: { icon: "layers", text: "Boutons, formulaires validés, données, navigation, pages, marque.", accent: "var(--alt-neon-cyan)" },
  "Variante HTML-CSS": { icon: "code", text: "Classes alt-* sans Tailwind ni JS, pour PowerShell et pages statiques.", accent: "var(--alt-neon-mint)" },
};

function firstStory(node) {
  if (node.type === "file") return node.file.stories[0];
  for (const c of node.children) {
    const s = firstStory(c);
    if (s) return s;
  }
  return null;
}
function count(node) {
  return node.type === "file" ? node.file.stories.length : node.children.reduce((n, c) => n + count(c), 0);
}
const sections = computed(() =>
  tree.map((n) => ({ name: n.name, first: firstStory(n), count: count(n), ...(SECTION_META[n.name] ?? { icon: "folder", text: "", accent: "var(--alt-azure-bright)" }) })),
);

const INSTALL = "npm install github:ITS-53/Altoneo-Charting";
const TAILWIND = `// tailwind.config.js
module.exports = {
  presets: [require("altoneo-charting/tailwind-preset")],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    // Indispensable : laisser Tailwind scanner les classes des composants
    "./node_modules/altoneo-charting/src/**/*.{vue,js}",
  ],
};`;
const MAIN = `// main.js
import { createApp } from "vue";
import App from "./App.vue";
import AltoneoUI from "altoneo-charting";
import "altoneo-charting/next.css"; // couche Altonéo Next
import "./assets/main.css"; // @tailwind base/components/utilities

createApp(App).use(AltoneoUI).mount("#app");`;
const USE = `<AltGlassCard eyebrow="Parc" title="Bienvenue">
  <AltButton variant="neon" magnetic @click="go">Commencer</AltButton>
</AltGlassCard>`;
</script>

<template>
  <div class="pg-scroll pg-home flex-1">
    <section class="pg-hero">
      <AltAurora :fixed="false" />
      <div class="relative mx-auto grid max-w-5xl gap-6 px-6 py-14 md:py-20">
        <div class="alt-eyebrow">
          Altonéo Charting · v{{ pkg.version }} · Vue 3 + Tailwind
        </div>
        <h2 class="alt-display max-w-3xl text-5xl leading-[1.02] text-fg md:text-6xl">
          L'atelier de la <span class="alt-text-gold">charte Altonéo</span>
        </h2>
        <p class="max-w-2xl text-[16px] leading-relaxed text-fg-muted">
          Chaque composant en vrai, dans les deux thèmes et les trois intensités d'animation :
          contrôles en direct, journal d'événements, code prêt à copier, référence d'API et
          contrôles d'accessibilité. Construit avec nos propres composants — sans Storybook.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <AltButton
            variant="neon"
            magnetic
            @click="go('story', stories[0].id)"
          >
            <template #icon-left>
              <AltIcon
                name="play"
                :size="15"
              />
            </template>
            Explorer les composants
          </AltButton>
          <span class="alt-chip"><kbd class="alt-kbd">/</kbd> rechercher</span>
          <span class="alt-chip"><kbd class="alt-kbd">T</kbd> thème</span>
          <span class="alt-chip"><kbd class="alt-kbd">J</kbd><kbd class="alt-kbd">K</kbd> story suivante / précédente</span>
        </div>
        <div class="mt-4 grid max-w-xl grid-cols-3 gap-3">
          <div
            v-for="s in stats"
            :key="s.label"
            class="alt-glass px-4 py-3"
          >
            <div class="flex items-center gap-2 text-fg-faint">
              <AltIcon
                :name="s.icon"
                :size="14"
              /><span class="alt-eyebrow !text-[10px]">{{ s.label }}</span>
            </div>
            <div class="alt-display mt-1 text-3xl text-fg">
              {{ s.value }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto grid max-w-5xl gap-12 px-6 pb-16">
      <section class="grid gap-4">
        <div class="alt-eyebrow">
          Parcourir
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <a
            v-for="s in sections"
            :key="s.name"
            :href="s.first ? `#/story/${s.first.id}` : '#/'"
            class="pg-focus rounded-2xl"
          >
            <AltGlassCard
              :eyebrow="`${s.count} stories`"
              :title="s.name"
              accent="left"
              :accent-color="s.accent"
              sheen
              neon
              class="h-full"
            >
              <div class="flex items-start gap-3">
                <AltIcon
                  :name="s.icon"
                  :size="20"
                  :style="{ color: `rgb(${s.accent})` }"
                  class="mt-0.5 shrink-0"
                />
                <p class="text-sm text-fg-muted">{{ s.text }}</p>
              </div>
            </AltGlassCard>
          </a>
        </div>
      </section>

      <section class="grid gap-4">
        <div class="alt-eyebrow">
          Installer dans un projet
        </div>
        <ol class="grid gap-4">
          <li class="grid gap-2">
            <h3 class="pg-step">
              <span>1</span> Ajouter la dépendance <small>(Vue 3 et Tailwind CSS v3 requis)</small>
            </h3>
            <CodeBlock
              :code="INSTALL"
              lang="bash"
              label="terminal"
            />
          </li>
          <li class="grid gap-2">
            <h3 class="pg-step">
              <span>2</span> Brancher le preset Tailwind
            </h3>
            <CodeBlock
              :code="TAILWIND"
              lang="js"
              label="tailwind.config.js"
            />
          </li>
          <li class="grid gap-2">
            <h3 class="pg-step">
              <span>3</span> Enregistrer les composants
            </h3>
            <CodeBlock
              :code="MAIN"
              lang="js"
              label="main.js"
            />
          </li>
          <li class="grid gap-2">
            <h3 class="pg-step">
              <span>4</span> Utiliser <small>(ou en imports nommés : <code class="pg-code-inline">import { AltButton, useForm } from "altoneo-charting"</code>)</small>
            </h3>
            <CodeBlock
              :code="USE"
              lang="html"
              label="App.vue"
            />
          </li>
        </ol>
      </section>

      <section class="grid gap-4">
        <div class="alt-eyebrow">
          Ce que contient la bibliothèque
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="item in [
              ['app', 'Composants Alt…', 'Boutons, champs, cartes, badges, alertes, modales, tableaux, onglets, toasts…'],
              ['check-circle', 'Validation', 'useForm + règles required, email, minLength, sameAs…'],
              ['bell', 'Toasts', 'createToastStore / useToast + <AltToastContainer />'],
              ['diamond', 'Jetons', 'Palette exportée en JS (altoneo, chartPalette…) pour les graphiques.'],
              ['layers', 'Preset Tailwind', 'Échelle altoneo, couleurs nommées, .btn-*, .input, .card, .badge-*'],
              ['spark', 'Altonéo Next', 'next.css : verre, lueurs, aurores, directives v-alt-*, useMotion.'],
            ]"
            :key="item[1]"
            class="alt-glass p-4"
          >
            <div class="flex items-center gap-2">
              <AltIcon
                :name="item[0]"
                :size="16"
                class="text-gold"
              />
              <span class="font-semibold text-fg">{{ item[1] }}</span>
            </div>
            <p class="mt-1.5 text-[13px] text-fg-muted">
              {{ item[2] }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-home {
  border-radius: 1.1rem;
}
.pg-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 1.1rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgb(var(--alt-glass-border) / var(--alt-glass-border-alpha));
  background: rgb(var(--alt-ink-950));
}
.pg-step {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-weight: 600;
  color: rgb(var(--alt-fg));
}
.pg-step span {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  font: 700 11px "JetBrains Mono", ui-monospace, monospace;
  color: rgb(var(--alt-navy));
  background: linear-gradient(135deg, rgb(var(--alt-gold-glow)), rgb(var(--alt-gold)));
}
.pg-step small {
  font-weight: 400;
  font-size: 12.5px;
  color: rgb(var(--alt-fg-faint));
}
</style>
