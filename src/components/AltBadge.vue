<template>
  <span
    class="inline-flex items-center gap-1 font-semibold rounded-full"
    :class="[variantClass, sizeClass]"
  >
    <slot name="icon" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * Variantes sémantiques génériques :
   *   neutral | info | success | warning | error | navy | gold
   * Variantes métier (reprises de controle-independance) :
   *   pending | sent | partial | completed | draft
   */
  variant: { type: String, default: "neutral" },
  /** sm | md */
  size: { type: String, default: "md" },
  label: { type: String, default: "" },
});

const variantClass = computed(
  () =>
    ({
      neutral: "bg-gray-100 text-gray-600 dark:bg-alt-dark-raised dark:text-altoneo-100",
      info: "bg-altoneo-50 text-altoneo-800 border border-altoneo-400 dark:bg-alt-dark-raised dark:text-altoneo-50 dark:border-alt-dark-link",
      success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
      warning: "bg-altoneo-200 text-altoneo-800",
      error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
      navy: "bg-altoneo-800 text-white dark:bg-alt-dark-raised",
      gold: "bg-altoneo-100 text-altoneo-800",
      // statuts métier
      pending: "bg-altoneo-100 text-altoneo-800",
      sent: "bg-altoneo-50 text-altoneo-800 border border-altoneo-400 dark:bg-alt-dark-raised dark:text-altoneo-50 dark:border-alt-dark-link",
      partial: "bg-altoneo-200 text-altoneo-800",
      completed: "bg-altoneo-800 text-white dark:bg-alt-dark-raised",
      draft: "bg-gray-100 text-gray-500 dark:bg-alt-dark-raised dark:text-alt-dark-muted",
    })[props.variant] || "bg-gray-100 text-gray-600 dark:bg-alt-dark-raised dark:text-altoneo-100",
);

const sizeClass = computed(
  () =>
    ({
      sm: "px-2 py-0.5 text-[11px]",
      md: "px-2.5 py-0.5 text-xs",
    })[props.size] || "px-2.5 py-0.5 text-xs",
);
</script>
