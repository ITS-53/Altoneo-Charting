import { AltLogo } from "../src/index.js";

export default {
  title: "Composants/Marque/AltLogo",
  component: AltLogo,
  tags: ["autodocs"],
  argTypes: {
    brand: { control: "inline-radio", options: ["altoneo", "its"] },
    variant: { control: "inline-radio", options: ["light", "dark"] },
    size: { control: { type: "range", min: 20, max: 120, step: 4 } },
  },
  args: { brand: "altoneo", variant: "light", size: 48 },
};

export const Playground = {
  render: (args) => ({
    components: { AltLogo },
    setup: () => ({ args }),
    template: `<div :style="{ padding: '24px', background: args.variant === 'dark' ? '#1c284d' : '#fff', borderRadius:'12px', display:'inline-block' }"><AltLogo v-bind="args" /></div>`,
  }),
};

export const SurFonds = {
  name: "Clair / sombre",
  render: () => ({
    components: { AltLogo },
    template: `
      <div style="display:flex;gap:16px;">
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;"><AltLogo variant="light" :size="48" /></div>
        <div style="padding:24px;background:#1c284d;border-radius:12px;"><AltLogo variant="dark" :size="48" /></div>
      </div>`,
  }),
};

export const Marques = {
  name: "Marques (Altonéo / IT Solutions)",
  render: () => ({
    components: { AltLogo },
    template: `
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;"><AltLogo brand="altoneo" variant="light" :size="48" /></div>
        <div style="padding:24px;background:#1c284d;border-radius:12px;"><AltLogo brand="altoneo" variant="dark" :size="48" /></div>
        <div style="padding:24px;background:#1c284d;border-radius:12px;"><AltLogo brand="its" :size="48" /></div>
      </div>
      <p style="margin-top:12px;font-size:13px;color:#6b7280;">Le logo est une <code>prop</code> : <code>&lt;AltLogo brand="its" /&gt;</code>. Tous les composants à logo (Navbar, Sidebar, Footer, AuthCard, formulaires) acceptent <code>brand</code>.</p>`,
  }),
};
