import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildTree, exportOrder, flattenTree, normalizeFile, sanitize, storyId, storyNameFromExport } from "../../playground/src/core/csf.js";
import { optionsFromDoc, parseSfc } from "../../playground/src/core/sfc-docs.js";
import { actionNames, inferControls, plainArgs } from "../../playground/src/core/controls.js";
import { componentSnippet, dedent, storySource } from "../../playground/src/core/snippet.js";
import { highlight } from "../../playground/src/core/highlight.js";
import { contrastRatio } from "../../playground/src/core/audit.js";

const Btn = { __name: "AltButton" };

describe("playground — lecture CSF", () => {
  it("produit des identifiants compatibles Storybook", () => {
    expect(sanitize("Composants/Boutons & Actions/AltButton")).toBe("composants-boutons-actions-altbutton");
    expect(sanitize("Altonéo Next/Données animées")).toBe("altoneo-next-donnees-animees");
    expect(storyNameFromExport("AvecIcones")).toBe("Avec Icones");
    expect(storyId("Composants/Formulaire/AltInput", "AvecAffixes")).toBe("composants-formulaire-altinput--avec-affixes");
  });

  it("conserve l'ordre des exports du fichier", () => {
    const raw = "export default {};\nexport const Zeta = {};\nexport const Alpha = {};\nexport { Beta as Gamma };";
    expect(exportOrder(raw)).toEqual(["Zeta", "Alpha", "Gamma"]);
  });

  it("normalise CSF 2 et CSF 3, fusionne args et argTypes", () => {
    const Template = (args) => ({ template: "<b/>", args });
    const Playground = Template.bind({});
    Playground.args = { size: "lg" };
    const mod = {
      default: { title: "Composants/AltButton", component: Btn, args: { variant: "primary", size: "md" }, argTypes: { size: { control: "select" } } },
      Variantes: { name: "Toutes les variantes", render: () => ({ template: "<i/>" }), parameters: { layout: "centered" } },
      Playground,
    };
    const file = normalizeFile("stories/AltButton.stories.js", mod, "export const Playground = 1;\nexport const Variantes = 2;");
    expect(file.stories.map((s) => s.key)).toEqual(["Playground", "Variantes"]);
    const [pg, va] = file.stories;
    expect(pg.args).toEqual({ variant: "primary", size: "lg" });
    expect(pg.usesArgs).toBe(true);
    expect(pg.componentName).toBe("AltButton");
    expect(va.name).toBe("Toutes les variantes");
    expect(va.layout).toBe("centered");
    expect(va.usesArgs).toBe(false);
  });

  it("construit l'arborescence dans l'ordre demandé", () => {
    const mk = (title) => normalizeFile(`${title}.stories.js`, { default: { title }, A: {} }, "");
    const files = [mk("Composants/Navigation/Nav"), mk("Design Tokens"), mk("Composants/Formulaire/Input"), mk("Altonéo Next/Icônes")];
    const tree = buildTree(files, ["Design Tokens", "Altonéo Next", "Composants", ["Formulaire", "Navigation"]]);
    expect(tree.map((n) => n.name)).toEqual(["Design Tokens", "Altonéo Next", "Composants"]);
    expect(tree[2].children.map((n) => n.name)).toEqual(["Formulaire", "Navigation"]);
    expect(flattenTree(tree).map((s) => s.title)).toEqual(["Design Tokens", "Altonéo Next/Icônes", "Composants/Formulaire/Input", "Composants/Navigation/Nav"]);
  });
});

