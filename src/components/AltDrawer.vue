<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[88] flex justify-end"
      @keydown.esc="close"
    >
      <div
        class="absolute inset-0"
        :style="{ background: 'rgb(var(--alt-ink-950) / 0.6)', backdropFilter: 'blur(4px)' }"
        @click="close"
      />
      <aside
        ref="panel"
        class="alt-glass-hi relative flex h-full flex-col !rounded-none !rounded-l-2xl"
        :style="{ width: `min(${width}px, 100vw)`, animation: 'alt-drawer-in calc(450ms * var(--alt-motion)) var(--alt-ease-out)', color: 'rgb(var(--alt-fg))' }"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
      >
        <header
          class="flex items-start gap-3 border-b px-6 py-4"
          :style="{ borderColor: 'rgb(var(--alt-line) / 0.4)' }"
        >
          <div class="min-w-0 flex-1">
            <div
              v-if="eyebrow"
              class="alt-eyebrow"
            >
              {{ eyebrow }}
            </div>
            <h2 class="alt-display truncate text-xl">
              {{ title }}
            </h2>
          </div>
          <slot name="actions" />
          <button
            type="button"
            class="alt-focus-ring rounded-lg p-1.5 transition hover:opacity-80"
            aria-label="Fermer"
            @click="close"
          >
            <AltIcon name="close" />
          </button>
        </header>
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <slot />
        </div>
        <footer
          v-if="$slots.footer"
          class="flex items-center gap-2 border-t px-6 py-3"
          :style="{ borderColor: 'rgb(var(--alt-line) / 0.4)' }"
        >
          <slot name="footer" />
        </footer>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import AltIcon from "./AltIcon.vue";

/** Tiroir latéral droit (fiche détail, réglages contextuels) : verre, entrée glissée, fermeture Échap ou clic hors panneau. */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "" },
  eyebrow: { type: String, default: "" },
  width: { type: Number, default: 520 },
});
const emit = defineEmits(["update:modelValue", "close"]);
const panel = ref(null);

function close() {
  emit("update:modelValue", false);
  emit("close");
}
watch(
  () => props.modelValue,
  (v) => v && nextTick(() => panel.value?.focus()),
);
</script>
