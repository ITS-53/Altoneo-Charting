<template>
  <div>
    <div class="border-b border-gray-200 dark:border-alt-dark-border" role="tablist">
      <nav class="-mb-px flex gap-1" :class="{ 'gap-6': underline }">
        <button
          v-for="tab in normalizedTabs"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="active === tab.value"
          :disabled="tab.disabled"
          class="inline-flex items-center gap-2 px-1 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
          :class="tabClass(tab)"
          @click="select(tab)"
        >
          {{ tab.label }}
          <span
            v-if="tab.badge !== undefined"
            class="rounded-full bg-altoneo-100 text-altoneo-800 text-[11px] px-1.5 py-0.5 font-semibold"
          >
            {{ tab.badge }}
          </span>
        </button>
      </nav>
    </div>

    <div class="pt-4">
      <slot :active="active" />
      <slot :name="active" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  /** [{ value, label, disabled?, badge? }] ou strings */
  tabs: { type: Array, default: () => [] },
  /** true = style soulignement ; false = style "pilule". */
  underline: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue", "change"]);

const normalizedTabs = computed(() =>
  props.tabs.map((t) => (typeof t === "object" ? t : { value: t, label: String(t) })),
);

const active = computed(
  () => props.modelValue ?? normalizedTabs.value[0]?.value,
);

function select(tab) {
  if (tab.disabled) return;
  emit("update:modelValue", tab.value);
  emit("change", tab.value);
}

function tabClass(tab) {
  const isActive = active.value === tab.value;
  if (props.underline) {
    return isActive
      ? "border-b-2 border-altoneo-200 text-altoneo-800 dark:text-altoneo-50 py-3"
      : "border-b-2 border-transparent text-gray-500 dark:text-alt-dark-muted hover:text-altoneo-800 dark:hover:text-altoneo-50 hover:border-gray-300 py-3";
  }
  return isActive
    ? "bg-altoneo-200 text-altoneo-800 rounded-lg px-3 py-1.5"
    : "text-gray-500 dark:text-alt-dark-muted hover:bg-altoneo-50 dark:hover:bg-alt-dark-raised rounded-lg px-3 py-1.5";
}
</script>
