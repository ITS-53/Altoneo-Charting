import { ref } from "vue";
import {
  AltProgress,
  AltStat,
  AltDivider,
  AltBreadcrumb,
  AltEmptyState,
  AltChip,
  AltSkeleton,
  AltThemeToggle,
  AltSwitch,
  AltButton,
} from "../src/index.js";

export default {
  title: "Composants/Utilitaires/Aperçu",
};

export const Progress = {
  render: () => ({
    components: { AltProgress },
    template: `
      <div style="max-width:420px;display:flex;flex-direction:column;gap:16px;">
        <AltProgress :value="72" label="Contrôles traités" show-value />
        <AltProgress :value="45" variant="navy" />
        <AltProgress :value="90" variant="success" size="sm" />
        <AltProgress :value="30" variant="danger" size="lg" />
        <AltProgress indeterminate label="Chargement…" />
      </div>`,
  }),
};

export const Stat = {
  name: "Stat (KPI)",
  render: () => ({
    components: { AltStat },
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:720px;">
        <AltStat label="Contrôles en cours" :value="12" :delta="8" hint="vs mois dernier">
          <template #icon><svg style="width:20px;height:20px" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg></template>
        </AltStat>
        <AltStat label="Taux de réponse" value="86%" :delta="-3" hint="7 derniers jours" />
        <AltStat label="Clôturés (mois)" :value="28" :delta="12" />
      </div>`,
  }),
};

export const Divider = {
  render: () => ({
    components: { AltDivider },
    template: `
      <div style="max-width:420px;">
        <p style="color:#374151;margin:0">Section A</p>
        <AltDivider />
        <p style="color:#374151;margin:0">Section B</p>
        <AltDivider label="ou" />
        <p style="color:#374151;margin:0">Section C</p>
      </div>`,
  }),
};

export const Breadcrumb = {
  render: () => ({
    components: { AltBreadcrumb },
    setup: () => ({ items: [{ label: "Accueil", to: "#" }, { label: "Clients", to: "#" }, { label: "MARTIN SAS" }] }),
    template: `<AltBreadcrumb :items="items" />`,
  }),
};

export const Chips = {
  render: () => ({
    components: { AltChip },
    setup() {
      const tags = ref(["Audit", "CAC", "2026", "Prioritaire"]);
      const remove = (t) => (tags.value = tags.value.filter((x) => x !== t));
      return { tags, remove };
    },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <AltChip v-for="t in tags" :key="t" :label="t" variant="info" removable @remove="remove(t)" />
        <AltChip label="primary" variant="primary" />
        <AltChip label="success" variant="success" />
        <AltChip label="error" variant="error" />
      </div>`,
  }),
};

export const Skeleton = {
  render: () => ({
    components: { AltSkeleton },
    template: `
      <div style="max-width:360px;display:flex;gap:12px;align-items:center;">
        <AltSkeleton variant="circle" width="3rem" />
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          <AltSkeleton variant="text" width="70%" />
          <AltSkeleton variant="text" width="40%" />
        </div>
      </div>`,
  }),
};

export const ThemeToggleEtSwitch = {
  name: "ThemeToggle & Switch (alignement corrigé)",
  render: () => ({
    components: { AltThemeToggle, AltSwitch },
    setup: () => ({ a: ref(true), b: ref(false) }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="color:#6b7280;font-size:14px">Bascule de thème :</span>
          <AltThemeToggle :storage-key="''" />
        </div>
        <AltSwitch v-model="a" label="Notifications par e-mail" />
        <AltSwitch v-model="b" size="sm" label="Mode archivé (petit)" />
        <p style="font-size:13px;color:#6b7280">Le pouce du switch est désormais parfaitement centré verticalement.</p>
      </div>`,
  }),
};

export const EmptyState = {
  render: () => ({
    components: { AltEmptyState, AltButton },
    template: `
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;max-width:480px;">
        <AltEmptyState title="Aucun contrôle" description="Vous n'avez pas encore créé de contrôle d'indépendance.">
          <template #action><AltButton variant="primary">+ Nouveau contrôle</AltButton></template>
        </AltEmptyState>
      </div>`,
  }),
};