describe("playground — documentation d'API", () => {
  it("lit props, défauts, commentaires, événements et slots d'un vrai composant", () => {
    const docs = parseSfc(readFileSync("src/components/AltButton.vue", "utf8"));
    const variant = docs.props.find((p) => p.name === "variant");
    expect(variant).toMatchObject({ type: "String", default: '"primary"' });
    expect(variant.options).toEqual(["primary", "secondary", "danger", "ghost", "navy", "neon"]);
    expect(docs.props.find((p) => p.name === "disabled")).toMatchObject({ type: "Boolean", default: "false" });
    expect(docs.slots).toContain("default");
  });

  it("gère types multiples, props requises et defineEmits", () => {
    const raw = `<template><slot name="footer" /></template>
<script setup>
const props = defineProps({
  /** Valeur liée. */
  modelValue: { type: [String, Number], required: true },
  items: { type: Array, default: () => [] },
  label: String,
});
defineEmits(["update:modelValue", "close"]);
</script>`;
    const docs = parseSfc(raw);
    expect(docs.props).toEqual([
      expect.objectContaining({ name: "modelValue", type: "String | Number", required: true, description: "Valeur liée." }),
      expect.objectContaining({ name: "items", type: "Array", default: "() => []" }),
      expect.objectContaining({ name: "label", type: "String" }),
    ]);
    expect(docs.emits).toEqual(["update:modelValue", "close"]);
    expect(docs.slots).toEqual(["footer"]);
  });

  it("extrait les valeurs possibles d'un commentaire", () => {
    expect(optionsFromDoc("sm | md | lg")).toEqual(["sm", "md", "lg"]);
    expect(optionsFromDoc("bottom (or) | left (couleur d'accent) | none")).toEqual(["bottom", "left", "none"]);
    expect(optionsFromDoc("Pleine largeur.")).toBeNull();
  });
});

describe("playground — contrôles, actions et code", () => {
  const docs = {
    props: [
      { name: "variant", type: "String", default: '"primary"', options: ["primary", "ghost"] },
      { name: "size", type: "String", default: '"md"', options: ["xs", "sm", "md", "lg", "xl"] },
      { name: "block", type: "Boolean", default: "false" },
    ],
    emits: ["click"],
  };
  const story = {
    usesArgs: true,
    componentName: "AltButton",
    args: { variant: "ghost", default: "OK", onClick: () => {} },
    argTypes: { size: { control: { type: "range", min: 1, max: 4 } }, onClick: { action: "clic" } },
  };

  it("déduit les contrôles (argTypes > options documentées > type de valeur)", () => {
    const byName = Object.fromEntries(inferControls(story, docs).map((c) => [c.name, c]));
    expect(byName.variant.type).toBe("inline-radio");
    expect(byName.size).toMatchObject({ type: "range", min: 1, max: 4 });
    expect(byName.block.type).toBe("boolean");
    expect(byName.default.type).toBe("text");
    expect(byName.onClick).toBeUndefined();
    expect(inferControls({ ...story, usesArgs: false }, docs)).toEqual([]);
  });

  it("liste les actions sans doublon", () => {
    expect(actionNames(story, docs)).toEqual([{ handler: "onClick", label: "clic" }]);
    expect(plainArgs(story.args)).toEqual({ variant: "ghost", default: "OK" });
  });

  it("génère un extrait avec les args différents des défauts", () => {
    expect(componentSnippet("AltButton", { variant: "primary", block: true, default: "Go" }, docs)).toBe("<AltButton block>Go</AltButton>");
    const s = { ...story, render: () => ({ template: `\n      <AltButton v-bind="args" @click="args.onClick">{{ args.default }}</AltButton>\n    ` }) };
    expect(storySource(s, { variant: "ghost", default: "OK" }, docs)).toBe('<AltButton variant="ghost">OK</AltButton>');
    expect(dedent("\n    <a>\n      <b/>\n    </a>\n")).toBe("<a>\n  <b/>\n</a>");
  });

  it("échappe le code coloré", () => {
    const html = highlight('<AltButton :size="2">x</AltButton>');
    expect(html).toContain('<span class="tk-component">AltButton</span>');
    expect(html).not.toContain("<AltButton");
  });

  it("calcule le contraste WCAG", () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 0);
    expect(contrastRatio({ r: 28, g: 40, b: 77 }, { r: 249, g: 178, b: 51 })).toBeGreaterThan(4.5);
  });
});
