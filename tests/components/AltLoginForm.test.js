import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AltLoginForm from "../../src/components/AltLoginForm.vue";

const fill = async (wrapper, { email, password }) => {
  await wrapper.find('input[type="email"]').setValue(email);
  await wrapper.find('input[autocomplete="current-password"]').setValue(password);
};

describe("Parcours : connexion", () => {
  it("refuse l'envoi d'un formulaire vide et affiche les erreurs", async () => {
    const wrapper = mount(AltLoginForm);
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
    expect(wrapper.text()).toContain("Ce champ est requis");
    expect(wrapper.text()).toContain("Le mot de passe est requis");
  });

  it("refuse une adresse e-mail invalide", async () => {
    const wrapper = mount(AltLoginForm);
    await fill(wrapper, { email: "jean", password: "secret" });
    await wrapper.find("form").trigger("submit");
    expect(wrapper.emitted("submit")).toBeUndefined();
    expect(wrapper.text()).toContain("Adresse e-mail invalide");
  });

  it("émet les identifiants quand le formulaire est valide", async () => {
    const wrapper = mount(AltLoginForm);
    await fill(wrapper, { email: "jean@altoneo.fr", password: "secret" });
    await wrapper.find("form").trigger("submit");
    await Promise.resolve();
    expect(wrapper.emitted("submit")?.[0][0]).toEqual({
      email: "jean@altoneo.fr",
      password: "secret",
      remember: false,
    });
  });

  it("affiche l'erreur serveur et le lien mot de passe oublié", () => {
    const wrapper = mount(AltLoginForm, {
      props: { error: "Identifiants incorrects", forgotHref: "/oubli" },
    });
    expect(wrapper.text()).toContain("Identifiants incorrects");
    expect(wrapper.find('a[href="/oubli"]').exists()).toBe(true);
  });

  it("permet d'afficher le mot de passe", async () => {
    const wrapper = mount(AltLoginForm);
    const input = () => wrapper.find('input[autocomplete="current-password"]');
    expect(input().attributes("type")).toBe("password");
    await wrapper.find('button[type="button"]').trigger("click");
    expect(input().attributes("type")).toBe("text");
  });
});
