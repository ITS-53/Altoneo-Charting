<template>
  <div
    ref="root"
    class="alt-glass relative inline-flex p-0.5"
    role="radiogroup"
    :aria-label="label"
    @keydown="onKey"
  >
    <!-- Pastille qui glisse sous l'option active. -->
    <span
      class="pointer-events-none absolute inset-y-0.5 rounded-lg transition-all"
      :style="{ left: `${pill.left}px`, width: `${pill.width}px`, background: 'rgb(var(--alt-ink-700))', transitionDuration: `calc(350ms * var(--alt-motion))`, transitionTimingFunction: 'var(--alt-ease-out)' }"
    />
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      role="radio"
      :aria-checked="o.value === modelValue"
      :tabindex="o.value === modelValue ? 0 : -1"
      class="alt-focus-ring relative z-[1] rounded-lg px-3 py-1 text-xs font-medium transition-colors"
      :style="{ color: o.value === modelValue ? 'rgb(var(--alt-gold))' : 'rgb(var(--alt-fg-faint))' }"
      @click="select(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";

/** Choix exclusif compact (intensité des animations, période, vue…), accessible au clavier (flèches). */
const props = defineProps({
  modelValue: { type: [String, Number], required: true },
  /** [{ value, label }] */
  options: { type: Array, required: true },
  label: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const root = ref(null);
const pill = reactive({ left: 2, width: 0 });

function place() {
  const i = props.options.findIndex((o) => o.value === props.modelValue);
  const btn = root.value?.querySelectorAll("button")[i];
  if (!btn) return;
  pill.left = btn.offsetLeft;
  pill.width = btn.offsetWidth;
}
function select(v) {
  emit("update:modelValue", v);
}
function onKey(e) {
  if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
  e.preventDefault();
  const i = props.options.findIndex((o) => o.value === props.modelValue);
  const n = props.options.length;
  const next = props.options[(i + (e.key === "ArrowRight" ? 1 : n - 1)) % n];
  select(next.value);
  nextTick(() => root.value?.querySelectorAll("button")[props.options.indexOf(next)]?.focus());
}

onMounted(place);
watch(() => props.modelValue, () => nextTick(place));
</script>
