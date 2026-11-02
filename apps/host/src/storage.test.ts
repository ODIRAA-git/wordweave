import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, loadSettings, parseSettings, saveSettings } from "./storage";

function fakeStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe("settings storage", () => {
  it("returns the defaults when nothing is saved", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("returns the defaults for broken JSON", () => {
    expect(parseSettings("{not json")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("42")).toEqual(DEFAULT_SETTINGS);
  });

  it("restores valid settings", () => {
    const saved = {
      a11y: { dyslexiaFont: true, letterSpacing: 0.1, lineHeight: 2, reducedMotion: true },
      language: "de",
      theme: "dark",
    };
    expect(parseSettings(JSON.stringify(saved))).toEqual(saved);
  });

  it("falls back field by field and clamps numbers", () => {
    const result = parseSettings(
      JSON.stringify({
        a11y: { dyslexiaFont: "yes", letterSpacing: 5, lineHeight: "big", reducedMotion: true },
        language: "fr",
        theme: "dark",
      }),
    );
    expect(result.a11y.dyslexiaFont).toBe(false);
    expect(result.a11y.letterSpacing).toBe(0.2);
    expect(result.a11y.lineHeight).toBe(1.6);
    expect(result.a11y.reducedMotion).toBe(true);
    expect(result.language).toBe("en");
    expect(result.theme).toBe("dark");
  });

  it("saves and loads the same settings", () => {
    const storage = fakeStorage();
    const settings = { ...DEFAULT_SETTINGS, language: "de" as const, theme: "soft" as const };
    saveSettings(settings, storage);
    expect(loadSettings(storage)).toEqual(settings);
  });

  it("does not throw when storage is blocked", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(loadSettings(blocked)).toEqual(DEFAULT_SETTINGS);
    expect(() => saveSettings(DEFAULT_SETTINGS, blocked)).not.toThrow();
  });
});
