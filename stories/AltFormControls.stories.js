import { ref } from "vue";
import {
  AltTextarea,
  AltSelect,
  AltCheckbox,
  AltRadioGroup,
  AltSwitch,
  AltFormField,
} from "../src/index.js";

export default {
  title: "Composants/Formulaire/Contrôles",
};

export const Textarea = {
  render: () => ({
    components: { AltTextarea, AltFormField },
    setup: () => ({ v: ref("") }),
    template: `
      <AltFormField label="Commentaire" hint="500 caractères maximum" style="max-width:420px">
        <AltTextarea v-model="v" :rows="4" :maxlength="500" placeholder="Votre message…" />
      </AltFormField>`,
  }),
};

export const Select = {
  render: () => ({
    components: { AltSelect, AltFormField },
    setup: () => ({
      v: ref(""),
      options: ["SAS", "SARL", "SA", "SCI", "EURL", "SNC", "GIE", "Association"],
    }),
    template: `
      <AltFormField label="Forme juridique" style="max-width:320px">
        <AltSelect v-model="v" :options="options" placeholder="— Sélectionner —" />
      </AltFormField>`,
  }),
};

export const Checkbox = {
  render: () => ({
    components: { AltCheckbox },
    setup: () => ({ single: ref(true), group: ref(["mail"]) }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <AltCheckbox v-model="single" label="Mandat de suppléant" />
        <div style="display:flex;flex-direction:column;gap:8px;">
          <AltCheckbox v-model="group" value="mail" label="Inclure dans le mail" />
          <AltCheckbox v-model="group" value="sms" label="Notifier par SMS" />
          <AltCheckbox v-model="group" value="copy" label="Mettre en copie le signataire" />
          <p style="font-size:12px;color:#6b7280;">Sélection : {{ group.join(", ") || "aucune" }}</p>
        </div>
      </div>`,
  }),
};

export const RadioGroup = {
  render: () => ({
    components: { AltRadioGroup },
    setup: () => ({
      v: ref("audit"),
      options: [
        { value: "audit", label: "Altonéo Audit" },
        { value: "dev", label: "Altonéo Développement" },
        { value: "conseil", label: "Altonéo Conseil" },
      ],
    }),
    template: `<AltRadioGroup v-model="v" :options="options" />`,
  }),
};

export const Switch = {
  render: () => ({
    components: { AltSwitch },
    setup: () => ({ a: ref(true), b: ref(false) }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <AltSwitch v-model="a" label="Notifications par e-mail" />
        <AltSwitch v-model="b" label="Mode archivé" size="sm" />
        <AltSwitch :model-value="true" label="Verrouillé" disabled />
      </div>`,
  }),
};
