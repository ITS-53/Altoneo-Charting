<template>
  <div
    role="radiogroup"
    :class="inline ? 'flex flex-wrap gap-4' : 'space-y-2'"
  >
    <label
      v-for="opt in normalizedOptions"
      :key="opt.value"
      class="inline-flex items-center gap-2"
      :class="disabled || opt.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'"
    >
      <input
        type="radio"
        class="h-4 w-4 border-gray-300 text-altoneo-500 focus:ring-altoneo-200 focus:ring-offset-0 dark:border-alt-dark-border dark:bg-alt-dark-surface"
        :name="name"
        :value="opt.value"
        :checked="modelValue === opt.value"
        :disabled="disabled || opt.disabled"
        @change="$emit('update:modelValue', opt.value)"
      >
      <span class="text-sm text-gray-700 dark:text-altoneo-100 select-none">{{ opt.label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed, useId } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: undefined },
  /** Tableau de strings ou d'objets { value, label, disabled }. */
  options: { type: Array, default: () => [] },
  name: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);

const generated = typeof useId === "function" ? useId() : `radio-${Math.random().toString(36).slice(2, 8)}`;
const name = computed(() => props.name || generated);

const normalizedOptions = computed(() =>
  props.options.map((o) =>
    typeof o === "object" ? o : { value: o, label: String(o) },
  ),
);
</script>
