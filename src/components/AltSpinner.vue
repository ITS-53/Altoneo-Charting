<template>
  <svg
    class="animate-spin"
    :class="sizeClass"
    :style="{ color }"
    fill="none"
    viewBox="0 0 24 24"
    role="status"
    :aria-label="label"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      class="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** xs | sm | md | lg | xl */
  size: { type: String, default: "md" },
  /** Couleur CSS (par défaut : courante / currentColor hérité). */
  color: { type: String, default: "currentColor" },
  label: { type: String, default: "Chargement…" },
});

const sizeClass = computed(
  () =>
    ({
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    })[props.size] || "w-5 h-5",
);
</script>
