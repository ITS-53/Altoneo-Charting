// Variante HTML/CSS pure : on injecte la feuille autonome (altoneo.css) et on
// rend du HTML brut avec les classes `alt-*` — exactement ce qu'un script
// PowerShell produirait.
import altoneoCss from "../dist/altoneo.css?raw";
import { onMounted } from "vue";

export default {
  title: "Variante HTML-CSS/Aperçu",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Classes sémantiques `alt-*` sans Tailwind ni JS (voir html/altoneo-charting.html et le module PowerShell). Le sélecteur de thème global s'applique aussi via la classe `alt-dark`.",
      },
    },
  },
};

function injectCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("altoneo-standalone-css")) return;
  const style = document.createElement("style");
  style.id = "altoneo-standalone-css";
  style.textContent = altoneoCss;
  document.head.appendChild(style);
}

const html = `
<div class="alt-container">
  <div class="alt-grid alt-grid--3" style="margin-bottom:1.5rem;">
    <div class="alt-stat"><p class="alt-stat__label">Contrôles en cours</p><p class="alt-stat__value">12</p><span class="alt-stat__delta alt-stat__delta--up">▲ 8%</span></div>
    <div class="alt-stat"><p class="alt-stat__label">Taux de réponse</p><p class="alt-stat__value">86%</p><span class="alt-stat__delta alt-stat__delta--down">▼ 3%</span></div>
    <div class="alt-stat"><p class="alt-stat__label">Clôturés (mois)</p><p class="alt-stat__value">28</p><span class="alt-stat__delta alt-stat__delta--up">▲ 12%</span></div>
  </div>

  <div class="alt-card" style="margin-bottom:1.5rem;">
    <div class="alt-card__header"><h3 class="alt-card__title">Contrôles en cours</h3></div>
    <div class="alt-card__body" style="padding:0;">
      <table class="alt-table alt-table--striped">
        <thead><tr><th>Client</th><th>Entité</th><th>Associés</th><th>Statut</th></tr></thead>
        <tbody>
          <tr><td>MARTIN SAS</td><td>Altonéo Audit</td><td>8</td><td><span class="alt-badge alt-badge--completed">Terminé</span></td></tr>
          <tr><td>DURAND SARL</td><td>Altonéo Conseil</td><td>3</td><td><span class="alt-badge alt-badge--partial">Partiel</span></td></tr>
          <tr><td>PETIT SCI</td><td>Altonéo Audit</td><td>5</td><td><span class="alt-badge alt-badge--sent">Envoyé</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="alt-row" style="flex-wrap:wrap;gap:.75rem;">
    <button class="alt-btn alt-btn--primary">Primary</button>
    <button class="alt-btn alt-btn--secondary">Secondary</button>
    <button class="alt-btn alt-btn--navy">Navy</button>
    <button class="alt-btn alt-btn--danger">Danger</button>
    <span class="alt-badge alt-badge--pending">En attente</span>
    <span class="alt-chip alt-chip--info">Audit</span>
  </div>
</div>`;

export const Rapport = {
  name: "Rapport (HTML pur)",
  render: () => ({
    setup() {
      onMounted(injectCss);
      return { html };
    },
    template: `<div class="alt-report" style="min-height:100%" v-html="html"></div>`,
  }),
};
