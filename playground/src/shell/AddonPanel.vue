<script setup>
import { computed } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import ApiTable from "./ApiTable.vue";
import CodeBlock from "./CodeBlock.vue";
import ControlField from "./ControlField.vue";
import { inferControls } from "../core/controls.js";
import { storySource } from "../core/snippet.js";
import { docsFor, fileById } from "../registry.js";
import { actions, audit, clearActions, isDirty, prefs, resetArgs, setArg } from "./store.js";

const props = defineProps({
  story: { type: Object, required: true },
  args: { type: Object, required: true },
});
const emit = defineEmits(["audit", "highlight"]);

const docs = computed(() => docsFor(props.story));
const controls = computed(() => inferControls(props.story, docs.value));
const source = computed(() => storySource(props.story, props.args, docs.value));
const file = computed(() => fileById.get(props.story.fileId));
const dirty = computed(() => isDirty(props.story));

const IMPACT = {
  critical: { label: "Critique", color: "var(--alt-sev-critical)" },
  serious: { label: "Majeur", color: "var(--alt-sev-high)" },
  moderate: { label: "Modéré", color: "var(--alt-sev-medium)" },
};

const tabs = computed(() => [
  { id: "controls", label: "Contrôles", icon: "settings", count: controls.value.length },
  { id: "actions", label: "Actions", icon: "bolt", count: actions.value.length || null, hot: true },
  { id: "code", label: "Code", icon: "code" },
  {
    id: "a11y",
    label: "Accessibilité",
    icon: "eye",
    count: audit.status === "done" ? audit.issues.length : null,
    alert: audit.issues.length > 0,
  },
  ...(docs.value ? [{ id: "api", label: "API", icon: "list" }] : []),
]);

function selectTab(id) {
  prefs.panelTab = id;
  if (id === "a11y") emit("audit");
}

const time = (t) => new Date(t).toLocaleTimeString("fr-FR", { hour12: false }) + `.${String(t % 1000).padStart(3, "0")}`;
</script>

