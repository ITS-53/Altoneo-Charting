import { AltAlert } from "../src/index.js";

export default {
  title: "Composants/Retour utilisateur/AltAlert",
  component: AltAlert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "error"] },
    dismissible: { control: "boolean" },
  },
  args: {
    variant: "info",
    title: "Information",
    message: "Voici un message d'information contextuel.",
    dismissible: false,
  },
};

export const Playground = {
  render: (args) => ({
    components: { AltAlert },
    setup: () => ({ args }),
    template: `<AltAlert v-bind="args" style="max-width:520px" />`,
  }),
};

export const Variantes = {
  render: () => ({
    components: { AltAlert },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:520px;">
        <AltAlert variant="info" title="Information" message="Un nouveau contrôle est disponible." />
        <AltAlert variant="success" title="Envoyé" message="Les e-mails de circularisation ont bien été envoyés." />
        <AltAlert variant="warning" title="Attention" message="3 associés n'ont pas encore répondu." dismissible />
        <AltAlert variant="error" title="Erreur" message="L'envoi a échoué. Vérifiez la configuration SMTP." dismissible />
      </div>`,
  }),
};
