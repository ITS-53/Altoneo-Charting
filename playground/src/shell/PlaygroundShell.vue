<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import AltAurora from "../../../src/components/AltAurora.vue";
import { setMotion } from "../../../src/composables/useMotion.js";
import DocsView from "./DocsView.vue";
import HomePage from "./HomePage.vue";
import SideNav from "./SideNav.vue";
import StoryView from "./StoryView.vue";
import PlaygroundToolbar from "./PlaygroundToolbar.vue";
import { prefs, route, signals, step } from "./store.js";
import { storyById, fileById } from "../registry.js";

const nav = ref(null);

watch(() => prefs.globals.motion, setMotion, { immediate: true });
watch(
  () => prefs.globals.contrast,
  (c) => (c === "high" ? (document.documentElement.dataset.altContrast = "high") : delete document.documentElement.dataset.altContrast),
  { immediate: true },
);
watch(
  route,
  (r) => {
    const s = r.view === "story" ? storyById.get(r.id) : null;
    const f = r.view === "docs" ? fileById.get(r.id) : null;
    document.title = s ? `${s.name} · ${s.title} — Playground` : f ? `${f.title} — Documentation` : "Altonéo Playground";
  },
  { immediate: true },
);

/** Raccourcis clavier (hors champs de saisie). */
function onKey(e) {
  const t = e.target;
  const typing = t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    prefs.focus = false;
    nav.value?.focusSearch();
    return;
  }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  const g = prefs.globals;
  const actions = {
    "/": () => {
      prefs.focus = false;
      setTimeout(() => nav.value?.focusSearch());
    },
    t: () => (g.theme = g.theme === "dark" ? "light" : "dark"),
    f: () => (prefs.focus = !prefs.focus),
    p: () => (prefs.panelOpen = !prefs.panelOpen),
    o: () => (g.outline = g.outline === "on" ? "off" : "on"),
    r: () => signals.remount++,
    j: () => step(1),
    k: () => step(-1),
  };
  const fn = actions[e.key.toLowerCase()];
  if (fn) {
    e.preventDefault();
    fn();
  }
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div
    class="pg-shell"
    :class="{ 'is-focus': prefs.focus }"
  >
    <AltAurora
      class="pg-backdrop"
      :grid="false"
    />
    <a
      href="#pg-main"
      class="pg-skip"
    >Aller au contenu</a>

    <aside
      v-show="!prefs.focus"
      class="pg-aside"
    >
      <SideNav ref="nav" />
    </aside>

    <main
      id="pg-main"
      class="pg-main"
      tabindex="-1"
    >
      <PlaygroundToolbar v-if="route.view !== 'home'" />
      <Transition
        name="pg-fade"
        mode="out-in"
      >
        <HomePage
          v-if="route.view === 'home'"
          key="home"
        />
        <DocsView
          v-else-if="route.view === 'docs'"
          :key="`docs-${route.id}`"
        />
        <StoryView
          v-else
          key="story"
        />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.pg-shell {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  gap: 0.75rem;
  height: 100%;
  padding: 0.75rem;
  box-sizing: border-box;
}
.pg-shell.is-focus {
  grid-template-columns: minmax(0, 1fr);
}
.pg-backdrop {
  opacity: 0.55;
}
.pg-aside {
  min-height: 0;
}
.pg-main {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  gap: 0.75rem;
  outline: none;
}
.pg-skip {
  position: absolute;
  left: 1rem;
  top: -3rem;
  z-index: 100;
  padding: 0.5rem 0.9rem;
  border-radius: 0.6rem;
  font-weight: 600;
  color: rgb(var(--alt-navy));
  background: rgb(var(--alt-gold));
}
.pg-skip:focus {
  top: 1rem;
}
@media (max-width: 860px) {
  .pg-shell {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .pg-aside {
    max-height: 38vh;
  }
}
</style>
