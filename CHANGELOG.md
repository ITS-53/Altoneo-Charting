# Journal des versions

Toutes les évolutions notables sont consignées ici. Format inspiré de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; versionnage [sémantique](https://semver.org/lang/fr/).
Les messages de commit suivent les [Conventional Commits](https://www.conventionalcommits.org/fr/).

## Non publié

### Ajouts

- Tests **Vitest** + `@vue/test-utils` (happy-dom) : règles de validation, `useForm`, `useMotion`,
  plugin et icônes ; parcours connexion, inscription et toasts (`npm test`).
- Script `npm run typecheck` (vue-tsc) et `npm run lint`.
- Workflow GitHub Actions `ci.yml` : installation, lint, typecheck, tests, build et build Storybook
  à chaque push et pull request.
- README : prérequis, scripts, tests, CI, contribution, versions, licence.

### Modifications

- Storybook 8.6 → **10.6** (`@storybook/addon-essentials` intégré au cœur, `@storybook/blocks` remplacé
  par `@storybook/addon-docs`) ; `@storybook/core` n'est plus une dépendance.
- Vite 6 → **8.3**, `@vitejs/plugin-vue` 5 → 6, PostCSS 8.5.31, autoprefixer 10.5.
- `vue` (dépendance de développement) → **3.6.0-rc.13** pour `@vue/server-renderer` ≥ 3.6.0-rc.6 ;
  la `peerDependency` reste `^3.4.0`.
- Dépendances transitives forcées (`overrides`) : nanoid ≥ 5.1.6, brace-expansion ≥ 5.0.9,
  source-map-js ≥ 1.2.2, browserslist ≥ 4.28.7, baseline-browser-mapping ≥ 2.11.0,
  postcss-selector-parser ≥ 7.1.6. `npm audit` : 0 vulnérabilité.
- ESLint : environnement Node pour `scripts/`, navigateur pour `.storybook/preview.js`.

## 0.2.0 — Altonéo Next (2026-10-26)

Couche « premium » issue d'Aud'IT : verre dépoli, lueurs, animations, icônes. **Additive** :
les composants et classes existants (`.btn-*`, `.card`, `.input`, `AltCard`…) ne changent pas ;
tout le nouveau est préfixé `alt-` et activé en important `altoneo-charting/next.css`.

### Ajouts

- **Jetons** (`next.css`) : surfaces `ink`, texte `fg`, `line`, néons (cyan, menthe, rose, violet),
  sévérités, verre et lueurs, en variables CSS qui basculent avec `.dark` ; mode haut contraste
  (`data-alt-contrast="high"`). Exposés au preset Tailwind (`bg-ink-800`, `text-neon-cyan/80`, `text-sev-high`…)
  et en JS (`neon`, `severity`, `ink`).
- **Typographie** : `font-display` (Space Grotesk), `font-mono` (JetBrains Mono), `.alt-display`, `.alt-eyebrow`,
  dégradés `.alt-text-gold` et `.alt-text-azure`.
- **Surfaces et effets** : `.alt-glass`, `.alt-glass-hi`, liseré lumineux `.alt-accent` (bas) / `.alt-accent-left`
  (couleur `--alt-accent`), halo `.alt-spotlight`, reflet au survol `.alt-sheen`, surbrillance `.alt-neon-hover`,
  reflet périodique `.alt-shine`, `.alt-btn-neon`, `.alt-chip`, `.alt-kbd`, `.alt-field`, `.alt-pulse`.
- **Mouvement** : `useMotion()` (cinéma / sobre / aucune, mémorisé, respecte « réduire les animations »),
  `useCountUp()`, courbes `ease-out-expo` et `ease-spring`.
- **Directives** (installées par le plugin) : `v-alt-spotlight`, `v-alt-magnetic`, `v-alt-tip`, `v-alt-reveal`.
- **Composants** : `AltIcon`, `AltScoreRing`, `AltSparkline`, `AltGlassCard`, `AltAurora`, `AltSegmented`,
  `AltPopover`, `AltDrawer`.
- **Bibliothèque d'icônes internes** : 103 icônes trait 24 px en 8 catégories (`ICONS`, `ICON_CATEGORIES`,
  `iconSvg()`), exportées en fichiers `.svg` (`npm run icons` → `src/icons/svg`).
- `AltButton` : variante `neon` et option `magnetic`.
- Storybook : section « Altonéo Next » (bandeau héros, cartes, galerie d'icônes cherchable avec copie du SVG,
  données animées, interactions).

Aucune nouvelle dépendance : les animations passent par CSS et la Web Animations API.

## 0.1.0

Première version : preset Tailwind, 39 composants Vue, variante HTML/CSS, Storybook.
