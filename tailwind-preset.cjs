/**
 * Preset Tailwind partageable — Identité visuelle Altonéo.
 *
 * Usage dans un projet consommateur (tailwind.config.js) :
 *
 *   module.exports = {
 *     presets: [require("altoneo-charting/tailwind-preset")],
 *     content: [
 *       "./index.html",
 *       "./src/**\/*.{vue,js,ts}",
 *       "./node_modules/altoneo-charting/src/**\/*.{vue,js}",
 *     ],
 *   };
 *
 * Le preset expose :
 *  - l'échelle `altoneo` (50 → 900) utilisée comme couleur de marque,
 *  - les couleurs sémantiques nommées de la charte (space-indigo, sunflower-gold…),
 *  - des alias d'intention (primary / accent / navy / success / warning / danger / info),
 *  - un plugin `addComponents` fournissant .btn-*, .input, .label, .card, .badge-*
 *    pour les pages qui n'utilisent pas les composants Vue,
 *  - Altonéo Next (v0.2) : `ink`, `fg`, `line`, `neon`, `sev` branchés sur les variables de
 *    next.css (bascule clair / sombre automatique), polices display et mono, lueurs, courbes.
 */
/** Couleur pilotée par une variable CSS de next.css, avec l'opacité Tailwind (bg-neon-cyan/20…). */
const v = (name) => `rgb(var(--alt-${name}) / <alpha-value>)`;
const plugin = require("tailwindcss/plugin");

/** Échelle de marque — issue du tailwind.config.js de référence (controle-independance). */
const altoneo = {
  50: "#eaf0f7", // PANTONE 656C  — fond bleu-gris clair (alice-blue)
  100: "#fde38d", // PANTONE 1205C — or pâle (jasmine)
  200: "#f9b233", // PANTONE 1235C — orange primaire / CTA (sunflower-gold)
  300: "#f07f40", // PANTONE 158C  — orange moyen / hover (atomic-tangerine)
  400: "#385697", // PANTONE 7685C — bleu moyen (dusk-blue)
  500: "#2d519f", // PANTONE 2145C — bleu (steel-azure)
  600: "#2d519f", // PANTONE 2145C — bleu (barres de progression)
  700: "#253a6b", // Navy intermédiaire (hover sur éléments navy)
  800: "#1c284d", // PANTONE 540C  — navy primaire (navbar, boutons secondaires) (space-indigo)
  900: "#131c36", // Navy foncé (actif)
};

/** Couleurs nommées de la palette officielle (palette.scss). */
const brand = {
  "space-indigo": "#1c284d",
  "sunflower-gold": "#f9b233",
  "steel-azure": "#2d519f",
  jasmine: "#fde38d",
  amaranth: "#e83a5d",
  "dusk-blue": "#385697",
  "atomic-tangerine": "#f07f40",
  "alice-blue": "#eaf0f7",
};

