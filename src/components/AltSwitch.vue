<template>
  <label
    class="inline-flex items-center gap-3 align-middle"
    :class="disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'"
  >
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue ? 'true' : 'false'"
      :disabled="disabled"
      class="relative inline-flex shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-altoneo-400 focus-visible:ring-offset-1"
      :class="[trackSize, modelValue ? 'bg-altoneo-500' : 'bg-gray-300 dark:bg-alt-dark-raised']"
      @click="toggle"
    >
      <span
        class="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-200 ease-in-out"
        :class="knobSize"
        :style="{ left: modelValue ? knobOnLeft : '0.125rem' }"
      />
    </button>
    <span v-if="label || $slots.default" class="text-sm text-gray-700 dark:text-altoneo-100 select-none">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  /** sm | md */
  size: { type: String, default: "md" },
});

const emit = defineEmits(["update:modelValue", "change"]);

function toggle() {
  if (props.disabled) return;
  emit("update:modelValue", !props.modelValue);
  emit("change", !props.modelValue);
}

const trackSize = computed(() => (props.size === "sm" ? "h-5 w-9" : "h-6 w-11"));
const knobSize = computed(() => (props.size === "sm" ? "h-4 w-4" : "h-5 w-5"));
// Position « on » = largeur piste − largeur knob − marge gauche (0.125rem)
const knobOnLeft = computed(() =>
  props.size === "sm" ? "1.125rem" : "1.375rem",
);
</script>
