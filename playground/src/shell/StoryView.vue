<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";
import AddonPanel from "./AddonPanel.vue";
import StoryFrame from "./StoryFrame.vue";
import { storyById } from "../registry.js";
import { VIEWPORTS, argsOf, audit, logAction, prefs, route, signals } from "./store.js";

const story = computed(() => storyById.get(route.value.id));
const args = computed(() => argsOf(story.value));
const frame = ref(null);
const error = ref("");

const vp = computed(() => VIEWPORTS[prefs.viewport] ?? VIEWPORTS.responsive);
const stage = ref(null);
const stageSize = ref({ w: 0, h: 0 });
const ro = new ResizeObserver(([e]) => (stageSize.value = { w: e.contentRect.width, h: e.contentRect.height }));
watch(stage, (el, old) => {
  if (old) ro.unobserve(old);
  if (el) ro.observe(el);
});
onBeforeUnmount(() => ro.disconnect());

/** Viewport fixe réduit à l'échelle de la scène si nécessaire. */
const device = computed(() => {
  if (!vp.value.width) return null;
  const pad = 48;
  const scale = Math.min(1, (stageSize.value.w - pad) / vp.value.width, (stageSize.value.h - pad) / vp.value.height);
  return { scale: Math.max(scale, 0.2), w: vp.value.width, h: vp.value.height };
});

function runAudit() {
  audit.status = "running";
  audit.issues = [];
  // Laisse aux animations d'entrée le temps de se poser.
  setTimeout(() => frame.value?.audit(), 700);
}
function onAudit(issues) {
  audit.issues = issues;
  audit.status = "done";
}
function onReady() {
  error.value = "";
  audit.status = "idle";
  audit.issues = [];
  if (prefs.panelTab === "a11y" && prefs.panelOpen) runAudit();
}

watch(() => signals.remount, () => frame.value?.remount());

/* Panneau redimensionnable */
function startResize(e) {
  const startY = e.clientY;
  const startH = prefs.panelHeight;
  const move = (ev) => (prefs.panelHeight = Math.min(Math.max(startH - (ev.clientY - startY), 140), window.innerHeight - 220));
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    document.body.style.cursor = "";
  };
  document.body.style.cursor = "ns-resize";
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
function onResizeKey(e) {
  if (e.key === "ArrowUp") prefs.panelHeight = Math.min(prefs.panelHeight + 24, window.innerHeight - 220);
  else if (e.key === "ArrowDown") prefs.panelHeight = Math.max(prefs.panelHeight - 24, 140);
}
</script>

