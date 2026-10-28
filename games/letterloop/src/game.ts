import type { Language } from "@wordweave/bridge";
export interface Level {
  id: number;
  word: string;
}

export const LEVELS_BY_LANGUAGE: Record<Language, readonly Level[]> = {
  en: [
    { id: 1, word: "cat" },
    { id: 2, word: "sun" },
    { id: 3, word: "book" },
    { id: 4, word: "tree" },
    { id: 5, word: "fish" },
    { id: 6, word: "star" },
    { id: 7, word: "moon" },
    { id: 8, word: "house" },
    { id: 9, word: "apple" },
    { id: 10, word: "water" },
  ],
  de: [
    { id: 1, word: "katze" },
    { id: 2, word: "sonne" },
    { id: 3, word: "buch" },
    { id: 4, word: "baum" },
    { id: 5, word: "fisch" },
    { id: 6, word: "stern" },
    { id: 7, word: "mond" },
    { id: 8, word: "haus" },
    { id: 9, word: "apfel" },
    { id: 10, word: "wasser" },
  ],
};

/** The English list, kept so existing code and tests keep working. */
export const LEVELS = LEVELS_BY_LANGUAGE.en;

export function levelsFor(language: Language): readonly Level[] {
  return LEVELS_BY_LANGUAGE[language];
}

/** Returns the letters of `word` in random order. Never returns the solved word. */
export function shuffleLetters(word: string, random: () => number = Math.random): string[] {
  const target = word.toUpperCase();
  const letters = target.split("");

  // Fisher-Yates shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = letters[i];
    const b = letters[j];
    if (a === undefined || b === undefined) continue;
    letters[i] = b;
    letters[j] = a;
  }

  // If the shuffle happened to produce the solved word, rotate it by one letter.
  if (letters.length > 1 && letters.join("") === target) {
    const first = letters.shift();
    if (first !== undefined) letters.push(first);
  }

  return letters;
}

/** True if the placed letters spell the target word. */
export function isCorrect(attempt: readonly string[], word: string): boolean {
  return attempt.join("").toUpperCase() === word.toUpperCase();
}

/** 10 points per letter, minus 5 per mistake, never below 10. */
export function scoreForLevel(word: string, mistakes: number): number {
  return Math.max(10, word.length * 10 - mistakes * 5);
}
