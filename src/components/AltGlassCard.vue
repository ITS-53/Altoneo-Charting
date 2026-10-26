<template>
  <component
    :is="tag"
    v-alt-spotlight="spotlight"
    class="alt-glass-hi"
    :class="[
      accent !== 'none' && 'alt-accent',
      accent === 'left' && 'alt-accent-left',
      sheen && 'alt-sheen',
      neon && 'alt-neon-hover',
      paddingClass,
    ]"
    :style="accentColor ? { '--alt-accent': accentColor } : undefined"
  >
    <span
      v-if="sheen"
      class="alt-sheen-ray"
    />
    <div
      v-if="shine"
      class="alt-shine"
    />
    <div
      v-if="eyebrow || title || $slots.actions"
      class="relative mb-3 flex items-start gap-3"
    >
      <div class="min-w-0 flex-1">
        <div
          v-if="eyebrow"
          class="alt-eyebrow"
        >
          {{ eyebrow }}
        </div>
        <h3
          v-if="title"
          class="alt-display text-lg"
          :style="{ color: 'rgb(var(--alt-fg))' }"
        >
          {{ title }}
        </h3>
      </div>
      <slot name="actions" />
    </div>
    <div class="relative">
      <slot />
    </div>
  </component>
</template>

<script setup>
import { computed } from "vue";
import { vAltSpotlight as spotlightDirective } from "../directives/index.js";

/**
 * Carte « premium » Altonéo Next : verre dépoli, liseré lumineux (bas ou gauche, dans la
 * couleur d'accent), halo qui suit le pointeur, reflet au survol, surbrillance néon.
 */
const props = defineProps({
  title: { type: String, default: "" },
  eyebrow: { type: String, default: "" },
  /** bottom (or) | left (couleur d'accent, ex. sévérité) | none */
  accent: { type: String, default: "bottom" },
  /** Triplet RGB « 255 61 113 » ou variable « var(--alt-sev-critical) ». */
  accentColor: { type: String, default: "" },
  spotlight: { type: Boolean, default: true },
  sheen: { type: Boolean, default: false },
  neon: { type: Boolean, default: false },
  /** Reflet périodique (bandeau héros). */
  shine: { type: Boolean, default: false },
  /** none | sm | md | lg */
  padding: { type: String, default: "md" },
  tag: { type: String, default: "div" },
});

// La directive n'est posée que si le halo est voulu.
const vAltSpotlight = {
  mounted: (el, b) => b.value && spotlightDirective.mounted(el),
  unmounted: (el) => spotlightDirective.unmounted(el),
};

const paddingClass = computed(() => ({ none: "", sm: "p-3", md: "p-5", lg: "p-7" })[props.padding] ?? "p-5");
</script>
