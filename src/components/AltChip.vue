<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full text-sm font-medium"
    :class="[variantClass, sizeClass]"
  >
    <slot name="icon" />
    <slot>{{ label }}</slot>
    <button
      v-if="removable"
      type="button"
      class="-mr-1 ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      aria-label="Retirer"
      @click.stop="$emit('remove')"
    >
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  /** neutral | primary | navy | info | success | warning | error */
  variant: { type: String, default: "neutral" },
  /** sm | md */
  size: { type: String, default: "md" },
  removable: { type: Boolean, default: false },
});

defineEmits(["remove"]);

const variantClass = computed(
  () =>
    ({
      neutral: "bg-gray-100 text-gray-700 dark:bg-alt-dark-raised dark:text-altoneo-100",
      primary: "bg-altoneo-200 text-altoneo-800",
      navy: "bg-altoneo-800 text-white dark:bg-alt-dark-raised",
      info: "bg-altoneo-50 text-altoneo-800 dark:bg-alt-dark-raised dark:text-altoneo-50",
      success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
      warning: "bg-altoneo-100 text-altoneo-900",
      error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
    })[props.variant] || "bg-gray-100 text-gray-700",
);

const sizeClass = computed(
  () => ({ sm: "px-2 py-0.5 text-xs", md: "px-2.5 py-1 text-sm" })[props.size] || "px-2.5 py-1 text-sm",
);
</script>
