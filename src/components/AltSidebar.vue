<template>
  <aside
    class="flex flex-col bg-altoneo-800 text-altoneo-100 transition-[width] duration-200 ease-in-out shrink-0"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- En-tête -->
    <div class="h-16 flex items-center gap-3 px-4 border-b border-altoneo-700 shrink-0">
      <slot name="header" :collapsed="collapsed">
        <AltLogo :size="32" :brand="brand" variant="dark" />
        <span v-if="!collapsed" class="font-semibold text-white truncate">{{ title }}</span>
      </slot>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
      <template v-for="item in items" :key="item.key || item.to || item.label">
        <!-- Libellé de groupe -->
        <p v-if="item.heading" class="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider text-altoneo-400" :class="{ 'sr-only': collapsed }">
          {{ item.heading }}
        </p>

        <component
          :is="item.to ? linkComponent : 'button'"
          v-else
          v-bind="item.to ? linkProps(item.to) : { type: 'button' }"
          class="group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-altoneo-200 text-altoneo-800'
            : 'text-altoneo-100 hover:bg-altoneo-700 hover:text-white'"
          :title="collapsed ? item.label : undefined"
          @click="$emit('navigate', item)"
        >
          <span class="shrink-0 w-5 h-5 flex items-center justify-center">
            <slot name="icon" :item="item" :active="isActive(item.to)">
              <span class="w-2 h-2 rounded-full bg-current opacity-70" />
            </slot>
          </span>
          <span v-if="!collapsed" class="truncate flex-1 text-left">{{ item.label }}</span>
          <span v-if="!collapsed && item.badge !== undefined" class="ml-auto rounded-full bg-altoneo-700 text-white text-[11px] px-1.5 py-0.5">
            {{ item.badge }}
          </span>
        </component>
      </template>
    </nav>

    <!-- Pied -->
    <div v-if="$slots.footer || collapsible" class="border-t border-altoneo-700 p-2 shrink-0">
      <slot name="footer" :collapsed="collapsed" />
      <button
        v-if="collapsible"
        type="button"
        class="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-altoneo-100 hover:bg-altoneo-700 transition-colors"
        @click="$emit('update:collapsed', !collapsed)"
      >
        <span class="shrink-0 w-5 h-5 flex items-center justify-center">
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': collapsed }" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
        </span>
        <span v-if="!collapsed">Réduire</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import AltLogo from "./AltLogo.vue";

const props = defineProps({
  /** [{ key?, to?, label, badge?, heading? }] — `heading` rend un libellé de groupe. */
  items: { type: Array, default: () => [] },
  title: { type: String, default: "Altonéo" },
  /** Chemin actif (ex: route.path) pour le surlignage. */
  activePath: { type: String, default: "" },
  collapsed: { type: Boolean, default: false },
  collapsible: { type: Boolean, default: true },
  linkComponent: { type: [String, Object], default: "a" },
  /** Marque du logo : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
});

defineEmits(["navigate", "update:collapsed"]);

function linkProps(to) {
  return props.linkComponent === "a" ? { href: to } : { to };
}

function isActive(to) {
  if (!to || !props.activePath) return false;
  if (to === "/") return props.activePath === "/";
  return props.activePath.startsWith(to);
}
</script>
