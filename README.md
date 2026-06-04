# Altoneo-Charting

Bibliothèque de composants **Vue 3 + TailwindCSS** portant l'identité visuelle d'Altonéo.
Installez-la dans n'importe quel projet pour réutiliser la charte graphique (couleurs, logos) et un
jeu de composants prêts à l'emploi : boutons, formulaires validés, cartes, badges, modales, tableaux,
toasts, etc.

📖 **Documentation interactive** : `npm run storybook`

---

## Installation dans un autre projet

```bash
npm install github:ITS-53/Altoneo-Charting
```

> Prérequis du projet consommateur : **Vue 3** et **TailwindCSS v3** (`vue` et `tailwindcss` sont
> des `peerDependencies`).

### 1. Brancher le preset Tailwind

`tailwind.config.js` :

```js
module.exports = {
  presets: [require("altoneo-charting/tailwind-preset")],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    // Indispensable : Tailwind doit scanner les classes utilisées par les composants
    "./node_modules/altoneo-charting/src/**/*.{vue,js}",
  ],
};
```

Si votre `tailwind.config.js` est en ESM (`export default`) :

```js
import altoneoPreset from "altoneo-charting/tailwind-preset";
export default { presets: [altoneoPreset], content: [/* … */] };
```

### 2. Enregistrer les composants

`main.js` :

```js
import { createApp } from "vue";
import App from "./App.vue";
import AltoneoUI from "altoneo-charting";
import "./assets/main.css"; // votre CSS avec @tailwind base/components/utilities

createApp(App).use(AltoneoUI).mount("#app");
```

### 3. Utiliser

```vue
<template>
  <AltCard title="Nouveau contrôle">
    <AltFormField label="Nom du client" required :error="form.errors.name">
      <AltInput v-model="form.values.name" @blur="form.handleBlur('name')" />
    </AltFormField>
    <AltButton variant="primary" :disabled="!form.isValid" @click="submit">Créer</AltButton>
  </AltCard>
</template>

<script setup>
import { useForm, required } from "altoneo-charting";
const form = useForm({ name: "" }, { name: [required()] });
const submit = form.handleSubmit((values) => console.log(values));
</script>
```

Imports nommés (tree-shaking) possibles :

```js
import { AltButton, AltModal, useForm, email } from "altoneo-charting";
```

---

## Composants

| Composant | Rôle |
|---|---|
| `AltButton` | Boutons : variants `primary/secondary/navy/danger/ghost`, tailles, `loading`, slots d'icônes |
| `AltInput` / `AltTextarea` / `AltSelect` | Champs de saisie avec états `default/error/success`, affixes |
| `AltCheckbox` / `AltRadioGroup` / `AltSwitch` | Contrôles booléens et choix |
| `AltFormField` | Wrapper label + champ + message d'aide/erreur (a11y) |
| `AltCard` | Carte avec slots header/footer |
| `AltBadge` | Badges sémantiques + statuts métier (`pending/sent/partial/completed/draft`) |
| `AltAlert` | Encarts d'alerte `info/success/warning/error`, dismissible |
| `AltModal` | Modale (teleport, overlay, esc, clic-dehors), `v-model:open` |
| `AltTable` | Tableau avec tri, état vide, état de chargement, slots de cellule |
| `AltTabs` | Onglets (soulignement ou pilule) |
| `AltPagination` | Pagination avec ellipses |
| `AltNavbar` | Barre de navigation (compatible vue-router via `link-component`) |
| `AltToast` + `AltToastContainer` | Notifications, pilotées par `useToast()` |
| `AltTooltip` / `AltAvatar` / `AltSpinner` / `AltLogo` | Utilitaires d'interface et marque |
| `AltAuthCard` | Gabarit générique de page d'authentification (logo + titre + slot formulaire) |
| `AltLoginForm` / `AltRegisterForm` / `AltContactForm` | Formulaires câblés (validation intégrée), émettent `@submit` avec les valeurs validées |
| `AltSidebar` / `AltTopbar` / `AltFooter` | Pièces de navigation (compatibles vue-router via `link-component`) |
| `AltAppLayout` | Shell d'application : sidebar repliable + topbar + contenu + footer, responsive |
| `AltErrorPage` | Page d'erreur générique avec presets `401/403/404/500/502/503` |

### Validation des formulaires

`useForm(initialValues, schema, options)` + règles : `required`, `requiredIf`, `email`, `url`,
`numeric`, `phoneFr`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `sameAs`, `custom`.

### Toasts

```js
import { createToastStore, useToast } from "altoneo-charting";
// App.vue : createToastStore() + <AltToastContainer />
// ailleurs : const toast = useToast(); toast.success("Enregistré");
```

### Thème sombre

Le thème sombre est piloté par la classe `.dark` (mode `class` de Tailwind). Ajoutez/retirez
`dark` sur `<html>` (ou tout ancêtre) pour basculer :

```js
document.documentElement.classList.toggle("dark");
```

Priorisation des couleurs (jetons `alt-dark-*` exposés par le preset) : fond appli `#131c36`,
surfaces `#1c284d`, survol `#253a6b`, bordures `#2f437a`, texte principal `altoneo-50`, texte
secondaire slate-400, **CTA inchangé** (or `altoneo-200`), liens/focus bleu éclairci `#8fb0e8`.
Tous les composants embarquent leurs variantes `dark:`.

