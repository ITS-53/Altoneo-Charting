<template>
  <div class="bg-white dark:bg-alt-dark-surface rounded-xl border border-gray-200 dark:border-alt-dark-border shadow-sm p-5">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-sm font-medium text-gray-500 dark:text-alt-dark-muted truncate">
          {{ label }}
        </p>
        <p class="mt-1 text-2xl font-bold text-altoneo-800 dark:text-altoneo-50">
          {{ value }}
        </p>
      </div>
      <div
        v-if="$slots.icon"
        class="shrink-0 w-10 h-10 rounded-lg bg-altoneo-50 dark:bg-alt-dark-raised text-altoneo-500 dark:text-altoneo-100 flex items-center justify-center"
      >
        <slot name="icon" />
      </div>
    </div>

    <div
      v-if="delta !== null || hint"
      class="mt-3 flex items-center gap-2 text-sm"
    >
      <span
        v-if="delta !== null"
        class="inline-flex items-center gap-0.5 font-semibold"
        :class="deltaClass"
      >
        <svg
          class="w-3.5 h-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            v-if="delta >= 0"
            fill-rule="evenodd"
            d="M10 5a1 1 0 01.7.3l4 4a1 1 0 11-1.4 1.4L10 7.42 6.7 10.7a1 1 0 11-1.4-1.4l4-4A1 1 0 0110 5z"
            clip-rule="evenodd"
          />
          <path
            v-else
            fill-rule="evenodd"
            d="M10 15a1 1 0 01-.7-.3l-4-4a1 1 0 011.4-1.4L10 12.58l3.3-3.28a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z"
            clip-rule="evenodd"
          />
        </svg>
        {{ Math.abs(delta) }}{{ deltaSuffix }}
      </span>
      <span
        v-if="hint"
        class="text-gray-400 dark:text-alt-dark-muted"
      >{{ hint }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  /** Variation (nombre). null = masqué. Positif = vert, négatif = rouge. */
  delta: { type: Number, default: null },
  deltaSuffix: { type: String, default: "%" },
  /** Inverse la couleur (utile quand une baisse est positive). */
  invertDelta: { type: Boolean, default: false },
  hint: { type: String, default: "" },
});

const deltaClass = computed(() => {
  const positive = props.invertDelta ? props.delta < 0 : props.delta >= 0;
  return positive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
});
</script>
