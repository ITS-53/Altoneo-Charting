<template>
  <img
    :src="resolvedSrc"
    :alt="resolvedAlt"
    :style="{ height: size + 'px', width: 'auto' }"
    class="block select-none"
    draggable="false"
  >
</template>

<script setup>
import { computed } from "vue";
import logoLight from "../assets/logo-altoneo-light.png";
import logoDark from "../assets/logo-altoneo-dark.png";
import itsWhite from "../assets/its-logo-white.png";

const props = defineProps({
  /** Hauteur en px (largeur proportionnelle automatique). */
  size: { type: [Number, String], default: 36 },
  /**
   * 'light' = logo pour fond CLAIR.
   * 'dark'  = logo pour fond SOMBRE (navbar/header navy, thème sombre).
   */
  variant: { type: String, default: "light" },
  /** Marque à afficher : 'altoneo' (défaut) ou 'its' (IT Solutions). */
  brand: { type: String, default: "altoneo" },
  /** Surcharge complète de la source (prioritaire sur brand/variant). */
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
});

const resolvedSrc = computed(() => {
  if (props.src) return props.src;
  if (props.brand === "its") return itsWhite; // ITS : version blanche (fond sombre/coloré)
  return props.variant === "dark" ? logoDark : logoLight;
});

const resolvedAlt = computed(
  () => props.alt || (props.brand === "its" ? "IT Solutions" : "Altonéo"),
);
</script>
