<template>
  <span
    class="block animate-pulse bg-gray-200 dark:bg-alt-dark-raised"
    :class="shapeClass"
    :style="style"
    aria-hidden="true"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** text | rect | circle */
  variant: { type: String, default: "text" },
  width: { type: String, default: "" },
  height: { type: String, default: "" },
  /** Arrondi (mode rect). */
  rounded: { type: String, default: "rounded-lg" },
});

const shapeClass = computed(() => {
  if (props.variant === "circle") return "rounded-full";
  if (props.variant === "text") return "rounded h-4";
  return props.rounded;
});

const style = computed(() => {
  const s = {};
  if (props.width) s.width = props.width;
  if (props.height) s.height = props.height;
  if (props.variant === "circle" && !props.height) s.height = props.width || "2.5rem";
  if (props.variant === "rect" && !props.height) s.height = "6rem";
  return s;
});
</script>
