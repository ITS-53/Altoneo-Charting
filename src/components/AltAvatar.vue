<template>
  <span
    class="inline-flex items-center justify-center rounded-full overflow-hidden font-semibold select-none shrink-0"
    :class="sizeClass"
    :style="!src ? { backgroundColor: bgColor, color: '#fff' } : null"
    :title="name || undefined"
  >
    <img
      v-if="src"
      :src="src"
      :alt="name || 'avatar'"
      class="w-full h-full object-cover"
    >
    <slot v-else>{{ initials }}</slot>
  </span>
</template>

<script setup>
import { computed } from "vue";
import { chartPalette } from "../tokens/colors.js";

const props = defineProps({
  name: { type: String, default: "" },
  src: { type: String, default: "" },
  /** xs | sm | md | lg | xl */
  size: { type: String, default: "md" },
});

const initials = computed(() => {
  const parts = props.name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

/** Couleur de fond stable, dérivée du nom. */
const bgColor = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return chartPalette[Math.abs(hash) % chartPalette.length];
});

const sizeClass = computed(
  () =>
    ({
      xs: "w-6 h-6 text-[10px]",
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-lg",
    })[props.size] || "w-10 h-10 text-sm",
);
</script>
