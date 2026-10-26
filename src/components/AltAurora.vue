<template>
  <div
    class="alt-aurora pointer-events-none overflow-hidden"
    :class="fixed ? 'fixed inset-0 -z-10' : 'absolute inset-0 -z-10'"
    aria-hidden="true"
  >
    <div class="alt-aurora-blob alt-aurora-a" />
    <div class="alt-aurora-blob alt-aurora-b" />
    <div class="alt-aurora-blob alt-aurora-c" />
    <div
      v-if="grid"
      class="alt-grid-wrap"
    >
      <div class="alt-grid-plane" />
    </div>
    <div class="alt-vignette" />
    <div
      v-if="grain"
      class="alt-grain"
    />
  </div>
</template>

<script setup>
/**
 * Fond vivant : aurores navy / or / violet qui dérivent lentement, grille en perspective
 * qui défile, vignette et grain. Purement décoratif, en CSS (aucune dépendance) ;
 * figé en mode « sobre » ou « aucune », et si l'utilisateur réduit les animations.
 */
defineProps({
  /** Couvre la fenêtre (fond d'application) plutôt que le parent positionné. */
  fixed: { type: Boolean, default: true },
  grid: { type: Boolean, default: true },
  grain: { type: Boolean, default: true },
});
</script>

<style scoped>
.alt-aurora {
  background: rgb(var(--alt-ink-950));
}
.alt-aurora-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: calc(0.25 + 0.3 * var(--alt-glow));
  animation: alt-float 20s ease-in-out infinite;
}
.alt-aurora-a {
  width: 55vw;
  height: 55vw;
  left: -12vw;
  top: -18vw;
  background: radial-gradient(circle, rgb(var(--alt-azure)) 0%, transparent 65%);
  --alt-float-x: 18%;
  --alt-float-y: -12%;
  --alt-float-s: 1.15;
  animation-duration: 18s;
}
.alt-aurora-b {
  width: 45vw;
  height: 45vw;
  right: -10vw;
  top: 10vh;
  background: radial-gradient(circle, rgb(var(--alt-gold) / 0.55) 0%, transparent 60%);
  --alt-float-x: -22%;
  --alt-float-y: 14%;
  --alt-float-s: 0.9;
  animation-duration: 22s;
}
.alt-aurora-c {
  width: 50vw;
  height: 40vw;
  left: 25vw;
  bottom: -25vw;
  background: radial-gradient(circle, rgb(var(--alt-neon-violet) / 0.5) 0%, transparent 60%);
  --alt-float-x: 10%;
  --alt-float-y: 20%;
  --alt-float-s: 1;
  animation-duration: 26s;
}
.alt-grid-wrap {
  position: absolute;
  inset: auto 0 0 0;
  height: 60%;
  perspective: 600px;
  mask-image: linear-gradient(to top, black 10%, transparent 90%);
}
.alt-grid-plane {
  position: absolute;
  inset: -50% -50% 0 -50%;
  transform: rotateX(62deg);
  transform-origin: bottom;
  background-image:
    linear-gradient(rgb(var(--alt-neon-cyan) / var(--alt-grid-alpha)) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--alt-neon-cyan) / var(--alt-grid-alpha)) 1px, transparent 1px);
  background-size: 64px 64px;
  animation: alt-grid-scroll 4s linear infinite;
}
.alt-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 30%, transparent 40%, rgb(var(--alt-ink-950) / 0.85) 100%);
}
.alt-grain {
  position: absolute;
  inset: -50%;
  opacity: 0.05;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
:global(:root[data-alt-motion="none"]) .alt-aurora-blob,
:global(:root[data-alt-motion="none"]) .alt-grid-plane,
:global(:root[data-alt-motion="sober"]) .alt-aurora-blob,
:global(:root[data-alt-motion="sober"]) .alt-grid-plane {
  animation: none;
}
</style>
