import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AltRegisterForm from "../../src/components/AltRegisterForm.vue";

const inputs = (wrapper) => wrapper.findAll("input");

/** Remplit dans l'ordre : prénom, nom, e-mail, mot de passe, confirmation. */
const fill = async (wrapper, values) => {
  const fields = inputs(wrapper).filter((i) => i.attributes("type") !== "checkbox");
  for (const [i, v] of values.entries()) await fields[i].setValue(v);
};

const acceptTerms = (wrapper) =>
  wrapper.find('input[type="checkbox"]').setValue(true);

describe("Parcours : inscription", () => {
  it("bloque l'envoi tant que les CGU ne sont pas acceptées", async () => {
    const wrapper = mount(AltRegisterForm);
    await fill(wrapper, ["Jean", "Dupont", "jean@altoneo.fr", "motdepasse", "motdepasse"]);
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
    expect(wrapper.text()).toContain("Vous devez accepter les conditions");
  });

  it("exige un mot de passe de 8 caractères et une confirmation identique", async () => {
    const wrapper = mount(AltRegisterForm);
    await fill(wrapper, ["Jean", "Dupont", "jean@altoneo.fr", "court", "autre"]);
    await acceptTerms(wrapper);
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
    expect(wrapper.text()).toContain("8 caractères minimum");
    expect(wrapper.text()).toContain("Les mots de passe ne correspondent pas");
  });

  it("émet le compte quand tout est valide", async () => {
    const wrapper = mount(AltRegisterForm);
    await fill(wrapper, ["Jean", "Dupont", "jean@altoneo.fr", "motdepasse", "motdepasse"]);
    await acceptTerms(wrapper);
    await wrapper.find("form").trigger("submit");
    await Promise.resolve();
    expect(wrapper.emitted("submit")?.[0][0]).toEqual({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@altoneo.fr",
      password: "motdepasse",
      confirm: "motdepasse",
      cgu: true,
    });
  });
});
