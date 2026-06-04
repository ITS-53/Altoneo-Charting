<template>
  <label
    class="inline-flex items-start gap-2"
    :class="disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'"
  >
    <input
      type="checkbox"
      class="mt-0.5 h-4 w-4 rounded border-gray-300 text-altoneo-500 focus:ring-altoneo-200 focus:ring-offset-0 disabled:cursor-not-allowed dark:border-alt-dark-border dark:bg-alt-dark-surface"
      :checked="isChecked"
      :value="value"
      :disabled="disabled"
      @change="onChange"
    />
    <span v-if="label || $slots.default" class="text-sm text-gray-700 dark:text-altoneo-100 select-none">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** Booléen, ou tableau quand `value` est fourni (groupe de cases). */
  modelValue: { type: [Boolean, Array], default: false },
  /** Valeur ajoutée/retirée du tableau (mode groupe). */
  value: { type: [String, Number, Boolean], default: undefined },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isArray = computed(() => Array.isArray(props.modelValue));

const isChecked = computed(() =>
  isArray.value ? props.modelValue.includes(props.value) : !!props.modelValue,
);

function onChange(e) {
  const checked = e.target.checked;
  if (isArray.value) {
    const next = [...props.modelValue];
    if (checked) {
      if (!next.includes(props.value)) next.push(props.value);
    } else {
      const i = next.indexOf(props.value);
      if (i !== -1) next.splice(i, 1);
    }
    emit("update:modelValue", next);
  } else {
    emit("update:modelValue", checked);
  }
  emit("change", checked);
}
</script>
