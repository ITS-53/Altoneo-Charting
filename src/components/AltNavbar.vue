<template>
  <nav class="bg-altoneo-800 text-white shadow-lg">
    <div
      class="mx-auto px-4 sm:px-6 lg:px-8"
      :class="containerClass"
    >
      <div class="flex items-center justify-between h-16">
        <!-- Marque + navigation -->
        <div class="flex items-center gap-8">
          <slot name="brand">
            <component
              :is="linkComponent"
              v-bind="linkProps(brandTo)"
              class="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <AltLogo
                :size="40"
                :brand="brand"
                variant="dark"
              />
              <span
                v-if="subtitle"
                class="hidden sm:block text-[10px] text-altoneo-100 uppercase tracking-widest leading-none border-l border-altoneo-700 pl-3"
              >
                {{ subtitle }}
              </span>
            </component>
          </slot>

          <div
            v-if="items.length"
            class="hidden md:block w-px h-6 bg-altoneo-700"
          />

          <div
            v-if="items.length"
            class="hidden md:flex items-center gap-1"
          >
            <component
              :is="linkComponent"
              v-for="item in items"
              :key="item.to"
              v-bind="linkProps(item.to)"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'bg-altoneo-200 text-altoneo-800 font-semibold'
                : 'text-altoneo-100 hover:bg-altoneo-700 hover:text-white'"
              @click="$emit('navigate', item)"
            >
              {{ item.label }}
            </component>
          </div>
        </div>

        <!-- Zone droite (utilisateur, actions) -->
        <div class="flex items-center gap-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import AltLogo from "./AltLogo.vue";

const props = defineProps({
  /** [{ to, label }] */
  items: { type: Array, default: () => [] },
  subtitle: { type: String, default: "" },
  brandTo: { type: String, default: "/" },
  /** Chemin actif courant (ex: route.path) pour surligner l'onglet. */
  activePath: { type: String, default: "" },
  /**
   * Composant de lien : 'a' (défaut), ou passez RouterLink/NuxtLink
   * pour une vraie navigation SPA.
   */
  linkComponent: { type: [String, Object], default: "a" },
  /** Largeur du conteneur : max-w-7xl par défaut. */
  containerClass: { type: String, default: "max-w-7xl" },
  /** Marque du logo : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
});

defineEmits(["navigate"]);

function linkProps(to) {
  // RouterLink attend `to`, une balise <a> attend `href`.
  return props.linkComponent === "a" ? { href: to } : { to };
}

function isActive(to) {
  if (!props.activePath || to === "/") return props.activePath === to;
  return props.activePath.startsWith(to);
}
</script>
