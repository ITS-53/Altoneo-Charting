<script setup>
import { computed } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import { prefs, route } from "./store.js";

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
});

const open = computed({
  get: () => prefs.expanded[props.node.key] ?? props.depth === 0,
  set: (v) => (prefs.expanded[props.node.key] = v),
});

const file = computed(() => props.node.file);
const isFileActive = computed(() => file.value && (route.value.id === file.value.id || file.value.stories.some((s) => s.id === route.value.id)));
/** Fichier à une seule story sans doc de composant : on l'affiche comme un lien direct. */
const single = computed(() => file.value && file.value.stories.length === 1 && !file.value.component);

const ICONS = { "Design Tokens": "diamond", "Altonéo Next": "spark", Composants: "layers", "Variante HTML-CSS": "code" };
const pad = computed(() => ({ paddingLeft: `${0.5 + props.depth * 0.85}rem` }));
</script>

<template>
  <li>
    <!-- Groupe -->
    <template v-if="node.type === 'group'">
      <button
        type="button"
        class="pg-row pg-focus w-full"
        :class="depth === 0 ? 'is-root' : 'is-group'"
        :style="pad"
        :aria-expanded="open"
        @click="open = !open"
      >
        <AltIcon
          name="chevron-right"
          :size="13"
          class="pg-chev"
          :class="{ 'is-open': open }"
        />
        <AltIcon
          v-if="depth === 0"
          :name="ICONS[node.name] ?? 'folder'"
          :size="14"
          class="text-gold"
        />
        <span class="truncate">{{ node.name }}</span>
      </button>
      <ul
        v-show="open"
        class="space-y-0.5"
      >
        <NavNode
          v-for="c in node.children"
          :key="c.key"
          :node="c"
          :depth="depth + 1"
        />
      </ul>
    </template>

    <!-- Fichier à story unique -->
    <a
      v-else-if="single"
      :href="`#/story/${file.stories[0].id}`"
      class="pg-row pg-focus is-story"
      :style="pad"
      :aria-current="route.id === file.stories[0].id ? 'page' : undefined"
    >
      <AltIcon
        :name="depth === 0 ? (ICONS[node.name] ?? 'file') : 'file'"
        :size="14"
        class="text-gold"
      />
      <span class="truncate">{{ node.name }}</span>
    </a>

    <!-- Composant : docs + stories -->
    <template v-else>
      <button
        type="button"
        class="pg-row pg-focus w-full is-file"
        :class="{ 'has-active': isFileActive }"
        :style="pad"
        :aria-expanded="open"
        @click="open = !open"
      >
        <AltIcon
          name="chevron-right"
          :size="13"
          class="pg-chev"
          :class="{ 'is-open': open }"
        />
        <AltIcon
          :name="file.component ? 'app' : 'layers'"
          :size="14"
          class="text-azure-bright"
        />
        <span class="truncate">{{ node.name }}</span>
        <span class="pg-n">{{ file.stories.length }}</span>
      </button>
      <ul
        v-show="open"
        class="pg-leafs"
        :style="{ marginLeft: `${1.15 + depth * 0.85}rem` }"
      >
        <li>
          <a
            :href="`#/docs/${file.id}`"
            class="pg-leaf pg-focus"
            :aria-current="route.view === 'docs' && route.id === file.id ? 'page' : undefined"
          >
            <AltIcon
              name="file-text"
              :size="13"
            /> Documentation
          </a>
        </li>
        <li
          v-for="s in file.stories"
          :key="s.id"
        >
          <a
            :href="`#/story/${s.id}`"
            class="pg-leaf pg-focus"
            :aria-current="route.view === 'story' && route.id === s.id ? 'page' : undefined"
          >
            <span class="pg-dot" /> <span class="truncate">{{ s.name }}</span>
          </a>
        </li>
      </ul>
    </template>
  </li>
</template>

<style scoped>
.pg-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 30px;
  padding-right: 0.6rem;
  border-radius: 0.55rem;
  font-size: 13px;
  color: rgb(var(--alt-fg-muted));
  text-align: left;
  transition:
    background 0.15s,
    color 0.15s;
}
.pg-row:hover {
  background: rgb(var(--alt-ink-700) / 0.55);
  color: rgb(var(--alt-fg));
}
.pg-row.is-root {
  margin-top: 0.6rem;
  font: 600 10.5px/1 "JetBrains Mono", ui-monospace, monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgb(var(--alt-fg-faint));
}
.pg-row.is-file.has-active {
  color: rgb(var(--alt-fg));
}
.pg-row[aria-current="page"] {
  color: rgb(var(--alt-gold));
  background: rgb(var(--alt-gold) / 0.1);
}
.pg-chev {
  flex-shrink: 0;
  opacity: 0.6;
  transition: transform calc(0.2s * var(--alt-motion)) var(--alt-ease-out);
}
.pg-chev.is-open {
  transform: rotate(90deg);
}
.pg-n {
  margin-left: auto;
  font: 500 10px "JetBrains Mono", ui-monospace, monospace;
  color: rgb(var(--alt-fg-faint));
}
.pg-leafs {
  position: relative;
  padding: 0.15rem 0 0.3rem 0.6rem;
  border-left: 1px solid rgb(var(--alt-line) / 0.45);
}
.pg-leaf {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 28px;
  padding: 0 0.6rem;
  border-radius: 0.5rem;
  font-size: 12.5px;
  color: rgb(var(--alt-fg-muted));
  transition:
    background 0.15s,
    color 0.15s;
}
.pg-leaf:hover {
  background: rgb(var(--alt-ink-700) / 0.55);
  color: rgb(var(--alt-fg));
}
.pg-leaf[aria-current="page"] {
  color: rgb(var(--alt-gold));
  background: linear-gradient(90deg, rgb(var(--alt-gold) / 0.16), rgb(var(--alt-gold) / 0.02));
}
.pg-leaf[aria-current="page"]::before {
  content: "";
  position: absolute;
  left: calc(-0.6rem - 1px);
  top: 6px;
  bottom: 6px;
  width: 2px;
  border-radius: 2px;
  background: rgb(var(--alt-gold));
  box-shadow: 0 0 calc(10px * var(--alt-glow)) rgb(var(--alt-gold));
}
.pg-dot {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.55;
}
.pg-leaf[aria-current="page"] .pg-dot {
  opacity: 1;
  box-shadow: 0 0 8px rgb(var(--alt-gold));
}
</style>
