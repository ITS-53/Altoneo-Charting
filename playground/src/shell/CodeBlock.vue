<script setup>
import { computed, ref } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import { highlight } from "../core/highlight.js";

const props = defineProps({
  code: { type: String, default: "" },
  /** html | js | bash */
  lang: { type: String, default: "html" },
  label: { type: String, default: "" },
});

const html = computed(() => highlight(props.code, props.lang));
const copied = ref(false);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch {
    /* presse-papiers refusé */
  }
}
</script>

<template>
  <div class="pg-codeblock">
    <div class="pg-codebar">
      <span class="alt-eyebrow !text-[10px]">{{ label || lang }}</span>
      <button
        type="button"
        class="pg-copy pg-focus"
        :class="{ 'is-done': copied }"
        @click="copy"
      >
        <AltIcon
          :name="copied ? 'check' : 'copy'"
          :size="13"
        />
        {{ copied ? "Copié" : "Copier" }}
      </button>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -- HTML échappé par highlight() -->
    <pre class="pg-code pg-scroll"><code v-html="html" /></pre>
  </div>
</template>

<style scoped>
.pg-codeblock {
  overflow: hidden;
  border-radius: 0.9rem;
  border: 1px solid rgb(var(--alt-line) / 0.5);
  background: rgb(var(--alt-ink-950) / 0.75);
}
.pg-codebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.5rem 0.35rem 0.9rem;
  border-bottom: 1px solid rgb(var(--alt-line) / 0.35);
}
.pg-code {
  padding: 0.9rem 1rem;
  max-height: 480px;
}
.pg-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 11.5px;
  font-weight: 600;
  color: rgb(var(--alt-fg-muted));
  transition:
    background 0.2s,
    color 0.2s;
}
.pg-copy:hover {
  background: rgb(var(--alt-ink-700));
  color: rgb(var(--alt-fg));
}
.pg-copy.is-done {
  color: rgb(var(--alt-neon-mint));
}
</style>
