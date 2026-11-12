<script setup>
/** Bouton-icône de la barre d'outils ouvrant un menu de choix exclusif. */
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import AltIcon from "../../../src/components/AltIcon.vue";

const props = defineProps({
  modelValue: { type: String, required: true },
  /** [{ value, label, icon?, hint? }] */
  options: { type: Array, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: "" },
  /** Le bouton s'allume quand la valeur diffère de celle-ci. */
  neutral: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const root = ref(null);
const current = computed(() => props.options.find((o) => o.value === props.modelValue));

function onDoc(e) {
  if (!root.value?.contains(e.target)) close();
}
function toggle() {
  open.value = !open.value;
  if (open.value) {
    document.addEventListener("pointerdown", onDoc);
    nextTick(() => root.value?.querySelector('[aria-checked="true"]')?.focus());
  } else close();
}
function close() {
  open.value = false;
  document.removeEventListener("pointerdown", onDoc);
}
function choose(v) {
  emit("update:modelValue", v);
  close();
  root.value?.querySelector("button")?.focus();
}
function onKey(e) {
  const items = [...root.value.querySelectorAll('[role="menuitemradio"]')];
  const i = items.indexOf(document.activeElement);
  if (e.key === "Escape") {
    close();
    root.value?.querySelector("button")?.focus();
  } else if (e.key === "ArrowDown") items[(i + 1) % items.length]?.focus();
  else if (e.key === "ArrowUp") items[(i - 1 + items.length) % items.length]?.focus();
  else return;
  e.preventDefault();
}
onBeforeUnmount(close);
</script>

<template>
  <div
    ref="root"
    class="relative"
    @keydown="onKey"
  >
    <button
      type="button"
      class="pg-icon-btn"
      :data-tip="open ? null : `${label} : ${current?.label ?? modelValue}`"
      :aria-label="`${label} : ${current?.label ?? modelValue}`"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-pressed="neutral ? modelValue !== neutral : undefined"
      @click="toggle"
    >
      <AltIcon
        :name="current?.icon || icon"
        :size="16"
      />
    </button>
    <Transition name="pg-pop">
      <div
        v-if="open"
        class="pg-menu alt-glass-hi"
        role="menu"
        :aria-label="label"
      >
        <div class="alt-eyebrow px-3 pb-1 pt-2 !text-[10px]">
          {{ label }}
        </div>
        <button
          v-for="o in options"
          :key="o.value"
          type="button"
          role="menuitemradio"
          class="pg-menu-item pg-focus"
          :aria-checked="o.value === modelValue"
          @click="choose(o.value)"
        >
          <AltIcon
            v-if="o.icon"
            :name="o.icon"
            :size="15"
            class="shrink-0"
          />
          <span class="flex-1 text-left">{{ o.label }}</span>
          <span
            v-if="o.hint"
            class="font-mono text-[10.5px] text-fg-faint"
          >{{ o.hint }}</span>
          <AltIcon
            v-if="o.value === modelValue"
            name="check"
            :size="14"
            class="text-gold"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pg-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 70;
  min-width: 220px;
  padding: 0.25rem 0.25rem 0.35rem;
  border-radius: 0.9rem;
  background: rgb(var(--alt-ink-800) / 0.96);
}
.pg-menu-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.55rem;
  font-size: 13px;
  color: rgb(var(--alt-fg-muted));
}
.pg-menu-item:hover,
.pg-menu-item:focus-visible {
  background: rgb(var(--alt-ink-700) / 0.8);
  color: rgb(var(--alt-fg));
  outline: none;
}
.pg-menu-item[aria-checked="true"] {
  color: rgb(var(--alt-fg));
}
.pg-pop-enter-active {
  animation: alt-pop-in calc(0.22s * var(--alt-motion)) var(--alt-ease-out);
}
.pg-pop-leave-active {
  transition: opacity 0.12s;
}
.pg-pop-leave-to {
  opacity: 0;
}
</style>
