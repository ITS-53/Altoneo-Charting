import { ref } from "vue";
import { AltTabs, AltPagination } from "../src/index.js";

export default {
  title: "Composants/Navigation/Tabs & Pagination",
};

export const Tabs = {
  render: () => ({
    components: { AltTabs },
    setup: () => ({
      active: ref("infos"),
      tabs: [
        { value: "infos", label: "Informations" },
        { value: "assoc", label: "Associés", badge: 8 },
        { value: "histo", label: "Historique" },
        { value: "params", label: "Paramètres", disabled: true },
      ],
    }),
    template: `
      <div style="max-width:560px">
        <AltTabs v-model="active" :tabs="tabs">
          <template #infos><p style="color:#374151">Onglet <b>Informations</b> : détails du client et de la mission.</p></template>
          <template #assoc><p style="color:#374151">Onglet <b>Associés</b> : 8 associés circularisés.</p></template>
          <template #histo><p style="color:#374151">Onglet <b>Historique</b> : journal des actions.</p></template>
        </AltTabs>
      </div>`,
  }),
};

export const TabsPilule = {
  name: "Tabs (style pilule)",
  render: () => ({
    components: { AltTabs },
    setup: () => ({ active: ref("a"), tabs: [{ value: "a", label: "Tous" }, { value: "b", label: "En cours" }, { value: "c", label: "Clôturés" }] }),
    template: `<AltTabs v-model="active" :tabs="tabs" :underline="false"><template #a>Tous</template><template #b>En cours</template><template #c>Clôturés</template></AltTabs>`,
  }),
};

export const Pagination = {
  render: () => ({
    components: { AltPagination },
    setup: () => ({ page: ref(3) }),
    template: `
      <div style="max-width:560px">
        <AltPagination v-model="page" :total="237" :per-page="20" />
        <p style="margin-top:12px;font-size:13px;color:#6b7280;">Page courante : {{ page }}</p>
      </div>`,
  }),
};
