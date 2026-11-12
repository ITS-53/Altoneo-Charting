/**
 * État de la coque : route (hash), réglages persistés, args par story, journal d'actions,
 * résultats d'accessibilité. Un simple module réactif : pas besoin de Pinia ni de vue-router.
 */
import { reactive, ref, watch } from "vue";
import { DEFAULT_GLOBALS } from "../bridge.js";
import { fileById, storyById, stories } from "../registry.js";
import { plainArgs } from "../core/controls.js";

const KEY = "alt-playground";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

const saved = load();
const systemTheme = typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

export const prefs = reactive({
  globals: { ...DEFAULT_GLOBALS, theme: systemTheme, ...saved.globals },
  viewport: saved.viewport ?? "responsive",
  panelOpen: saved.panelOpen ?? true,
  panelHeight: saved.panelHeight ?? 300,
  panelTab: saved.panelTab ?? "controls",
  expanded: saved.expanded ?? {},
  focus: false,
});

watch(
  prefs,
  () => {
    try {
      const { focus: _focus, ...rest } = prefs;
      localStorage.setItem(KEY, JSON.stringify(rest));
    } catch {
      /* stockage indisponible : réglages non mémorisés */
    }
  },
  { deep: true },
);

watch(
  () => prefs.globals.theme,
  (t) => document.documentElement.classList.toggle("dark", t === "dark"),
  { immediate: true },
);

/* ── Route ───────────────────────────────────────────────────────────────── */
function parseRoute() {
  // Anciens liens Storybook : ?path=/story/<id> ou ?path=/docs/<id>--docs
  const legacy = new URLSearchParams(location.search).get("path");
  if (legacy) {
    const [, kind, id] = legacy.match(/^\/(story|docs)\/(.+)$/) ?? [];
    history.replaceState(null, "", location.pathname);
    if (kind === "story") return { view: "story", id };
    if (kind === "docs") return { view: "docs", id: id.replace(/--docs$/, "") };
  }
  const [, view = "", id = ""] = location.hash.match(/^#\/?([^/]*)\/?(.*)$/) ?? [];
  if (view === "story" && storyById.has(id)) return { view, id };
  if (view === "docs" && fileById.has(id)) return { view, id };
  return { view: "home", id: "" };
}

export const route = ref(parseRoute());
window.addEventListener("hashchange", () => (route.value = parseRoute()));

export function go(view, id = "") {
  location.hash = view === "home" ? "#/" : `#/${view}/${id}`;
}

/** Story suivante / précédente dans l'ordre de la navigation. */
export function step(delta) {
  const i = stories.findIndex((s) => s.id === route.value.id);
  const next = stories[(i + delta + stories.length) % stories.length];
  if (next) go("story", next.id);
}

/* ── Args (modifiés via le panneau Contrôles) ────────────────────────────── */
export const argsByStory = reactive({});

export function argsOf(story) {
  if (!argsByStory[story.id]) argsByStory[story.id] = plainArgs(story.args);
  return argsByStory[story.id];
}

export function resetArgs(story) {
  argsByStory[story.id] = plainArgs(story.args);
}

export function setArg(story, name, value) {
  const a = argsOf(story);
  if (value === undefined) delete a[name];
  else a[name] = value;
}

export function isDirty(story) {
  return JSON.stringify(argsOf(story)) !== JSON.stringify(plainArgs(story.args));
}

/* ── Journal d'actions et accessibilité ──────────────────────────────────── */
export const actions = ref([]);
export const audit = reactive({ status: "idle", issues: [] });

export function logAction(entry) {
  actions.value = [{ ...entry, n: (actions.value[0]?.n ?? 0) + 1 }, ...actions.value].slice(0, 200);
}

/** Commandes ponctuelles de la barre d'outils (compteurs observés par la vue story). */
export const signals = reactive({ remount: 0 });

export function clearActions() {
  actions.value = [];
}

/** Viewports de la barre d'outils. */
export const VIEWPORTS = {
  responsive: { label: "Adaptatif", icon: "grid" },
  mobile: { label: "Mobile", icon: "phone", width: 390, height: 844 },
  tablet: { label: "Tablette", icon: "app", width: 834, height: 1112 },
  desktop: { label: "Bureau", icon: "vm", width: 1440, height: 900 },
};
