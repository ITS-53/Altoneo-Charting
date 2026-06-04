/**
 * Point d'entrée de la bibliothèque Altonéo Charting.
 *
 * Deux usages :
 *  1) Plugin global —  app.use(AltoneoUI)  → tous les composants <Alt…> disponibles partout.
 *  2) Imports nommés — import { AltButton, useForm } from "altoneo-charting".
 */

// Composants
import AltAlert from "./components/AltAlert.vue";
import AltAppLayout from "./components/AltAppLayout.vue";
import AltAuthCard from "./components/AltAuthCard.vue";
import AltAvatar from "./components/AltAvatar.vue";
import AltBadge from "./components/AltBadge.vue";
import AltBreadcrumb from "./components/AltBreadcrumb.vue";
import AltButton from "./components/AltButton.vue";
import AltCard from "./components/AltCard.vue";
import AltCheckbox from "./components/AltCheckbox.vue";
import AltChip from "./components/AltChip.vue";
import AltContactForm from "./components/AltContactForm.vue";
import AltDivider from "./components/AltDivider.vue";
import AltEmptyState from "./components/AltEmptyState.vue";
import AltErrorPage from "./components/AltErrorPage.vue";
import AltFooter from "./components/AltFooter.vue";
import AltFormField from "./components/AltFormField.vue";
import AltInput from "./components/AltInput.vue";
import AltLoginForm from "./components/AltLoginForm.vue";
import AltLogo from "./components/AltLogo.vue";
import AltModal from "./components/AltModal.vue";
import AltNavbar from "./components/AltNavbar.vue";
import AltPagination from "./components/AltPagination.vue";
import AltProgress from "./components/AltProgress.vue";
import AltRadioGroup from "./components/AltRadioGroup.vue";
import AltRegisterForm from "./components/AltRegisterForm.vue";
import AltSelect from "./components/AltSelect.vue";
import AltSidebar from "./components/AltSidebar.vue";
import AltSkeleton from "./components/AltSkeleton.vue";
import AltSpinner from "./components/AltSpinner.vue";
import AltStat from "./components/AltStat.vue";
import AltSwitch from "./components/AltSwitch.vue";
import AltTable from "./components/AltTable.vue";
import AltTabs from "./components/AltTabs.vue";
import AltTextarea from "./components/AltTextarea.vue";
import AltThemeToggle from "./components/AltThemeToggle.vue";
import AltToast from "./components/AltToast.vue";
import AltToastContainer from "./components/AltToastContainer.vue";
import AltTooltip from "./components/AltTooltip.vue";
import AltTopbar from "./components/AltTopbar.vue";

export const components = {
  AltAlert,
  AltAppLayout,
  AltAuthCard,
  AltAvatar,
  AltBadge,
  AltBreadcrumb,
  AltButton,
  AltCard,
  AltCheckbox,
  AltChip,
  AltContactForm,
  AltDivider,
  AltEmptyState,
  AltErrorPage,
  AltFooter,
  AltFormField,
  AltInput,
  AltLoginForm,
  AltLogo,
  AltModal,
  AltNavbar,
  AltPagination,
  AltProgress,
  AltRadioGroup,
  AltRegisterForm,
  AltSelect,
  AltSidebar,
  AltSkeleton,
  AltSpinner,
  AltStat,
  AltSwitch,
  AltTable,
  AltTabs,
  AltTextarea,
  AltThemeToggle,
  AltToast,
  AltToastContainer,
  AltTooltip,
  AltTopbar,
};

// Plugin Vue
const AltoneoUI = {
  install(app) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
};

export default AltoneoUI;

// Exports nommés des composants
export {
  AltAlert,
  AltAppLayout,
  AltAuthCard,
  AltAvatar,
  AltBadge,
  AltBreadcrumb,
  AltButton,
  AltCard,
  AltCheckbox,
  AltChip,
  AltContactForm,
  AltDivider,
  AltEmptyState,
  AltErrorPage,
  AltFooter,
  AltFormField,
  AltInput,
  AltLoginForm,
  AltLogo,
  AltModal,
  AltNavbar,
  AltPagination,
  AltProgress,
  AltRadioGroup,
  AltRegisterForm,
  AltSelect,
  AltSidebar,
  AltSkeleton,
  AltSpinner,
  AltStat,
  AltSwitch,
  AltTable,
  AltTabs,
  AltTextarea,
  AltThemeToggle,
  AltToast,
  AltToastContainer,
  AltTooltip,
  AltTopbar,
};

// Composables
export { useForm } from "./composables/useForm.js";
export { useToast, createToastStore } from "./composables/useToast.js";
export {
  required,
  requiredIf,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  email,
  url,
  numeric,
  phoneFr,
  sameAs,
  custom,
  validateValue,
} from "./composables/useValidation.js";

// Tokens
export { altoneo, brand, semantic, chartPalette } from "./tokens/colors.js";
