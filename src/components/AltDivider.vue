<template>
  <div
    v-if="vertical"
    class="inline-block w-px self-stretch bg-gray-200 dark:bg-alt-dark-border"
    role="separator"
    aria-orientation="vertical"
  />
  <div
    v-else
    class="flex items-center"
    :class="spacingClass"
    role="separator"
  >
    <span class="flex-1 h-px bg-gray-200 dark:bg-alt-dark-border" />
    <span
      v-if="label || $slots.default"
      class="px-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-alt-dark-muted"
    >
      <slot>{{ label }}</slot>
    </span>
    <span
      v-if="label || $slots.default"
      class="flex-1 h-px bg-gray-200 dark:bg-alt-dark-border"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  vertical: { type: Boolean, default: false },
  /** none | sm | md | lg — marge verticale (mode horizontal). */
  spacing: { type: String, default: "md" },
});

const spacingClass = computed(
  () => ({ none: "my-0", sm: "my-2", md: "my-4", lg: "my-8" })[props.spacing] || "my-4",
);
</script>
