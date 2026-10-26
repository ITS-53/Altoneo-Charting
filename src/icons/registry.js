/**
 * Bibliothèque d'icônes internes Altonéo — trait 24 px, style Lucide, sans dépendance.
 * Chaque icône est un tracé SVG (attribut d) dessiné dans une grille 24×24, trait 1.8,
 * extrémités arrondies. <AltIcon name="…" /> les affiche ; `npm run icons` les exporte
 * aussi en fichiers .svg (src/icons/svg) pour Figma, PowerPoint ou une page HTML.
 *
 * Catégories (pour la vitrine) : navigation, actions, fichiers, données, infra, communication,
 * statut, marque. Les sévérités ont chacune leur silhouette : jamais la couleur seule.
 */
export const ICON_CATEGORIES = {
  navigation: ["home", "cockpit", "menu", "search", "arrow-right", "arrow-left", "chevron-down", "chevron-up", "chevron-left", "chevron-right", "external", "compass", "layers", "grid", "list", "filter", "sort"],
  actions: ["plus", "minus", "check", "close", "edit", "trash", "copy", "download", "upload", "refresh", "play", "pause", "eye", "eye-off", "lock", "unlock", "logout", "settings", "more", "link", "pin"],
  fichiers: ["file", "file-text", "report", "folder", "image", "attach", "archive"],
  donnees: ["chart-bar", "chart-line", "chart-pie", "database", "table", "calendar", "clock", "findings", "scan", "target"],
  infra: ["server", "vm", "cloud", "cpu", "code", "terminal", "git-branch", "pr", "repo", "app", "topology", "shield", "key", "bolt"],
  communication: ["mail", "send", "bell", "message", "phone", "user", "users", "team", "client", "building", "map-pin"],
  statut: ["info", "help", "alert", "check-circle", "x-circle", "sev-critical", "sev-high", "sev-medium", "sev-low", "sev-info", "star", "heart", "smile", "meh", "frown", "spark", "sun", "moon", "keyboard"],
  marque: ["diamond", "wave", "euro", "gdpr"],
};

export const ICONS = {
  // Navigation
  home: "M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5",
  cockpit: "M3 12a9 9 0 1 1 18 0M12 12l4-4M5.6 18h12.8",
  menu: "M4 6h16M4 12h16M4 18h16",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  "arrow-right": "M5 12h14M13 5l7 7-7 7",
  "arrow-left": "M19 12H5M11 5l-7 7 7 7",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up": "M18 15l-6-6-6 6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  external: "M15 3h6v6M10 14 21 3M18 13v8H3V6h8",
  compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16 8l-2.5 5.5L8 16l2.5-5.5z",
  layers: "M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  filter: "M3 4h18l-7 9v6l-4 2v-8z",
  sort: "M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4",

  // Actions
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  check: "M20 6 9 17l-5-5",
  close: "M18 6 6 18M6 6l12 12",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  copy: "M8 8h12v12H8zM16 8V4H4v12h4",
  download: "M12 3v12M7 10l5 5 5-5M4 19h16",
  upload: "M12 21V9M7 14l5-5 5 5M4 5h16",
  refresh: "M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4",
  play: "M6 4l14 8-14 8z",
  pause: "M7 4h3v16H7zM14 4h3v16h-3z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "eye-off": "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 1 1 8 0v4",
  unlock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 7.7-1.5",
  logout: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 15 1.6 1.6 0 0 0 2 14H2a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 3.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 20.4 9H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 2z",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  pin: "M12 17v5M8 3h8l-1 7 3 3v2H6v-2l3-3z",

  // Fichiers
  file: "M14 3H6v18h12V7zM14 3v4h4",
  "file-text": "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6M9 9h2",
  report: "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6M9 9h2",
  folder: "M3 6h6l2 2h10v11H3z",
  image: "M3 5h18v14H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 19",
  attach: "M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7",
  archive: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",

  // Données
  "chart-bar": "M4 20V10M10 20V4M16 20v-7M22 20H2",
  "chart-line": "M3 3v18h18M7 15l4-4 3 3 6-7",
  "chart-pie": "M12 3v9h9a9 9 0 1 1-9-9zM15 3.5A9 9 0 0 1 20.5 9H15z",
  database: "M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  table: "M3 4h18v16H3zM3 10h18M3 15h18M9 4v16",
  calendar: "M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  findings: "M12 3 2 21h20zM12 10v5M12 18h.01",
  scan: "M3 7V3h4M17 3h4v4M21 17v4h-4M7 21H3v-4M7 12h10",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",

  // Infra
  server: "M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01",
  vm: "M3 4h18v6H3zM3 14h18v6H3zM7 7h.01M7 17h.01",
  cloud: "M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18z",
  cpu: "M6 6h12v12H6zM9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4",
  code: "M8 6l-6 6 6 6M16 6l6 6-6 6",
  terminal: "M3 4h18v16H3zM7 9l3 3-3 3M13 15h4",
  "git-branch": "M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9",
  pr: "M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9v3a6 6 0 0 1-6 6H9",
  repo: "M6 3v12a3 3 0 1 0 3 3M6 3h11v14H9M18 21l-3-3 3-3",
  app: "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01",
  topology: "M12 2 3 7v10l9 5 9-5V7zM12 12 3 7M12 12l9-5M12 12v10",
  shield: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z",
  key: "M15 9a4 4 0 1 0-3.4 4L8 16.6V20h3.4v-2h2v-2h2l.6-.6A4 4 0 0 0 15 9zM16 8h.01",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9z",

  // Communication
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0",
  message: "M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12z",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-5-6.7",
  team: "M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM19 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 20a6 6 0 0 1 12 0M1 18a4.5 4.5 0 0 1 5-4.4M23 18a4.5 4.5 0 0 0-5-4.4",
  client: "M4 21V7l8-4 8 4v14M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01",
  building: "M4 21V3h12v18M16 9h4v12M8 7h4M8 11h4M8 15h4M2 21h20",
  "map-pin": "M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",

  // Statut
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v5M12 8h.01",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01",
  alert: "M12 3 2 21h20zM12 10v4M12 17h.01",
  "check-circle": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12l3 3 5-6",
  "x-circle": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6",
  "sev-critical": "M8 2h8l6 6v8l-6 6H8l-6-6V8zM12 8v5M12 16h.01",
  "sev-high": "M12 3 2 21h20zM12 10v4M12 17h.01",
  "sev-medium": "M12 2l10 10-10 10L2 12zM12 8v4M12 15h.01",
  "sev-low": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v5M12 16h.01",
  "sev-info": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 11v5M12 8h.01",
  star: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z",
  smile: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  meh: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 15h8M9 9h.01M15 9h.01",
  frown: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01",
  spark: "M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  keyboard: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",

  // Marque
  diamond: "M12 2l10 10-10 10L2 12zM12 7l5 5-5 5-5-5z",
  wave: "M2 12c2.5-4 5-4 7.5 0s5 4 7.5 0 3.5-3 5-2",
  euro: "M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10",
  gdpr: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7zM9 12l2 2 4-4",
};

export const ICON_NAMES = Object.keys(ICONS);

/** Code SVG autonome d'une icône (export de fichiers, copier-coller dans une page). */
export function iconSvg(name, { size = 24, stroke = 1.8, color = "currentColor" } = {}) {
  const d = ICONS[name];
  if (!d) throw new Error(`Icône inconnue : ${name}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
}
