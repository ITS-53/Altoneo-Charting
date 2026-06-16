<template>
  <button
    type="button"
    class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-alt-dark-border bg-white dark:bg-alt-dark-surface text-altoneo-800 dark:text-altoneo-100 hover:bg-altoneo-50 dark:hover:bg-alt-dark-raised transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-altoneo-400"
    :aria-pressed="isDark ? 'true' : 'false'"
    :title="isDark ? 'Passer en thème clair' : 'Passer en thème sombre'"
    @click="toggle"
  >
    <svg
      v-if="isDark"
      class="w-5 h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clip-rule="evenodd"
      />
    </svg>
    <svg
      v-else
      class="w-5 h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
    <span class="sr-only">{{ isDark ? "Thème sombre actif" : "Thème clair actif" }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  /** Élément cible portant la classe `.dark`. Par défaut <html>. */
  target: { type: String, default: "html" },
  /** Clé localStorage pour mémoriser le choix (vide = pas de persistance). */
  storageKey: { type: String, default: "altoneo-theme" },
});

const emit = defineEmits(["change"]);
const isDark = ref(false);

function el() {
  if (typeof document === "undefined") return null;
  return props.target === "html" ? document.documentElement : document.querySelector(props.target);
}

function apply(dark) {
  isDark.value = dark;
  el()?.classList.toggle("dark", dark);
  if (props.storageKey && typeof localStorage !== "undefined") {
    localStorage.setItem(props.storageKey, dark ? "dark" : "light");
  }
  emit("change", dark);
}

function toggle() {
  apply(!isDark.value);
}

onMounted(() => {
  let dark = el()?.classList.contains("dark") ?? false;
  if (props.storageKey && typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(props.storageKey);
    if (saved) dark = saved === "dark";
  }
  apply(dark);
});

defineExpose({ isDark, toggle });
</script>
