<template>
  <div :class="{ 'opacity-60': disabled }">
    <label
      v-if="label"
      :for="fieldId"
      class="block text-sm font-semibold text-altoneo-800 dark:text-altoneo-50 mb-1"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
        aria-hidden="true"
      >*</span>
    </label>

    <slot
      :id="fieldId"
      :has-error="!!error"
      :described-by="describedBy"
    />

    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      :id="`${fieldId}-hint`"
      class="mt-1 text-sm text-gray-500 dark:text-alt-dark-muted"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, useId } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  /** Message d'erreur ; sa présence bascule le champ en état "erreur". */
  error: { type: String, default: "" },
  /** Aide affichée sous le champ quand il n'y a pas d'erreur. */
  hint: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** Force un id (sinon généré). */
  id: { type: String, default: "" },
});

// useId existe depuis Vue 3.5 ; fallback si indisponible.
const generated =
  typeof useId === "function" ? useId() : `alt-${Math.random().toString(36).slice(2, 9)}`;
const fieldId = computed(() => props.id || generated);

const describedBy = computed(() =>
  props.error
    ? `${fieldId.value}-error`
    : props.hint
      ? `${fieldId.value}-hint`
      : undefined,
);
</script>
