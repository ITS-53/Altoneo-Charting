<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-between gap-4" aria-label="Pagination">
    <p v-if="showTotal" class="text-sm text-gray-500 dark:text-alt-dark-muted">
      {{ rangeStart }}–{{ rangeEnd }} sur {{ total }}
    </p>

    <ul class="inline-flex items-center gap-1">
      <li>
        <button
          type="button"
          class="px-2.5 py-1.5 rounded-lg text-sm text-gray-500 dark:text-alt-dark-muted hover:bg-altoneo-50 dark:hover:bg-alt-dark-raised disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="modelValue <= 1"
          aria-label="Page précédente"
          @click="go(modelValue - 1)"
        >
          ‹
        </button>
      </li>

      <li v-for="(page, i) in pages" :key="i">
        <span v-if="page === '…'" class="px-2 text-gray-400">…</span>
        <button
          v-else
          type="button"
          class="min-w-[2rem] px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
          :class="page === modelValue ? 'bg-altoneo-200 text-altoneo-800' : 'text-gray-600 dark:text-altoneo-100 hover:bg-altoneo-50 dark:hover:bg-alt-dark-raised'"
          :aria-current="page === modelValue ? 'page' : undefined"
          @click="go(page)"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          type="button"
          class="px-2.5 py-1.5 rounded-lg text-sm text-gray-500 dark:text-alt-dark-muted hover:bg-altoneo-50 dark:hover:bg-alt-dark-raised disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="modelValue >= totalPages"
          aria-label="Page suivante"
          @click="go(modelValue + 1)"
        >
          ›
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** Page courante (1-indexée), v-model. */
  modelValue: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 },
  /** Nombre de pages autour de la courante. */
  siblings: { type: Number, default: 1 },
  showTotal: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue", "change"]);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)));
const rangeStart = computed(() => (props.total === 0 ? 0 : (props.modelValue - 1) * props.perPage + 1));
const rangeEnd = computed(() => Math.min(props.modelValue * props.perPage, props.total));

const pages = computed(() => {
  const tp = totalPages.value;
  const cur = props.modelValue;
  const s = props.siblings;
  const range = [];
  const left = Math.max(2, cur - s);
  const right = Math.min(tp - 1, cur + s);

  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < tp - 1) range.push("…");
  if (tp > 1) range.push(tp);
  return range;
});

function go(page) {
  if (page < 1 || page > totalPages.value || page === props.modelValue) return;
  emit("update:modelValue", page);
  emit("change", page);
}
</script>
