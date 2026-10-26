<template>
  <div
    v-if="!values.length"
    class="flex items-center border-b border-dashed text-[10px]"
    :style="{ width: `${width}px`, height: `${height}px`, borderColor: 'rgb(var(--alt-line) / 0.6)', color: 'rgb(var(--alt-fg-faint))', fontFamily: 'JetBrains Mono, monospace' }"
  >
    {{ emptyText }}
  </div>
  <div
    v-else
    class="relative"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <svg
      :width="width"
      :height="height"
      class="overflow-visible"
      role="img"
      :aria-label="`${label} : ${series.join(', ')}`"
      @pointermove="onMove"
      @pointerleave="hover = null"
    >
      <defs>
        <linearGradient
          :id="uid"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            :stop-color="color"
            stop-opacity="0.35"
          />
          <stop
            offset="1"
            :stop-color="color"
            stop-opacity="0"
          />
        </linearGradient>
      </defs>
      <path
        :d="area"
        :fill="`url(#${uid})`"
      />
      <path
        ref="line"
        :d="linePath"
        fill="none"
        :stroke="color"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <template v-if="hover !== null">
        <line
          :x1="pts[hover][0]"
          :x2="pts[hover][0]"
          y1="0"
          :y2="height"
          stroke="rgb(var(--alt-fg-faint))"
          stroke-dasharray="2 3"
        />
        <circle
          :cx="pts[hover][0]"
          :cy="pts[hover][1]"
          r="4"
          :fill="color"
          stroke="rgb(var(--alt-ink-800))"
          stroke-width="2"
        />
      </template>
      <rect
        :width="width"
        :height="height"
        fill="transparent"
      />
    </svg>
    <div
      v-if="hover !== null"
      class="alt-glass pointer-events-none absolute -top-9 z-10 whitespace-nowrap px-2 py-1 text-[11px]"
      :style="{ left: `${Math.min(width - 70, Math.max(0, pts[hover][0] - 30))}px`, color: 'rgb(var(--alt-fg))', fontFamily: 'JetBrains Mono, monospace' }"
    >
      {{ labels[hover] ?? `#${hover + 1}` }} · <b>{{ series[hover] }}</b>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { motionScale } from "../composables/useMotion.js";

/** Série unique, sans légende : ligne 2 px, aire en dégradé, réticule et valeur au survol. Le tracé se dessine à l'apparition. */
const props = defineProps({
  values: { type: Array, default: () => [] },
  labels: { type: Array, default: () => [] },
  width: { type: Number, default: 160 },
  height: { type: Number, default: 40 },
  color: { type: String, default: "rgb(var(--alt-neon-cyan))" },
  label: { type: String, default: "Évolution" },
  emptyText: { type: String, default: "pas encore d'historique" },
});

const line = ref(null);
const hover = ref(null);
const uid = `alt-sp-${Math.random().toString(36).slice(2, 8)}`;

// Une courbe demande deux points : une valeur unique donne un palier.
const series = computed(() => (props.values.length === 1 ? [props.values[0], props.values[0]] : props.values));
const min = computed(() => Math.min(...series.value));
const max = computed(() => Math.max(...series.value));
const pts = computed(() =>
  series.value.map((v, i) => [
    (i / (series.value.length - 1)) * props.width,
    props.height - 3 - ((v - min.value) / (max.value - min.value || 1)) * (props.height - 6),
  ]),
);
const linePath = computed(() => pts.value.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(""));
const area = computed(() => `${linePath.value}L${props.width},${props.height}L0,${props.height}Z`);

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const i = Math.round(((e.clientX - r.left) / r.width) * (series.value.length - 1));
  hover.value = Math.max(0, Math.min(series.value.length - 1, i));
}

onMounted(() => {
  const scale = motionScale();
  if (!line.value || !scale) return;
  const len = line.value.getTotalLength();
  line.value.animate([{ strokeDasharray: len, strokeDashoffset: len }, { strokeDasharray: len, strokeDashoffset: 0 }], { duration: 1400 * scale, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
});
</script>