<template>
  <section
    class="pg-panel flex h-full flex-col"
    aria-label="Panneau d'outils"
  >
    <div
      class="flex items-center gap-5 border-b border-line/40 pl-4 pr-12"
      role="tablist"
    >
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        role="tab"
        class="pg-tab pg-focus"
        :aria-selected="prefs.panelTab === t.id"
        @click="selectTab(t.id)"
      >
        <AltIcon
          :name="t.icon"
          :size="14"
        />
        {{ t.label }}
        <span
          v-if="t.count !== null && t.count !== undefined"
          class="pg-count"
          :class="{ 'is-hot': t.hot, 'is-alert': t.alert }"
        >{{ t.count }}</span>
      </button>
      <span class="flex-1" />
      <button
        v-if="prefs.panelTab === 'controls' && dirty"
        type="button"
        class="pg-icon-btn"
        data-tip="Réinitialiser les args"
        data-tip-end
        aria-label="Réinitialiser les args"
        @click="resetArgs(story)"
      >
        <AltIcon
          name="refresh"
          :size="15"
        />
      </button>
      <button
        v-if="prefs.panelTab === 'actions' && actions.length"
        type="button"
        class="pg-icon-btn"
        data-tip="Vider le journal"
        data-tip-end
        aria-label="Vider le journal"
        @click="clearActions"
      >
        <AltIcon
          name="trash"
          :size="15"
        />
      </button>
      <button
        v-if="prefs.panelTab === 'a11y'"
        type="button"
        class="pg-icon-btn"
        data-tip="Relancer l'analyse"
        data-tip-end
        aria-label="Relancer l'analyse"
        @click="emit('audit')"
      >
        <AltIcon
          name="scan"
          :size="15"
        />
      </button>
    </div>

    <div class="pg-scroll min-h-0 flex-1">
      <!-- Contrôles -->
      <template v-if="prefs.panelTab === 'controls'">
        <table
          v-if="controls.length"
          class="pg-table"
        >
          <thead>
            <tr>
              <th class="w-[28%]">
                Prop
              </th><th class="w-[36%]">
                Description
              </th><th>Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in controls"
              :key="c.name"
            >
              <td>
                <label
                  :for="`ctl-${c.name}`"
                  class="font-mono text-[12.5px] font-semibold text-fg"
                >{{ c.name }}<span
                  v-if="c.required"
                  class="text-neon-rose"
                >*</span></label>
                <div
                  v-if="c.propType"
                  class="mt-0.5 font-mono text-[11px] text-fg-faint"
                >
                  {{ c.propType }}
                </div>
              </td>
              <td class="text-[12.5px] text-fg-muted">
                {{ c.description || "—" }}
                <div
                  v-if="c.defaultText"
                  class="mt-1 text-[11px] text-fg-faint"
                >
                  Défaut : <code class="pg-code-inline">{{ c.defaultText }}</code>
                </div>
              </td>
              <td>
                <ControlField
                  :model-value="args[c.name]"
                  :control="c"
                  @update:model-value="(v) => setArg(story, c.name, v)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-else
          class="pg-empty"
        >
          <AltIcon
            name="settings"
            :size="22"
          />
          <p>Cette story est une composition figée : elle n'expose pas d'args.</p>
          <p class="text-fg-faint">
            Pour la rendre pilotable, écrivez <code class="pg-code-inline">render: (args) =&gt; ({ … })</code> dans son fichier de stories.
          </p>
        </div>
      </template>

      <!-- Actions -->
      <template v-else-if="prefs.panelTab === 'actions'">
        <ol
          v-if="actions.length"
          class="divide-y divide-line/30 font-mono text-[12px]"
        >
          <li
            v-for="a in actions"
            :key="a.n"
            class="flex gap-3 px-4 py-2"
          >
            <span class="text-fg-faint">{{ time(a.time) }}</span>
            <span class="font-semibold text-gold">{{ a.name }}</span>
            <span
              class="min-w-0 flex-1 truncate text-fg-muted"
              :title="JSON.stringify(a.args)"
            >{{ JSON.stringify(a.args) }}</span>
          </li>
        </ol>
        <div
          v-else
          class="pg-empty"
        >
          <AltIcon
            name="bolt"
            :size="22"
          />
          <p>Aucun événement pour l'instant.</p>
          <p class="text-fg-faint">
            Les événements émis par le composant (et les argTypes <code class="pg-code-inline">action</code>) s'affichent ici.
          </p>
        </div>
      </template>

      <!-- Code -->
      <div
        v-else-if="prefs.panelTab === 'code'"
        class="grid gap-4 p-4"
      >
        <CodeBlock
          v-if="source"
          :code="source"
          lang="html"
          label="Gabarit · args courants"
        />
        <CodeBlock
          :code="file.raw"
          lang="js"
          :label="file.path"
        />
      </div>

      <!-- Accessibilité -->
      <template v-else-if="prefs.panelTab === 'a11y'">
        <div
          v-if="audit.status === 'running'"
          class="pg-empty"
        >
          <AltIcon
            name="scan"
            :size="22"
            class="animate-pulse"
          /><p>Analyse en cours…</p>
        </div>
        <ul
          v-else-if="audit.issues.length"
          class="divide-y divide-line/30"
        >
          <li
            v-for="i in audit.issues"
            :key="i.index"
            class="flex cursor-default items-start gap-3 px-4 py-2.5 hover:bg-ink-700/30"
            @mouseenter="emit('highlight', i.index)"
            @mouseleave="emit('highlight', null)"
          >
            <span
              class="pg-impact"
              :style="{ '--c': IMPACT[i.impact].color }"
            >{{ IMPACT[i.impact].label }}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-[13px] text-fg">{{ i.message }}</span>
              <code class="block truncate font-mono text-[11px] text-fg-faint">{{ i.selector }}</code>
            </span>
            <span class="font-mono text-[11px] text-fg-faint">{{ i.rule }}</span>
          </li>
        </ul>
        <div
          v-else-if="audit.status === 'done'"
          class="pg-empty"
        >
          <AltIcon
            name="check-circle"
            :size="22"
            class="text-neon-mint"
          />
          <p>Aucun problème détecté par les contrôles de base.</p>
          <p class="text-fg-faint">
            Textes alternatifs, noms accessibles, étiquettes, identifiants et contraste AA. Complétez par un test clavier et lecteur d'écran.
          </p>
        </div>
      </template>

      <!-- API -->
      <div
        v-else-if="prefs.panelTab === 'api' && docs"
        class="p-4"
      >
        <ApiTable :docs="docs" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.pg-empty {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  font-size: 13px;
  color: rgb(var(--alt-fg-muted));
}
.pg-impact {
  flex-shrink: 0;
  margin-top: 1px;
  padding: 1px 8px;
  border-radius: 9999px;
  font-size: 10.5px;
  font-weight: 700;
  color: rgb(var(--c));
  background: rgb(var(--c) / 0.12);
  box-shadow: inset 0 0 0 1px rgb(var(--c) / 0.35);
}
</style>
