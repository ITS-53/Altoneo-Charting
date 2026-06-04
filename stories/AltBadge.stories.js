import { AltBadge } from "../src/index.js";

export default {
  title: "Composants/Retour utilisateur/AltBadge",
  component: AltBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "error", "navy", "gold", "pending", "sent", "partial", "completed", "draft"],
    },
    size: { control: "select", options: ["sm", "md"] },
  },
  args: { variant: "info", size: "md", label: "Badge" },
};

export const Playground = {
  render: (args) => ({
    components: { AltBadge },
    setup: () => ({ args }),
    template: `<AltBadge v-bind="args" />`,
  }),
};

export const Semantiques = {
  render: () => ({
    components: { AltBadge },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <AltBadge variant="neutral" label="Neutral" />
        <AltBadge variant="info" label="Info" />
        <AltBadge variant="success" label="Succès" />
        <AltBadge variant="warning" label="Attention" />
        <AltBadge variant="error" label="Erreur" />
        <AltBadge variant="navy" label="Navy" />
        <AltBadge variant="gold" label="Or" />
      </div>`,
  }),
};

export const StatutsMetier = {
  name: "Statuts métier",
  render: () => ({
    components: { AltBadge },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <AltBadge variant="draft" label="Brouillon" />
        <AltBadge variant="pending" label="En attente" />
        <AltBadge variant="sent" label="Envoyé" />
        <AltBadge variant="partial" label="Partiel" />
        <AltBadge variant="completed" label="Terminé" />
      </div>`,
  }),
};