module.exports = {
  // Thème sombre piloté par la classe `.dark` sur un ancêtre (ex: <html class="dark">).
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        altoneo,
        ...brand,
        /**
         * Jetons sémantiques du thème sombre (priorisation Altonéo) :
         *  app    = fond de page · surface = cartes/inputs · raised = survol/élévation
         *  border = bordures      · link    = liens/focus éclaircis
         */
        "alt-dark": {
          app: "#131c36", // altoneo-900
          surface: "#1c284d", // altoneo-800
          raised: "#253a6b", // altoneo-700
          border: "#2f437a",
          muted: "#94a3b8", // slate-400 (texte secondaire)
          link: "#8fb0e8", // bleu éclairci (liens/focus)
        },
        // Altonéo Next — suivent le thème via next.css
        ink: { 950: v("ink-950"), 900: v("ink-900"), 800: v("ink-800"), 700: v("ink-700") },
        fg: { DEFAULT: v("fg"), muted: v("fg-muted"), faint: v("fg-faint") },
        line: v("line"),
        gold: { DEFAULT: v("gold"), glow: v("gold-glow") },
        tangerine: v("tangerine"),
        azure: { DEFAULT: v("azure"), bright: v("azure-bright") },
        neon: { cyan: v("neon-cyan"), mint: v("neon-mint"), rose: v("neon-rose"), violet: v("neon-violet") },
        sev: {
          critical: v("sev-critical"),
          high: v("sev-high"),
          medium: v("sev-medium"),
          low: v("sev-low"),
          info: v("sev-info"),
        },
        // Alias d'intention sémantique
        primary: altoneo[200], // CTA orange
        accent: altoneo[300], // orange hover / accent
        navy: altoneo[800],
        success: "#16a34a",
        warning: altoneo[200],
        danger: "#dc2626",
        info: altoneo[500],
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ['"Space Grotesk"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        "altoneo-card": "0 1px 2px 0 rgb(28 40 77 / 0.05)",
        "altoneo-pop": "0 10px 25px -5px rgb(28 40 77 / 0.15)",
        "glow-gold": "0 0 0 1px rgb(249 178 51 / 0.4), 0 8px 30px -8px rgb(249 178 51 / 0.7)",
        "glow-cyan": "0 0 0 1px rgb(56 225 255 / 0.3), 0 0 28px -6px rgb(56 225 255 / 0.55)",
        glass: "inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 20px 50px -20px rgb(0 0 0 / 0.55)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backdropBlur: { glass: "18px" },
      borderRadius: {
        altoneo: "0.625rem",
        "4xl": "2rem",
      },
      keyframes: {
        // Altonéo Next (dupliquées dans next.css pour les pages sans Tailwind)
        "alt-pop-in": {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.97)", filter: "blur(4px)" },
          to: { opacity: "1", transform: "none", filter: "none" },
        },
        "alt-pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgb(46 230 166 / 0.55)" },
          "100%": { boxShadow: "0 0 0 10px rgb(46 230 166 / 0)" },
        },
        "alt-float": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(6%, -6%, 0) scale(1.08)" },
        },
        "altoneo-fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "altoneo-toast-in": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "altoneo-fade-in": "altoneo-fade-in 0.15s ease-out",
        "altoneo-toast-in": "altoneo-toast-in 0.2s ease-out",
        "alt-pop-in": "alt-pop-in 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        "alt-pulse": "alt-pulse-ring 1.8s ease-out infinite",
        "alt-float": "alt-float 20s ease-in-out infinite",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        /* Boutons */
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: theme("spacing.2"),
          paddingInline: theme("spacing.4"),
          paddingBlock: theme("spacing.2"),
          borderRadius: theme("borderRadius.lg"),
          fontWeight: theme("fontWeight.semibold"),
          transitionProperty: "color, background-color, border-color, box-shadow",
          transitionDuration: "150ms",
          "&:disabled": { opacity: "0.5", cursor: "not-allowed" },
        },
        ".btn-primary": {
          backgroundColor: altoneo[200],
          color: altoneo[800],
          boxShadow: theme("boxShadow.sm"),
          "&:hover:not(:disabled)": { backgroundColor: altoneo[300] },
          "&:active:not(:disabled)": { backgroundColor: altoneo[300] },
        },
        ".btn-secondary": {
          backgroundColor: theme("colors.white"),
          color: altoneo[800],
          border: `1px solid ${altoneo[800]}`,
          "&:hover:not(:disabled)": { backgroundColor: altoneo[50] },
          ".dark &": {
            backgroundColor: "transparent",
            color: altoneo[50],
            border: `1px solid #2f437a`,
          },
          ".dark &:hover:not(:disabled)": { backgroundColor: "#253a6b" },
        },
        ".btn-danger": {
          backgroundColor: "#dc2626",
          color: theme("colors.white"),
          "&:hover:not(:disabled)": { backgroundColor: "#b91c1c" },
        },
        ".btn-ghost": {
          backgroundColor: "transparent",
          color: altoneo[800],
          "&:hover:not(:disabled)": { backgroundColor: altoneo[50] },
          ".dark &": { color: altoneo[50] },
          ".dark &:hover:not(:disabled)": { backgroundColor: "#253a6b" },
        },
        /* Champs de formulaire */
        ".input": {
          display: "block",
          width: "100%",
          borderRadius: theme("borderRadius.lg"),
          border: `1px solid ${theme("colors.gray.300")}`,
          backgroundColor: theme("colors.white"),
          paddingInline: theme("spacing.3"),
          paddingBlock: theme("spacing.2"),
          fontSize: theme("fontSize.sm[0]"),
          boxShadow: theme("boxShadow.sm"),
          "&::placeholder": { color: theme("colors.gray.400") },
          "&:focus": {
            outline: "none",
            borderColor: altoneo[200],
            boxShadow: `0 0 0 1px ${altoneo[200]}`,
          },
          ".dark &": {
            backgroundColor: "#1c284d",
            borderColor: "#2f437a",
            color: altoneo[50],
          },
          ".dark &::placeholder": { color: "#64748b" },
        },
        ".label": {
          display: "block",
          fontSize: theme("fontSize.sm[0]"),
          fontWeight: theme("fontWeight.semibold"),
          color: altoneo[800],
          marginBottom: theme("spacing.1"),
          ".dark &": { color: altoneo[50] },
        },
        /* Carte */
        ".card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.xl"),
          border: `1px solid ${theme("colors.gray.200")}`,
          boxShadow: theme("boxShadow.sm"),
          ".dark &": {
            backgroundColor: "#1c284d",
            borderColor: "#2f437a",
          },
        },
        /* Badges de statut métier (repris de controle-independance) */
        ".badge": {
          display: "inline-flex",
          alignItems: "center",
          paddingInline: theme("spacing[2.5]"),
          paddingBlock: theme("spacing[0.5]"),
          borderRadius: theme("borderRadius.full"),
          fontSize: theme("fontSize.xs[0]"),
          fontWeight: theme("fontWeight.semibold"),
        },
        ".badge-pending": { backgroundColor: altoneo[100], color: altoneo[800] },
        ".badge-sent": {
          backgroundColor: altoneo[50],
          color: altoneo[800],
          border: `1px solid ${altoneo[400]}`,
        },
        ".badge-partial": { backgroundColor: altoneo[200], color: altoneo[800] },
        ".badge-completed": { backgroundColor: altoneo[800], color: theme("colors.white") },
        ".badge-draft": {
          backgroundColor: theme("colors.gray.100"),
          color: theme("colors.gray.500"),
        },
      });
    }),
  ],
};
