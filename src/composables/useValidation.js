/**
 * Règles de validation pures, sans dépendance.
 * Chaque règle est une fonction `(value, allValues?) => true | string`
 * qui retourne `true` si valide, sinon le message d'erreur.
 *
 * Exemple :
 *   import { required, email, minLength } from "altoneo-charting";
 *   const rules = { mail: [required(), email()], pwd: [required(), minLength(8)] };
 */

const isEmpty = (v) =>
  v === null ||
  v === undefined ||
  v === false ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

export const required = (msg = "Ce champ est requis") => (v) =>
  !isEmpty(v) || msg;

export const requiredIf = (predicate, msg = "Ce champ est requis") => (v, all) =>
  !predicate(all) || !isEmpty(v) || msg;

export const minLength = (n, msg) => (v) =>
  isEmpty(v) || String(v).length >= n || (msg ?? `${n} caractères minimum`);

export const maxLength = (n, msg) => (v) =>
  isEmpty(v) || String(v).length <= n || (msg ?? `${n} caractères maximum`);

export const min = (n, msg) => (v) =>
  isEmpty(v) || Number(v) >= n || (msg ?? `La valeur doit être ≥ ${n}`);

export const max = (n, msg) => (v) =>
  isEmpty(v) || Number(v) <= n || (msg ?? `La valeur doit être ≤ ${n}`);

export const pattern = (re, msg = "Format invalide") => (v) =>
  isEmpty(v) || re.test(String(v)) || msg;

export const email = (msg = "Adresse e-mail invalide") =>
  pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg);

export const url = (msg = "URL invalide") =>
  pattern(/^https?:\/\/[^\s.]+\.\S{2,}$/i, msg);

export const numeric = (msg = "Doit être un nombre") => (v) =>
  isEmpty(v) || !Number.isNaN(Number(v)) || msg;

/** Téléphone FR souple (10 chiffres, espaces/points/tirets tolérés). */
export const phoneFr = (msg = "Numéro de téléphone invalide") =>
  pattern(/^(?:\+33|0)[\s.-]?[1-9](?:[\s.-]?\d{2}){4}$/, msg);

/** Doit être égal à la valeur d'un autre champ (ex: confirmation de mot de passe). */
export const sameAs = (field, msg = "Les valeurs ne correspondent pas") => (
  v,
  all,
) => (all && v === all[field]) || msg;

/** Règle personnalisée à partir d'un prédicat. */
export const custom = (predicate, msg = "Valeur invalide") => (v, all) =>
  predicate(v, all) || msg;

/**
 * Valide une valeur contre une liste de règles.
 * Retourne le premier message d'erreur, ou `null` si tout est valide.
 */
export function validateValue(value, rules = [], allValues = {}) {
  for (const rule of rules) {
    const result = rule(value, allValues);
    if (result !== true) return result;
  }
  return null;
}

export default {
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
};
