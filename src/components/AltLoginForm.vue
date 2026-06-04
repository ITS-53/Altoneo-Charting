<template>
  <AltAuthCard :title="title" :subtitle="subtitle" :background="background" :centered="centered" :brand="brand">
    <template v-if="$slots.logo" #logo><slot name="logo" /></template>

    <form class="space-y-4" novalidate @submit="onSubmit">
      <AltAlert v-if="error" variant="error" :message="error" />

      <AltFormField label="Adresse e-mail" required :error="form.touched.email ? form.errors.email : ''">
        <AltInput
          v-model="form.values.email"
          type="email"
          autocomplete="email"
          placeholder="vous@altoneo.fr"
          :state="fieldState('email')"
          @blur="form.handleBlur('email')"
        >
          <template #prefix>
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          </template>
        </AltInput>
      </AltFormField>

      <AltFormField label="Mot de passe" required :error="form.touched.password ? form.errors.password : ''">
        <AltInput
          v-model="form.values.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="••••••••"
          :state="fieldState('password')"
          @blur="form.handleBlur('password')"
        >
          <template #suffix>
            <button type="button" class="text-gray-400 hover:text-gray-600" tabindex="-1" @click="showPassword = !showPassword">
              <svg v-if="showPassword" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.262l1.514 1.514a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
            </button>
          </template>
        </AltInput>
      </AltFormField>

      <div class="flex items-center justify-between">
        <AltCheckbox v-if="showRemember" v-model="form.values.remember" label="Se souvenir de moi" />
        <a v-if="forgotHref" :href="forgotHref" class="text-sm text-altoneo-500 dark:text-alt-dark-link hover:underline ml-auto">Mot de passe oublié ?</a>
      </div>

      <AltButton type="submit" variant="primary" block :loading="loading">
        {{ submitLabel }}
      </AltButton>

      <slot name="extra" />
    </form>

    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </AltAuthCard>
</template>

<script setup>
import { ref, computed } from "vue";
import AltAuthCard from "./AltAuthCard.vue";
import AltFormField from "./AltFormField.vue";
import AltInput from "./AltInput.vue";
import AltCheckbox from "./AltCheckbox.vue";
import AltButton from "./AltButton.vue";
import AltAlert from "./AltAlert.vue";
import { useForm } from "../composables/useForm.js";
import { required, email } from "../composables/useValidation.js";

const props = defineProps({
  title: { type: String, default: "Connexion" },
  subtitle: { type: String, default: "Accédez à votre espace Altonéo" },
  submitLabel: { type: String, default: "Se connecter" },
  /** Message d'erreur serveur affiché en haut. */
  error: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  showRemember: { type: Boolean, default: true },
  forgotHref: { type: String, default: "" },
  background: { type: Boolean, default: true },
  centered: { type: Boolean, default: true },
  /** Marque du logo : 'altoneo' | 'its'. */
  brand: { type: String, default: "altoneo" },
});

const emit = defineEmits(["submit"]);
const showPassword = ref(false);

const form = useForm(
  { email: "", password: "", remember: false },
  { email: [required(), email()], password: [required("Le mot de passe est requis")] },
);

const fieldState = (name) =>
  form.errors[name] && form.touched[name] ? "error" : "default";

const onSubmit = form.handleSubmit((values) => emit("submit", values));
</script>
