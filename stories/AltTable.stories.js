import { AltTable, AltBadge } from "../src/index.js";

export default {
  title: "Composants/Données/AltTable",
  component: AltTable,
  tags: ["autodocs"],
};

const columns = [
  { key: "client", label: "Client", sortable: true },
  { key: "entity", label: "Entité" },
  { key: "associates", label: "Associés", align: "center", sortable: true },
  { key: "status", label: "Statut" },
];

const rows = [
  { id: 1, client: "MARTIN SAS", entity: "Altonéo Audit", associates: 8, status: "completed" },
  { id: 2, client: "DURAND SARL", entity: "Altonéo Conseil", associates: 3, status: "partial" },
  { id: 3, client: "PETIT SCI", entity: "Altonéo Audit", associates: 5, status: "sent" },
  { id: 4, client: "BERNARD SA", entity: "Altonéo Développement", associates: 12, status: "pending" },
];

const labels = { completed: "Terminé", partial: "Partiel", sent: "Envoyé", pending: "En attente" };

export const Standard = {
  render: () => ({
    components: { AltTable, AltBadge },
    setup: () => ({ columns, rows, labels }),
    template: `
      <AltTable :columns="columns" :rows="rows" row-key="id" clickable>
        <template #cell-status="{ value }">
          <AltBadge :variant="value" :label="labels[value]" />
        </template>
      </AltTable>`,
  }),
};

export const Vide = {
  name: "État vide",
  render: () => ({
    components: { AltTable },
    setup: () => ({ columns }),
    template: `<AltTable :columns="columns" :rows="[]" empty-text="Aucun contrôle pour le moment" />`,
  }),
};

export const Chargement = {
  render: () => ({
    components: { AltTable },
    setup: () => ({ columns }),
    template: `<AltTable :columns="columns" :rows="[]" :loading="true" />`,
  }),
};
