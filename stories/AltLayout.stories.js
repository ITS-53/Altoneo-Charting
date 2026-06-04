import { ref } from "vue";
import {
  AltAppLayout,
  AltSidebar,
  AltTopbar,
  AltFooter,
  AltButton,
  AltAvatar,
  AltBadge,
} from "../src/index.js";

export default {
  title: "Composants/Navigation/Layout",
  parameters: { layout: "fullscreen" },
};

const items = [
  { heading: "Pilotage" },
  { key: "dash", to: "/dashboard", label: "Tableau de bord" },
  { key: "controls", to: "/controls", label: "Contrôles", badge: 4 },
  { heading: "Référentiel" },
  { key: "clients", to: "/clients", label: "Clients" },
  { key: "assoc", to: "/associates", label: "Associés / CAC" },
  { key: "settings", to: "/settings", label: "Paramètres" },
];

export const AppLayoutComplet = {
  name: "AltAppLayout (shell complet)",
  render: () => ({
    components: { AltAppLayout, AltButton, AltAvatar, AltBadge },
    setup: () => ({ items }),
    template: `
      <AltAppLayout :items="items" title="Altonéo" page-title="Tableau de bord" active-path="/controls">
        <template #topbar-actions>
          <AltButton variant="primary" size="sm">+ Nouveau contrôle</AltButton>
          <AltAvatar name="Corentin Hayer" size="sm" />
        </template>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px;">
          <div class="card p-5"><p style="color:#6b7280;font-size:13px;margin:0">Contrôles en cours</p><p style="font-size:28px;font-weight:700;color:#1c284d;margin:4px 0 0">12</p></div>
          <div class="card p-5"><p style="color:#6b7280;font-size:13px;margin:0">En attente</p><p style="font-size:28px;font-weight:700;color:#1c284d;margin:4px 0 0">5</p></div>
          <div class="card p-5"><p style="color:#6b7280;font-size:13px;margin:0">Clôturés (mois)</p><p style="font-size:28px;font-weight:700;color:#1c284d;margin:4px 0 0">28</p></div>
        </div>
        <div class="card p-6"><p style="margin:0;color:#374151">Contenu de la page. Le bouton menu de la topbar replie la sidebar (desktop) ou ouvre le tiroir (mobile).</p></div>
      </AltAppLayout>`,
  }),
};

export const Sidebar = {
  render: () => ({
    components: { AltSidebar },
    setup: () => ({ items, collapsed: ref(false) }),
    template: `<div style="height:520px;display:flex;"><AltSidebar :items="items" :collapsed="collapsed" active-path="/clients" @update:collapsed="collapsed = $event" /><div style="flex:1;padding:24px;color:#6b7280">Cliquez sur « Réduire » en bas de la sidebar.</div></div>`,
  }),
};

export const Topbar = {
  render: () => ({
    components: { AltTopbar, AltButton, AltAvatar },
    template: `<AltTopbar title="Clients"><template #actions><AltButton variant="secondary" size="sm">Exporter</AltButton><AltButton variant="primary" size="sm">+ Ajouter</AltButton><AltAvatar name="Corentin Hayer" size="sm" /></template></AltTopbar>`,
  }),
};

export const Footer = {
  render: () => ({
    components: { AltFooter },
    setup: () => ({
      columns: [
        { title: "Produit", links: [{ label: "Fonctionnalités" }, { label: "Tarifs" }, { label: "Sécurité" }] },
        { title: "Société", links: [{ label: "À propos" }, { label: "Contact" }, { label: "Carrières" }] },
        { title: "Légal", links: [{ label: "Mentions légales" }, { label: "RGPD" }, { label: "CGU" }] },
      ],
    }),
    template: `<AltFooter :columns="columns" tagline="Outils d'audit et de contrôle pour les commissaires aux comptes." />`,
  }),
};
