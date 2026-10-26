<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    class="shrink-0"
  >
    <title v-if="label">{{ label }}</title>
    <path :d="d" />
  </svg>
</template>

<script setup>
import { computed } from "vue";
import { ICONS } from "../icons/registry.js";

const props = defineProps({
  /** Nom dans la bibliothèque d'icônes (cf. ICON_NAMES). */
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  stroke: { type: [Number, String], default: 1.8 },
  /** Libellé accessible ; sans libellé, l'icône est décorative (aria-hidden). */
  label: { type: String, default: "" },
});

const d = computed(() => {
  if (!ICONS[props.name] && import.meta.env?.DEV) console.warn(`[AltIcon] icône inconnue : ${props.name}`);
  return ICONS[props.name] ?? ICONS.help;
});
</script>
