import { reactive, inject, provide } from "vue";

const TOAST_KEY = Symbol("altoneo-toast");

let _id = 0;

/**
 * Crée le magasin de toasts. À appeler une fois (App.vue) puis poser
 * <AltToastContainer /> à la racine. Fournit l'API via provide/inject.
 */
export function createToastStore() {
  const toasts = reactive([]);

  function push(toast) {
    const id = ++_id;
    const item = {
      id,
      variant: "info",
      duration: 4000,
      ...(typeof toast === "string" ? { message: toast } : toast),
    };
    toasts.push(item);
    if (item.duration > 0) {
      setTimeout(() => remove(id), item.duration);
    }
    return id;
  }

  function remove(id) {
    const i = toasts.findIndex((t) => t.id === id);
    if (i !== -1) toasts.splice(i, 1);
  }

  const api = {
    toasts,
    push,
    remove,
    clear: () => toasts.splice(0),
    success: (message, opts) => push({ ...opts, message, variant: "success" }),
    error: (message, opts) => push({ ...opts, message, variant: "error" }),
    warning: (message, opts) => push({ ...opts, message, variant: "warning" }),
    info: (message, opts) => push({ ...opts, message, variant: "info" }),
  };

  provide(TOAST_KEY, api);
  return api;
}

/** À utiliser dans n'importe quel composant pour déclencher des toasts. */
export function useToast() {
  const api = inject(TOAST_KEY, null);
  if (!api) {
    throw new Error(
      "[altoneo-charting] useToast() requiert createToastStore() dans un ancêtre (App.vue).",
    );
  }
  return api;
}

export { TOAST_KEY };
export default useToast;
