<template>
  <form class="space-y-4" novalidate @submit="onSubmit">
    <AltAlert v-if="success" variant="success" :message="successMessage" />
    <AltAlert v-if="error" variant="error" :message="error" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AltFormField label="Nom complet" required :error="form.touched.name ? form.errors.name : ''">
        <AltInput v-model="form.values.name" autocomplete="name" :state="fieldState('name')" @blur="form.handleBlur('name')" />
      </AltFormField>
      <AltFormField label="Adresse e-mail" required :error="form.touched.email ? form.errors.email : ''">
        <AltInput v-model="form.values.email" type="email" autocomplete="email" :state="fieldState('email')" @blur="form.handleBlur('email')" />
      </AltFormField>
    </div>

    <AltFormField v-if="showSubject" label="Sujet" required :error="form.touched.subject ? form.errors.subject : ''">
      <AltInput v-model="form.values.subject" :state="fieldState('subject')" @blur="form.handleBlur('subject')" />
    </AltFormField>

    <AltFormField label="Message" required :error="form.touched.message ? form.errors.message : ''">
      <AltTextarea v-model="form.values.message" :rows="5" placeholder="Votre message…" :state="fieldState('message')" @blur="form.handleBlur('message')" />
    </AltFormField>

    <div class="flex justify-end">
      <AltButton type="submit" variant="primary" :loading="loading">{{ submitLabel }}</AltButton>
    </div>
  </form>
</template>

<script setup>
import { computed } from "vue";
import AltFormField from "./AltFormField.vue";
import AltInput from "./AltInput.vue";
import AltTextarea from "./AltTextarea.vue";
import AltButton from "./AltButton.vue";
import AltAlert from "./AltAlert.vue";
import { useForm } from "../composables/useForm.js";
import { required, email, minLength } from "../composables/useValidation.js";

const props = defineProps({
  submitLabel: { type: String, default: "Envoyer" },
  showSubject: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
  success: { type: Boolean, default: false },
  successMessage: { type: String, default: "Votre message a bien été envoyé." },
});

const emit = defineEmits(["submit"]);

const schema = {
  name: [required()],
  email: [required(), email()],
  message: [required(), minLength(10, "Votre message est trop court")],
};
if (props.showSubject) schema.subject = [required()];

const form = useForm(
  { name: "", email: "", subject: "", message: "" },
  schema,
);

const fieldState = (name) =>
  form.errors[name] && form.touched[name] ? "error" : "default";

const onSubmit = form.handleSubmit((values) => emit("submit", values));
</script>
