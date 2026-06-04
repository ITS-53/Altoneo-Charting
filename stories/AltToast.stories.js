import {
  AltToastContainer,
  AltButton,
  createToastStore,
  useToast,
} from "../src/index.js";

export default {
  title: "Composants/Retour utilisateur/AltToast",
  parameters: {
    docs: {
      description: {
        component:
          "Appelez `createToastStore()` une fois (App.vue) et posez `<AltToastContainer />` à la racine. Déclenchez ensuite des toasts via `useToast()` n'importe où : `toast.success('Enregistré')`.",
      },
    },
  },
};

// Composant enfant : déclenche les toasts via useToast()
const Trigger = {
  components: { AltButton },
  setup() {
    const toast = useToast();
    return {
      ok: () => toast.success("Contrôle créé avec succès"),
      info: () => toast.info("3 associés n'ont pas encore répondu"),
      warn: () => toast.warning("Pensez à relancer les CAC", { title: "Rappel" }),
      err: () => toast.error("L'envoi a échoué", { title: "Erreur SMTP" }),
    };
  },
  template: `
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <AltButton variant="primary" @click="ok">Succès</AltButton>
      <AltButton variant="secondary" @click="info">Info</AltButton>
      <AltButton variant="navy" @click="warn">Avertissement</AltButton>
      <AltButton variant="danger" @click="err">Erreur</AltButton>
    </div>`,
};

export const Demo = {
  name: "Déclencher des toasts",
  render: () => ({
    components: { AltToastContainer, Trigger },
    setup() {
      createToastStore(); // fournit le store aux descendants
    },
    template: `
      <div>
        <Trigger />
        <AltToastContainer position="top-right" />
      </div>`,
  }),
};
