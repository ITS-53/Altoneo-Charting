import { describe, it, expect, beforeEach } from "vitest";
import { useMotion, setMotion, motionScale, isCinema } from "../../src/composables/useMotion.js";

describe("useMotion", () => {
  beforeEach(() => setMotion("cinema"));

  it("applique le facteur de durée selon le niveau", () => {
    expect(motionScale()).toBe(1);
    expect(isCinema()).toBe(true);
    setMotion("sober");
    expect(motionScale()).toBe(0.45);
    expect(isCinema()).toBe(false);
    setMotion("none");
    expect(motionScale()).toBe(0);
  });

  it("pose l'attribut sur <html> et mémorise le choix", () => {
    setMotion("sober");
    expect(document.documentElement.dataset.altMotion).toBe("sober");
    expect(localStorage.getItem("alt-motion")).toBe("sober");
  });

  it("ignore un niveau inconnu", () => {
    setMotion("turbo");
    expect(useMotion().level.value).toBe("cinema");
  });

  it("expose des valeurs dérivées réactives", () => {
    const motion = useMotion();
    expect(motion.levels).toEqual(["cinema", "sober", "none"]);
    motion.setMotion("none");
    expect(motion.scale.value).toBe(0);
    expect(motion.cinema.value).toBe(false);
  });
});
