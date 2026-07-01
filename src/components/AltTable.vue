<template>
  <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-alt-dark-border">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-alt-dark-border text-sm">
      <thead class="bg-altoneo-50 dark:bg-alt-dark-raised">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="px-4 py-3 text-left font-semibold text-altoneo-800 dark:text-altoneo-50 whitespace-nowrap"
            :class="[col.align ? `text-${col.align}` : '', col.sortable ? 'cursor-pointer select-none' : '']"
            @click="col.sortable && toggleSort(col.key)"
          >
            <span class="inline-flex items-center gap-1">
              {{ col.label }}
              <span
                v-if="col.sortable"
                class="text-altoneo-400"
              >
                <svg
                  v-if="sortKey === col.key"
                  class="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    v-if="sortDir === 'asc'"
                    d="M10 5l5 6H5l5-6z"
                  />
                  <path
                    v-else
                    d="M10 15l-5-6h10l-5 6z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-3 h-3 opacity-30"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 4l4 5H6l4-5zM10 16l-4-5h8l-4 5z" />
                </svg>
              </span>
            </span>
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100 dark:divide-alt-dark-border bg-white dark:bg-alt-dark-surface">
        <tr v-if="loading">
          <td
            :colspan="columns.length"
            class="px-4 py-10 text-center text-gray-400"
          >
            <AltSpinner class="inline-block" /> Chargement…
          </td>
        </tr>
        <tr v-else-if="!sortedRows.length">
          <td
            :colspan="columns.length"
            class="px-4 py-10 text-center text-gray-400"
          >
            <slot name="empty">
              {{ emptyText }}
            </slot>
          </td>
        </tr>
        <tr
          v-for="(row, i) in sortedRows"
          v-else
          :key="rowKey ? row[rowKey] : i"
          class="hover:bg-altoneo-50/60 dark:hover:bg-alt-dark-raised/60 transition-colors"
          :class="[{ 'cursor-pointer': clickable }, resolveRowClass(row)]"
          @click="clickable && $emit('row-click', row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-gray-700 dark:text-altoneo-100 whitespace-nowrap"
            :class="col.align ? `text-${col.align}` : ''"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :value="row[col.key]"
            >
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import AltSpinner from "./AltSpinner.vue";

const props = defineProps({
  /** [{ key, label, sortable?, align? }] */
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  emptyText: { type: String, default: "Aucune donnée" },
  /**
   * Classe(s) CSS appliquée(s) à une ligne. Chaîne fixe, ou fonction (row) =>
   * string pour styliser conditionnellement (ex. griser une ligne obsolète).
   */
  rowClass: { type: [String, Function], default: "" },
});

defineEmits(["row-click"]);

function resolveRowClass(row) {
  return typeof props.rowClass === "function" ? props.rowClass(row) : props.rowClass;
}

const sortKey = ref("");
const sortDir = ref("asc");

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
}

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows;
  const dir = sortDir.value === "asc" ? 1 : -1;
  return [...props.rows].sort((a, b) => {
    const av = a[sortKey.value];
    const bv = b[sortKey.value];
    if (av == null) return 1;
    if (bv == null) return -1;
    return av > bv ? dir : av < bv ? -dir : 0;
  });
});
</script>
