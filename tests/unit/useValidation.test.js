import { describe, it, expect } from "vitest";
import {
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
} from "../../src/composables/useValidation.js";

describe("required", () => {
  it.each([null, undefined, false, "", "   ", []])("rejette la valeur vide %j", (v) => {
    expect(required()(v)).toBe("Ce champ est requis");
  });

  it.each(["a", 0, true, ["x"]])("accepte %j", (v) => {
    expect(required()(v)).toBe(true);
  });

  it("utilise le message personnalisé", () => {
    expect(required("Obligatoire")("")).toBe("Obligatoire");
  });
});

describe("requiredIf", () => {
  const rule = requiredIf((all) => all.pro === true);

  it("n'exige rien quand le prédicat est faux", () => {
    expect(rule("", { pro: false })).toBe(true);
  });

  it("exige la valeur quand le prédicat est vrai", () => {
    expect(rule("", { pro: true })).toBe("Ce champ est requis");
    expect(rule("SIRET", { pro: true })).toBe(true);
  });
});

describe("longueurs et bornes", () => {
  it("minLength / maxLength bornent la longueur et ignorent le vide", () => {
    expect(minLength(8)("1234567")).toBe("8 caractères minimum");
    expect(minLength(8)("12345678")).toBe(true);
    expect(minLength(8)("")).toBe(true);
    expect(maxLength(3)("abcd")).toBe("3 caractères maximum");
    expect(maxLength(3)("abc")).toBe(true);
  });

  it("min / max comparent numériquement, bornes incluses", () => {
    expect(min(10)("9")).toBe("La valeur doit être ≥ 10");
    expect(min(10)(10)).toBe(true);
    expect(max(10)(11)).toBe("La valeur doit être ≤ 10");
    expect(max(10)("10")).toBe(true);
    expect(min(10)("")).toBe(true);
  });

  it("numeric refuse ce qui n'est pas un nombre", () => {
    expect(numeric()("12.5")).toBe(true);
    expect(numeric()("douze")).toBe("Doit être un nombre");
  });
});

describe("formats", () => {
  it.each(["jean.dupont@altoneo.fr", "a@b.co"])("email accepte %s", (v) => {
    expect(email()(v)).toBe(true);
  });

  it.each(["jean", "jean@", "jean@altoneo", "jean dupont@altoneo.fr"])("email refuse %s", (v) => {
    expect(email()(v)).toBe("Adresse e-mail invalide");
  });

  it("url exige http(s) et un domaine", () => {
    expect(url()("https://altoneo.fr")).toBe(true);
    expect(url()("ftp://altoneo.fr")).toBe("URL invalide");
    expect(url()("altoneo.fr")).toBe("URL invalide");
  });

  it.each(["0612345678", "06 12 34 56 78", "06.12.34.56.78", "+33612345678", "+33 6 12 34 56 78"])(
    "phoneFr accepte %s",
    (v) => {
      expect(phoneFr()(v)).toBe(true);
    },
  );

  it.each(["0012345678", "061234567", "+44612345678"])("phoneFr refuse %s", (v) => {
    expect(phoneFr()(v)).toBe("Numéro de téléphone invalide");
  });

  it("pattern applique l'expression fournie", () => {
    expect(pattern(/^[A-Z]{3}$/)("ABC")).toBe(true);
    expect(pattern(/^[A-Z]{3}$/, "3 majuscules")("abc")).toBe("3 majuscules");
  });
});

describe("règles inter-champs", () => {
  it("sameAs compare avec un autre champ", () => {
    const rule = sameAs("password");
    expect(rule("secret", { password: "secret" })).toBe(true);
    expect(rule("autre", { password: "secret" })).toBe("Les valeurs ne correspondent pas");
    expect(rule("secret")).toBe("Les valeurs ne correspondent pas");
  });

  it("custom reçoit la valeur et l'ensemble des valeurs", () => {
    const rule = custom((v, all) => v < all.plafond, "Au-dessus du plafond");
    expect(rule(5, { plafond: 10 })).toBe(true);
    expect(rule(15, { plafond: 10 })).toBe("Au-dessus du plafond");
  });
});

describe("validateValue", () => {
  it("renvoie null quand toutes les règles passent", () => {
    expect(validateValue("a@b.fr", [required(), email()])).toBeNull();
  });

  it("renvoie le premier message d'erreur, dans l'ordre des règles", () => {
    expect(validateValue("", [required("Requis"), email()])).toBe("Requis");
    expect(validateValue("x", [required(), email(), minLength(5)])).toBe("Adresse e-mail invalide");
  });

  it("sans règle, tout est valide", () => {
    expect(validateValue("")).toBeNull();
  });
});
