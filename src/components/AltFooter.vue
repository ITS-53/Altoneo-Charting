<template>
  <footer class="bg-altoneo-800 text-altoneo-100">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div
        v-if="columns.length || $slots.brand"
        class="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        <!-- Bloc marque -->
        <div class="col-span-2 md:col-span-1">
          <slot name="brand">
            <AltLogo
              :size="40"
              :brand="brand"
              variant="dark"
            />
            <p
              v-if="tagline"
              class="mt-3 text-sm text-altoneo-400 max-w-xs"
            >
              {{ tagline }}
            </p>
          </slot>
        </div>

        <!-- Colonnes de liens -->
        <div
          v-for="col in columns"
          :key="col.title"
        >
          <h3 class="text-xs font-semibold uppercase tracking-wider text-white mb-3">
            {{ col.title }}
          </h3>
          <ul class="space-y-2">
            <li
              v-for="link in col.links"
              :key="link.label"
            >
              <component
                :is="link.to ? linkComponent : 'a'"
                v-bind="linkProps(link)"
                class="text-sm text-altoneo-100 hover:text-white transition-colors"
              >
                {{ link.label }}
              </component>
            </li>
          </ul>
        </div>
      </div>

      <!-- Barre du bas -->
      <div class="mt-8 pt-6 border-t border-altoneo-700 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-sm text-altoneo-400">
          {{ copyright || defaultCopyright }}
        </p>
        <div class="flex items-center gap-4">
          <slot name="social" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import AltLogo from "./AltLogo.vue";

const props = defineProps({
  /** [{ title, links: [{ label, to?, href? }] }] */
  columns: { type: Array, default: () => [] },
  tagline: { type: String, default: "" },
  copyright: { type: String, default: "" },
  linkComponent: { type: [String, Object], default: "a" },
  /** Marque du logo : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
});

const defaultCopyright = computed(
  () => `© ${new Date().getFullYear()} Altonéo. Tous droits réservés.`,
);

function linkProps(link) {
  if (link.to && props.linkComponent !== "a") return { to: link.to };
  return { href: link.href || link.to || "#" };
}
</script>
