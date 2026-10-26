import "../src/style.css";
import "../src/next.css";
import { h } from "vue";
import { setup } from "@storybook/vue3";
import { directives } from "../src/directives/index.js";

// Directives Altonéo Next disponibles dans toutes les stories.
setup((app) => {
  for (const [name, d] of Object.entries(directives)) app.directive(name, d);
});

/** Bascule de thème (barre d'outils Storybook). */
export const globalTypes = {
  theme: {
    description: "Thème clair / sombre",
    defaultValue: "light",
    toolbar: {
      title: "Thème",
      icon: "circlehollow",
      items: [
        { value: "light", title: "Clair", icon: "sun" },
        { value: "dark", title: "Sombre", icon: "moon" },
      ],
      dynamicTitle: true,
    },
  },
};

/** Décorateur : applique la classe `.dark` + le fond de marque selon le thème choisi. */
const withTheme = (story, context) => {
  const theme = context.globals.theme || "light";
  // Aussi sur <html> : popovers, tiroirs et infobulles sont téléportés dans <body>.
  document.documentElement.classList.toggle("dark", theme === "dark");
  return () =>
    h(
      "div",
      {
        class: theme === "dark" ? "dark alt-dark" : "",
        style: {
          minHeight: "100vh",
          background: theme === "dark" ? "#131c36" : "#eaf0f7",
        },
      },
      [h(story())],
    );
};

export const decorators = [withTheme];

/** @type {import('@storybook/vue3').Preview} */
const preview = {
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Design Tokens",
          "Altonéo Next",
          "Composants",
          ["Boutons & Actions", "Formulaire", "Données", "Retour utilisateur", "Navigation", "Pages", "Marque"],
        ],
      },
    },
  },
};

export default preview;
