import { ref } from "vue";
import { AltInput, AltFormField } from "../src/index.js";

export default {
  title: "Composants/Formulaire/AltInput",
  component: AltInput,
  tags: ["autodocs"],
  argTypes: {
    state: { control: "select", options: ["default", "error", "success"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: { control: "select", options: ["text", "email", "password", "number", "date", "search"] },
    disabled: { control: "boolean" },
  },
  args: { placeholder: "Saisissez…", state: "default", size: "md", type: "text", disabled: false },
};

export const Playground = {
  render: (args) => ({
    components: { AltInput },
    setup() {
      const v = ref("");
      return { args, v };
    },
    template: `<AltInput v-bind="args" v-model="v" style="max-width:320px" />`,
  }),
};

export const Etats = {
  name: "États",
  render: () => ({
    components: { AltInput, AltFormField },
    setup: () => ({ a: ref("contact@altoneo.fr"), b: ref("invalide"), c: ref("") }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:340px;">
        <AltFormField label="Champ normal" hint="Texte d'aide affiché sous le champ.">
          <AltInput v-model="c" placeholder="ex: MARTIN SAS" />
        </AltFormField>
        <AltFormField label="Champ valide">
          <AltInput v-model="a" state="success" />
        </AltFormField>
        <AltFormField label="Champ en erreur" error="Adresse e-mail invalide">
          <AltInput v-model="b" state="error" />
        </AltFormField>
        <AltFormField label="Champ désactivé">
          <AltInput model-value="Lecture seule" disabled />
        </AltFormField>
      </div>`,
  }),
};

export const AvecAffixes = {
  name: "Préfixe / suffixe",
  render: () => ({
    components: { AltInput },
    setup: () => ({ v: ref("") }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px;">
        <AltInput v-model="v" placeholder="Rechercher">
          <template #prefix>
            <svg style="width:16px;height:16px" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          </template>
        </AltInput>
        <AltInput v-model="v" type="number" placeholder="0">
          <template #suffix><span style="font-size:13px">€</span></template>
        </AltInput>
      </div>`,
  }),
};
