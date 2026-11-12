<script setup>
/** Page de documentation d'un fichier de stories (remplace l'autodocs de Storybook). */
import { computed, reactive } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import ApiTable from "./ApiTable.vue";
import CodeBlock from "./CodeBlock.vue";
import StoryFrame from "./StoryFrame.vue";
import { storySource } from "../core/snippet.js";
import { docsFor, fileById } from "../registry.js";
import { argsOf, logAction, prefs, route } from "./store.js";

const file = computed(() => fileById.get(route.value.id));
const docs = computed(() => docsFor(file.value));
const description = computed(() => file.value?.description || docs.value?.description || "");

const heights = reactive({});
const showCode = reactive({});

function frameHeight(s) {
  if (s.layout === "fullscreen") return 560;
  return Math.min(Math.max(heights[s.id] ?? 220, 120), 900);
}

/** `code` en ligne dans les descriptions issues des métadonnées. */
function inline(text) {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/`([^`]+)`/g, '<code class="pg-code-inline">$1</code>');
}

const importLine = computed(() =>
  file.value?.componentName ? `import { ${file.value.componentName} } from "altoneo-charting";` : "",
);
</script>

<template>
  <article
    v-if="file"
    :key="file.id"
    class="pg-scroll pg-docs flex-1"
  >
    <div class="mx-auto grid max-w-5xl gap-8 px-6 py-8">
      <header class="grid gap-3">
        <div class="alt-eyebrow">
          {{ file.segments.slice(0, -1).join(" / ") || "Documentation" }}
        </div>
        <h2 class="alt-display text-4xl text-fg">
          {{ file.componentName || file.segments.at(-1) }}
        </h2>
        <!-- eslint-disable vue/no-v-html -- texte échappé par inline() -->
        <p
          v-if="description"
          class="max-w-3xl text-[15px] leading-relaxed text-fg-muted"
          v-html="inline(description)"
        />
        <!-- eslint-enable vue/no-v-html -->
        <div class="flex flex-wrap gap-2">
          <span class="alt-chip"><AltIcon
            name="layers"
            :size="12"
          /> {{ file.stories.length }} stories</span>
          <span
            v-if="docs"
            class="alt-chip"
          ><AltIcon
            name="list"
            :size="12"
          /> {{ docs.props.length }} props</span>
          <span class="alt-chip font-mono"><AltIcon
            name="file"
            :size="12"
          /> {{ file.path }}</span>
        </div>
      </header>

      <CodeBlock
        v-if="importLine"
        :code="importLine"
        lang="js"
        label="Import"
      />

      <section
        v-for="(s, i) in file.stories"
        :key="s.id"
        class="grid gap-3"
      >
        <div class="flex items-end justify-between gap-3">
          <h3 class="alt-display text-xl text-fg">
            <span class="mr-2 font-mono text-sm text-gold">{{ String(i + 1).padStart(2, "0") }}</span>{{ s.name }}
          </h3>
          <div class="flex gap-1">
            <button
              type="button"
              class="pg-icon-btn"
              :aria-pressed="Boolean(showCode[s.id])"
              data-tip="Afficher le code"
              data-tip-end
              aria-label="Afficher le code"
              @click="showCode[s.id] = !showCode[s.id]"
            >
              <AltIcon
                name="code"
                :size="16"
              />
            </button>
            <a
              :href="`#/story/${s.id}`"
              class="pg-icon-btn"
              data-tip="Ouvrir dans le canevas"
              data-tip-end
              aria-label="Ouvrir dans le canevas"
            >
              <AltIcon
                name="arrow-right"
                :size="16"
              />
            </a>
          </div>
        </div>
        <div
          class="pg-docs-frame"
          :style="{ height: `${frameHeight(s)}px` }"
        >
          <StoryFrame
            :story-id="s.id"
            :args="argsOf(s)"
            :globals="prefs.globals"
            :title="`${s.title} — ${s.name}`"
            docs
            @height="(h) => (heights[s.id] = h)"
            @action="logAction"
          />
        </div>
        <CodeBlock
          v-if="showCode[s.id]"
          :code="storySource(s, argsOf(s), docs)"
          lang="html"
          label="Gabarit"
        />
      </section>

      <section
        v-if="docs"
        class="grid gap-3"
      >
        <h3 class="alt-display text-xl text-fg">
          Référence d'API
        </h3>
        <ApiTable :docs="docs" />
      </section>
    </div>
  </article>
</template>

<style scoped>
.pg-docs {
  border-radius: 1.1rem;
}
.pg-docs-frame {
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid rgb(var(--alt-glass-border) / calc(var(--alt-glass-border-alpha) + 0.06));
  box-shadow: 0 24px 50px -30px rgb(0 0 0 / calc(0.2 + 0.3 * var(--alt-glow)));
  transition: height calc(0.25s * var(--alt-motion)) var(--alt-ease-out);
}
</style>
