<template>
  <span
    class="relative inline-flex"
    @mouseenter="show = true"
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
  >
    <slot />
    <transition name="alt-tip">
      <span
        v-if="show && content"
        role="tooltip"
        class="absolute z-50 whitespace-nowrap rounded-md bg-altoneo-800 px-2 py-1 text-xs font-medium text-white shadow-altoneo-pop pointer-events-none"
        :class="positionClass"
      >
        {{ content }}
        <span
          class="absolute w-2 h-2 bg-altoneo-800 rotate-45"
          :class="arrowClass"
        />
      </span>
    </transition>
  </span>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  content: { type: String, default: "" },
  /** top | bottom | left | right */
  placement: { type: String, default: "top" },
});

const show = ref(false);

const positionClass = computed(
  () =>
    ({
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    })[props.placement] || "bottom-full left-1/2 -translate-x-1/2 mb-2",
);

const arrowClass = computed(
  () =>
    ({
      top: "top-full left-1/2 -translate-x-1/2 -mt-1",
      bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
      left: "left-full top-1/2 -translate-y-1/2 -ml-1",
      right: "right-full top-1/2 -translate-y-1/2 -mr-1",
    })[props.placement] || "top-full left-1/2 -translate-x-1/2 -mt-1",
);
</script>

<style scoped>
.alt-tip-enter-active,
.alt-tip-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.alt-tip-enter-from,
.alt-tip-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
