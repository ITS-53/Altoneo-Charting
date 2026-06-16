<template>
  <div
    v-if="visible"
    class="flex gap-3 rounded-lg border p-4 animate-altoneo-fade-in"
    :class="variantClass"
    role="alert"
  >
    <div class="shrink-0 mt-0.5">
      <slot name="icon">
        <svg
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            :d="iconPath"
            fill-rule="evenodd"
            clip-rule="evenodd"
          />
        </svg>
      </slot>
    </div>

    <div class="flex-1 min-w-0">
      <p
        v-if="title"
        class="font-semibold"
      >
        {{ title }}
      </p>
      <div
        class="text-sm"
        :class="{ 'mt-0.5': title }"
      >
        <slot>{{ message }}</slot>
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      aria-label="Fermer"
      @click="close"
    >
      <svg
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  /** info | success | warning | error */
  variant: { type: String, default: "info" },
  title: { type: String, default: "" },
  message: { type: String, default: "" },
  dismissible: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);
const visible = ref(true);

function close() {
  visible.value = false;
  emit("close");
}

const variantClass = computed(
  () =>
    ({
      info: "bg-altoneo-50 border-altoneo-400 text-altoneo-800 dark:bg-alt-dark-surface dark:border-alt-dark-link dark:text-altoneo-50",
      success: "bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200",
      warning: "bg-altoneo-100/60 border-altoneo-200 text-altoneo-900 dark:bg-altoneo-200/10 dark:border-altoneo-300 dark:text-altoneo-100",
      error: "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-200",
    })[props.variant] || "bg-altoneo-50 border-altoneo-400 text-altoneo-800 dark:bg-alt-dark-surface dark:border-alt-dark-link dark:text-altoneo-50",
);

const iconPath = computed(
  () =>
    ({
      info: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
      success:
        "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
      warning:
        "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
      error:
        "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
    })[props.variant] || "",
);
</script>
