<template>
  <component
    :is="tag"
    :type="isNativeButton ? type : undefined"
    :href="href"
    :disabled="isNativeButton ? disabled || loading : undefined"
    :aria-disabled="!isNativeButton && (disabled || loading) ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    class="inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-altoneo-400 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClass, sizeClass, { 'w-full': block }]"
    @click="onClick"
  >
    <AltSpinner v-if="loading" :size="spinnerSize" />
    <slot v-else name="icon-left" />
    <slot v-if="$slots.default" />
    <slot name="icon-right" />
  </component>
</template>

<script setup>
import { computed } from "vue";
import AltSpinner from "./AltSpinner.vue";

const props = defineProps({
  /** primary | secondary | danger | ghost | navy */
  variant: { type: String, default: "primary" },
  /** xs | sm | md | lg */
  size: { type: String, default: "md" },
  /** Rendu en <button> par défaut ; passez `href` pour un <a>. */
  href: { type: String, default: undefined },
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  /** Pleine largeur. */
  block: { type: Boolean, default: false },
});

const emit = defineEmits(["click"]);

const tag = computed(() => (props.href ? "a" : "button"));
const isNativeButton = computed(() => !props.href);

const variantClass = computed(
  () =>
    ({
      primary:
        "bg-altoneo-200 text-altoneo-800 shadow-sm hover:bg-altoneo-300 active:bg-altoneo-300",
      secondary:
        "bg-white text-altoneo-800 border border-altoneo-800 hover:bg-altoneo-50 dark:bg-transparent dark:text-altoneo-50 dark:border-alt-dark-border dark:hover:bg-alt-dark-raised",
      navy: "bg-altoneo-800 text-white hover:bg-altoneo-900 active:bg-altoneo-900 dark:bg-alt-dark-raised dark:hover:bg-altoneo-700",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
      ghost: "bg-transparent text-altoneo-800 hover:bg-altoneo-50 dark:text-altoneo-50 dark:hover:bg-alt-dark-raised",
    })[props.variant] || "",
);

const sizeClass = computed(
  () =>
    ({
      xs: "text-xs px-2.5 py-1",
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-5 py-2.5",
    })[props.size] || "text-sm px-4 py-2",
);

const spinnerSize = computed(
  () => ({ xs: "xs", sm: "xs", md: "sm", lg: "sm" })[props.size] || "sm",
);

function onClick(event) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit("click", event);
}
</script>
