import { computed, readonly, ref } from "vue";

/**
 * Intensité des animations, partagée par toute l'application :
 *   cinema = tout (défaut) · sober = court, sans effets décoratifs · none = états finaux immédiats.
 * Posée en attribut data-alt-motion sur <html> (lu par next.css) et mémorisée localement.
 * « prefers-reduced-motion » l'emporte toujours.
 */
const KEY = "alt-motion";
const LEVELS = ["cinema", "sober", "none"];

function initial() {
  if (typeof window === "undefined") return "cinema";
  try {
    const saved = localStorage.getItem(KEY);
    if (LEVELS.includes(saved)) return saved;
  } catch {
    /* stockage indisponible */
  }
  return "cinema";
}

const level = ref(initial());
const reduced = ref(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

if (typeof window !== "undefined") {
  document.documentElement.dataset.altMotion = level.value;
  window.matchMedia?.("(prefers-reduced-motion: reduce)").addEventListener?.("change", (e) => (reduced.value = e.matches));
}

/** Facteur appliqué aux durées : 1, 0.45 ou 0. */
export function motionScale() {
  if (reduced.value) return 0;
  return level.value === "cinema" ? 1 : level.value === "sober" ? 0.45 : 0;
}

export function isCinema() {
  return !reduced.value && level.value === "cinema";
}

export function setMotion(next) {
  if (!LEVELS.includes(next)) return;
  level.value = next;
  if (typeof window === "undefined") return;
  document.documentElement.dataset.altMotion = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* stockage indisponible */
  }
}

export function useMotion() {
  return {
    level: readonly(level),
    reduced: readonly(reduced),
    scale: computed(() => motionScale()),
    cinema: computed(() => isCinema()),
    setMotion,
    levels: LEVELS,
  };
}
