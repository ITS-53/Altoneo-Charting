<template>
  <div>
    <div v-if="label || showValue" class="flex items-center justify-between mb-1 text-sm">
      <span class="font-medium text-altoneo-800 dark:text-altoneo-100">{{ label }}</span>
      <span v-if="showValue" class="text-gray-500 dark:text-alt-dark-muted">{{ percent }}%</span>
    </div>
    <div
      class="w-full overflow-hidden rounded-full bg-gray-200 dark:bg-alt-dark-raised"
      :class="sizeClass"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : value"
      :aria-valuemin="0"
      :aria-valuemax="max"
    >
      <div
        class="h-full rounded-full transition-[width] duration-300"
        :class="[variantClass, { 'animate-pulse': indeterminate }]"
        :style="{ width: indeterminate ? '100%' : percent + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  /** primary | navy | success | danger */
  variant: { type: String, default: "primary" },
  /** sm | md | lg */
  size: { type: String, default: "md" },
  label: { type: String, default: "" },
  showValue: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
});

const percent = computed(() =>
  Math.max(0, Math.min(100, Math.round((props.value / props.max) * 100))),
);

const variantClass = computed(
  () =>
    ({
      primary: "bg-altoneo-200",
      navy: "bg-altoneo-600",
      success: "bg-green-500",
      danger: "bg-red-500",
    })[props.variant] || "bg-altoneo-200",
);

const sizeClass = computed(
  () => ({ sm: "h-1.5", md: "h-2.5", lg: "h-4" })[props.size] || "h-2.5",
);
</script>
