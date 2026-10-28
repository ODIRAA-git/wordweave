import { describe, expect, it } from "vitest";
import { LEVELS_BY_LANGUAGE, levelsFor } from "./game";

describe("word lists", () => {
  it("has the same level ids in English and German", () => {
    const ids = (language: "en" | "de") => levelsFor(language).map((level) => level.id);
    expect(ids("de")).toEqual(ids("en"));
  });

  it("uses only plain letters a to z", () => {
    for (const [language, levels] of Object.entries(LEVELS_BY_LANGUAGE)) {
      for (const level of levels) {
        expect(level.word, `${language} level ${level.id}`).toMatch(/^[a-z]+$/);
      }
    }
  });

  it("has no repeated words within a language", () => {
    for (const levels of Object.values(LEVELS_BY_LANGUAGE)) {
      const words = levels.map((level) => level.word);
      expect(new Set(words).size).toBe(words.length);
    }
  });
});
