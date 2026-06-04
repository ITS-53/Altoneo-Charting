import {
  AltInput,
  AltSelect,
  AltCheckbox,
  AltFormField,
  AltButton,
  AltAlert,
  useForm,
  required,
  email,
  minLength,
  sameAs,
} from "../src/index.js";

export default {
  title: "Composants/Formulaire/Validation (useForm)",
  parameters: {
    docs: {
      description: {
        component:
          "Démonstration de `useForm` + règles de validation. La validation se déclenche au blur et au submit. Le bouton reste désactivé tant que le formulaire n'est pas valide.",
      },
    },
  },
};

export const InscriptionComplete = {
  name: "Formulaire validé",
  render: () => ({
    components: { AltInput, AltSelect, AltCheckbox, AltFormField, AltButton, AltAlert },
    setup() {
      const form = useForm(
        { name: "", email: "", company: "", password: "", confirm: "", cgu: false },
        {
          name: [required("Le nom est requis")],
          email: [required(), email()],
          company: [required("Sélectionnez une entité")],
          password: [required(), minLength(8)],
          confirm: [required(), sameAs("password", "Les mots de passe diffèrent")],
          cgu: [required("Vous devez accepter les conditions")],
        },
      );
      const submitted = useFormSubmitted();
      const onSubmit = form.handleSubmit(() => {
        submitted.value = true;
      });
      return { form, onSubmit, submitted };
    },
    template: `
      <form @submit="onSubmit" style="max-width:380px;display:flex;flex-direction:column;gap:14px;" novalidate>
        <AltAlert v-if="submitted" variant="success" message="Formulaire valide et soumis ! 🎉" />

        <AltFormField label="Nom" required :error="form.touched.name ? form.errors.name : ''">
          <AltInput v-model="form.values.name" :state="form.errors.name && form.touched.name ? 'error' : 'default'" @blur="form.handleBlur('name')" placeholder="ex: MARTIN SAS" />
        </AltFormField>

        <AltFormField label="E-mail" required :error="form.touched.email ? form.errors.email : ''">
          <AltInput v-model="form.values.email" type="email" :state="form.errors.email && form.touched.email ? 'error' : 'default'" @blur="form.handleBlur('email')" placeholder="contact@altoneo.fr" />
        </AltFormField>

        <AltFormField label="Entité" required :error="form.touched.company ? form.errors.company : ''">
          <AltSelect v-model="form.values.company" :options="['Altonéo Audit','Altonéo Développement','Altonéo Conseil']" placeholder="— Sélectionner —" :state="form.errors.company && form.touched.company ? 'error' : 'default'" @blur="form.handleBlur('company')" />
        </AltFormField>

        <AltFormField label="Mot de passe" required hint="8 caractères minimum" :error="form.touched.password ? form.errors.password : ''">
          <AltInput v-model="form.values.password" type="password" :state="form.errors.password && form.touched.password ? 'error' : 'default'" @blur="form.handleBlur('password')" />
        </AltFormField>

        <AltFormField label="Confirmation" required :error="form.touched.confirm ? form.errors.confirm : ''">
          <AltInput v-model="form.values.confirm" type="password" :state="form.errors.confirm && form.touched.confirm ? 'error' : 'default'" @blur="form.handleBlur('confirm')" />
        </AltFormField>

        <div>
          <AltCheckbox v-model="form.values.cgu" label="J'accepte les conditions d'utilisation" @change="form.handleBlur('cgu')" />
          <p v-if="form.touched.cgu && form.errors.cgu" style="color:#dc2626;font-size:13px;margin:4px 0 0;">{{ form.errors.cgu }}</p>
        </div>

        <AltButton type="submit" variant="primary" :disabled="!form.isValid">Créer le compte</AltButton>
        <p style="font-size:12px;color:#6b7280;">Formulaire valide : <strong>{{ form.isValid ? 'oui' : 'non' }}</strong></p>
      </form>`,
  }),
};

// petit helper local pour garder l'état "soumis" hors du composant setup
import { ref } from "vue";
function useFormSubmitted() {
  return ref(false);
}
