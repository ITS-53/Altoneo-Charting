<script setup>
import { computed, nextTick, ref, watch } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import pkg from "../../../package.json";
import NavNode from "./NavNode.vue";
import { componentDocs, files, stories, tree } from "../registry.js";
import { go, prefs, route } from "./store.js";
import sigle from "../../../src/assets/Altoneo - sigle-CMJN.png";

const query = ref("");
const input = ref(null);

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Recherche : chaque mot doit apparaître dans « titre + nom de story ». */
const results = computed(() => {
  const words = norm(query.value).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return stories
    .filter((s) => words.every((w) => norm(`${s.title} ${s.name}`).includes(w)))
    .slice(0, 40);
});
const active = ref(0);
watch(results, () => (active.value = 0));

function pick(s) {
  if (!s) return;
  go("story", s.id);
  query.value = "";
}

function onKey(e) {
  if (e.key === "ArrowDown") active.value = Math.min(active.value + 1, results.value.length - 1);
  else if (e.key === "ArrowUp") active.value = Math.max(active.value - 1, 0);
  else if (e.key === "Enter") pick(results.value[active.value]);
  else if (e.key === "Escape") {
    query.value = "";
    input.value?.blur();
  } else return;
  e.preventDefault();
}

/** Déplie le chemin de la story ouverte. */
watch(
  route,
  (r) => {
    const file = files.find((f) => f.id === r.id || f.stories.some((s) => s.id === r.id));
    if (!file) return;
    file.segments.forEach((_, i) => (prefs.expanded[file.segments.slice(0, i + 1).join("/")] = true));
    nextTick(() => document.querySelector(".pg-nav [aria-current='page']")?.scrollIntoView({ block: "nearest" }));
  },
  { immediate: true },
);

function focusSearch() {
  input.value?.focus();
  input.value?.select();
}
defineExpose({ focusSearch });

const counts = { components: componentDocs.size, stories: stories.length };
</script>

<template>
  <nav
    class="pg-nav alt-glass flex h-full flex-col overflow-hidden"
    aria-label="Stories"
  >
    <a
      href="#/"
      class="pg-brand pg-focus"
      :aria-current="route.view === 'home' ? 'page' : undefined"
    >
      <img
        :src="sigle"
        alt=""
        class="h-9 w-9 shrink-0 drop-shadow-[0_0_14px_rgba(249,178,51,0.45)]"
      >
      <span class="min-w-0">
        <span class="alt-display block truncate text-[17px] leading-tight text-fg">Altonéo <span class="alt-text-gold">Playground</span></span>
        <span class="alt-eyebrow block !text-[10px]">Charting v{{ pkg.version }} · {{ counts.components }} composants</span>
      </span>
    </a>

    <div class="relative px-3 pb-3">
      <AltIcon
        name="search"
        :size="15"
        class="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-fg-faint"
      />
      <input
        ref="input"
        v-model="query"
        type="search"
        class="alt-field !pl-9 !pr-10"
        placeholder="Rechercher une story…"
        aria-label="Rechercher une story"
        role="combobox"
        :aria-expanded="results.length > 0"
        aria-controls="pg-search-results"
        @keydown="onKey"
      >
      <kbd class="alt-kbd absolute right-6 top-1/2 -translate-y-1/2">/</kbd>
    </div>

    <div class="pg-scroll flex-1 px-2 pb-4">
      <ul
        v-if="query"
        id="pg-search-results"
        role="listbox"
        class="space-y-0.5"
      >
        <li
          v-for="(s, i) in results"
          :key="s.id"
          role="option"
          :aria-selected="i === active"
        >
          <a
            :href="`#/story/${s.id}`"
            class="pg-result pg-focus"
            :class="{ 'is-active': i === active }"
            @click="query = ''"
            @mouseenter="active = i"
          >
            <span class="block truncate text-[13px] font-medium text-fg">{{ s.name }}</span>
            <span class="block truncate text-[11px] text-fg-faint">{{ s.title }}</span>
          </a>
        </li>
        <li
          v-if="!results.length"
          class="px-3 py-6 text-center text-sm text-fg-faint"
        >
          Aucune story ne correspond à « {{ query }} ».
        </li>
      </ul>
      <ul
        v-else
        class="space-y-0.5"
      >
        <NavNode
          v-for="n in tree"
          :key="n.key"
          :node="n"
          :depth="0"
        />
      </ul>
    </div>

    <footer class="flex items-center gap-1 border-t border-line/40 px-3 py-2 text-[11px] text-fg-faint">
      <span class="alt-eyebrow !text-[10px]">{{ counts.stories }} stories</span>
      <span class="flex-1" />
      <a
        class="pg-icon-btn"
        href="https://github.com/ITS-53/Altoneo-Charting"
        target="_blank"
        rel="noopener"
        data-tip="Dépôt GitHub"
        aria-label="Dépôt GitHub"
      ><AltIcon
        name="git-branch"
        :size="15"
      /></a>
      <a
        class="pg-icon-btn"
        href="https://github.com/ITS-53/Altoneo-Charting/blob/main/CHANGELOG.md"
        target="_blank"
        rel="noopener"
        data-tip="Journal des versions"
        aria-label="Journal des versions"
      ><AltIcon
        name="file-text"
        :size="15"
      /></a>
    </footer>
  </nav>
</template>

<style scoped>
.pg-nav {
  border-radius: 1.1rem;
}
.pg-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.9rem;
  transition: background 0.2s;
}
.pg-brand:hover,
.pg-brand[aria-current="page"] {
  background: rgb(var(--alt-ink-700) / 0.5);
}
.pg-result {
  display: block;
  padding: 0.45rem 0.75rem;
  border-radius: 0.6rem;
}
.pg-result.is-active {
  background: rgb(var(--alt-gold) / 0.1);
  box-shadow: inset 2px 0 0 rgb(var(--alt-gold));
}
input[type="search"]::-webkit-search-cancel-button {
  display: none;
}
</style>
