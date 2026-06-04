<template>
  <div class="flex h-screen overflow-hidden bg-altoneo-50 dark:bg-alt-dark-app">
    <!-- Sidebar (desktop) -->
    <AltSidebar
      v-if="items.length || $slots.sidebar"
      class="hidden md:flex"
      :items="items"
      :title="title"
      :brand="brand"
      :active-path="activePath"
      :collapsed="collapsed"
      :collapsible="collapsible"
      :link-component="linkComponent"
      @update:collapsed="collapsed = $event"
      @navigate="$emit('navigate', $event)"
    >
      <template v-if="$slots['sidebar-header']" #header="s"><slot name="sidebar-header" v-bind="s" /></template>
      <template v-if="$slots['sidebar-icon']" #icon="s"><slot name="sidebar-icon" v-bind="s" /></template>
      <template v-if="$slots['sidebar-footer']" #footer="s"><slot name="sidebar-footer" v-bind="s" /></template>
    </AltSidebar>

    <!-- Sidebar (mobile, overlay) -->
    <transition name="alt-drawer">
      <div v-if="mobileOpen" class="fixed inset-0 z-40 md:hidden">
        <div class="absolute inset-0 bg-altoneo-900/50" @click="mobileOpen = false" />
        <AltSidebar
          class="relative z-50 h-full"
          :items="items"
          :title="title"
          :brand="brand"
          :active-path="activePath"
          :collapsible="false"
          :link-component="linkComponent"
          @navigate="onMobileNavigate"
        >
          <template v-if="$slots['sidebar-icon']" #icon="s"><slot name="sidebar-icon" v-bind="s" /></template>
        </AltSidebar>
      </div>
    </transition>

    <!-- Colonne principale -->
    <div class="flex-1 flex flex-col min-w-0">
      <AltTopbar
        :title="pageTitle"
        :show-menu-button="true"
        @toggle-sidebar="onToggle"
      >
        <template v-if="$slots['topbar-title']" #title><slot name="topbar-title" /></template>
        <template #actions><slot name="topbar-actions" /></template>
      </AltTopbar>

      <main class="flex-1 overflow-y-auto">
        <div :class="contentClass">
          <slot />
        </div>
      </main>

      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AltSidebar from "./AltSidebar.vue";
import AltTopbar from "./AltTopbar.vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  title: { type: String, default: "Altonéo" },
  /** Marque du logo de la sidebar : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
  /** Titre affiché dans la topbar. */
  pageTitle: { type: String, default: "" },
  activePath: { type: String, default: "" },
  collapsible: { type: Boolean, default: true },
  linkComponent: { type: [String, Object], default: "a" },
  /** Classe du conteneur de contenu (padding, largeur max). */
  contentClass: { type: String, default: "max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" },
});

const emit = defineEmits(["navigate"]);

const collapsed = ref(false);
const mobileOpen = ref(false);

function onToggle() {
  // Sur mobile : ouvre/ferme le drawer. Sur desktop : replie la sidebar.
  if (window.matchMedia("(min-width: 768px)").matches) {
    collapsed.value = !collapsed.value;
  } else {
    mobileOpen.value = !mobileOpen.value;
  }
}

function onMobileNavigate(item) {
  mobileOpen.value = false;
  emit("navigate", item);
}
</script>

<style scoped>
.alt-drawer-enter-active,
.alt-drawer-leave-active {
  transition: opacity 0.2s ease;
}
.alt-drawer-enter-from,
.alt-drawer-leave-to {
  opacity: 0;
}
</style>
