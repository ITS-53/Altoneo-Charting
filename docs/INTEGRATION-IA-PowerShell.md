# Guide d'intégration — Charte Altonéo dans un rapport HTML généré par PowerShell

> **À qui s'adresse ce document ?** À un **agent IA** (ou un développeur) chargé de rebrander un
> script PowerShell existant qui génère un rapport HTML, pour qu'il utilise la bibliothèque
> **Altonéo Charting**. Le script peut avoir n'importe quelle structure : ce guide est générique.

---

## 0. Règle d'or (NE JAMAIS ENFREINDRE)

Tu ne modifies **que la couche présentation** (le HTML et le CSS, et — si le rendu est fait en
JavaScript — les _noms de classes_ dans les chaînes JS). Tu **ne touches à RIEN** d'autre :

| ⛔ Interdit de modifier                        | ✅ Autorisé à modifier                             |
| ---------------------------------------------- | -------------------------------------------------- |
| Noms et signatures des fonctions               | Le contenu du bloc `<style>`                       |
| La collecte de données (API, Graph, CSV, SQL…) | Les `class="..."` dans le HTML                     |
| Le chiffrement / la sécurité                   | Les `class` dans les littéraux JS de rendu         |
| `Read-Host`, paramètres, sorties console       | Ajout de petites règles CSS spécifiques au rapport |
| La forme du payload JSON / des objets          | Le `<title>`, libellés purement cosmétiques        |
| Les `id=` référencés par le JavaScript         | —                                                  |
| Les écouteurs d'événements, la logique JS      | —                                                  |
| Le nom et l'encodage des fichiers produits     | —                                                  |

Si un changement de présentation t'oblige à toucher à la logique → **ne le fais pas**, garde l'existant.

---

## 1. Récupérer la bibliothèque

Le seul fichier nécessaire côté rapport est **`dist/altoneo.css`** (feuille de style autonome, sans
dépendance). Trois manières de l'obtenir :

```bash
# Option A — cloner le dépôt
git clone https://github.com/ITS-53/Altoneo-Charting.git

# Option B — récupérer uniquement la CSS (raw)
#   https://raw.githubusercontent.com/ITS-53/Altoneo-Charting/main/dist/altoneo.css

# Option C — via npm (si le projet est node)
npm install github:ITS-53/Altoneo-Charting
#   -> node_modules/altoneo-charting/dist/altoneo.css
```

Pour un rapport **autonome** (un seul fichier `.html`, idéal pour l'archivage / l'e-mail), on
**inline** cette CSS dans le `<style>` du rapport (voir étape 3). Référence visuelle de toutes les
classes : **`html/altoneo-charting.html`** dans le dépôt.

---

## 2. Analyser le script (diagnostic)

Avant toute modification, repère **comment** le HTML est produit. Trois cas fréquents :

1. **Rendu côté serveur (PowerShell)** — le script construit le HTML final à partir des données :
   - chaînes ici-document `@" ... "@` (interpolées) ou `@' ... '@` (littérales),
   - concaténation de chaînes, ou `ConvertTo-Html`.
2. **Rendu côté client (JavaScript)** — le script embarque un _payload_ (parfois chiffré) + un
   `<script>` qui **génère le DOM dans le navigateur** (template literals JS, `innerHTML`, etc.).
3. **Mixte** — une coquille statique + des fragments générés en JS.

Localise précisément :

- [ ] Le bloc `<style> … </style>` (le design system actuel à remplacer).
- [ ] Le type de here-string : `@'...'@` (**littéral** : aucune variable `$` interpolée → utiliser un _placeholder_ + `.Replace`) ou `@"..."@` (**interpolé**).
- [ ] Les éventuels jetons de substitution déjà présents (ex. `__PAYLOAD_JSON__`) et leur `.Replace(...)`.
- [ ] **Toutes** les classes CSS utilisées, **y compris dans les chaînes JavaScript** (`class="badge ..."`, `className = '...'`).
- [ ] Le mécanisme de thème (ex. `[data-theme="dark"]`, classe `dark`…).

> ⚠️ **Point critique du cas client-side** : `altoneo.css` n'est **pas** « purgé » (contrairement à
> un build Tailwind). **Toutes** les classes `alt-*` existent en permanence → les classes posées par
> le JS au _runtime_ fonctionnent toujours. Tu **dois** donc aussi remplacer les classes **à
> l'intérieur des littéraux JS**, pas seulement dans le HTML statique.

---

## 3. Injecter la CSS Altonéo

**3.1 — Charger la CSS** (en tête de script, sans modifier la logique existante) :

```powershell
# La CSS est lue une fois et inlinée dans le rapport.
$AltoneoCss = Get-Content (Join-Path $PSScriptRoot 'altoneo.css') -Raw -Encoding UTF8
# (ou, si la lib est installée : Import-Module ...\powershell\Altoneo.psm1 ; $AltoneoCss = Get-AltoneoCss)
```

