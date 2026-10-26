import { describe, it, expect } from "vitest";
import { createApp } from "vue";
import AltoneoUI, { components, directives, ICONS, ICON_NAMES, iconSvg } from "../../src/index.js";

describe("Plugin AltoneoUI", () => {
  it("enregistre tous les composants et directives", () => {
    const app = createApp({});
    app.use(AltoneoUI);
    for (const name of Object.keys(components)) {
      expect(app.component(name), name).toBeDefined();
    }
    for (const name of Object.keys(directives)) {
      expect(app.directive(name), name).toBeDefined();
    }
  });

  it("préfixe tous les composants par Alt", () => {
    for (const name of Object.keys(components)) expect(name).toMatch(/^Alt[A-Z]/);
  });
});

describe("Icônes internes", () => {
  it("ICON_NAMES reflète le registre", () => {
    expect(ICON_NAMES).toEqual(Object.keys(ICONS));
    expect(ICON_NAMES.length).toBeGreaterThan(0);
  });

  it("iconSvg produit un SVG autonome paramétrable", () => {
    const svg = iconSvg(ICON_NAMES[0], { size: 32, color: "#123456" });
    expect(svg).toMatch(/^<svg/);
    expect(svg).toContain('width="32"');
    expect(svg).toContain("#123456");
  });
});
