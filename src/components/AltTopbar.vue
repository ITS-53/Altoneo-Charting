<template>
  <header class="h-16 bg-white dark:bg-alt-dark-surface border-b border-gray-200 dark:border-alt-dark-border flex items-center gap-4 px-4 sm:px-6 shrink-0">
    <!-- Bouton menu (mobile / repli sidebar) -->
    <button
      v-if="showMenuButton"
      type="button"
      class="p-2 -ml-2 rounded-lg text-gray-500 dark:text-alt-dark-muted hover:bg-altoneo-50 dark:hover:bg-alt-dark-raised hover:text-altoneo-800 dark:hover:text-altoneo-50 transition-colors"
      aria-label="Menu"
      @click="$emit('toggle-sidebar')"
    >
      <svg
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      /></svg>
    </button>

    <!-- Titre / fil d'ariane -->
    <div class="min-w-0 flex-1">
      <slot name="title">
        <h1
          v-if="title"
          class="text-lg font-semibold text-altoneo-800 dark:text-altoneo-50 truncate"
        >
          {{ title }}
        </h1>
      </slot>
    </div>

    <!-- Actions à droite -->
    <div class="flex items-center gap-2 sm:gap-3">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  showMenuButton: { type: Boolean, default: true },
});

defineEmits(["toggle-sidebar"]);
</script>