**3.2 — Remplacer le `<style>` du rapport.** Mets un jeton à la place du design system actuel et
conserve, en dessous, **uniquement** les quelques règles spécifiques au rapport qui n'existent pas
dans la lib (ex. positionnement d'une icône, animation maison) :

```html
<style>
  __ALTONEO_CSS__
  /* Styles spécifiques au rapport (à conserver/adapter si besoin) */
  .ma-classe-specifique { ... }
</style>
```

**3.3 — Substituer le jeton** là où le script finalise la chaîne HTML (à côté des `.Replace`
existants ; **n'en supprime aucun**) :

```powershell
# Cas here-string littérale @' ... '@  → .Replace (recommandé, robuste)
$html = $template.Replace('__ALTONEO_CSS__', $AltoneoCss).Replace('__PAYLOAD_JSON__', $payloadJson)

# Cas here-string interpolée @" ... "@  → tu peux écrire directement $AltoneoCss dans le <style>,
#   MAIS attention : tout $ / ` présent dans du JS ou du CSS sera interprété. Le jeton + .Replace
#   reste la méthode la plus sûre.
```

---

## 4. Remplacer les classes par le vocabulaire `alt-*`

Applique ce mapping **dans le HTML statique ET dans les chaînes JavaScript**. Adapte selon les noms
réels du script (ce sont des correspondances _d'intention_, pas des règles littérales) :

| Intention / classe générique        | Classe Altonéo                                                                                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conteneur de page                   | `alt-report` (sur `<body>`) + `alt-container`                                                                                                              |
| Carte / panneau / encadré           | `alt-card` (+ `alt-card__header` `__title` `__subtitle` `__body` `__footer`)                                                                               |
| Carte KPI / statistique             | `alt-stat` (+ `alt-stat__label` `__value` `__delta--up/--down`) ; avec icône : `alt-stat alt-stat--row` + `alt-icon-box alt-icon-box--gold/--navy/--green` |
| Badge / étiquette de statut         | `alt-badge alt-badge--success / --error / --warning / --info / --neutral / --pending / --sent / --partial / --completed / --draft`                         |
| Puce / tag                          | `alt-chip` (`--primary` / `--info`)                                                                                                                        |
| Message / bannière                  | `alt-alert alt-alert--info/--success/--warning/--error` (+ `alt-alert__title`)                                                                             |
| Tableau                             | `alt-table` (`--striped`, `--bordered`)                                                                                                                    |
| Bouton principal / secondaire       | `alt-btn alt-btn--primary` / `--secondary` / `--navy` / `--danger` / `--ghost` (+ `--sm`/`--lg`/`--block`)                                                 |
| Champ texte / zone / liste          | `alt-input` / `alt-textarea` / `alt-select` (+ `alt-field`, `alt-label`, `alt-help`, `alt-error`)                                                          |
| Champ de recherche (icône à gauche) | `alt-search` > `svg` + `alt-input`                                                                                                                         |
| Barre de navigation / pied          | `alt-navbar` (`__brand`/`__links`/`__link`/`--active`) / `alt-footer` (`__copy`)                                                                           |
| Onglets / pagination                | `alt-tabs` + `alt-tab`/`--active` ; `alt-pagination` + `alt-page`/`--active`                                                                               |
| Barre de progression                | `alt-progress` > `alt-progress__bar` (`--navy`/`--success`/`--danger`)                                                                                     |
| Avatar / spinner / séparateur       | `alt-avatar` / `alt-spinner` / `alt-divider`                                                                                                               |
| État vide / squelette               | `alt-empty` (`__title`/`__desc`) / `alt-skeleton` (`--text`/`--circle`)                                                                                    |
| Page d'erreur (404…)                | `alt-error-page` (`__code`/`__title`/`__msg`)                                                                                                              |
| Écran de connexion / déverrouillage | `alt-auth` + `alt-auth__card` (ou une simple `alt-card`)                                                                                                   |
| Texte secondaire / monospace        | `alt-muted` / `alt-mono`                                                                                                                                   |
| Masquer un élément                  | `alt-hidden`                                                                                                                                               |

**Ne pas introduire de classes utilitaires Tailwind** (`bg-...`, `flex`, `p-4`…) : elles n'existent
pas dans `altoneo.css`. Pour un besoin non couvert, ajoute une petite règle CSS dédiée dans le
`<style>` (sous `__ALTONEO_CSS__`) en réutilisant les **variables** `--alt-*`
(`var(--alt-surface)`, `var(--alt-heading)`, `var(--alt-muted)`, `var(--alt-200)`…).

---

## 5. Thème sombre

`altoneo.css` gère le thème sombre via **deux conventions** — garde celle déjà présente dans le
script, ne réécris pas la logique du toggle :

- classe `alt-dark` sur un ancêtre (`<body class="alt-report alt-dark">`), **ou**
- attribut `[data-theme="dark"]` (typiquement posé sur `<html>` par le bouton de thème existant).

Si le script possède déjà un sélecteur de thème en `[data-theme]`, **rien à faire** : il fonctionne
tel quel.

---

## 6. Vérification (checklist de fin)

- [ ] Le script **s'exécute sans erreur** (aucune modif de logique, de fonction ou de paramètre).
- [ ] Le HTML produit **n'a plus de jeton résiduel** (`__ALTONEO_CSS__`, etc.).
- [ ] La CSS Altonéo est bien présente (recherche `--alt-200` ou `.alt-card` dans la sortie).
- [ ] Plus aucune classe de l'ancien design system n'est référencée (HTML **et** JS).
- [ ] Rendu correct en thème **clair** et **sombre**.
- [ ] Les données affichées sont **identiques** à avant (le pipeline n'a pas changé).
- [ ] Fichier écrit en **UTF-8** (comme le faisait le script).
- [ ] (Si rendu client-side) le rapport se construit toujours après chargement/déverrouillage.

Astuce de test sans relancer toute la collecte : appeler la fonction de génération HTML avec un jeu
de données factice, écrire le `.html`, l'ouvrir dans un navigateur.

---

## 7. Pièges connus

- **Here-string littérale** `@'...'@` : aucune variable n'est interpolée → **obligatoirement** un
  jeton + `.Replace`. Le marqueur de fin `'@` doit être **en colonne 0** (aucune indentation).
- **`$` et backtick** dans une here-string interpolée `@"..."@` : le JS (`${...}`) et certaines
  valeurs CSS seront interprétés → préférer la here-string littérale + jeton.
- **`ConvertTo-Html`** : injecter la CSS via `-Head "<style>$AltoneoCss</style>"` puis, si besoin,
  post-traiter la chaîne pour appliquer les classes `alt-*`.
- **Échappement HTML** : conserver la fonction d'échappement existante (`escapeHtml`, etc.).
- **Ne pas renommer** les `id` utilisés par `document.getElementById` ni les `data-*` lus par le JS.
- **Classes générées en JS** : ne pas les oublier — elles ne sont visibles que dans des chaînes.

---

## 8. Exemple minimal (avant / après)

**Avant** (design system maison dans une here-string) :

```powershell
$html = @"
<style>.card{border:1px solid #ddd;border-radius:8px;padding:16px}.tag{background:#e0f2fe;color:#0369a1}</style>
<div class="card"><span class="tag">Actif</span><h3>$Name</h3></div>
"@
```

**Après** (CSS Altonéo inlinée + classes `alt-*`, **mêmes données `$Name`**) :

```powershell
$AltoneoCss = Get-Content (Join-Path $PSScriptRoot 'altoneo.css') -Raw -Encoding UTF8
$html = @"
<style>$AltoneoCss</style>
<body class="alt-report">
  <div class="alt-card"><div class="alt-card__body">
    <span class="alt-badge alt-badge--success">Actif</span>
    <h3 class="alt-card__title">$Name</h3>
  </div></div>
</body>
"@
```

Un exemple complet et réaliste (rapport d'audit MFA, payload chiffré + rendu client) est fourni dans
le dépôt : **`powershell/examples/New-AltoneoMfaReport.ps1`**.

---

## 9. Prompt prêt à coller pour l'agent IA

> Copie ce bloc et joins-y le script PowerShell à rebrander.

```md
Tu es chargé de rebrander le rapport HTML généré par le script PowerShell ci-joint avec la
bibliothèque « Altonéo Charting ». Suis STRICTEMENT le guide
docs/INTEGRATION-IA-PowerShell.md du dépôt https://github.com/ITS-53/Altoneo-Charting.

Contraintes absolues :

- Ne modifie AUCUNE fonction, signature, logique de collecte de données, chiffrement, Read-Host,
  paramètre, sortie console, forme de payload, id HTML, ni écouteur d'événement.
- Tu ne changes QUE la couche présentation : le bloc <style>, les attributs class="..." dans le
  HTML, et les noms de classes dans les chaînes JavaScript de rendu.

Étapes :

1. Récupère dist/altoneo.css (clone du repo, raw GitHub, ou npm) et inline-la dans le <style>
   via un jeton + .Replace (méthode du guide).
2. Remplace les classes du design system maison par les classes alt-\* (table de mapping du guide),
   dans le HTML statique ET dans les littéraux JS.
3. Conserve le mécanisme de thème existant (alt-dark ou [data-theme="dark"] sont supportés).
4. Vérifie : script sans erreur, aucun jeton résiduel, données identiques, rendu clair+sombre OK.

Rends le script complet modifié, en listant précisément les seules lignes de présentation changées.
```

---

### Référence rapide

- Feuille de style : `dist/altoneo.css` · Galerie/HTML de référence : `html/altoneo-charting.html`
- Helpers PowerShell (rendu serveur) : `powershell/Altoneo.psm1`
- Exemple complet (rendu client + chiffrement) : `powershell/examples/New-AltoneoMfaReport.ps1`
- Dépôt : <https://github.com/ITS-53/Altoneo-Charting>
