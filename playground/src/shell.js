/** Coque du playground : navigation, barre d'outils, panneaux et documentation. */
import "../../src/style.css";
import "../../src/next.css";
import "./shell/shell.css";
import { createApp } from "vue";
import { directives } from "../../src/directives/index.js";
import Shell from "./shell/PlaygroundShell.vue";

const app = createApp(Shell);
for (const [name, d] of Object.entries(directives)) app.directive(name, d);
app.mount("#app");
