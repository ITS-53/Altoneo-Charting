<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :rows="rows"
    :maxlength="maxlength"
    :aria-invalid="state === 'error' ? 'true' : undefined"
    class="block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-alt-dark-surface dark:text-altoneo-50 dark:placeholder-slate-500 dark:disabled:bg-alt-dark-app"
    :class="[stateClass, { 'resize-none': !resize }]"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  rows: { type: [Number, String], default: 4 },
  maxlength: { type: [Number, String], default: undefined },
  resize: { type: Boolean, default: true },
  id: { type: String, default: undefined },
  /** default | error | success */
  state: { type: String, default: "default" },
});

defineEmits(["update:modelValue", "blur", "focus"]);

const stateClass = computed(
  () =>
    ({
      default: "border-gray-300 dark:border-alt-dark-border focus:border-altoneo-200 focus:ring-altoneo-200",
      error: "border-red-400 focus:border-red-500 focus:ring-red-500",
      success: "border-green-400 focus:border-green-500 focus:ring-green-500",
    })[props.state] || "",
);
</script>
