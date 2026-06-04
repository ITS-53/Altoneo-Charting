import { AltErrorPage } from "../src/index.js";

export default {
  title: "Composants/Pages/AltErrorPage",
  component: AltErrorPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    code: { control: "select", options: [401, 403, 404, 500, 502, 503] },
    showRetry: { control: "boolean" },
  },
  args: { code: 404, showRetry: false, homeHref: "#" },
};

export const Playground = {
  render: (args) => ({
    components: { AltErrorPage },
    setup: () => ({ args }),
    template: `<AltErrorPage v-bind="args" />`,
  }),
};

export const NonTrouve404 = {
  name: "404 — Page introuvable",
  render: () => ({ components: { AltErrorPage }, template: `<AltErrorPage :code="404" home-href="#" />` }),
};

export const AccesRefuse403 = {
  name: "403 — Accès refusé",
  render: () => ({ components: { AltErrorPage }, template: `<AltErrorPage :code="403" home-href="#" />` }),
};

export const NonAuthentifie401 = {
  name: "401 — Non authentifié",
  render: () => ({ components: { AltErrorPage }, template: `<AltErrorPage :code="401" home-href="#" />` }),
};

export const ServeurIndisponible = {
  name: "500 / 502 / 503 (avec Réessayer)",
  render: () => ({
    components: { AltErrorPage },
    template: `<AltErrorPage :code="502" show-retry home-href="#" @retry="() => {}" />`,
  }),
};

export const Personnalisee = {
  name: "Code personnalisé",
  render: () => ({
    components: { AltErrorPage },
    template: `<AltErrorPage code="🔒" title="Maintenance en cours" message="Nous revenons très vite. Merci de votre patience." home-href="#" />`,
  }),
};
