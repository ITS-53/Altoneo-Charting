<template>
  <AltAuthCard :title="title" :subtitle="subtitle" :background="background" :centered="centered" :brand="brand" size="md">
    <template v-if="$slots.logo" #logo><slot name="logo" /></template>

    <form class="space-y-4" novalidate @submit="onSubmit">
      <AltAlert v-if="error" variant="error" :message="error" />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AltFormField label="Prénom" required :error="form.touched.firstName ? form.errors.firstName : ''">
          <AltInput v-model="form.values.firstName" autocomplete="given-name" :state="fieldState('firstName')" @blur="form.handleBlur('firstName')" />
        </AltFormField>
        <AltFormField label="Nom" required :error="form.touched.lastName ? form.errors.lastName : ''">
          <AltInput v-model="form.values.lastName" autocomplete="family-name" :state="fieldState('lastName')" @blur="form.handleBlur('lastName')" />
        </AltFormField>
      </div>

      <AltFormField label="Adresse e-mail" required :error="form.touched.email ? form.errors.email : ''">
        <AltInput v-model="form.values.email" type="email" autocomplete="email" placeholder="vous@altoneo.fr" :state="fieldState('email')" @blur="form.handleBlur('email')" />
      </AltFormField>

      <AltFormField label="Mot de passe" required hint="8 caractères minimum" :error="form.touched.password ? form.errors.password : ''">
        <AltInput v-model="form.values.password" type="password" autocomplete="new-password" :state="fieldState('password')" @blur="form.handleBlur('password')" />
      </AltFormField>

      <AltFormField label="Confirmer le mot de passe" required :error="form.touched.confirm ? form.errors.confirm : ''">
        <AltInput v-model="form.values.confirm" type="password" autocomplete="new-password" :state="fieldState('confirm')" @blur="form.handleBlur('confirm')" />
      </AltFormField>

      <div>
        <AltCheckbox v-model="form.values.cgu" @change="form.handleBlur('cgu')">
          J'accepte les <a v-if="termsHref" :href="termsHref" class="text-altoneo-500 dark:text-alt-dark-link hover:underline">conditions d'utilisation</a><span v-else>conditions d'utilisation</span>
        </AltCheckbox>
        <p v-if="form.touched.cgu && form.errors.cgu" class="text-red-600 text-sm mt-1">{{ form.errors.cgu }}</p>
      </div>

      <AltButton type="submit" variant="primary" block :loading="loading">{{ submitLabel }}</AltButton>

      <slot name="extra" />
    </form>

    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </AltAuthCard>
</template>

<script setup>
import { computed } from "vue";
import AltAuthCard from "./AltAuthCard.vue";
import AltFormField from "./AltFormField.vue";
import AltInput from "./AltInput.vue";
import AltCheckbox from "./AltCheckbox.vue";
import AltButton from "./AltButton.vue";
import AltAlert from "./AltAlert.vue";
import { useForm } from "../composables/useForm.js";
import { required, email, minLength, sameAs } from "../composables/useValidation.js";

const props = defineProps({
  title: { type: String, default: "Créer un compte" },
  subtitle: { type: String, default: "Rejoignez votre espace Altonéo" },
  submitLabel: { type: String, default: "Créer le compte" },
  error: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  termsHref: { type: String, default: "" },
  background: { type: Boolean, default: true },
  centered: { type: Boolean, default: true },
  /** Marque du logo : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
});

const emit = defineEmits(["submit"]);

const form = useForm(
  { firstName: "", lastName: "", email: "", password: "", confirm: "", cgu: false },
  {
    firstName: [required()],
    lastName: [required()],
    email: [required(), email()],
    password: [required(), minLength(8)],
    confirm: [required(), sameAs("password", "Les mots de passe ne correspondent pas")],
    cgu: [required("Vous devez accepter les conditions")],
  },
);

const fieldState = (name) =>
  form.errors[name] && form.touched[name] ? "error" : "default";

const onSubmit = form.handleSubmit((values) => emit("submit", values));
</script>
