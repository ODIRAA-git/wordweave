import type { A11ySettings, Language, Theme } from "@wordweave/bridge";

export interface SavedSettings {
  a11y: A11ySettings;
  language: Language;
  theme: Theme;
}

export const DEFAULT_SETTINGS: SavedSettings = {
  a11y: { dyslexiaFont: false, letterSpacing: 0, lineHeight: 1.6, reducedMotion: false },
  language: "en",
  theme: "light",
};

const STORAGE_KEY = "wordweave.settings";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isLanguage = (value: unknown): value is Language => value === "en" || value === "de";

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "soft" || value === "dark";

const boolOr = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const numberInRange = (value: unknown, min: number, max: number, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;

/** Turns stored text into settings. Anything missing or invalid falls back to the default. */
export function parseSettings(raw: string | null): SavedSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data)) return DEFAULT_SETTINGS;
    const a11y = isRecord(data.a11y) ? data.a11y : {};
    const defaults = DEFAULT_SETTINGS.a11y;
    return {
      a11y: {
        dyslexiaFont: boolOr(a11y.dyslexiaFont, defaults.dyslexiaFont),
        letterSpacing: numberInRange(a11y.letterSpacing, 0, 0.2, defaults.letterSpacing),
        lineHeight: numberInRange(a11y.lineHeight, 1.4, 2.2, defaults.lineHeight),
        reducedMotion: boolOr(a11y.reducedMotion, defaults.reducedMotion),
      },
      language: isLanguage(data.language) ? data.language : DEFAULT_SETTINGS.language,
      theme: isTheme(data.theme) ? data.theme : DEFAULT_SETTINGS.theme,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Reads the saved settings. Never throws, even if storage is blocked. */
export function loadSettings(storage: StorageLike = window.localStorage): SavedSettings {
  try {
    return parseSettings(storage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Saves the settings. Silently does nothing if storage is blocked or full. */
export function saveSettings(
  settings: SavedSettings,
  storage: StorageLike = window.localStorage,
): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings simply will not be remembered.
  }
}
