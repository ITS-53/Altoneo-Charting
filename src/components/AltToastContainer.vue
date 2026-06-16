<template>
  <teleport to="body">
    <div
      class="fixed z-[60] flex flex-col gap-2 p-4 pointer-events-none"
      :class="positionClass"
    >
      <transition-group name="alt-toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto"
        >
          <AltToast
            :variant="t.variant"
            :title="t.title"
            :message="t.message"
            @close="remove(t.id)"
          />
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from "vue";
import AltToast from "./AltToast.vue";
import { useToast } from "../composables/useToast.js";

const props = defineProps({
  /** top-right | top-left | bottom-right | bottom-left | top-center | bottom-center */
  position: { type: String, default: "top-right" },
});

const { toasts, remove } = useToast();

const positionClass = computed(
  () =>
    ({
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-right": "bottom-0 right-0",
      "bottom-left": "bottom-0 left-0",
      "top-center": "top-0 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    })[props.position] || "top-0 right-0",
);
</script>

<style scoped>
.alt-toast-enter-active,
.alt-toast-leave-active {
  transition: all 0.25s ease;
}
.alt-toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.alt-toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.alt-toast-move {
  transition: transform 0.25s ease;
}
</style>
