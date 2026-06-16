<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="state === 'error' ? 'true' : undefined"
      class="block w-full appearance-none rounded-lg border bg-white pl-3 pr-9 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-alt-dark-surface dark:text-altoneo-50 dark:disabled:bg-alt-dark-app"
      :class="[stateClass, { 'text-gray-400': modelValue === '' && placeholder }]"
      @change="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
      >
        {{ placeholder }}
      </option>
      <slot>
        <option
          v-for="opt in normalizedOptions"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >
          {{ opt.label }}
        </option>
      </slot>
    </select>

    <svg
      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  /** Tableau de strings ou d'objets { value, label, disabled }. */
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  /** default | error | success */
  state: { type: String, default: "default" },
});

defineEmits(["update:modelValue", "blur"]);

const normalizedOptions = computed(() =>
  props.options.map((o) =>
    typeof o === "object" ? o : { value: o, label: String(o) },
  ),
);

const stateClass = computed(
  () =>
    ({
      default: "border-gray-300 dark:border-alt-dark-border focus:border-altoneo-200 focus:ring-altoneo-200",
      error: "border-red-400 focus:border-red-500 focus:ring-red-500",
      success: "border-green-400 focus:border-green-500 focus:ring-green-500",
    })[props.state] || "",
);
</script>
