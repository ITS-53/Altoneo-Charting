import { describe, it, expect, vi } from "vitest";
import { nextTick } from "vue";
import { useForm } from "../../src/composables/useForm.js";
import { required, email, minLength, sameAs } from "../../src/composables/useValidation.js";

const schema = {
  email: [required(), email()],
  password: [required(), minLength(8)],
  confirm: [sameAs("password", "Différent")],
};

const makeForm = (options) =>
  useForm({ email: "", password: "", confirm: "" }, schema, options);

describe("useForm", () => {
  it("démarre invalide, propre et sans erreur affichée", () => {
    const form = makeForm();
    expect(form.isValid.value).toBe(false);
    expect(form.isDirty.value).toBe(false);
    expect(form.errors).toEqual({});
  });

  it("validate() marque tous les champs touchés et remplit les erreurs", () => {
    const form = makeForm();
    expect(form.validate()).toBe(false);
    expect(form.touched).toEqual({ email: true, password: true, confirm: true });
    expect(form.errors.email).toBe("Ce champ est requis");
    expect(form.errors.password).toBe("Ce champ est requis");
  });

  it("devient valide quand les règles inter-champs sont satisfaites", () => {
    const form = makeForm();
    form.setValues({ email: "a@b.fr", password: "12345678", confirm: "1234" });
    expect(form.isValid.value).toBe(false);
    form.setValues({ confirm: "12345678" });
    expect(form.isValid.value).toBe(true);
    expect(form.isDirty.value).toBe(true);
  });

  it("handleBlur valide le champ quitté (validateOnBlur par défaut)", () => {
    const form = makeForm();
    form.values.email = "pas-un-mail";
    form.handleBlur("email");
    expect(form.touched.email).toBe(true);
    expect(form.errors.email).toBe("Adresse e-mail invalide");
    expect(form.errors.password).toBeUndefined();
  });

  it("validateOnChange revalide un champ touché à la frappe", async () => {
    const form = makeForm({ validateOnChange: true });
    form.handleBlur("email");
    expect(form.errors.email).toBeDefined();
    form.values.email = "a@b.fr";
    await nextTick();
    expect(form.errors.email).toBeUndefined();
  });

  it("fieldProps n'expose l'erreur qu'une fois le champ touché", () => {
    const form = makeForm();
    form.validateField("email");
    expect(form.fieldProps("email").error).toBeUndefined();
    form.fieldProps("email").onBlur();
    expect(form.fieldProps("email").error).toBe("Ce champ est requis");
    form.fieldProps("email")["onUpdate:modelValue"]("x@y.fr");
    expect(form.values.email).toBe("x@y.fr");
  });

  it("handleSubmit bloque l'envoi si invalide", async () => {
    const form = makeForm();
    const cb = vi.fn();
    const preventDefault = vi.fn();
    expect(await form.handleSubmit(cb)({ preventDefault })).toBe(false);
    expect(preventDefault).toHaveBeenCalled();
    expect(cb).not.toHaveBeenCalled();
  });

  it("handleSubmit transmet une copie des valeurs si valide", async () => {
    const form = makeForm();
    form.setValues({ email: "a@b.fr", password: "12345678", confirm: "12345678" });
    const cb = vi.fn(async () => "ok");
    expect(await form.handleSubmit(cb)()).toBe("ok");
    const sent = cb.mock.calls[0][0];
    expect(sent).toEqual({ email: "a@b.fr", password: "12345678", confirm: "12345678" });
    sent.email = "modifie@b.fr";
    expect(form.values.email).toBe("a@b.fr");
  });

  it("reset() restaure les valeurs initiales et vide erreurs et touchés", () => {
    const form = makeForm();
    form.setValues({ email: "x" });
    form.validate();
    form.reset();
    expect(form.values).toEqual({ email: "", password: "", confirm: "" });
    expect(form.errors).toEqual({});
    expect(form.touched).toEqual({});
    expect(form.isDirty.value).toBe(false);
  });

  it("ne partage pas les objets initiaux avec l'état", () => {
    const initial = { tags: ["a"] };
    const form = useForm(initial, {});
    form.values.tags = ["a", "b"];
    form.reset();
    expect(form.values.tags).toEqual(["a"]);
    expect(initial.tags).toEqual(["a"]);
  });
});
