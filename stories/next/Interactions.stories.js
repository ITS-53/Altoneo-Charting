import { ref } from "vue";
import { AltButton, AltDrawer, AltGlassCard, AltIcon, AltPopover, AltSegmented, useMotion } from "../../src/index.js";

export default {
  title: "Altonéo Next/Interactions et mouvement",
};

const bg = "padding:32px;min-height:420px;background:rgb(var(--alt-ink-900));color:rgb(var(--alt-fg))";

export const IntensiteDesAnimations = {
  name: "Intensité des animations",
  render: () => ({
    components: { AltSegmented, AltGlassCard },
    setup() {
      const { level, setMotion, levels } = useMotion();
      const options = [
        { value: "cinema", label: "Cinéma" },
        { value: "sober", label: "Sobre" },
        { value: "none", label: "Aucune" },
      ];
      return { level, setMotion, options, levels, bg };
    },
    template: `
      <div :style="bg">
        <AltGlassCard eyebrow="useMotion()" title="Un seul réglage pour toute l'application" shine style="max-width:620px">
          <p style="color:rgb(var(--alt-fg-muted));font-size:13px;margin-bottom:14px">
            Cinéma : tout. Sobre : animations courtes, sans effets décoratifs (reflets, aurores). Aucune : états finaux immédiats.
            « Réduire les animations » du système l'emporte toujours. Le choix est mémorisé sur le poste.
          </p>
          <AltSegmented :model-value="level" :options="options" label="Intensité des animations" @update:model-value="setMotion" />
        </AltGlassCard>
      </div>`,
  }),
};

export const Directives = {
  render: () => ({
    components: { AltButton, AltIcon },
    setup: () => ({ bg }),
    template: `
      <div :style="bg">
        <div style="display:grid;gap:28px;max-width:720px">
          <div>
            <div class="alt-eyebrow">v-alt-tip</div>
            <button class="alt-chip" v-alt-tip="'Infobulle légère, au survol comme au focus clavier'"><AltIcon name="info" :size="13" /> Survolez-moi</button>
          </div>
          <div>
            <div class="alt-eyebrow">v-alt-magnetic · AltButton magnetic</div>
            <div style="display:flex;gap:12px;margin-top:6px">
              <AltButton variant="neon" magnetic>Bouton magnétique</AltButton>
              <AltButton variant="primary">Bouton historique</AltButton>
            </div>
          </div>
          <div>
            <div class="alt-eyebrow">v-alt-spotlight</div>
            <div v-alt-spotlight class="alt-glass" style="padding:28px;font-size:13px;color:rgb(var(--alt-fg-muted))">Le halo suit le pointeur.</div>
          </div>
          <div>
            <div class="alt-eyebrow">v-alt-reveal="i" — cascade à l'entrée dans l'écran</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:6px">
              <div v-for="i in 8" :key="i" v-alt-reveal="i" class="alt-glass" style="height:64px;display:grid;place-items:center;font-family:JetBrains Mono,monospace;font-size:12px">{{ i }}</div>
            </div>
          </div>
        </div>
      </div>`,
  }),
};

export const PopoverEtTiroir = {
  name: "Popover et tiroir",
  render: () => ({
    components: { AltPopover, AltDrawer, AltButton, AltIcon },
    setup() {
      const open = ref(false);
      return { open, bg };
    },
    template: `
      <div :style="bg">
        <div style="display:flex;gap:16px;align-items:center">
          <AltPopover>
            <template #trigger><span class="alt-chip" tabindex="0">3 constats élevés</span></template>
            <div style="padding:14px">
              <div class="alt-eyebrow">Détail</div>
              <ul style="margin:8px 0 0;padding-left:16px;font-size:13px;color:rgb(var(--alt-fg-muted))">
                <li>HSTS absent</li><li>Port 5432 exposé</li><li>Certificat à 9 jours</li>
              </ul>
            </div>
          </AltPopover>
          <AltButton variant="neon" @click="open = true"><template #icon-left><AltIcon name="layers" :size="15" /></template>Ouvrir le tiroir</AltButton>
        </div>
        <AltDrawer v-model="open" eyebrow="Fiche" title="SRV-DEVOPS-PROD">
          <p style="font-size:14px;color:rgb(var(--alt-fg-muted))">Entrée glissée, verre dépoli, fermeture par Échap ou clic à l'extérieur.</p>
          <template #footer><AltButton variant="neon" @click="open = false">Fermer</AltButton></template>
        </AltDrawer>
      </div>`,
  }),
};
