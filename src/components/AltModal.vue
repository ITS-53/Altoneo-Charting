<template>
  <teleport to="body">
    <transition name="alt-modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @keydown.esc="closeOnEsc && close()"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-altoneo-900/50 backdrop-blur-sm"
          @click="closeOnOverlay && close()"
        />

        <!-- Panneau -->
        <div
          ref="panel"
          class="relative w-full bg-white dark:bg-alt-dark-surface dark:text-altoneo-50 rounded-xl shadow-altoneo-pop max-h-[90vh] flex flex-col animate-altoneo-fade-in"
          :class="sizeClass"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          tabindex="-1"
        >
          <div
            v-if="title || $slots.header || closable"
            class="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-alt-dark-border"
          >
            <div class="min-w-0">
              <slot name="header">
                <h3 class="font-semibold text-lg text-altoneo-800 dark:text-altoneo-50">{{ title }}</h3>
              </slot>
            </div>
            <button
              v-if="closable"
              type="button"
              class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
              @click="close"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-4 overflow-y-auto">
            <slot />
          </div>

          <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 dark:border-alt-dark-border bg-gray-50 dark:bg-alt-dark-raised rounded-b-xl flex items-center justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount } from "vue";

const props = defineProps({
  /** v-model:open */
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  /** sm | md | lg | xl | full */
  size: { type: String, default: "md" },
  closable: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true },
});

const emit = defineEmits(["update:open", "close"]);
const panel = ref(null);

function close() {
  emit("update:open", false);
  emit("close");
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) nextTick(() => panel.value?.focus());
  },
);

onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.body.style.overflow = "";
});

const sizeClass = computed(
  () =>
    ({
      sm: "max-w-sm",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-[95vw]",
    })[props.size] || "max-w-lg",
);
</script>

<style scoped>
.alt-modal-enter-active,
.alt-modal-leave-active {
  transition: opacity 0.18s ease;
}
.alt-modal-enter-from,
.alt-modal-leave-to {
  opacity: 0;
}
</style>
