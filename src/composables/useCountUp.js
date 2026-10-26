import { onBeforeUnmount, ref, watch } from "vue";
import { motionScale } from "./useMotion.js";

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Valeur qui « se calcule » jusqu'à sa cible (compteurs, notes, KPI).
 *   const shown = useCountUp(() => props.value, { duration: 1600 })
 */
export function useCountUp(source, { duration = 1600, from = 0 } = {}) {
  const shown = ref(from);
  let raf = 0;

  function run(target) {
    cancelAnimationFrame(raf);
    const goal = Number(target ?? 0);
    const scale = motionScale();
    if (!scale || typeof window === "undefined") return void (shown.value = goal);
    const start = shown.value;
    const t0 = performance.now();
    const total = duration * scale;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / total);
      shown.value = start + (goal - start) * easeOutExpo(t);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  watch(source, run, { immediate: true });
  onBeforeUnmount(() => cancelAnimationFrame(raf));
  return shown;
}
