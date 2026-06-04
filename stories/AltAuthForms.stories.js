import { ref } from "vue";
import {
  AltLoginForm,
  AltRegisterForm,
  AltContactForm,
  AltAuthCard,
  AltButton,
} from "../src/index.js";

export default {
  title: "Composants/Formulaire/Authentification",
  parameters: { layout: "fullscreen" },
};

export const Connexion = {
  render: () => ({
    components: { AltLoginForm },
    setup() {
      const loading = ref(false);
      const result = ref("");
      const onSubmit = (values) => {
        loading.value = true;
        result.value = JSON.stringify(values);
        setTimeout(() => (loading.value = false), 1200);
      };
      return { loading, result, onSubmit };
    },
    template: `<AltLoginForm :loading="loading" forgot-href="#" @submit="onSubmit">
      <template #footer>Pas encore de compte ? <a href="#" style="color:#2d519f">Créer un compte</a></template>
    </AltLoginForm>`,
  }),
};

export const ConnexionAvecErreur = {
  name: "Connexion (erreur serveur)",
  render: () => ({
    components: { AltLoginForm },
    template: `<AltLoginForm error="Identifiants incorrects. Veuillez réessayer." forgot-href="#" />`,
  }),
};

export const ConnexionITSolutions = {
  name: "Connexion (logo IT Solutions)",
  render: () => ({
    components: { AltLoginForm },
    template: `<AltLoginForm brand="its" title="Espace IT Solutions" subtitle="Connectez-vous à votre compte" forgot-href="#" />`,
  }),
};

export const Inscription = {
  render: () => ({
    components: { AltRegisterForm },
    setup() {
      const onSubmit = (v) => console.log("register", v);
      return { onSubmit };
    },
    template: `<AltRegisterForm terms-href="#" @submit="onSubmit">
      <template #footer>Déjà inscrit ? <a href="#" style="color:#2d519f">Se connecter</a></template>
    </AltRegisterForm>`,
  }),
};

export const AuthCardPersonnalisee = {
  name: "AltAuthCard (gabarit générique)",
  render: () => ({
    components: { AltAuthCard, AltButton },
    template: `
      <AltAuthCard title="Mot de passe oublié" subtitle="Recevez un lien de réinitialisation">
        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="label">Adresse e-mail</label>
            <input class="input" placeholder="vous@altoneo.fr" />
          </div>
          <AltButton type="submit" variant="primary" block>Envoyer le lien</AltButton>
        </form>
        <template #footer><a href="#" style="color:#2d519f">Retour à la connexion</a></template>
      </AltAuthCard>`,
  }),
};

export const Contact = {
  parameters: { layout: "centered" },
  render: () => ({
    components: { AltContactForm },
    setup() {
      const loading = ref(false);
      const success = ref(false);
      const onSubmit = () => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          success.value = true;
        }, 1000);
      };
      return { loading, success, onSubmit };
    },
    template: `<div style="width:640px;max-width:100%;background:#fff;padding:28px;border-radius:14px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 16px;color:#1c284d;font-weight:700;">Nous contacter</h2>
      <AltContactForm :loading="loading" :success="success" @submit="onSubmit" />
    </div>`,
  }),
};