<template>
  <div
    v-if="story"
    class="flex min-h-0 flex-1 flex-col gap-3"
  >
    <div
      ref="stage"
      class="pg-stage-area"
      :class="{ 'is-device': device }"
    >
      <div
        v-if="device"
        class="pg-device"
        :style="{ width: `${device.w}px`, height: `${device.h}px`, transform: `scale(${device.scale})` }"
      >
        <StoryFrame
          ref="frame"
          :story-id="story.id"
          :args="args"
          :globals="prefs.globals"
          :title="`${story.title} — ${story.name}`"
          @action="logAction"
          @audit="onAudit"
          @error="(m) => (error = m)"
          @ready="onReady"
        />
      </div>
      <div
        v-else
        class="pg-fluid"
      >
        <StoryFrame
          ref="frame"
          :story-id="story.id"
          :args="args"
          :globals="prefs.globals"
          :title="`${story.title} — ${story.name}`"
          @action="logAction"
          @audit="onAudit"
          @error="(m) => (error = m)"
          @ready="onReady"
        />
      </div>
      <span
        v-if="device"
        class="pg-size alt-chip"
      >
        <AltIcon
          :name="vp.icon"
          :size="12"
        /> {{ device.w }} × {{ device.h }}
        <template v-if="device.scale < 1"> · {{ Math.round(device.scale * 100) }} %</template>
      </span>
      <div
        v-if="error"
        class="pg-error-toast alt-glass-hi"
        role="alert"
      >
        <AltIcon
          name="alert"
          :size="16"
          class="text-neon-rose"
        />
        <span class="min-w-0 flex-1 truncate">{{ error }}</span>
        <button
          type="button"
          class="pg-icon-btn"
          aria-label="Masquer l'erreur"
          @click="error = ''"
        >
          <AltIcon
            name="close"
            :size="14"
          />
        </button>
      </div>
    </div>

    <div
      v-if="!prefs.focus"
      class="pg-panel-wrap alt-glass"
      :style="{ height: prefs.panelOpen ? `${prefs.panelHeight}px` : 'auto' }"
    >
      <div
        v-if="prefs.panelOpen"
        class="pg-resizer"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Redimensionner le panneau"
        tabindex="0"
        @pointerdown.prevent="startResize"
        @keydown="onResizeKey"
      />
      <button
        type="button"
        class="pg-icon-btn pg-panel-toggle"
        :aria-label="prefs.panelOpen ? 'Replier le panneau' : 'Déplier le panneau'"
        :data-tip="prefs.panelOpen ? 'Replier (P)' : 'Déplier (P)'"
        data-tip-end
        @click="prefs.panelOpen = !prefs.panelOpen"
      >
        <AltIcon
          :name="prefs.panelOpen ? 'chevron-down' : 'chevron-up'"
          :size="15"
        />
      </button>
      <AddonPanel
        v-if="prefs.panelOpen"
        :story="story"
        :args="args"
        @audit="runAudit"
        @highlight="(i) => frame?.highlight(i)"
      />
      <div
        v-else
        class="px-4 py-2.5 text-[12.5px] text-fg-faint"
      >
        Panneau replié — Contrôles, Actions, Code, Accessibilité.
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-stage-area {
  position: relative;
  flex: 1;
  min-height: 160px;
  overflow: hidden;
  border-radius: 1.1rem;
  border: 1px solid rgb(var(--alt-glass-border) / var(--alt-glass-border-alpha));
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / calc(0.25 + 0.3 * var(--alt-glow)));
}
.pg-stage-area.is-device {
  display: grid;
  place-items: center;
  background-color: rgb(var(--alt-ink-900) / 0.6);
  background-image: radial-gradient(rgb(var(--alt-line) / 0.55) 1px, transparent 1px);
  background-size: 18px 18px;
}
.pg-fluid {
  position: absolute;
  inset: 0;
}
.pg-device {
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 1.4rem;
  border: 1px solid rgb(var(--alt-line) / 0.8);
  box-shadow:
    0 0 0 6px rgb(var(--alt-ink-800)),
    0 0 0 7px rgb(var(--alt-line) / 0.6),
    0 40px 80px -30px rgb(0 0 0 / 0.6);
  transform-origin: center;
  transition: transform calc(0.3s * var(--alt-motion)) var(--alt-ease-out);
}
.pg-size {
  position: absolute;
  left: 50%;
  bottom: 10px;
  translate: -50% 0;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  background: rgb(var(--alt-ink-800) / 0.9);
}
.pg-error-toast {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.4rem 0.4rem 0.9rem;
  font-size: 13px;
  border-color: rgb(var(--alt-neon-rose) / 0.45);
}
.pg-panel-wrap {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 1.1rem;
}
.pg-resizer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  z-index: 5;
  cursor: ns-resize;
}
.pg-resizer::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 3px;
  width: 42px;
  height: 3px;
  translate: -50% 0;
  border-radius: 3px;
  background: rgb(var(--alt-line));
  transition: background 0.2s;
}
.pg-resizer:hover::after,
.pg-resizer:focus-visible::after {
  background: rgb(var(--alt-gold));
}
.pg-resizer:focus-visible {
  outline: none;
}
.pg-panel-toggle {
  position: absolute;
  right: 0.4rem;
  top: 0.3rem;
  z-index: 6;
}
</style>
