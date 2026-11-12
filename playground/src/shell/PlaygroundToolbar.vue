<script setup>
import { computed, ref } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import AltSegmented from "../../../src/components/AltSegmented.vue";
import MenuButton from "./MenuButton.vue";
import { canvasUrl } from "../bridge.js";
import { fileById, storyById } from "../registry.js";
import { VIEWPORTS, argsOf, go, prefs, route, signals } from "./store.js";

const story = computed(() => (route.value.view === "story" ? storyById.get(route.value.id) : null));
const file = computed(() => fileById.get(story.value?.fileId ?? route.value.id));

const crumbs = computed(() => (file.value ? file.value.segments : []));
const heading = computed(() => {
  if (route.value.view === "docs") return "Documentation";
  return story.value?.name ?? "";
});

/** Canevas ⇄ Documentation pour le fichier courant. */
const mode = computed({
  get: () => route.value.view,
  set: (v) => (v === "docs" ? go("docs", file.value.id) : go("story", file.value.stories[0].id)),
});
const showModes = computed(() => file.value && (file.value.stories.length > 1 || file.value.component));

const MOTION = [
  { value: "cinema", label: "Cinéma", icon: "play", hint: "tout" },
  { value: "sober", label: "Sobre", icon: "pause", hint: "court" },
  { value: "none", label: "Aucune", icon: "minus", hint: "figé" },
];
const BACKGROUNDS = [
  { value: "charte", label: "Fond de la charte", icon: "image" },
  { value: "aurora", label: "Aurore", icon: "spark" },
  { value: "grid", label: "Grille", icon: "grid" },
  { value: "transparent", label: "Damier", icon: "layers" },
];
const viewportOptions = Object.entries(VIEWPORTS).map(([value, v]) => ({
  value,
  label: v.label,
  icon: v.icon,
  hint: v.width ? `${v.width}×${v.height}` : "",
}));

const g = prefs.globals;
const toggle = (k, a, b) => (g[k] = g[k] === a ? b : a);

function openTab() {
  if (!story.value) return;
  window.open(canvasUrl(story.value.id, { globals: g, args: argsOf(story.value) }), "_blank", "noopener");
}

const copied = ref(false);
async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch {
    /* presse-papiers refusé */
  }
}
</script>

<template>
  <header class="pg-toolbar alt-glass">
    <div class="min-w-0 flex-1">
      <div class="alt-eyebrow flex min-w-0 items-center gap-1.5 !text-[10px]">
        <template
          v-for="(c, i) in crumbs"
          :key="i"
        >
          <span
            v-if="i"
            aria-hidden="true"
          >/</span><span class="truncate">{{ c }}</span>
        </template>
      </div>
      <h1 class="alt-display truncate text-[19px] leading-tight text-fg">
        {{ heading }}
      </h1>
    </div>

    <AltSegmented
      v-if="showModes"
      v-model="mode"
      class="hidden lg:inline-flex"
      label="Vue"
      :options="[{ value: 'story', label: 'Canevas' }, { value: 'docs', label: 'Documentation' }]"
    />

    <div class="flex items-center gap-0.5">
      <button
        type="button"
        class="pg-icon-btn"
        :data-tip="g.theme === 'dark' ? 'Thème clair (T)' : 'Thème sombre (T)'"
        :aria-label="g.theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'"
        @click="toggle('theme', 'dark', 'light')"
      >
        <AltIcon
          :name="g.theme === 'dark' ? 'sun' : 'moon'"
          :size="16"
        />
      </button>
      <MenuButton
        v-model="g.motion"
        label="Animations"
        :options="MOTION"
        neutral="cinema"
      />
      <button
        type="button"
        class="pg-icon-btn"
        data-tip="Haut contraste"
        aria-label="Haut contraste"
        :aria-pressed="g.contrast === 'high'"
        @click="toggle('contrast', 'high', 'normal')"
      >
        <AltIcon
          name="eye"
          :size="16"
        />
      </button>
      <MenuButton
        v-model="g.bg"
        label="Fond"
        :options="BACKGROUNDS"
        neutral="charte"
      />

      <template v-if="story">
        <span class="pg-sep" />
        <MenuButton
          v-model="prefs.viewport"
          label="Viewport"
          :options="viewportOptions"
          neutral="responsive"
        />
        <button
          type="button"
          class="pg-icon-btn"
          data-tip="Contours (O)"
          aria-label="Afficher les contours"
          :aria-pressed="g.outline === 'on'"
          @click="toggle('outline', 'on', 'off')"
        >
          <AltIcon
            name="target"
            :size="16"
          />
        </button>
        <button
          type="button"
          class="pg-icon-btn"
          data-tip="Remonter la story (R)"
          aria-label="Remonter la story"
          @click="signals.remount++"
        >
          <AltIcon
            name="refresh"
            :size="16"
          />
        </button>
        <button
          type="button"
          class="pg-icon-btn"
          data-tip="Ouvrir seule dans un onglet"
          aria-label="Ouvrir la story dans un nouvel onglet"
          @click="openTab"
        >
          <AltIcon
            name="external"
            :size="16"
          />
        </button>
      </template>

      <span class="pg-sep" />
      <button
        type="button"
        class="pg-icon-btn"
        :data-tip="copied ? 'Lien copié' : 'Copier le lien'"
        aria-label="Copier le lien de la page"
        @click="copyLink"
      >
        <AltIcon
          :name="copied ? 'check' : 'link'"
          :size="16"
        />
      </button>
      <button
        type="button"
        class="pg-icon-btn"
        data-tip="Mode focus (F)"
        data-tip-end
        aria-label="Mode focus"
        :aria-pressed="prefs.focus"
        @click="prefs.focus = !prefs.focus"
      >
        <AltIcon
          name="compass"
          :size="16"
        />
      </button>
    </div>
  </header>
</template>

<style scoped>
.pg-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 0.6rem 0.55rem 1.1rem;
  border-radius: 1.1rem;
  position: relative;
  z-index: 20;
}
.pg-sep {
  width: 1px;
  height: 20px;
  margin: 0 0.3rem;
  background: rgb(var(--alt-line) / 0.6);
}
</style>
