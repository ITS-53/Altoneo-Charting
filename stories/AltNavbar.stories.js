import { AltNavbar, AltButton, AltAvatar } from "../src/index.js";

export default {
  title: "Composants/Navigation/AltNavbar",
  component: AltNavbar,
  tags: ["autodocs"],
  parameters: { backgrounds: { default: "alice-blue" }, layout: "fullscreen" },
};

export const Standard = {
  render: () => ({
    components: { AltNavbar, AltButton, AltAvatar },
    setup: () => ({
      items: [
        { to: "/dashboard", label: "Tableau de bord" },
        { to: "/clients", label: "Clients" },
        { to: "/associates", label: "Associés / CAC" },
      ],
    }),
    template: `
      <AltNavbar :items="items" subtitle="Contrôle Indépendance" active-path="/clients">
        <template #actions>
          <span style="font-size:13px;color:#fde38d;" class="hidden sm:block">Corentin Hayer</span>
          <AltAvatar name="Corentin Hayer" size="sm" />
        </template>
      </AltNavbar>`,
  }),
};
