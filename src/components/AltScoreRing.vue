<template>
  <div
    class="relative inline-grid place-items-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="value === null ? `${label} : non évalué` : `${label} : ${value} sur ${max}${grade ? `, grade ${grade}` : ''}`"
  >
    <svg
      :width="size"
      :height="size"
      class="-rotate-90 overflow-visible"
    >
      <defs>
        <!-- Lueur en filtre SVG (zone élargie) : un drop-shadow CSS serait rogné en carré par le cadre du SVG. -->
        <filter
          :id="glowId"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            :stdDeviation="Math.max(3, stroke * 0.7)"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        v-if="ticks"
        :transform="`translate(${size / 2} ${size / 2})`"
      >
        <line
          v-for="t in 40"
          :key="t"
          :x1="r + stroke / 2 + 3"
          :x2="r + stroke / 2 + 6"
          stroke="rgb(var(--alt-line))"
          stroke-width="1"
          :opacity="(t - 1) / 40 <= ratio ? 0.9 : 0.3"
          :transform="`rotate(${(t - 1) * 9})`"
        />
      </g>
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        fill="none"
        stroke="rgb(var(--alt-line) / 0.35)"
        :stroke-width="stroke"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        fill="none"
        :stroke="tone"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circ"
        :stroke-dashoffset="circ * (1 - ratio)"
        :filter="value === null || !glow ? undefined : `url(#${glowId})`"
      />
    </svg>
    <div class="absolute inset-0 grid place-items-center text-center">
      <div>
        <div
          class="alt-display leading-none"
          :style="{ fontSize: `${size * 0.28}px`, color: 'rgb(var(--alt-fg))' }"
        >
          {{ value === null ? "—" : Math.round(shown) }}
        </div>
        <div
          v-if="caption || grade || value === null"
          class="mt-1 font-semibold"
          :style="{ color: tone, fontSize: `${Math.max(10, size * 0.1)}px`, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }"
        >
          {{ value === null ? "NON ÉVALUÉ" : caption || `GRADE ${grade}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCountUp } from "../composables/useCountUp.js";

/**
 * Anneau de note : l'arc et le chiffre « se calculent » à l'apparition, la couleur et le
 * grade suivent la valeur affichée. value = null : jamais évalué, aucune note inventée.
 */
const props = defineProps({
  value: { type: Number, default: null },
  max: { type: Number, default: 100 },
  size: { type: Number, default: 120 },
  stroke: { type: Number, default: 8 },
  label: { type: String, default: "Note" },
  /** Texte sous le chiffre ; par défaut « GRADE X ». */
  caption: { type: String, default: "" },
  /** Graduations autour de l'anneau. */
  ticks: { type: Boolean, default: true },
  glow: { type: Boolean, default: true },
  /** Couleur imposée (CSS) ; sinon déduite du grade. */
  color: { type: String, default: "" },
  /** Seuils des grades A→E sur 100 (en dessous du dernier : F). */
  thresholds: { type: Array, default: () => [90, 80, 70, 60, 50] },
});

const GRADES = ["A", "B", "C", "D", "E"];
const COLORS = {
  A: "rgb(var(--alt-neon-mint))",
  B: "rgb(var(--alt-neon-cyan))",
  C: "rgb(var(--alt-gold))",
  D: "rgb(var(--alt-tangerine))",
  E: "rgb(var(--alt-sev-high))",
  F: "rgb(var(--alt-sev-critical))",
};

const shown = useCountUp(() => props.value ?? 0);
const ratio = computed(() => Math.max(0, Math.min(1, shown.value / props.max)));
const grade = computed(() => {
  if (props.value === null) return "";
  const pct = (shown.value / props.max) * 100;
  const i = props.thresholds.findIndex((t) => pct >= t);
  return i === -1 ? "F" : GRADES[i];
});
const tone = computed(() => (props.value === null ? "rgb(var(--alt-fg-faint))" : props.color || COLORS[grade.value]));
const r = computed(() => (props.size - props.stroke) / 2 - 6);
const circ = computed(() => 2 * Math.PI * r.value);
const glowId = `alt-ring-${Math.random().toString(36).slice(2, 8)}`;
</script>
