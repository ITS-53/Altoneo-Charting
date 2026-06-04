import { ref } from "vue";
import { AltModal, AltButton } from "../src/index.js";

export default {
  title: "Composants/Retour utilisateur/AltModal",
  component: AltModal,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
    closable: { control: "boolean" },
    closeOnOverlay: { control: "boolean" },
    closeOnEsc: { control: "boolean" },
  },
  args: { title: "Confirmer l'envoi", size: "md", closable: true, closeOnOverlay: true, closeOnEsc: true },
};

export const Playground = {
  render: (args) => ({
    components: { AltModal, AltButton },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <div>
        <AltButton variant="primary" @click="open = true">Ouvrir la modale</AltButton>
        <AltModal v-bind="args" v-model:open="open">
          <p style="color:#374151;margin:0;">Vous allez envoyer les e-mails de circularisation à 8 associés. Cette action est définitive.</p>
          <template #footer>
            <AltButton variant="secondary" @click="open = false">Annuler</AltButton>
            <AltButton variant="primary" @click="open = false">Confirmer l'envoi</AltButton>
          </template>
        </AltModal>
      </div>`,
  }),
};
