<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-altoneo-50 dark:bg-alt-dark-app">
    <div class="text-center max-w-lg">
      <slot name="illustration">
        <p class="font-black leading-none text-altoneo-800 dark:text-altoneo-100 select-none" style="font-size: clamp(5rem, 18vw, 9rem)">
          {{ code }}
        </p>
      </slot>

      <h1 class="mt-2 text-2xl font-bold text-altoneo-800 dark:text-altoneo-50">{{ resolvedTitle }}</h1>
      <p class="mt-2 text-gray-500 dark:text-alt-dark-muted">{{ resolvedMessage }}</p>

      <div class="mt-8 flex items-center justify-center gap-3">
        <slot name="actions">
          <AltButton :href="homeHref" variant="primary">Retour à l'accueil</AltButton>
          <AltButton v-if="showRetry" variant="secondary" @click="$emit('retry')">Réessayer</AltButton>
        </slot>
      </div>

      <div v-if="$slots.footer" class="mt-6 text-sm text-gray-400">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import AltButton from "./AltButton.vue";

const PRESETS = {
  401: { title: "Non authentifié", message: "Vous devez vous connecter pour accéder à cette page." },
  403: { title: "Accès refusé", message: "Vous n'avez pas les droits nécessaires pour consulter cette ressource." },
  404: { title: "Page introuvable", message: "La page que vous recherchez n'existe pas ou a été déplacée." },
  500: { title: "Erreur interne", message: "Une erreur inattendue est survenue de notre côté. Réessayez dans un instant." },
  502: { title: "Passerelle invalide", message: "Le serveur a reçu une réponse invalide. Le service est peut-être momentanément indisponible." },
  503: { title: "Service indisponible", message: "Le service est temporairement indisponible, probablement pour maintenance." },
};

const props = defineProps({
  /** 401 | 403 | 404 | 500 | 502 | 503 (ou tout code/texte personnalisé). */
  code: { type: [Number, String], default: 404 },
  /** Surcharge le titre du preset. */
  title: { type: String, default: "" },
  /** Surcharge le message du preset. */
  message: { type: String, default: "" },
  homeHref: { type: String, default: "/" },
  /** Affiche un bouton « Réessayer » (émet @retry). */
  showRetry: { type: Boolean, default: false },
});

defineEmits(["retry"]);

const preset = computed(() => PRESETS[props.code] || {});
const resolvedTitle = computed(() => props.title || preset.value.title || "Une erreur est survenue");
const resolvedMessage = computed(() => props.message || preset.value.message || "");
</script>
