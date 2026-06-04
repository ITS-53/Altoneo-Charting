import { AltSpinner, AltAvatar, AltTooltip, AltButton } from "../src/index.js";

export default {
  title: "Composants/Retour utilisateur/Spinner, Avatar & Tooltip",
};

export const Spinner = {
  render: () => ({
    components: { AltSpinner },
    template: `
      <div style="display:flex;gap:20px;align-items:center;color:#2d519f;">
        <AltSpinner size="xs" />
        <AltSpinner size="sm" />
        <AltSpinner size="md" />
        <AltSpinner size="lg" />
        <AltSpinner size="xl" />
      </div>`,
  }),
};

export const Avatar = {
  render: () => ({
    components: { AltAvatar },
    template: `
      <div style="display:flex;gap:14px;align-items:center;">
        <AltAvatar name="Corentin Hayer" size="xs" />
        <AltAvatar name="David Cochery" size="sm" />
        <AltAvatar name="Émilie Cottais" size="md" />
        <AltAvatar name="François Rival" size="lg" />
        <AltAvatar name="Serge Tosoni" size="xl" />
        <AltAvatar src="https://i.pravatar.cc/100?img=12" name="Photo" size="lg" />
      </div>`,
  }),
};

export const Tooltip = {
  render: () => ({
    components: { AltTooltip, AltButton },
    template: `
      <div style="display:flex;gap:40px;padding:40px;align-items:center;justify-content:center;">
        <AltTooltip content="Info en haut" placement="top"><AltButton variant="secondary">Haut</AltButton></AltTooltip>
        <AltTooltip content="Info en bas" placement="bottom"><AltButton variant="secondary">Bas</AltButton></AltTooltip>
        <AltTooltip content="À gauche" placement="left"><AltButton variant="secondary">Gauche</AltButton></AltTooltip>
        <AltTooltip content="À droite" placement="right"><AltButton variant="secondary">Droite</AltButton></AltTooltip>
      </div>`,
  }),
};
