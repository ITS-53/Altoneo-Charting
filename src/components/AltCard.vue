<template>
  <div
    class="bg-white dark:bg-alt-dark-surface rounded-xl border"
    :class="[
      bordered ? 'border-gray-200 dark:border-alt-dark-border' : 'border-transparent',
      elevated ? 'shadow-altoneo-pop' : 'shadow-sm',
      { 'transition-shadow hover:shadow-altoneo-pop': hoverable },
    ]"
  >
    <div
      v-if="$slots.header || title"
      class="border-b border-gray-100 dark:border-alt-dark-border"
      :class="paddingClass"
    >
      <slot name="header">
        <h3 class="font-semibold text-altoneo-800 dark:text-altoneo-50">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-500 dark:text-alt-dark-muted mt-0.5">{{ subtitle }}</p>
      </slot>
    </div>

    <div :class="bodyPadding ? paddingClass : ''">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="border-t border-gray-100 dark:border-alt-dark-border bg-gray-50 dark:bg-alt-dark-raised rounded-b-xl"
      :class="paddingClass"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  bordered: { type: Boolean, default: true },
  elevated: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  /** Applique le padding au corps (désactivez pour un contenu pleine largeur, ex: table). */
  bodyPadding: { type: Boolean, default: true },
  /** none | sm | md | lg */
  padding: { type: String, default: "md" },
});

const paddingClass = computed(
  () =>
    ({ none: "p-0", sm: "p-3", md: "p-6", lg: "p-8" })[props.padding] || "p-6",
);
</script>
