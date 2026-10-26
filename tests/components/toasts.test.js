import { describe, it, expect, vi, afterEach } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import AltToastContainer from "../../src/components/AltToastContainer.vue";
import { createToastStore, useToast } from "../../src/composables/useToast.js";

/** Application minimale : le magasin à la racine, le conteneur dedans. */
function mountApp() {
  let api;
  const App = defineComponent({
    setup() {
      api = createToastStore();
      return () => h(AltToastContainer);
    },
  });
  const wrapper = mount(App, { attachTo: document.body });
  return { wrapper, api: () => api };
}

describe("Parcours : notifications (toasts)", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("affiche un toast puis le retire après sa durée", async () => {
    vi.useFakeTimers();
    const { api } = mountApp();
    api().success("Rapport enregistré", { duration: 1000 });
    await nextTick();
    expect(document.body.textContent).toContain("Rapport enregistré");
    expect(api().toasts[0].variant).toBe("success");
    vi.advanceTimersByTime(1000);
    expect(api().toasts).toHaveLength(0);
  });

  it("garde un toast persistant (durée 0) jusqu'à suppression", () => {
    vi.useFakeTimers();
    const { api } = mountApp();
    const id = api().push({ message: "Persistant", duration: 0 });
    vi.advanceTimersByTime(60_000);
    expect(api().toasts).toHaveLength(1);
    api().remove(id);
    expect(api().toasts).toHaveLength(0);
  });

  it("accepte une chaîne et applique les valeurs par défaut", () => {
    const { api } = mountApp();
    api().push("Bonjour");
    expect(api().toasts[0]).toMatchObject({ message: "Bonjour", variant: "info", duration: 4000 });
    api().clear();
    expect(api().toasts).toHaveLength(0);
  });

  it("useToast() sans magasin lève une erreur explicite", () => {
    const Orphan = defineComponent({
      setup() {
        useToast();
        return () => null;
      },
    });
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => mount(Orphan)).toThrow(/createToastStore/);
  });
});
