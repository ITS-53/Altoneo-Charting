import { ref } from "vue";
import { AltGlassCard, AltScoreRing, AltSparkline } from "../../src/index.js";

export default {
  title: "Altonéo Next/Données animées",
  component: AltScoreRing,
  tags: ["autodocs"],
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
  args: { value: 78, size: 140, stroke: 8, label: "Note", ticks: true, glow: true },
};

export const AnneauDeNote = { name: "Anneau de note" };

export const Grades = {
  name: "Grades A → F",
  render: () => ({
    components: { AltScoreRing },
    template: `
      <div style="display:flex;gap:24px;flex-wrap:wrap;padding:24px;background:rgb(var(--alt-ink-900))">
        <AltScoreRing v-for="v in [96, 84, 74, 64, 54, 31]" :key="v" :value="v" :size="110" />
        <AltScoreRing :value="null" :size="110" label="Cible" />
      </div>`,
  }),
};

export const Rejouer = {
  name: "Valeur qui change",
  render: () => ({
    components: { AltScoreRing, AltGlassCard, AltSparkline },
    setup() {
      const value = ref(62);
      const history = ref([58, 61, 60, 66, 70, 69, 74]);
      function roll() {
        value.value = Math.round(40 + Math.random() * 60);
        history.value = [...history.value.slice(1), value.value];
      }
      return { value, history, roll };
    },
    template: `
      <div class="dark" style="padding:32px;background:rgb(var(--alt-ink-900));min-height:420px">
        <AltGlassCard eyebrow="Démo" title="La note se calcule à chaque changement" style="max-width:520px">
          <div style="display:flex;align-items:center;gap:28px">
            <AltScoreRing :value="value" :size="130" />
            <div>
              <AltSparkline :values="history" :labels="history.map((_, i) => 'S-' + (history.length - 1 - i))" :width="200" :height="48" />
              <button class="alt-btn-neon" style="margin-top:16px" @click="roll">Nouvelle mesure</button>
            </div>
          </div>
        </AltGlassCard>
      </div>`,
  }),
};

export const Sparkline = {
  render: () => ({
    components: { AltSparkline },
    template: `
      <div style="display:flex;gap:40px;padding:48px 24px 24px;background:rgb(var(--alt-ink-900))">
        <AltSparkline :values="[72, 75, 71, 78, 82, 80, 86]" />
        <AltSparkline :values="[90, 84, 79, 70, 66]" color="rgb(var(--alt-sev-critical))" label="Dégradation" />
        <AltSparkline :values="[]" />
      </div>`,
  }),
};
