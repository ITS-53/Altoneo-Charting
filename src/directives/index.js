import { isCinema, motionScale } from "../composables/useMotion.js";

/*
 * Directives d'interaction Altonéo Next — aucune dépendance (Web Animations API).
 * Enregistrées par le plugin sous les noms v-alt-spotlight, v-alt-magnetic, v-alt-tip, v-alt-reveal.
 */

/** Halo qui suit le pointeur : pose --alt-mx / --alt-my lus par .alt-spotlight. */
export const vAltSpotlight = {
  mounted(el) {
    el.classList.add("alt-spotlight");
    el._altSpot = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--alt-mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--alt-my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", el._altSpot);
  },
  unmounted(el) {
    el.removeEventListener("pointermove", el._altSpot);
  },
};

/**
 * Élément « magnétique » : attiré par le pointeur, retour élastique.
 * v-alt-magnetic ou v-alt-magnetic="0.2" (force). Débattement borné à 4 px :
 * il « respire » vers le pointeur sans jamais chevaucher ses voisins. Mode cinéma uniquement.
 */
export const vAltMagnetic = {
  mounted(el, binding) {
    const strength = typeof binding.value === "number" ? binding.value : 0.15;
    const MAX = 4;
    const clamp = (v) => Math.max(-MAX, Math.min(MAX, v));
    let x = 0;
    let y = 0;
    const go = (tx, ty, duration, easing) => {
      el.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: `translate(${tx}px, ${ty}px)` }], { duration, easing, fill: "forwards" });
      x = tx;
      y = ty;
    };
    el._altMagMove = (e) => {
      if (!isCinema()) return;
      const r = el.getBoundingClientRect();
      // Centre au repos (sans la translation en cours), sinon l'élément « court » après la souris.
      const cx = r.left + r.width / 2 - x;
      const cy = r.top + r.height / 2 - y;
      go(clamp((e.clientX - cx) * strength), clamp((e.clientY - cy) * strength), 400, "cubic-bezier(0.22, 1, 0.36, 1)");
    };
    el._altMagLeave = () => go(0, 0, 800, "cubic-bezier(0.34, 1.56, 0.64, 1)");
    el.addEventListener("pointermove", el._altMagMove);
    el.addEventListener("pointerleave", el._altMagLeave);
  },
  unmounted(el) {
    el.removeEventListener("pointermove", el._altMagMove);
    el.removeEventListener("pointerleave", el._altMagLeave);
  },
};

/**
 * Infobulle texte légère : v-alt-tip="'Texte'". Une seule bulle partagée, placée au-dessus
 * de l'élément (ou en dessous s'il manque de place), au survol comme au focus clavier.
 */
let bubble = null;
function tipBubble() {
  if (!bubble) {
    bubble = document.createElement("div");
    bubble.setAttribute("role", "tooltip");
    bubble.className = "alt-glass-hi";
    Object.assign(bubble.style, {
      position: "fixed",
      zIndex: "90",
      maxWidth: "20rem",
      padding: "0.5rem 0.75rem",
      fontSize: "0.75rem",
      lineHeight: "1.5",
      color: "rgb(var(--alt-fg))",
      pointerEvents: "none",
      opacity: "0",
    });
    document.body.appendChild(bubble);
  }
  return bubble;
}

export const vAltTip = {
  mounted(el, binding) {
    el._altTip = binding.value;
    const show = () => {
      if (!el._altTip) return;
      const b = tipBubble();
      b.textContent = el._altTip;
      b.style.left = "0px";
      b.style.top = "0px";
      const r = el.getBoundingClientRect();
      const w = b.offsetWidth;
      const h = b.offsetHeight;
      const below = r.top - h - 10 < 0;
      b.style.left = `${Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8)}px`;
      b.style.top = `${below ? r.bottom + 8 : r.top - h - 8}px`;
      b.animate([{ opacity: 0, transform: `translateY(${below ? -4 : 4}px)` }, { opacity: 1, transform: "none" }], { duration: 200 * (motionScale() || 0.01), fill: "forwards" });
    };
    const hide = () => bubble?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120 * (motionScale() || 0.01), fill: "forwards" });
    el.addEventListener("pointerenter", show);
    el.addEventListener("pointerleave", hide);
    el.addEventListener("focus", show);
    el.addEventListener("blur", hide);
    el._altTipOff = () => {
      hide();
      el.removeEventListener("pointerenter", show);
      el.removeEventListener("pointerleave", hide);
      el.removeEventListener("focus", show);
      el.removeEventListener("blur", hide);
    };
    if (binding.value && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", binding.value);
  },
  updated(el, binding) {
    el._altTip = binding.value;
  },
  unmounted(el) {
    el._altTipOff?.();
  },
};

/**
 * Apparition en cascade à l'entrée dans l'écran : v-alt-reveal (ou v-alt-reveal="3" pour
 * le rang dans la cascade). Une seule fois par élément.
 */
let observer = null;
function revealObserver() {
  if (!observer)
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            observer.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
  return observer;
}

export const vAltReveal = {
  mounted(el, binding) {
    if (typeof binding.value === "number") el.style.setProperty("--alt-reveal-i", String(binding.value));
    el.classList.add("alt-reveal");
    if (!motionScale() || typeof IntersectionObserver === "undefined") return void el.classList.add("is-in");
    revealObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};

export const directives = {
  "alt-spotlight": vAltSpotlight,
  "alt-magnetic": vAltMagnetic,
  "alt-tip": vAltTip,
  "alt-reveal": vAltReveal,
};
