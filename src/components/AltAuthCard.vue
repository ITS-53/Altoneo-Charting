<template>
  <div
    class="relative w-full flex items-center justify-center p-4 overflow-hidden"
    :class="centered ? 'min-h-screen' : 'min-h-full'"
    :style="background ? bgStyle : null"
  >
    <!-- Décor : halos lumineux + vague de marque -->
    <template v-if="background">
      <div class="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-30 blur-3xl" style="background: radial-gradient(circle, #f9b233 0%, transparent 70%)" />
      <div class="pointer-events-none absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full opacity-25 blur-3xl" style="background: radial-gradient(circle, #2d519f 0%, transparent 70%)" />
      <svg class="pointer-events-none absolute bottom-0 left-0 w-full opacity-[0.07]" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#ffffff" d="M0,160 C320,260 640,60 960,120 C1200,170 1320,240 1440,200 L1440,320 L0,320 Z" />
      </svg>
    </template>

    <div class="relative w-full" :class="maxWidthClass">
      <div class="bg-white dark:bg-alt-dark-surface rounded-2xl shadow-altoneo-pop border border-gray-100 dark:border-alt-dark-border p-8">
        <!-- En-tête : logo + titre -->
        <div class="mb-6 text-center">
          <div class="flex justify-center mb-4">
            <slot name="logo">
              <AltLogo :size="48" :brand="brand" variant="light" />
            </slot>
          </div>
          <h1 v-if="title" class="text-xl font-bold text-altoneo-800 dark:text-altoneo-50">{{ title }}</h1>
          <p v-if="subtitle" class="text-sm text-gray-500 dark:text-alt-dark-muted mt-1">{{ subtitle }}</p>
        </div>

        <slot />

        <div v-if="$slots.footer" class="mt-6 text-center text-sm text-gray-500 dark:text-alt-dark-muted">
          <slot name="footer" />
        </div>
      </div>

      <div v-if="$slots.below" class="mt-4 text-center text-sm text-white/80">
        <slot name="below" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import AltLogo from "./AltLogo.vue";

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  /** Centre verticalement sur toute la hauteur de l'écran. */
  centered: { type: Boolean, default: true },
  /** Fond de marque (dégradé navy + décor) derrière la carte. */
  background: { type: Boolean, default: true },
  /** Marque du logo par défaut : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
  /** sm | md | lg */
  size: { type: String, default: "sm" },
});

const maxWidthClass = computed(
  () => ({ sm: "max-w-md", md: "max-w-lg", lg: "max-w-xl" })[props.size] || "max-w-md",
);

const bgStyle = {
  background:
    "radial-gradient(120% 120% at 50% 0%, #233a73 0%, #1c284d 45%, #131c36 100%)",
};
</script>
