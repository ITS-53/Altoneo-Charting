<template>
  <nav aria-label="Fil d'ariane">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-1.5">
        <component
          :is="item.to && i < items.length - 1 ? linkComponent : 'span'"
          v-bind="item.to && i < items.length - 1 ? linkProps(item.to) : {}"
          class="truncate"
          :class="i === items.length - 1
            ? 'font-medium text-altoneo-800 dark:text-altoneo-50'
            : 'text-gray-500 dark:text-alt-dark-muted hover:text-altoneo-800 dark:hover:text-altoneo-100 transition-colors'"
          :aria-current="i === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </component>
        <span v-if="i < items.length - 1" class="text-gray-300 dark:text-alt-dark-border select-none" aria-hidden="true">
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  /** [{ label, to? }] */
  items: { type: Array, default: () => [] },
  separator: { type: String, default: "/" },
  linkComponent: { type: [String, Object], default: "a" },
});

function linkProps(to) {
  return props.linkComponent === "a" ? { href: to } : { to };
}
</script>
