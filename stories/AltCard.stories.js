import { AltCard, AltButton, AltBadge } from "../src/index.js";

export default {
  title: "Composants/Données/AltCard",
  component: AltCard,
  tags: ["autodocs"],
  argTypes: {
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    bordered: { control: "boolean" },
    elevated: { control: "boolean" },
    hoverable: { control: "boolean" },
  },
  args: { title: "Titre de la carte", subtitle: "", padding: "md", bordered: true, elevated: false, hoverable: false },
};

export const Playground = {
  render: (args) => ({
    components: { AltCard },
    setup: () => ({ args }),
    template: `<AltCard v-bind="args" style="max-width:420px"><p style="color:#374151">Contenu de la carte. Glissez du texte, des formulaires ou des tableaux ici.</p></AltCard>`,
  }),
};

export const Complete = {
  name: "Header + corps + footer",
  render: () => ({
    components: { AltCard, AltButton, AltBadge },
    template: `
      <AltCard style="max-width:420px">
        <template #header>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <h3 style="font-weight:600;color:#1c284d;margin:0;">MARTIN SAS</h3>
            <AltBadge variant="completed" label="Terminé" />
          </div>
        </template>
        <p style="color:#374151;margin:0;">Contrôle d'indépendance clôturé le 12/05/2026. 8 associés circularisés, aucune anomalie.</p>
        <template #footer>
          <AltButton variant="secondary" size="sm">Détails</AltButton>
          <AltButton variant="primary" size="sm">Exporter</AltButton>
        </template>
      </AltCard>`,
  }),
};
