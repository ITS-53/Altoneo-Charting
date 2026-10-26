<template>
  <span
    ref="anchor"
    class="inline-flex"
    @pointerenter="trigger === 'hover' && show()"
    @pointerleave="trigger === 'hover' && scheduleHide()"
    @click="trigger === 'click' && (open ? hide() : show())"
    @focusin="show()"
    @keydown.esc="hide()"
  >
    <slot name="trigger" />
  </span>
  <Teleport to="body">
    <div
      v-if="open"
      ref="panel"
      class="alt-glass-hi fixed z-[85] text-sm"
      :style="{ top: `${pos.top}px`, left: `${pos.left}px`, width: width ? `${width}px` : undefined, animation: 'alt-pop-in calc(220ms * var(--alt-motion)) var(--alt-ease-out)', color: 'rgb(var(--alt-fg))' }"
      role="dialog"
      @pointerenter="cancelHide()"
      @pointerleave="trigger === 'hover' && scheduleHide()"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, reactive, ref } from "vue";

/**
 * Panneau riche ancré à un déclencheur (survol ou clic), téléporté dans <body> pour n'être
 * jamais rogné ; il se replace au-dessus s'il manque de place en dessous.
 */
const props = defineProps({
  /** hover | click */
  trigger: { type: String, default: "hover" },
  width: { type: Number, default: 280 },
});

const open = ref(false);
const anchor = ref(null);
const panel = ref(null);
const pos = reactive({ top: 0, left: 0 });
let timer = 0;

async function show() {
  cancelHide();
  open.value = true;
  await nextTick();
  const a = anchor.value.getBoundingClientRect();
  const h = panel.value?.offsetHeight ?? 0;
  const w = panel.value?.offsetWidth ?? props.width;
  const below = a.bottom + h + 12 < window.innerHeight;
  pos.top = below ? a.bottom + 8 : a.top - h - 8;
  pos.left = Math.min(Math.max(8, a.left + a.width / 2 - w / 2), window.innerWidth - w - 8);
  document.addEventListener("pointerdown", outside, true);
}
function hide() {
  open.value = false;
  document.removeEventListener("pointerdown", outside, true);
}
function scheduleHide() {
  timer = window.setTimeout(hide, 140);
}
function cancelHide() {
  clearTimeout(timer);
}
function outside(e) {
  if (!panel.value?.contains(e.target) && !anchor.value?.contains(e.target)) hide();
}
onBeforeUnmount(hide);
defineExpose({ show, hide });
</script>
