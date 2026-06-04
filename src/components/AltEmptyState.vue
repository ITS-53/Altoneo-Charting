<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-6">
    <div class="w-14 h-14 rounded-full bg-altoneo-50 dark:bg-alt-dark-raised text-altoneo-400 dark:text-altoneo-100 flex items-center justify-center mb-4">
      <slot name="icon">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4l-2 3h-4l-2-3H4" />
        </svg>
      </slot>
    </div>
    <h3 class="font-semibold text-altoneo-800 dark:text-altoneo-50">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-alt-dark-muted max-w-sm">{{ description }}</p>
    <div v-if="$slots.action" class="mt-5">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Aucune donnée" },
  description: { type: String, default: "" },
});
</script>
