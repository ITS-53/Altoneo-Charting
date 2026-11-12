<script setup>
/** Référence d'API d'un composant : props, événements et slots (lus dans sa source .vue). */
defineProps({
  docs: { type: Object, required: true },
});
</script>

<template>
  <div class="grid gap-5">
    <div
      v-if="docs.props.length"
      class="pg-api-card"
    >
      <table class="pg-table">
        <thead>
          <tr><th>Prop</th><th>Type</th><th>Défaut</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr
            v-for="p in docs.props"
            :key="p.name"
          >
            <td class="whitespace-nowrap font-mono text-[12.5px] font-semibold text-fg">
              {{ p.name }}<span
                v-if="p.required"
                class="text-neon-rose"
                title="Requis"
              >*</span>
            </td>
            <td class="font-mono text-[11.5px] text-azure-bright">
              {{ p.type }}
            </td>
            <td>
              <code
                v-if="p.default !== undefined"
                class="pg-code-inline"
              >{{ p.default }}</code><span
                v-else
                class="text-fg-faint"
              >—</span>
            </td>
            <td class="text-[12.5px] text-fg-muted">
              {{ p.description }}
              <div
                v-if="p.options"
                class="mt-1 flex flex-wrap gap-1"
              >
                <span
                  v-for="o in p.options"
                  :key="o"
                  class="alt-chip !py-0 font-mono !text-[10.5px]"
                >{{ o }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="pg-api-card p-4">
        <div class="alt-eyebrow mb-2">
          Événements
        </div>
        <div
          v-if="docs.emits.length"
          class="flex flex-wrap gap-1.5"
        >
          <code
            v-for="e in docs.emits"
            :key="e"
            class="pg-code-inline"
          >@{{ e }}</code>
        </div>
        <p
          v-else
          class="text-sm text-fg-faint"
        >
          Aucun événement émis.
        </p>
      </div>
      <div class="pg-api-card p-4">
        <div class="alt-eyebrow mb-2">
          Slots
        </div>
        <div
          v-if="docs.slots.length"
          class="flex flex-wrap gap-1.5"
        >
          <code
            v-for="s in docs.slots"
            :key="s"
            class="pg-code-inline"
          >#{{ s }}</code>
        </div>
        <p
          v-else
          class="text-sm text-fg-faint"
        >
          Aucun slot.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-api-card {
  overflow: hidden;
  border-radius: 0.9rem;
  border: 1px solid rgb(var(--alt-line) / 0.45);
  background: rgb(var(--alt-ink-800) / 0.55);
}
</style>
