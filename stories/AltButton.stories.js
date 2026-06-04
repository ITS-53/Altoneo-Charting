import { AltButton } from "../src/index.js";

export default {
  title: "Composants/Boutons & Actions/AltButton",
  component: AltButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "navy", "danger", "ghost"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    block: { control: "boolean" },
    onClick: { action: "click" },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    block: false,
    default: "Valider",
  },
};

const Template = (args) => ({
  components: { AltButton },
  setup: () => ({ args }),
  template: `<AltButton v-bind="args" @click="args.onClick">{{ args.default }}</AltButton>`,
});

export const Playground = Template.bind({});

export const Variantes = {
  render: () => ({
    components: { AltButton },
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <AltButton variant="primary">Primary</AltButton>
        <AltButton variant="secondary">Secondary</AltButton>
        <AltButton variant="navy">Navy</AltButton>
        <AltButton variant="danger">Danger</AltButton>
        <AltButton variant="ghost">Ghost</AltButton>
      </div>`,
  }),
};

export const Tailles = {
  render: () => ({
    components: { AltButton },
    template: `
      <div style="display:flex;gap:12px;align-items:center;">
        <AltButton size="xs">XS</AltButton>
        <AltButton size="sm">SM</AltButton>
        <AltButton size="md">MD</AltButton>
        <AltButton size="lg">LG</AltButton>
      </div>`,
  }),
};

export const Etats = {
  name: "États (loading / disabled)",
  render: () => ({
    components: { AltButton },
    template: `
      <div style="display:flex;gap:12px;align-items:center;">
        <AltButton :loading="true">Chargement</AltButton>
        <AltButton :disabled="true">Désactivé</AltButton>
        <AltButton variant="secondary" :disabled="true">Désactivé</AltButton>
      </div>`,
  }),
};

export const AvecIcones = {
  name: "Avec icônes (slots)",
  render: () => ({
    components: { AltButton },
    template: `
      <div style="display:flex;gap:12px;align-items:center;">
        <AltButton variant="primary">
          <template #icon-left>
            <svg style="width:16px;height:16px" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/></svg>
          </template>
          Ajouter
        </AltButton>
        <AltButton variant="navy">
          Suivant
          <template #icon-right>
            <svg style="width:16px;height:16px" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
          </template>
        </AltButton>
      </div>`,
  }),
};
