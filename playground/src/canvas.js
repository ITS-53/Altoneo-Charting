/**
 * Canevas : rend UNE story dans une iframe isolée (styles globaux, téléportations, media
 * queries du viewport). Piloté par la coque via postMessage ; utilisable seul :
 *   canvas.html?id=composants-boutons-actions-altbutton--playground&theme=dark
 */
import "../../src/style.css";
import "../../src/next.css";
import "./canvas.css";
import { createApp, defineComponent, h, reactive, ref, shallowRef } from "vue";
import AltAurora from "../../src/components/AltAurora.vue";
import { setMotion } from "../../src/composables/useMotion.js";
import { directives } from "../../src/directives/index.js";
import { actionNames } from "./core/controls.js";
import { runAudit } from "./core/audit.js";
import { serialize } from "./core/serialize.js";
import { docsFor, storyById } from "./registry.js";
import { DEFAULT_GLOBALS, MSG } from "./bridge.js";

const q = new URLSearchParams(location.search);
const frame = q.get("frame") ?? "solo";
const embedded = q.get("docs") === "1";
const story = storyById.get(q.get("id"));

const globals = reactive({ ...DEFAULT_GLOBALS });
for (const k of Object.keys(DEFAULT_GLOBALS)) if (q.has(k)) globals[k] = q.get(k);

const post = (type, payload = {}) => {
  if (window.parent !== window) window.parent.postMessage({ source: MSG, type, frame, ...payload }, "*");
};

function applyGlobals() {
  const root = document.documentElement;
  root.classList.toggle("dark", globals.theme === "dark");
  root.classList.toggle("pg-outline", globals.outline === "on");
  if (globals.contrast === "high") root.dataset.altContrast = "high";
  else delete root.dataset.altContrast;
  if (globals.motion !== root.dataset.altMotion) setMotion(globals.motion);
  root.dataset.pgBg = globals.bg;
  root.dataset.pgEmbedded = embedded ? "1" : "0";
}

/* ── Args réactifs + actions ─────────────────────────────────────────────── */
const args = reactive({ ...(story?.args ?? {}) });
try {
  Object.assign(args, JSON.parse(q.get("args") || "{}"));
} catch {
  /* paramètre args invalide : ignoré */
}

let last = null;
function makeAction(label) {
  return (...callArgs) => {
    const first = callArgs[0];
    // Un même événement peut arriver deux fois (v-bind="args" + @click="args.onClick").
    if (last && last.label === label && first && typeof first === "object" && last.first === first) return;
    last = { label, first };
    queueMicrotask(() => (last = null));
    post("action", { name: label, args: serialize(callArgs), time: Date.now() });
  };
}
for (const { handler, label } of actionNames(story ?? {}, docsFor(story))) args[handler] = makeAction(label);

function setArgs(next) {
  const handlers = Object.keys(args).filter((k) => typeof args[k] === "function");
  for (const k of Object.keys(args)) if (!handlers.includes(k) && !(k in next)) delete args[k];
  Object.assign(args, next);
}

/* ── Rendu ───────────────────────────────────────────────────────────────── */
function defaultRender(a) {
  const C = story.component;
  return { render: () => h(C, { ...a }, a.default ? { default: () => a.default } : undefined) };
}

function buildStory() {
  const ctx = { args, argTypes: story.argTypes, parameters: story.parameters, globals, id: story.id, name: story.name, title: story.title };
  let comp = (story.render ?? defaultRender)(args, ctx);
  for (const deco of story.decorators) {
    const inner = comp;
    const wrapped = deco(() => inner, ctx);
    comp = wrapped?.components?.story ? wrapped : { ...wrapped, components: { ...wrapped?.components, story: inner } };
  }
  return comp;
}

const renderKey = ref(0);
const error = shallowRef(null);

// Composant de la story construit une fois par montage : changer de thème ne le recrée pas
// (l'état interne de la story — champ saisi, modale ouverte — est conservé).
let built = null;
let builtKey = -1;
function currentStory() {
  if (builtKey !== renderKey.value) {
    builtKey = renderKey.value;
    built = buildStory();
  }
  return built;
}

const Stage = defineComponent({
  name: "PlaygroundStage",
  setup() {
    return () => {
      if (!story) return h("div", { class: "pg-missing" }, [h("strong", "Story introuvable"), h("code", q.get("id") ?? "(aucun id)")]);
      if (error.value) return h("pre", { class: "pg-error" }, `${error.value?.message ?? error.value}\n\n${error.value?.stack ?? ""}`);
      let comp;
      try {
        comp = currentStory();
      } catch (err) {
        return h("pre", { class: "pg-error" }, `${err?.message ?? err}\n\n${err?.stack ?? ""}`);
      }
      const dark = globals.theme === "dark";
      return h("div", { class: ["pg-stage", `pg-layout-${story.layout}`, dark && "dark alt-dark"] }, [
        globals.bg === "aurora" ? h(AltAurora, { fixed: true }) : null,
        h(comp, { key: renderKey.value }),
      ]);
    };
  },
  errorCaptured(err) {
    error.value = err;
    post("error", { message: String(err?.message ?? err) });
    return false;
  },
});

const app = createApp(Stage);
for (const [name, d] of Object.entries(directives)) app.directive(name, d);
app.config.warnHandler = () => {};
applyGlobals();
app.mount("#canvas");

/* ── Messagerie avec la coque ────────────────────────────────────────────── */
let audited = null;
let outlined = null;

window.addEventListener("message", (e) => {
  const m = e.data;
  if (!m || m.source !== MSG) return;
  if (m.type === "globals") {
    Object.assign(globals, m.globals);
    applyGlobals();
  } else if (m.type === "args") setArgs(m.args);
  else if (m.type === "remount") {
    error.value = null;
    renderKey.value++;
  } else if (m.type === "audit") {
    audited = runAudit(document.getElementById("canvas"));
    post("audit", { issues: audited.issues });
  } else if (m.type === "highlight") {
    outlined?.classList.remove("pg-highlight");
    outlined = m.index === null ? null : audited?.elements[m.index];
    outlined?.classList.add("pg-highlight");
    outlined?.scrollIntoView({ block: "center", behavior: "smooth" });
  }
});

new ResizeObserver(() => post("height", { height: document.getElementById("canvas").scrollHeight })).observe(
  document.getElementById("canvas"),
);
document.title = story ? `${story.name} · ${story.title}` : "Story introuvable";
post("ready");