### Logo & marque

`AltLogo` accepte une marque en **prop** — pas besoin de dupliquer les composants :

```vue
<AltLogo brand="altoneo" variant="light" />   <!-- logo Altonéo -->
<AltLogo brand="its" />                         <!-- logo IT Solutions (version blanche) -->
<AltLogo :src="monLogo" />                      <!-- surcharge complète -->
```

La prop `brand` (`'altoneo'` | `'its'`) est aussi disponible sur `AltNavbar`, `AltSidebar`,
`AltFooter`, `AltAppLayout`, `AltAuthCard`, `AltLoginForm`, `AltRegisterForm`.

### Tokens couleur (hors Tailwind)

```js
import { altoneo, chartPalette } from "altoneo-charting/tokens";
```

---

## Variante HTML / CSS pure (rapports, PowerShell)

Pour les contextes sans Vue ni build Tailwind (rapports HTML générés par scripts,
e-mails…), une feuille de style **autonome** reproduit l'identité via des classes
sémantiques `alt-*` — aucune dépendance, aucun JS.

```html
<link rel="stylesheet" href="dist/altoneo.css" />
<body class="alt-report">            <!-- ajouter `alt-dark` pour le thème sombre -->
  <div class="alt-card">
    <div class="alt-card__header"><h3 class="alt-card__title">MARTIN SAS</h3></div>
    <div class="alt-card__body">
      <span class="alt-badge alt-badge--completed">Terminé</span>
      <button class="alt-btn alt-btn--primary">Exporter</button>
    </div>
  </div>
</body>
```

- Référence visuelle complète + à copier : [`html/altoneo-charting.html`](html/altoneo-charting.html)
- Classes disponibles : `alt-btn(--*)`, `alt-badge--*`, `alt-chip`, `alt-alert--*`, `alt-card`,
  `alt-input/textarea/select`, `alt-table(--striped/--bordered)`, `alt-navbar`, `alt-tabs`,
  `alt-pagination`, `alt-progress`, `alt-stat`, `alt-avatar`, `alt-spinner`, `alt-divider`,
  `alt-empty`, `alt-skeleton`, `alt-error-page`, `alt-auth`. Palette en variables CSS (`--alt-*`).

### Génération de rapports en PowerShell

Un module fournit des helpers qui produisent un rapport **HTML autonome** (CSS embarquée
inline → un seul fichier, idéal pour l'envoi par e-mail) :

```powershell
Import-Module ./powershell/Altoneo.psm1

$rows  = Get-Content data.json | ConvertFrom-Json
$table = New-AltoneoTable -Data $rows -RawColumns 'Statut' -Striped
$body  = New-AltoneoSection -Title 'Contrôles' -Body (New-AltoneoCard -Body $table)

New-AltoneoReport -Title 'Rapport' -Body $body -Path .\rapport.html   # -Dark pour le thème sombre
```

Fonctions : `New-AltoneoReport`, `New-AltoneoCard`, `New-AltoneoTable`, `New-AltoneoStat`,
`New-AltoneoBadge`, `New-AltoneoButton`, `New-AltoneoAlert`, `New-AltoneoSection`, `Get-AltoneoCss`.
Exemple complet exécutable : [`powershell/Example-Report.ps1`](powershell/Example-Report.ps1).

#### Deux approches selon le type de rapport

1. **Rapport rendu côté serveur (PowerShell)** — le HTML est construit à partir des données
   dans le script. → Utilisez les fonctions ci-dessus (`New-AltoneoCard`, `New-AltoneoTable`…).
2. **Rapport rendu côté client (JS)** — le script embarque un payload (souvent chiffré) et du
   JavaScript qui génère le DOM dans le navigateur. → Inlinez `Get-AltoneoCss` dans le `<style>`
   et émettez les classes `alt-*` **dans le HTML statique ET dans les littéraux JS**. C'est fiable
   car `altoneo.css` contient **toutes** les classes en permanence (aucun *purge* Tailwind) : les
   classes posées au runtime existent toujours. Le thème sombre fonctionne via `.alt-dark` **ou**
   `[data-theme="dark"]`.

   Démo complète refactorisant un vrai rapport (audit MFA Entra ID, payload AES-GCM + rendu
   client) : [`powershell/examples/New-AltoneoMfaReport.ps1`](powershell/examples/New-AltoneoMfaReport.ps1).

> 🤖 **Rebrander un script existant (par un agent IA ou à la main)** : guide pas-à-pas, du clone du
> dépôt à la finalisation, **sans toucher à la logique du script** —
> [`docs/INTEGRATION-IA-PowerShell.md`](docs/INTEGRATION-IA-PowerShell.md). Il contient aussi un
> prompt prêt à coller pour confier la tâche à un agent.

---

## Développement de la bibliothèque

```bash
npm install
npm run storybook        # documentation interactive sur http://localhost:6006
npm run build-storybook  # build statique (storybook-static/)
```

La charte est centralisée dans `tailwind-preset.cjs` (échelle `altoneo`, couleurs nommées, classes
`.btn-*`, `.input`, `.card`, `.badge-*`). Les composants vivent dans `src/components`, les composables
dans `src/composables`, les tokens JS dans `src/tokens`.
