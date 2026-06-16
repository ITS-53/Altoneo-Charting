<template>
  <div class="relative">
    <span
      v-if="$slots.prefix"
      class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none"
    >
      <slot name="prefix" />
    </span>

    <input
      :id="id"
      ref="inputEl"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="state === 'error' ? 'true' : undefined"
      class="block w-full rounded-lg border bg-white text-sm shadow-sm placeholder-gray-400 transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-alt-dark-surface dark:text-altoneo-50 dark:placeholder-slate-500 dark:disabled:bg-alt-dark-app"
      :class="[stateClass, sizeClass, { 'pl-9': $slots.prefix, 'pr-9': $slots.suffix }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >

    <span
      v-if="$slots.suffix"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: undefined },
  id: { type: String, default: undefined },
  /** default | error | success — pilote bordure et anneau de focus. */
  state: { type: String, default: "default" },
  /** sm | md | lg */
  size: { type: String, default: "md" },
});

defineEmits(["update:modelValue", "blur", "focus"]);

const inputEl = ref(null);
defineExpose({ focus: () => inputEl.value?.focus(), el: inputEl });

const stateClass = computed(
  () =>
    ({
      default:
        "border-gray-300 dark:border-alt-dark-border focus:border-altoneo-200 focus:ring-altoneo-200",
      error: "border-red-400 focus:border-red-500 focus:ring-red-500",
      success: "border-green-400 focus:border-green-500 focus:ring-green-500",
    })[props.state] || "",
);

const sizeClass = computed(
  () =>
    ({
      sm: "px-2.5 py-1.5 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-3.5 py-2.5 text-base",
    })[props.size] || "px-3 py-2 text-sm",
);
</script>
