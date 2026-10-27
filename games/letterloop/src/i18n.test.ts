import { describe, expect, it } from "vitest";
import { dictionaries, t } from "./i18n";

describe("i18n", () => {
  it("has the same keys in English and German", () => {
    const en = Object.keys(dictionaries.en).sort();
    const de = Object.keys(dictionaries.de).sort();
    expect(de).toEqual(en);
  });

  it("has no empty translations", () => {
    for (const language of ["en", "de"] as const) {
      for (const [key, text] of Object.entries(dictionaries[language])) {
        expect(text.trim(), `${language}.${key}`).not.toBe("");
      }
    }
  });

  it("fills in placeholders", () => {
    expect(t("en", "wellDone", { points: 30 })).toBe("Well done! +30 points");
    expect(t("de", "wellDone", { points: 30 })).toBe("Gut gemacht! +30 Punkte");
  });

  it("uses the same placeholders in both languages", () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(dictionaries.en) as (keyof typeof dictionaries.en)[]) {
      expect(placeholders(dictionaries.de[key]), key).toEqual(placeholders(dictionaries.en[key]));
    }
  });
});
