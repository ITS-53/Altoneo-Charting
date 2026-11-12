<script setup>
/** Un contrôle du panneau : bascule, choix, plage, nombre, texte ou JSON. */
import { computed, ref, watch } from "vue";
import AltSegmented from "../../../src/components/AltSegmented.vue";
import AltSwitch from "../../../src/components/AltSwitch.vue";
import { literal } from "../core/controls.js";

const props = defineProps({
  control: { type: Object, required: true },
  modelValue: { type: null, default: undefined },
});
const emit = defineEmits(["update:modelValue"]);

const c = computed(() => props.control);
const id = computed(() => `ctl-${c.value.name}`);
const fallback = computed(() => literal(c.value.defaultText ?? ""));
const value = computed(() => (props.modelValue === undefined ? fallback.value : props.modelValue));
const set = (v) => emit("update:modelValue", v);

const segOptions = computed(() => (c.value.options ?? []).map((o) => ({ value: o, label: String(o) })));

/* Objets / tableaux : édition JSON avec validation. */
const json = ref("");
const jsonError = ref("");
watch(
  () => props.modelValue,
  (v) => {
    if (c.value.type !== "object") return;
    try {
      if (JSON.stringify(JSON.parse(json.value || "null")) === JSON.stringify(v ?? null)) return;
    } catch {
      /* saisie en cours invalide : on la remplace */
    }
    json.value = v === undefined ? "" : JSON.stringify(v, null, 2);
  },
  { immediate: true },
);
function onJson(e) {
  json.value = e.target.value;
  try {
    set(json.value.trim() ? JSON.parse(json.value) : undefined);
    jsonError.value = "";
  } catch (err) {
    jsonError.value = err.message;
  }
}
</script>

<template>
  <div class="min-w-0">
    <AltSwitch
      v-if="c.type === 'boolean'"
      :model-value="Boolean(value)"
      size="sm"
      @update:model-value="set"
    >
      <span class="font-mono text-[11px] text-fg-faint">{{ value ? "true" : "false" }}</span>
    </AltSwitch>

    <AltSegmented
      v-else-if="c.type === 'inline-radio' && segOptions.length"
      :model-value="value ?? ''"
      :options="segOptions"
      :label="c.name"
      @update:model-value="set"
    />

    <select
      v-else-if="c.type === 'select' || c.type === 'inline-radio'"
      :id="id"
      class="alt-field !py-1.5"
      :value="value ?? ''"
      @change="set($event.target.value)"
    >
      <option
        v-if="value === undefined"
        value=""
        disabled
      >
        Choisir…
      </option>
      <option
        v-for="o in c.options"
        :key="String(o)"
        :value="o"
      >
        {{ o }}
      </option>
    </select>

    <div
      v-else-if="c.type === 'range'"
      class="flex items-center gap-3"
    >
      <input
        :id="id"
        type="range"
        class="pg-range flex-1"
        :min="c.min ?? 0"
        :max="c.max ?? 100"
        :step="c.step ?? 1"
        :value="value ?? c.min ?? 0"
        @input="set(Number($event.target.value))"
      >
      <span class="w-10 text-right font-mono text-xs text-gold">{{ value }}</span>
    </div>

    <input
      v-else-if="c.type === 'number'"
      :id="id"
      type="number"
      class="alt-field !py-1.5"
      :min="c.min"
      :max="c.max"
      :step="c.step"
      :value="value"
      :placeholder="c.defaultText ?? ''"
      @input="set($event.target.value === '' ? undefined : Number($event.target.value))"
    >

    <input
      v-else-if="c.type === 'color'"
      :id="id"
      type="color"
      class="h-8 w-14 cursor-pointer rounded-md border border-line/60 bg-transparent"
      :value="value || '#f9b233'"
      @input="set($event.target.value)"
    >

    <div v-else-if="c.type === 'object'">
      <textarea
        :id="id"
        class="alt-field !py-1.5 font-mono !text-xs"
        :rows="Math.min(8, Math.max(3, json.split('\n').length))"
        :value="json"
        spellcheck="false"
        @input="onJson"
      />
      <p
        v-if="jsonError"
        class="mt-1 text-[11px] text-neon-rose"
      >
        JSON invalide : {{ jsonError }}
      </p>
    </div>

    <textarea
      v-else-if="c.type === 'textarea'"
      :id="id"
      class="alt-field !py-1.5"
      rows="3"
      :value="value ?? ''"
      @input="set($event.target.value)"
    />

    <input
      v-else
      :id="id"
      type="text"
      class="alt-field !py-1.5"
      :value="value ?? ''"
      :placeholder="c.defaultText ? `défaut : ${c.defaultText}` : ''"
      @input="set($event.target.value)"
    >
  </div>
</template>

<style scoped>
.pg-range {
  accent-color: rgb(var(--alt-gold));
}
</style>
