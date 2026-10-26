import { computed, ref } from "vue";
import { AltIcon, ICON_CATEGORIES, ICON_NAMES, iconSvg } from "../../src/index.js";

export default {
  title: "Altonéo Next/Icônes internes",
  component: AltIcon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
    size: { control: { type: "range", min: 12, max: 64, step: 2 } },
    stroke: { control: { type: "range", min: 1, max: 3, step: 0.1 } },
  },
  args: { name: "spark", size: 32, stroke: 1.8, label: "" },
};

export const Playground = {};

const LABELS = { navigation: "Navigation", actions: "Actions", fichiers: "Fichiers", donnees: "Données", infra: "Infrastructure", communication: "Communication", statut: "Statut et ressenti", marque: "Marque" };

export const Bibliotheque = {
  name: "Bibliothèque complète",
  parameters: { layout: "fullscreen" },
  render: () => ({
    components: { AltIcon },
    setup() {
      const q = ref("");
      const copied = ref("");
      const groups = computed(() =>
        Object.entries(ICON_CATEGORIES)
          .map(([k, names]) => [LABELS[k], names.filter((n) => n.includes(q.value.trim().toLowerCase()))])
          .filter(([, names]) => names.length),
      );
      async function copy(name) {
        await navigator.clipboard?.writeText(iconSvg(name));
        copied.value = name;
        setTimeout(() => copied.value === name && (copied.value = ""), 1400);
      }
      return { q, groups, copy, copied, total: ICON_NAMES.length };
    },
    template: `
      <div style="padding:32px;min-height:100vh;background:rgb(var(--alt-ink-900));color:rgb(var(--alt-fg))">
        <div style="display:flex;align-items:end;gap:16px;flex-wrap:wrap;margin-bottom:20px">
          <div style="flex:1">
            <div class="alt-eyebrow">{{ total }} icônes · trait 24 px</div>
            <h2 class="alt-display" style="font-size:28px;margin:4px 0 0">Bibliothèque d'icônes internes</h2>
            <p style="color:rgb(var(--alt-fg-muted));font-size:13px;margin-top:4px">Cliquez une icône pour copier son SVG. Fichiers .svg : <code>altoneo-charting/icons/svg/&lt;nom&gt;.svg</code></p>
          </div>
          <input v-model="q" class="alt-field" style="max-width:280px" placeholder="Rechercher une icône…" />
        </div>
        <section v-for="[label, names] in groups" :key="label" style="margin-bottom:22px">
          <div class="alt-eyebrow" style="margin-bottom:8px">{{ label }}</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px">
            <button v-for="n in names" :key="n" v-alt-spotlight class="alt-glass alt-neon-hover" style="display:grid;place-items:center;gap:8px;padding:16px 8px;cursor:pointer;color:inherit" :title="'Copier le SVG de ' + n" @click="copy(n)">
              <AltIcon :name="n" :size="26" />
              <span style="font-family:JetBrains Mono,monospace;font-size:10.5px;color:rgb(var(--alt-fg-muted))">{{ copied === n ? 'copié ✓' : n }}</span>
            </button>
          </div>
        </section>
      </div>`,
  }),
};
