import { AltAurora, AltButton, AltGlassCard, AltIcon, AltScoreRing } from "../../src/index.js";

export default {
  title: "Altonéo Next/Surfaces et effets",
  parameters: { layout: "fullscreen" },
};

const stage = "position:relative;min-height:100vh;padding:40px;overflow:hidden;isolation:isolate";

export const Heros = {
  name: "Bandeau héros",
  render: () => ({
    components: { AltAurora, AltGlassCard, AltButton, AltIcon, AltScoreRing },
    template: `
      <div class="dark" :style="stage">
        <AltAurora :fixed="false" />
        <AltGlassCard shine padding="lg" style="max-width:880px">
          <div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
            <AltScoreRing :value="86" :size="150" label="Note du parc" />
            <div style="flex:1;min-width:260px">
              <div class="alt-eyebrow">Parc ITS-53 · aujourd'hui</div>
              <h1 class="alt-display" style="font-size:40px;line-height:1.05;color:rgb(var(--alt-fg));margin:6px 0 10px">
                Infrastructure <span class="alt-text-gold">sous contrôle</span>
              </h1>
              <p style="color:rgb(var(--alt-fg-muted));font-size:14px;max-width:46ch">
                Verre dépoli, liseré lumineux, reflet périodique, aurores et grille en perspective :
                le vocabulaire visuel d'Aud'IT, désormais dans la charte.
              </p>
              <div style="display:flex;gap:10px;margin-top:18px">
                <AltButton variant="neon" magnetic><template #icon-left><AltIcon name="play" :size="15" /></template>Lancer</AltButton>
                <button class="alt-chip"><AltIcon name="clock" :size="13" /> Prochain passage 02:30</button>
              </div>
            </div>
          </div>
        </AltGlassCard>
      </div>`,
    setup: () => ({ stage }),
  }),
};

export const Cartes = {
  name: "Cartes premium",
  render: () => ({
    components: { AltGlassCard, AltIcon },
    template: `
      <div class="dark" :style="stage + ';background:rgb(var(--alt-ink-900))'">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;max-width:1100px">
          <AltGlassCard eyebrow="Par défaut" title="Liseré or en bas">
            <p style="color:rgb(var(--alt-fg-muted));font-size:13px">Halo qui suit le pointeur : survolez la carte.</p>
          </AltGlassCard>
          <AltGlassCard eyebrow="accent=left" title="Constat critique" accent="left" accent-color="var(--alt-sev-critical)" neon>
            <p style="color:rgb(var(--alt-fg-muted));font-size:13px">Liseré gauche dans la couleur de gravité, surbrillance néon au survol.</p>
          </AltGlassCard>
          <AltGlassCard eyebrow="sheen" title="Reflet au survol" sheen accent="left" accent-color="var(--alt-neon-cyan)">
            <p style="color:rgb(var(--alt-fg-muted));font-size:13px">Un éclat balaie la carte quand on la survole.</p>
          </AltGlassCard>
          <AltGlassCard eyebrow="shine" title="Reflet périodique" shine>
            <p style="color:rgb(var(--alt-fg-muted));font-size:13px">Pour un bandeau de synthèse : un éclat toutes les 7 s (coupé en mode sobre).</p>
          </AltGlassCard>
        </div>
      </div>`,
    setup: () => ({ stage }),
  }),
};

export const Primitives = {
  name: "Classes utilitaires",
  render: () => ({
    components: { AltIcon },
    template: `
      <div :style="stage + ';background:rgb(var(--alt-ink-900))'">
        <div style="display:grid;gap:22px;max-width:760px;color:rgb(var(--alt-fg))">
          <div><div class="alt-eyebrow">.alt-eyebrow</div><div class="alt-display" style="font-size:28px">.alt-display — Space Grotesk</div></div>
          <div class="alt-display" style="font-size:32px"><span class="alt-text-gold">.alt-text-gold</span> · <span class="alt-text-azure">.alt-text-azure</span></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="alt-btn-neon"><AltIcon name="spark" :size="15" /> .alt-btn-neon</button>
            <span class="alt-chip"><span class="alt-pulse" style="width:8px;height:8px;border-radius:9px;background:rgb(var(--alt-neon-mint))"></span> .alt-chip + .alt-pulse</span>
            <span><span class="alt-kbd">Ctrl</span> <span class="alt-kbd">K</span></span>
          </div>
          <input class="alt-field" placeholder=".alt-field — focus néon cyan" />
          <div class="alt-glass" style="padding:16px;font-size:13px">.alt-glass — verre dépoli</div>
        </div>
      </div>`,
    setup: () => ({ stage }),
  }),
};
