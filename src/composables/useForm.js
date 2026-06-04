import { reactive, computed, watch } from "vue";
import { validateValue } from "./useValidation.js";

/**
 * Gestion d'état de formulaire, sans dépendance.
 *
 * @param {Object} initialValues  Valeurs initiales { champ: valeur }.
 * @param {Object} schema         Schéma de règles { champ: [règles] }.
 * @param {Object} [options]
 * @param {boolean} [options.validateOnBlur=true]
 * @param {boolean} [options.validateOnChange=false]
 *
 * Retourne :
 *   values, errors, touched, dirty (réactifs),
 *   isValid, isDirty (computed),
 *   validateField(name), validate(), handleBlur(name),
 *   reset(), setValues(obj), setErrors(obj), handleSubmit(cb), fieldProps(name)
 */
export function useForm(initialValues = {}, schema = {}, options = {}) {
  const { validateOnBlur = true, validateOnChange = false } = options;

  const initial = JSON.parse(JSON.stringify(initialValues));
  const values = reactive({ ...initialValues });
  const errors = reactive({});
  const touched = reactive({});

  function validateField(name) {
    const rules = schema[name] || [];
    const error = validateValue(values[name], rules, values);
    if (error) errors[name] = error;
    else delete errors[name];
    return !error;
  }

  function validate() {
    let ok = true;
    for (const name of Object.keys(schema)) {
      touched[name] = true;
      if (!validateField(name)) ok = false;
    }
    return ok;
  }

  function handleBlur(name) {
    touched[name] = true;
    if (validateOnBlur) validateField(name);
  }

  if (validateOnChange) {
    watch(
      () => ({ ...values }),
      (nv, ov) => {
        for (const name of Object.keys(schema)) {
          if (touched[name] && nv[name] !== ov?.[name]) validateField(name);
        }
      },
      { deep: true },
    );
  }

  const isValid = computed(() =>
    Object.keys(schema).every(
      (name) => validateValue(values[name], schema[name] || [], values) === null,
    ),
  );

  const isDirty = computed(
    () => JSON.stringify(values) !== JSON.stringify(initial),
  );

  function reset(newValues) {
    const base = newValues ?? initial;
    Object.keys(values).forEach((k) => delete values[k]);
    Object.assign(values, JSON.parse(JSON.stringify(base)));
    Object.keys(errors).forEach((k) => delete errors[k]);
    Object.keys(touched).forEach((k) => delete touched[k]);
  }

  function setValues(obj) {
    Object.assign(values, obj);
  }

  function setErrors(obj) {
    Object.assign(errors, obj);
  }

  function handleSubmit(callback) {
    return async (event) => {
      if (event?.preventDefault) event.preventDefault();
      if (!validate()) return false;
      return callback ? await callback({ ...values }) : true;
    };
  }

  /** Props prêtes à brancher sur un AltFormField / AltInput. */
  function fieldProps(name) {
    return {
      modelValue: values[name],
      error: touched[name] ? errors[name] : undefined,
      "onUpdate:modelValue": (v) => {
        values[name] = v;
        if (validateOnChange && touched[name]) validateField(name);
      },
      onBlur: () => handleBlur(name),
    };
  }

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    validateField,
    validate,
    handleBlur,
    reset,
    setValues,
    setErrors,
    handleSubmit,
    fieldProps,
  };
}

export default useForm;
