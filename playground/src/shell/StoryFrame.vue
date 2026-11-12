<script setup>
/**
 * Iframe du canevas pour une story. L'URL n'est recalculée qu'au changement de story :
 * args et réglages globaux passent ensuite par postMessage (pas de rechargement).
 */
import { onBeforeUnmount, onMounted, ref, shallowRef, toRaw, watch } from "vue";
import { MSG, canvasUrl, send } from "../bridge.js";

const props = defineProps({
  storyId: { type: String, required: true },
  args: { type: Object, default: () => ({}) },
  globals: { type: Object, required: true },
  /** Intégré à une page de documentation : hauteur ajustée au contenu. */
  docs: { type: Boolean, default: false },
  title: { type: String, default: "Aperçu de la story" },
});
const emit = defineEmits(["action", "audit", "error", "ready", "height"]);

const frame = `f${Math.random().toString(36).slice(2, 9)}`;
const el = ref(null);
const loading = ref(true);
const src = shallowRef("");

const snapshot = (o) => JSON.parse(JSON.stringify(toRaw(o)));

function load() {
  loading.value = true;
  src.value = canvasUrl(props.storyId, { globals: snapshot(props.globals), args: snapshot(props.args), frame, docs: props.docs });
}

function onMessage(e) {
  const m = e.data;
  if (!m || m.source !== MSG || m.frame !== frame) return;
  if (m.type === "ready") {
    loading.value = false;
    emit("ready");
  } else if (m.type === "action") emit("action", m);
  else if (m.type === "audit") emit("audit", m.issues);
  else if (m.type === "error") emit("error", m.message);
  else if (m.type === "height") emit("height", m.height);
}

watch(() => props.storyId, load);
watch(() => props.args, (a) => send(el.value, "args", { args: snapshot(a) }), { deep: true });
watch(() => props.globals, (g) => send(el.value, "globals", { globals: snapshot(g) }), { deep: true });

onMounted(() => {
  window.addEventListener("message", onMessage);
  load();
});
onBeforeUnmount(() => window.removeEventListener("message", onMessage));

defineExpose({
  remount: () => send(el.value, "remount"),
  reload: () => el.value?.contentWindow?.location.reload(),
  audit: () => send(el.value, "audit"),
  highlight: (index) => send(el.value, "highlight", { index }),
  url: () => src.value,
});
</script>

<template>
  <div
    class="pg-frame"
    :class="{ 'is-loading': loading }"
  >
    <iframe
      ref="el"
      :src="src"
      :title="title"
      class="pg-frame-el"
      loading="lazy"
    />
    <div
      v-if="loading"
      class="pg-frame-loader"
      aria-hidden="true"
    >
      <span /><span /><span />
    </div>
  </div>
</template>

<style scoped>
.pg-frame {
  position: relative;
  width: 100%;
  height: 100%;
}
.pg-frame-el {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  transition: opacity calc(0.3s * var(--alt-motion));
}
.is-loading .pg-frame-el {
  opacity: 0;
}
.pg-frame-loader {
  position: absolute;
  inset: 0;
  display: grid;
  grid-auto-flow: column;
  place-content: center;
  gap: 6px;
}
.pg-frame-loader span {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: rgb(var(--alt-gold));
  animation: pg-bounce 1s var(--alt-ease-out) infinite;
}
.pg-frame-loader span:nth-child(2) {
  animation-delay: 0.12s;
  background: rgb(var(--alt-tangerine));
}
.pg-frame-loader span:nth-child(3) {
  animation-delay: 0.24s;
  background: rgb(var(--alt-azure-bright));
}
@keyframes pg-bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
}
</style>
